# Raw Whisper Transcript Audit

**Prepared:** September 4, 2026  
**Scope:** Existing raw/near-raw Whisper transcript artifacts only. Analysis summaries, framework cards, and generated scripts are not treated as transcripts.

## Executive finding

The project retains substantial raw transcript material for the creator corpora used in the original in-depth analysis. The main retained sources are creator-level GMV-ranked transcript bundles: Riva, rphreviews, Drew Reviews accounts 1 and 2, Dr. Faith, and Naturopathic Apothecary. A separate `faith_transcripts_full.txt` file contains the @momfindsbyfaith BOF/bundle material. These bundles are appropriate for the requested audit because they include timestamped spoken segments and source-video URLs or video IDs.

The files do **not** prove that every named hook has a one-to-one dedicated transcript artifact. Several hooks were derived from a creator corpus and can be located inside a bundle by exact opening language, while some framework cards preserve only a source link, paraphrase, visual analysis, or structural summary. The report therefore distinguishes **raw-bundle coverage** from **exact hook-level confirmation**.

## Tier 1

| Hook | Existing raw transcript source | Audit status |
|---|---|---|
| `symptom-checklist` | `analysis/faithfuldoc_transcripts_gmv_full.txt`, `analysis/rphreviews_transcripts_gmv_full.txt`, and related creator bundles | Raw bundle coverage exists. Exact hook-level source must be matched by the opening line and video ID; do not use the framework summary as a verbatim substitute. |
| `suppressed-knowledge` | `analysis/faithfuldoc_transcripts_gmv_full.txt`, `analysis/naturopathicapothecary1_transcripts_gmv_full.txt`, `analysis/drew_acct1_transcripts_gmv_full.txt`, and `analysis/drew_acct2_transcripts_gmv_full.txt` | Raw bundle coverage exists, including “what most people don’t know” and “shoved down your throat” openings. Exact source varies by product/video. |
| `instruction-correction` | `analysis/adoseofwellness_transcripts_gmv_full.txt`, `analysis/faithfuldoc_transcripts_gmv_full.txt`, `analysis/rphreviews_transcripts_gmv_full.txt`, and `analysis/naturopathicapothecary1_transcripts_gmv_full.txt` | Strong raw coverage. Multiple exact “here’s how to take…” and “correct way” executions are on file. |
| `right-way` | The same creator bundles, especially Riva, Dr. Faith, Drew, and Naturo | Strong raw coverage. The exact reference should be selected by source URL rather than assumed from the generic framework pattern. |

## Tier 2

| Hook | Existing raw transcript source | Audit status |
|---|---|---|
| `side-effect-surprise` | Creator-level bundles, principally rphreviews, Riva, Drew, and Dr. Faith | Raw corpus coverage exists, but the current inventory does not identify one standalone transcript file named for this hook. Exact matching is required before quoting. |
| `scam-warning` | `analysis/riva_video2_transcript.txt`, `analysis/riva_scam_hook_3video_synthesis.md` as derived support, plus Riva’s wider corpus where applicable | One complete raw Riva transcript is explicitly retained. The transcript opens “This is fake…” and is the strongest standalone scam-warning transcript currently on file. The synthesis document is not itself a transcript. |
| `instead-of-drug` | `analysis/rphreviews_transcripts_gmv_full.txt` and other creator bundles | Raw corpus coverage exists; exact named drug/alternative source should be selected from the URL-bearing rank block. |
| `how-do-you-know` | `analysis/faithfuldoc_transcripts_gmv_full.txt`, `analysis/rphreviews_transcripts_gmv_full.txt`, and related bundles | Raw corpus coverage exists, including symptom/deficiency question structures. Exact framework attribution must be checked against the relevant video ID. |
| `audience-pivot` | `analysis/rphreviews_transcripts_gmv_full.txt`, `analysis/faithfuldoc_transcripts_gmv_full.txt`, and `analysis/faith_transcripts_full.txt` | Raw coverage exists for gift/third-party recommendation patterns. The @momfindsbyfaith file is especially relevant to a buyer purchasing for another person. |
| `fear-external-threat` | `analysis/rphreviews_transcripts_gmv_full.txt` | Strong raw coverage. The retained bundle includes the ABC News/flu opening and the creator’s subsequent pharmacist statement. |
| `expert-verdict` | All major creator bundles, especially rphreviews, Riva, Dr. Faith, Drew, and Naturo | Strong raw coverage. Multiple “best…” and “recommendation” openings are present; the exact reference is not a single universal transcript. |
| `after-1-month` | `analysis/drew_acct1_transcripts_gmv_full.txt`, `analysis/drew_acct2_transcripts_gmv_full.txt`, and `analysis/rphreviews_transcripts_gmv_full.txt` | Strong raw coverage. Retained openings include astaxanthin and saffron one-month examples. |
| `viral-metaphor` | `analysis/drew_acct2_transcripts_gmv_full.txt`, `analysis/naturopathicapothecary1_transcripts_gmv_full.txt`, `analysis/rphreviews_transcripts_gmv_full.txt`, and `analysis/faithfuldoc_transcripts_gmv_full.txt` | Raw corpus coverage exists, including flamingo/salmon/microalgae mechanism openings. Exact hook assignment should be made from the source URL and product context. |

