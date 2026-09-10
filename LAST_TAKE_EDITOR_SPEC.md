# Last-Take TikTok Video Editor Specification

**Version:** 1.0.0  
**Date:** September 8, 2026  
**Status:** Approved for Implementation  

---

## 1. Executive Summary

The Last-Take TikTok Video Editor is a creator-first tool modeled after CutAI and tailored for healthcare and TikTok Shop affiliate creators. Creators naturally repeat lines multiple times when filming until they get the delivery right. This tool automatically ingests raw footage (single long files or multiple clips), transcribes and segments the speech, identifies retake groups without requiring a pre-uploaded script, applies the **Last-Take Rule** (selecting the final complete delivery), cuts out all dead air, and applies an optional **Audio Bleed (Overlap Audio)** pass to create fast-paced, continuous TikTok-ready edits.

---

## 2. Input Specifications

| Capability | Specification |
|---|---|
| **Input Formats** | MP4, MOV, WebM, M4V |
| **Input Modes** | 1. Single continuous raw recording (e.g., 3–6 minute raw file)<br>2. Multiple raw video clips (up to 10 clips in sequence) |
| **Sample Footage Support** | Built-in sample loader for immediate testing with creator's uploaded files (`IMG_7546.MOV`, `IMG_7502.MOV`) and transcripts |
| **Script Requirement** | **None.** No script upload is required. The editor detects repeated lines directly from speech transcription and lexical/semantic analysis. |
| **Optional Transcript Upload** | Supports optional plain text/timestamped transcript ingestion for instant processing or offline review. |

---

## 3. Core Processing Pipeline

```
[Raw Video(s)]
      │
      ▼
[1. Audio Extraction & Speech Recognition]
      │  - Built-in Whisper STT / Transcript Ingestion
      │  - Word and phrase-level timestamps
      ▼
[2. Utterance Segmentation & Normalization]
      │  - Merge adjacent tokens within natural pauses (< 1.2s)
      │  - Text normalization (case, punctuation, filler filtering)
      ▼
[3. Retake Grouping (Fuzzy / Semantic Matching)]
      │  - Temporal proximity window
      │  - Token similarity (Jaccard + Levenshtein + Keyword overlap)
      │  - False-start / prefix detection
      ▼
[4. Last-Take Selection & Dead-Air Removal]
      │  - Default: select the LAST complete take in each retake group
      │  - Discard partial false starts and non-selected attempts
      │  - Strip all unassigned intervals (dead air, prep time, prop setup)
      │  - Apply lead-in (80ms) and lead-out (120ms) padding
      ▼
[5. Creator Review & Approval]
      │  - Interactive UI showing all groups, takes, and durations
      │  - Creator can override any selection with 1 click
      │  - Interactive timeline and instant cut preview
      ▼
[6. Audio Bleed (Overlap Audio) Processing]
      │  - Toggle: Enabled (default) / Disabled
      │  - Overlap duration: 150ms default (configurable 50ms - 300ms)
      │  - Tail of previous clip bleeds smoothly into head of next clip
      ▼
[7. TikTok 9:16 Render & Export]
      │  - Vertical 1080x1920 @ 30fps CFR
      │  - H.264 (yuv420p) + AAC audio
      │  - Direct browser download
```

---

## 4. Retake Detection Algorithm

### 4.1 Utterance Grouping Criteria
Two utterances $U_a$ and $U_b$ belong to the same **Retake Group** if:
1. **Sequential Proximity:** They appear in the same filming block (consecutive or separated only by silence/false starts).
2. **Text Similarity:** 
   $$\text{Similarity}(U_a, U_b) \ge 0.45$$
   calculated as a weighted combination of:
   - Jaccard token overlap on stemmed words
   - Levenshtein character distance on normalized strings
   - Key entity match (e.g. product names like "Medicube", "peeling shot", "spray", "body bumps")
3. **Prefix / Incomplete Start:** $U_a$ is an initial prefix of $U_b$ (e.g., *"To celebrate the launch they're also giving..."* vs *"To celebrate the new launch, they're also giving away some bonuses"*).

### 4.2 Selection Heuristic: The Last Complete Take
Within any retake group $[T_1, T_2, \dots, T_k]$:
- If $T_k$ is complete (does not end abruptly in an unfinished word or sub-second fragment), select $T_k$.
- If $T_k$ was an accidental false start trailing off, select $T_{k-1}$ if $T_{k-1}$ was complete, but flag for review.
- The creator always has full visual override capability in the review panel.

---

## 5. Audio Bleed (Overlap Audio) Mechanics

- **Purpose:** On TikTok, hard cuts with complete silence between dialogue chunks sound sterile and disjointed. Audio bleed creates a fast-paced, high-retention cadence.
- **Timing:** Applied **strictly after** dead-air removal.
- **Technique:**
  - Let $C_i$ be clip $i$ and $C_{i+1}$ be clip $i+1$.
  - Duration: $D_{\text{bleed}} \approx 150\,\text{ms}$.
  - The audio of $C_i$ continues for $D_{\text{bleed}}$ with an exponential fade-out while $C_{i+1}$ begins, or a smooth crossfade is applied across the video transition boundary.
  - Video cuts are exact jump cuts (zero video overlap), maintaining crisp visual pacing.

---

## 6. Output & Export Specifications

| Parameter | Default Value | Options |
|---|---|---|
| **Aspect Ratio** | 9:16 Vertical (1080 × 1920) | 9:16 Vertical, Original Source Ratio |
| **Resolution** | 1080p (1080 × 1920) | 1080p, 720p |
| **Frame Rate** | 30 fps CFR | 30 fps, 24 fps, 60 fps |
| **Video Codec** | H.264 (libx264, profile high, level 4.1, yuv420p) | H.264 |
| **Audio Codec** | AAC (stereo, 48 kHz, 192 kbps) | AAC |
| **Audio Bleed** | Enabled (150ms) | Enabled (50–300ms) / Disabled |
| **Container** | MP4 (`faststart` enabled for immediate playback) | MP4 |
