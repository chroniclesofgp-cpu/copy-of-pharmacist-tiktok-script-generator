#!/usr/bin/env python3
"""
Batch download and transcribe TikTok videos from a URL file.
Phase A of Kalodata analysis plan.
"""
import subprocess
import os
import sys
import time
import json
import glob

def download_audio(url, output_dir, video_id):
    """Download audio from TikTok URL. Returns path to mp3 or None on failure."""
    out_template = os.path.join(output_dir, f"{video_id}.%(ext)s")
    mp3_path = os.path.join(output_dir, f"{video_id}.mp3")
    
    # Skip if already downloaded
    if os.path.exists(mp3_path):
        return mp3_path
    
    result = subprocess.run(
        ["yt-dlp", "--no-playlist", "-x", "--audio-format", "mp3",
         "-o", out_template, url],
        capture_output=True, text=True, timeout=120
    )
    
    if result.returncode == 0 and os.path.exists(mp3_path):
        return mp3_path
    else:
        return None

def transcribe_audio(mp3_path):
    """Transcribe audio file. Returns transcript text or None on failure."""
    result = subprocess.run(
        ["manus-speech-to-text", mp3_path],
        capture_output=True, text=True, timeout=180
    )
    
    # Find the plain text transcription file
    base = mp3_path.replace(".mp3", "")
    txt_files = glob.glob(f"{base}_transcription_*.txt")
    if txt_files:
        txt_files.sort(reverse=True)
        with open(txt_files[0]) as f:
            return f.read().strip()
    return None

def process_url_file(url_file, output_dir, creator_name):
    """Process all URLs from a URL file."""
    os.makedirs(output_dir, exist_ok=True)
    
    urls = []
    with open(url_file) as f:
        for line in f:
            line = line.strip()
            if line.startswith('#') or not line:
                continue
            parts = line.split(' | ')
            if len(parts) >= 4:
                rank = parts[0].strip()
                gmv = parts[1].strip()
                product = parts[2].strip()
                url = parts[3].strip()
                video_id = url.split('/')[-1]
                urls.append((rank, gmv, product, url, video_id))
    
    print(f"\n{'='*60}")
    print(f"Processing {creator_name}: {len(urls)} videos")
    print(f"{'='*60}")
    
    results = []
    failed = []
    
    for rank, gmv, product, url, video_id in urls:
        print(f"\n[{rank}] {gmv} | {video_id}")
        print(f"  URL: {url}")
        
        # Download
        mp3_path = download_audio(url, output_dir, video_id)
        if not mp3_path:
            print(f"  FAILED: Download failed")
            failed.append({"rank": rank, "video_id": video_id, "url": url, "reason": "download_failed"})
            continue
        
        print(f"  Downloaded: {os.path.basename(mp3_path)}")
        
        # Transcribe
        transcript = transcribe_audio(mp3_path)
        if not transcript:
            print(f"  FAILED: Transcription failed or empty")
            failed.append({"rank": rank, "video_id": video_id, "url": url, "reason": "transcription_failed"})
            continue
        
        word_count = len(transcript.split())
        if word_count < 20:
            print(f"  FLAGGED: Transcript too short ({word_count} words) — possible truncation")
            failed.append({"rank": rank, "video_id": video_id, "url": url, "reason": f"transcript_too_short_{word_count}_words"})
        
        print(f"  Transcribed: {word_count} words")
        results.append({
            "rank": rank,
            "gmv": gmv,
            "product": product,
            "url": url,
            "video_id": video_id,
            "transcript": transcript,
            "word_count": word_count
        })
        
        # Rate limiting — 2 second delay between videos
        time.sleep(2)
    
    return results, failed

if __name__ == "__main__":
    creator = sys.argv[1] if len(sys.argv) > 1 else "rphreviews"
    
    url_file = f"/home/ubuntu/pharma-script-gen/analysis/{creator}_video_urls_gmv.txt"
    output_dir = f"/home/ubuntu/kalodata_videos/{creator}"
    
    results, failed = process_url_file(url_file, output_dir, creator)
    
    # Save combined transcript file
    transcript_file = f"/home/ubuntu/pharma-script-gen/analysis/{creator}_transcripts_gmv_full.txt"
    with open(transcript_file, "w") as f:
        f.write(f"# {creator.upper()} — Full Video Transcripts (GMV-Ranked)\n")
        f.write(f"# Generated: May 31, 2026\n")
        f.write(f"# Total videos: {len(results)} successful, {len(failed)} failed\n")
        f.write(f"# Source: Kalodata top GMV export, 6-month window\n\n")
        
        for r in results:
            f.write(f"{'='*60}\n")
            f.write(f"RANK: {r['rank']} | GMV: {r['gmv']} | VIDEO ID: {r['video_id']}\n")
            f.write(f"URL: {r['url']}\n")
            f.write(f"WORD COUNT: {r['word_count']}\n")
            f.write(f"{'='*60}\n")
            f.write(r['transcript'])
            f.write("\n\n")
    
    # Completion report
    print(f"\n{'='*60}")
    print(f"COMPLETION REPORT — {creator}")
    print(f"{'='*60}")
    print(f"Successfully transcribed: {len(results)}/{len(results)+len(failed)} videos")
    if failed:
        print(f"\nFailed/Flagged videos:")
        for f_item in failed:
            print(f"  [{f_item['rank']}] {f_item['video_id']} — {f_item['reason']}")
    print(f"\nTranscripts saved to: {transcript_file}")
