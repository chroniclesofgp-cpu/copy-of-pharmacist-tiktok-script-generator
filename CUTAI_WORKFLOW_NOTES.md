# CutAI Workflow Notes

**Research date:** September 8, 2026

**Primary public reference:** [CutAI Full Tutorial: How I Edit & Post 10x More Videos With AI](https://www.youtube.com/watch?v=oe1z2KLpxqg)

## Observed behavior

The tutorial demonstrates selecting one or more prerecorded videos from a device library, with on-screen messaging indicating that up to 10 videos can be processed at once. The tutorial does not establish whether the app accepts text scripts or audio-only inputs.

The demonstrated creator records repeated attempts within a single continuous recording and sends the raw footage to CutAI. The app produces a substantially shorter condensed edit. The tutorial establishes that the app removes dead space or pauses between lines, but it does not establish a user-configurable silence threshold or aggressiveness setting.

The product includes a toggle labeled **Overlap audio** with supporting text describing that CutAI will smooth audio bleed into the next clip. The exact overlap duration and implementation are not exposed in the tutorial, so the MVP should treat bleed duration as an implementation setting rather than assume a particular crossfade algorithm.

After processing, the app provides a basic Cuts preview with playback controls. The tutorial does not show manual in-app controls for restoring deleted takes, changing in/out points, or rearranging the generated cut list. The creator performs later trimming and caption work in TikTok after export.

The observed export screen exposes resolution choices of 480p, 720p, 1080p, and 4K; frame-rate choices of 24, 30, and 60 fps; a bitrate slider shown at 30 Mbps; and an estimated file size. The tutorial shows exporting to the camera roll, but does not establish the final container format or direct social-platform sharing behavior.

## Implications for this MVP

The proposed editor should match the useful parts of the workflow while adding explicit control over the key behavior CutAI leaves opaque. It should accept both a single long raw recording and multiple clips, require no script upload, identify repeated lines using speech transcription and fuzzy matching, keep the final detected take by default, remove dead air before applying audio bleed, expose an **Overlap audio** toggle, and provide a review step where detected take groups can be inspected before export.

For TikTok, the initial export default should be vertical 9:16 at 1080p and 30 fps, with a configurable bitrate and MP4/H.264 output if the browser/server media pipeline supports it. These defaults should be validated against the sample footage and may be adjusted if the source recordings use a different frame rate or aspect ratio.

## Evidence limits

The public tutorial does not prove how CutAI determines the best take, whether its AI reads a transcript, whether it always selects the last take, or whether audio overlap is a crossfade, a pre-roll, or another waveform operation. Those points remain design choices for this project and should be tested against the creator's actual footage.