## Tier 3

| Framework or example | Existing raw transcript status | Access finding |
|---|---|---|
| Bundle Routine Walkthrough | Three standalone transcripts were created for `@cakedfinds` and `@midlife.nursing` from the three TikTok URLs preserved in the source log. | Direct TikTok retrieval succeeded for all three; no Facebook access issue applies. |
| Category Scorecard | `research/CATEGORY_SCORECARD_INSTAGRAM_VERBATIM_TRANSCRIPT_2026-09-04.md` | Direct Instagram retrieval succeeded; complete 37.6-second transcript created. No Facebook access issue applies because the source is Instagram. |
| Numeric Scorecard | `research/NUMERIC_SCORECARD_FACEBOOK_VERBATIM_TRANSCRIPT_2026-09-04.md` | Direct Facebook retrieval succeeded; complete transcript created. |
| Exploratory Best-Last-style format | `research/BEST_LAST_LIST_FACEBOOK_VERBATIM_TRANSCRIPT_2026-09-04.md` | Direct Facebook retrieval succeeded; complete 9.2-second transcript created. This is the user-provided exploratory viral-format example, not a canonical “#5 is the best one” source. |
| Do/Don’t Contrast | `research/DO_DONT_CONTRAST_FACEBOOK_VERBATIM_TRANSCRIPT_2026-09-04.md` | Direct Facebook retrieval succeeded; complete transcript created. |

## Tier 4: BOF Types 1/2 — @momfindsbyfaith

The main retained raw file is `analysis/faith_transcripts_full.txt`, labeled `FAITH (@momfindsbyfaith) - FULL TRANSCRIPTS`. It contains complete spoken transcripts with source URLs for multiple BOF/bundle-style videos, including openings such as “Holy Cycler Motherload. They are spoiling us with this bundle.” This is the strongest on-file raw transcript source for the requested @momfindsbyfaith BOF audit.

The file is a transcript corpus rather than a one-video transcript. Each video must be kept with its source URL and hook heading when used for framework revalidation. The corpus should not be collapsed into a paraphrased BOF summary when the user requests the original words.

## Other previously unresolved named hooks

Drew’s exact NAD Dosing/tutorial transcript and Naturo’s exact Age Reversal transcript were already recovered as standalone documents. The retained Riva and Dr. Faith creator bundles provide broad raw transcript coverage, but the project still does not preserve an unambiguous canonical URL for the specifically named 1.5M-view Trend-or-Trash video or 6M-view Warning Signs video. Related raw candidate material must remain labeled as candidate coverage rather than being promoted to exact-hook status.

## Raw transcript files being delivered

The downloadable audit package contains the retained raw/near-raw creator bundles, the @momfindsbyfaith corpus, the retained standalone Riva scam-warning transcript, the Facebook reference transcripts, the newly recovered Instagram Category Scorecard transcript, the three newly recovered TikTok Bundle Routine transcripts, the three previously recovered comparison transcripts, and the exact-source transcript-only documents for Drew and Naturo. No analysis summary is substituted for a raw transcript.

## Important boundary

The presence of a raw transcript bundle means the spoken audio was captured for that source corpus. It does not automatically prove that the active hook card named the correct video, that the view count was preserved correctly, or that the current framework wording is verbatim. Those questions require matching the exact video ID, source URL, and opening line inside the bundle.

## Facebook retrieval test completed September 4, 2026

The three Facebook URLs already recorded in the framework source logs were tested through direct link-based retrieval. No Facebook account access, password, or re-authentication was required for the media download:

| Framework or example | Resolved URL | Retrieval result | Transcript result |
|---|---|---|---|
| Do/Don’t Contrast | https://www.facebook.com/reel/1241122267803302 | Downloaded successfully | Complete spoken transcript created |
| Numeric Scorecard | https://www.facebook.com/reel/1019273693814974 | Downloaded successfully | Complete spoken transcript created |
| Exploratory Best-Last-style format | https://www.facebook.com/reel/2629687567410812 | Downloaded successfully | Complete transcript created for the user-provided exploratory “Five content tools to help you go viral and make money” list. It is not labeled as the canonical “#5 is the best one” reference. |

The practical retrieval fix is to use the existing public URL with direct media retrieval first. A logged-in Facebook session or phone recording is only needed if a future source is private, login-gated, or no longer exposes downloadable media.
