#!/usr/bin/env python3
"""
NusaTV Background Stream Probe & Thumbnail Worker:
- Runs in background on the server
- Every minute, samples/probes channels in random order
- Checks live signal status (online/degraded/offline), latency in ms, and resolution
- Takes a live screenshot/thumbnail frame using OpenCV
- Saves thumbnails to public/thumbnails/{ch_id}.jpg (served at /thumbnails/{ch_id}.jpg)
- Generates/updates public/status.json with real-time status & thumbnail metadata
"""
import concurrent.futures
import json
import os
import random
import tempfile
import time
import urllib.request
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
PUBLIC_DIR = os.path.join(ROOT, "dist") if os.path.exists(os.path.join(ROOT, "dist")) else os.path.join(ROOT, "public")
THUMBS_DIR = os.path.join(PUBLIC_DIR, "thumbnails")
STATUS_FILE = os.path.join(PUBLIC_DIR, "status.json")
CHANNELS_FILE = os.path.join(PUBLIC_DIR, "channels.json")

os.makedirs(THUMBS_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.dens.tv/"
}

def load_channels():
    for path in [CHANNELS_FILE, os.path.join(ROOT, "public", "channels.json")]:
        if os.path.exists(path):
            try:
                with open(path) as f:
                    return json.load(f)
            except Exception:
                pass
    return []

def capture_stream_frame(url, timeout=5):
    t0 = time.time()
    # 1. Try direct VideoCapture
    try:
        cap = cv2.VideoCapture(url)
        cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, timeout * 1000)
        cap.set(cv2.CAP_PROP_READ_TIMEOUT_MSEC, timeout * 1000)
        ret, frame = cap.read()
        cap.release()
        if ret and frame is not None and frame.size > 0:
            latency = int((time.time() - t0) * 1000)
            return True, frame, latency
    except Exception:
        pass

    # 2. Try fetching latest .ts chunk and decode
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            text = resp.read().decode("utf-8", errors="ignore")
        lines = [l.strip() for l in text.splitlines() if l.strip() and not l.startswith("#")]
        if lines:
            seg_url = lines[-1]
            if not seg_url.startswith("http"):
                base = url.rsplit("/", 1)[0]
                seg_url = base + "/" + seg_url
            s_req = urllib.request.Request(seg_url, headers=HEADERS)
            with urllib.request.urlopen(s_req, timeout=timeout) as s_resp:
                data = s_resp.read()
            if len(data) > 2000:
                with tempfile.NamedTemporaryFile(suffix=".ts", delete=False) as tf:
                    tf.write(data)
                    tmp_name = tf.name
                cap = cv2.VideoCapture(tmp_name)
                ret, frame = cap.read()
                cap.release()
                try:
                    os.remove(tmp_name)
                except Exception:
                    pass
                if ret and frame is not None and frame.size > 0:
                    latency = int((time.time() - t0) * 1000)
                    return True, frame, latency
    except Exception:
        pass

    latency = int((time.time() - t0) * 1000)
    return False, None, latency

def probe_one(ch):
    ch_id = ch["id"]
    url = ch["src"]
    ok, frame, latency = capture_stream_frame(url, timeout=5)
    
    thumb_rel = f"/thumbnails/{ch_id}.jpg"
    thumb_path = os.path.join(THUMBS_DIR, f"{ch_id}.jpg")
    
    res_str = None
    if ok and frame is not None:
        h, w, _ = frame.shape
        res_str = f"{w}x{h}"
        target_w = 320
        target_h = int(h * (target_w / w)) if w > 0 else 180
        thumb = cv2.resize(frame, (target_w, target_h))
        try:
            ok_enc, buf = cv2.imencode(".jpg", thumb, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if ok_enc:
                tmp_thumb = thumb_path + ".tmp"
                with open(tmp_thumb, "wb") as f:
                    f.write(buf.tobytes())
                os.replace(tmp_thumb, thumb_path)
        except Exception as e:
            print(f"[{ch_id}] imencode error: {e}")
    
    status = "online" if ok else "offline"
    if ok and latency > 3500:
        status = "degraded"
        
    return ch_id, {
        "status": status,
        "latencyMs": latency,
        "resolution": res_str,
        "lastChecked": int(time.time() * 1000),
        "thumb": thumb_rel if (ok or os.path.exists(thumb_path)) else None
    }

def run_probe_cycle():
    channels = load_channels()
    if not channels:
        print("[worker] No channels found.")
        return

    current_status = {}
    if os.path.exists(STATUS_FILE):
        try:
            with open(STATUS_FILE) as f:
                data = json.load(f)
                current_status = data.get("channels", {})
        except Exception:
            pass

    shuffled = list(channels)
    random.shuffle(shuffled)
    
    # Process up to 16 channels per cycle so server CPU remains under 5%
    batch_size = min(16, len(shuffled))
    batch = shuffled[:batch_size]
    
    print(f"[worker] Probing {len(batch)} channels in parallel (out of {len(channels)} total)...")
    t0 = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(probe_one, ch): ch for ch in batch}
        for f in concurrent.futures.as_completed(futures):
            ch_id, info = f.result()
            if not info.get("resolution") and current_status.get(ch_id, {}).get("resolution"):
                info["resolution"] = current_status[ch_id]["resolution"]
            if not info.get("thumb") and current_status.get(ch_id, {}).get("thumb"):
                info["thumb"] = current_status[ch_id]["thumb"]
            current_status[ch_id] = info

    out_data = {
        "lastUpdated": int(time.time() * 1000),
        "total": len(channels),
        "channels": current_status
    }
    
    tmp_status = STATUS_FILE + ".tmp"
    with open(tmp_status, "w") as f:
        json.dump(out_data, f, indent=2)
    os.replace(tmp_status, STATUS_FILE)
    print(f"[worker] Cycle complete in {time.time() - t0:.2f}s. Saved to {STATUS_FILE}")

def main():
    print("[worker] Starting NusaTV stream probe worker (sampling randomly every 60s)...")
    while True:
        try:
            run_probe_cycle()
        except Exception as e:
            print(f"[worker] Error in cycle: {e}")
        time.sleep(60)

if __name__ == "__main__":
    main()
