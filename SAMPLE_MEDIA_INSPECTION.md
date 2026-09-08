# Sample Media Inspection

**Analysis date:** September 8, 2026

## Media characteristics

Both source files are vertical 2160 × 3840 HEVC MOV recordings at approximately 30 frames per second with mono AAC audio sampled at 48 kHz. `IMG_7546.MOV` is approximately 360.25 seconds long and about 1.02 GB. `IMG_7502.MOV` is approximately 210.45 seconds long and about 598 MB. These files are already in a TikTok-compatible portrait orientation, but the MVP should still normalize orientation metadata and export to a standard 9:16 profile.

## IMG_7546 findings

This is a single continuous raw recording with roughly six minutes of preparation, silent rehearsal, prop handling, repeated lines, partial starts, and usable speech. The actual final spoken assembly is estimated at roughly 25–30 seconds. The usable take groups include the problem statement, the “bought separately” setup, the Medicube bundle solution, the price sentence, the launch bonuses, the limited-bonus urgency line, and the final CTA.

The recording includes silent lip-syncing and mental preparation, not just true silence. It also contains cardboard scraping, object clinks, plastic wrapper noise, and other handling sounds. The editor must therefore combine speech activity, ASR timestamps, waveform energy, and visual/take context rather than assuming that every quiet interval is safe to use or that every non-speech sound is dead air.

The strongest examples of the last-take rule are the repeated “I say maybe if you bought them all separately” line, the repeated bundle-price sentence, and the closing CTA. The final CTA is a later alternative that is shorter but still complete. The selection model should compare completeness and semantic continuity, then prefer the later complete candidate by default.

## IMG_7502 findings

This is a roughly three-and-a-half-minute raw recording containing the daily routine, a skin-sensitivity warning, a launch-bonus statement, urgency language, and a final CTA. It shows a sequence of long dead-air intervals while the presenter handles products and prepares the next line.

The strongest selection example is the warning group. A partial sentence begins with “peeling shot,” a complete version repeats that wording, and a later complete version changes the product reference to “spray” and ends with “two exfoliating steps at once.” The later version should be surfaced as the selected final take, while the earlier version should remain available as an alternative in the review screen because the wording difference may have product-accuracy implications.

The video also contains whispered rehearsals inside otherwise quiet gaps, including before the peeling-shot line, the warning conclusion, and the launch-bonus section. This is a critical implementation constraint: dead-air removal must not be based on a simple silence gate, and audio bleed must never pull rehearsal audio from the source gap into the next selected clip.

## Required editing pipeline

The media supports the following ordered pipeline:

1. Ingest one long video or multiple clips and preserve source order.
2. Extract or receive timestamped speech transcription.
3. Detect voiced speech regions and merge short adjacent ASR fragments into candidate utterances.
4. Identify candidate retake groups using temporal proximity, semantic similarity, false-start patterns, and source order.
5. Select the last complete usable candidate in each group by default, while retaining alternatives for review.
6. Trim each selected candidate with configurable lead-in and lead-out boundaries, using waveform and transcript confidence to avoid clipped consonants and whispered rehearsals.
7. Remove dead air and non-selected source intervals.
8. Concatenate selected video/audio segments with zero intentional gap.
9. If the optional overlap-audio setting is enabled, apply a short post-edit audio overlap or crossfade between the completed neighboring segments. This pass must operate on the edited sequence, not on raw source gaps.
10. Preserve or generate a consistent room-tone bed where needed, because hard cuts between isolated speech takes can otherwise create a vacuum-like transition.
11. Present the selected take groups and a preview before export.
12. Export a TikTok-first MP4 profile, initially 1080 × 1920 at 30 fps with configurable bitrate.

## Key acceptance cases

The MVP should pass these sample-derived cases:

- It must replace a partial false start with the later complete sentence.
- It must group near-duplicate attempts even when the final version adds or removes words.
- It must prefer the final complete CTA when the last attempt is semantically equivalent but differently worded.
- It must surface material wording changes, such as “peeling shot” versus “spray,” for user review rather than silently treating them as identical.
- It must remove long preparation gaps without importing whispered rehearsals.
- It must avoid including prop-handling noise from a source interval that is not selected for the final edit.
- It must support the same logic across one long source file and a set of separately uploaded clips.

## Remaining validation need

The analyses establish the timing and behavior needed to design the MVP, but implementation testing still needs to verify the exact audio boundaries, whether room tone should be synthesized or sampled from clean gaps, and whether a fixed or adaptive overlap duration sounds best on the creator's real recordings.
