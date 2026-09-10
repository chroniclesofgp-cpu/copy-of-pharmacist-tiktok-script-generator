# Sample Transcript Analysis

**Source files received:**

- `IMG_7546_converted_20260908_171807_transcription_20260908_171817.txt`
- `IMG_7502_converted_20260908_170157_transcription_20260908_170205.txt`

**Analysis date:** September 8, 2026

## What the samples show

Both transcripts come from continuous raw recordings in which a spoken line is attempted several times in sequence. The transcription includes partial fragments, false starts, exact or near-exact repetitions, revised wording, and long intervals with little or no recognized speech. This is exactly the type of input the last-take editor needs to handle without a script upload.

The first sample, `IMG_7546`, contains several clear retake groups. The opening includes a correction from “body shot, lotion, and wash” to “peel shot, body wash, and lotion.” The phrase “I say maybe if you bought them all separately” is attempted repeatedly, with the cleanest complete version appearing last in the local group. “But Medicube put them all in a new Body Bumps bundle” follows a partial false start and then a clean completion. “And now you can get them all for a fraction of the price” is repeated. The launch-bonus sentence is attempted in incomplete and corrected forms before the complete version appears. The closing call to action is also repeated, with the final version adding the urgency phrase “before they’re gone.”

The second sample, `IMG_7502`, shows the same pattern with more fragmentary ASR output. “So the actual routine” is restarted as “So the actual daily routine.” The daily-routine sentence is split across “Lotion” and “every day,” with a long silence before the next step. The peeling-shot instruction is followed by a revised sensitivity warning: one version says not to stack the peeling shot with the lotion, another says not to stack the spray with the lotion. The launch-bonus and closing call-to-action sections also contain long pauses, restarts, and a final clean version.

## Timing and segmentation implications

A detector cannot treat every ASR row as an independent take. Rows such as “And,” “I,” “But,” “To,” “I would,” and “Lotion” are often lead-in fragments or partial recognition of the following take. The system should merge adjacent speech segments into candidate utterances when they are separated by a short pause, then use the longer silence intervals as stronger boundaries between editing units.

The long gaps in these samples are material editing signals. Examples include approximately 80 seconds in `IMG_7546` between the repeated “I say maybe…” attempts and the next bundle sentence, approximately 40 seconds before the launch-bonus sentence, and approximately 23 seconds before the final CTA retry. In `IMG_7502`, there are approximately 10 seconds between the opening restart and the clean daily-routine sentence, approximately 21 seconds before the sensitivity warning is completed, and approximately 48 seconds before the launch-bonus section. Dead-air removal must happen before audio bleed is applied.

## Last-take rule

The default selection rule should be **last complete semantically matching take in source order**, not simply the last ASR row. The detector should group neighboring or overlapping candidate segments by semantic similarity, allow a later take to replace an earlier one, and prefer a later candidate when it is complete enough to stand alone. The selected candidate should retain its original video time range, including a small configurable amount of natural lead-in and lead-out after dead air is removed.

A purely lexical exact-match rule will fail on the observed samples because the final take may add words, correct a product name, or replace a phrase. The first version should therefore use normalized text, token overlap, fuzzy similarity, and completion heuristics. It should also preserve the candidate groups in the review screen so the user can verify what was kept.

## Transcript should be optional

The supplied transcripts are useful for validating the segmentation model and for displaying candidate text, but they should not become a required input. In production, the editor should generate its own timestamped transcription from uploaded media. If a user supplies a transcript, the MVP may support it as an optional diagnostic or faster-analysis input, but the take-selection flow must work without it.

## Initial MVP acceptance cases derived from the samples

1. A partial false start followed by a complete later sentence is grouped together, with the complete later sentence selected.
2. Several near-identical attempts are grouped together, with the last complete attempt selected.
3. A later take with an added CTA qualifier, such as “before they’re gone,” replaces an earlier shorter take when it is a natural completion of the same unit.
4. A revised product term, such as “peeling shot” versus “spray,” is surfaced as a candidate difference rather than silently treated as an exact duplicate.
5. Long periods without speech are removed before any audio-bleed pass.
6. Fragments such as “And,” “I,” “But,” and “I would” do not become standalone final clips unless the timing and following speech indicate that they are intentionally separate.
7. Multi-clip uploads preserve clip order and treat later clips as later source order unless the user explicitly reorders them.

## Still needed for validation

The transcript timestamps are sufficient to define the initial detection logic, but the actual video files are needed to verify whether the timestamp ranges align with usable visual starts and ends, how much lead-in and lead-out sound natural, whether the pauses are truly silent or contain room tone, and whether the audio-bleed pass should use a fixed duration or an adaptive duration.
