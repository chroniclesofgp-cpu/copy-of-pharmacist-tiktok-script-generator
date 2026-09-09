## Source leads verified 2026-09-04

- **NAD Dosing — Drew / @drew.review:** Public search identified an exact likely dosing source: https://www.tiktok.com/@drew.review/video/7490996569349803310 (search title: “Replying to @DonniHaas their new 500mg NAD with ...”). A second related indexed source is https://www.tiktok.com/@drew.review/video/7492875586424245550 (search title: “NAD Supplements: The Right Dose for Anti-Aging”). The active framework cites Drew at 18.2M views, but the cited view count and exact reference mapping still require direct verification.
- **Age Reversal — Naturo / @naturopathicapothecary1:** Public search identified related exact sources: https://www.tiktok.com/@naturopathicapothecary1/video/7628589452616617229 (NMN vs Astaxanthin as anti-aging supplements) and https://www.tiktok.com/@naturopathicapothecary1/video/7601335306075245837 (NAD vs NMN, which anti-aging supplement should you take?). The active framework cites Naturo at 7.9M views, but the exact cited Age Reversal mapping remains to be verified.
- **Trend-or-Trash — Riva / @adoseofwellness:** The active Hook Frameworks document names Riva and cites 1.5M views but does not expose an exact URL in the source block. The retained `analysis/riva_deep_analysis.md` documents Riva’s broader warning/education patterns, not a confirmed Trend-or-Trash transcript.
- **Warning Signs — Dr. Faith / @faithfuldoc:** Retained URL inventory includes many exact Dr. Faith source URLs and analysis files, but the active source block does not identify which exact video corresponds to the cited Warning Signs hook. Existing `analysis/faithfuldoc_transcripts_gmv_full.txt` and ranked analysis files contain transcript and timing evidence that can be matched after the exact rank/source is resolved.
- Direct project search confirmed creator-specific ranked analysis directories and transcript bundles for Riva, Drew, Naturo, and Dr. Faith. The named hooks must be matched to exact video IDs before any transcript is labeled complete/verbatim.
## Exact source candidate verified from retained analysis

- **Drew Trend-or-Trash candidate:** `analysis/drew_video_analysis/acct1_rank_01_analysis.txt` identifies https://www.tiktok.com/@drew.review/video/7592733868550114574, GMV $179,257, with the opening: “If you take astaxanthin for one month straight, here is what you will experience. I'm a pancreatic cancer researcher, and I talk about the science behind whether certain supplements work or not.” This is an After-1-Month/ingredient-evidence execution rather than proof of the exact “Is X worth it? A pharmacist looks at the evidence” Trend-or-Trash wording. It is retained as a candidate only until the active framework’s exact Trend-or-Trash attribution is matched.
## Candidate matching update

- **NAD Dosing / Drew candidate:** `analysis/drew_video_analysis/acct1_rank_02_analysis.txt`, Micro Ingredients NMN Complex, URL https://www.tiktok.com/@drew.review/video/7578355445631356174, GMV $117,035. Retained transcript-bundle matching segment opens with “of the billionaires who take NNM, but what makes the one that they take more effective than other ones? That, my friends, is the addition of TMG.” Exact active-framework hook wording still needs matching to the source video.
- **Age Reversal / Naturo candidate:** `analysis/naturo_video_analysis/rank_02_analysis.txt`, Video ID 7628589452616617229, URL https://www.tiktok.com/@naturopathicapothecary1/video/7628589452616617229. Retained transcript segment 15 opens: “Christina swears by Asazanthin and Kim swears by NMN, but which one of these anti-aging supplements is actually worth your money?”
- **Warning Signs / Dr. Faith:** active framework cites @faithfuldoc at 6M views, but the retained ranked analyses expose several symptom/aging candidates (IDs 7618978253952257310, 7616016652441832734, 7622902639453408542, 7609504443960233246) without an unambiguous “warning signs” title match. Do not label one exact until source wording and rank are reconciled.

## Browser/source retrieval update

The canonical Drew URL resolves in TikTok to a 1:48 video titled “Let’s discuss whether NMN or NAD is better suited for you,” posted by Drew Reviews on 2025-11-30. TikTok exposes the source URL and video metadata but not a transcript in page text. The source MP4 was successfully retrieved from the canonical URL and transcribed locally.

The canonical Naturo URL was successfully retrieved and transcribed locally. TikTok page text was not needed after yt-dlp retrieval.

TikTok’s public `#trendyortrash` page loaded only the hashtag shell and login prompt in the sandbox; it did not expose video cards or canonical links. The Riva Trend-or-Trash source remains unresolved pending a stronger URL candidate.

## Corrected source match

The first Drew URL tested (`7578355445631356174`) is a related NMN-versus-NAD comparison and is not the active NAD Dosing reference. The retained exact tutorial source is `analysis/drew_video_analysis/acct2_rank_10_analysis.txt`: https://www.tiktok.com/@drew.review1/video/7605736101134830862. Its documented opening is “Here's how to take NMN and astaxanthin together correctly from a pancreatic cancer researcher and a naturopathic practitioner,” and its transcript-only deliverable has been regenerated from that exact source.

## Tier 3 Facebook access test — September 4, 2026

The existing framework links were found in the rebuild source logs. Direct link-based retrieval succeeded without Facebook login for Do/Don’t Contrast (`https://www.facebook.com/reel/1241122267803302`) and Numeric Scorecard (`https://www.facebook.com/reel/1019273693814974`); both now have complete transcript-only files. The existing Best-Last URL (`https://www.facebook.com/reel/2629687567410812`) also downloaded without login, but its current content is a 9.2-second “Five content tools to help you go viral and make money” reel, not the expected “#5 is the best one” ranking video. This is a stale or incorrect source mapping, not a Facebook authentication block. Category Scorecard is sourced from Instagram and Bundle Routine Walkthrough from TikTok, so they do not depend on the Facebook access path.

## Correction — Best-Last classification

The Facebook reel `https://www.facebook.com/reel/2629687567410812` was not intended to be the canonical “#5 is the best one” ranking source. It is the user-provided exploratory viral-format example. Its current 9.2-second transcript (“Five content tools to help you go viral and make money”) is retained as exploratory format evidence and must not be described as a stale or incorrect canonical source.

## Cross-creator validation recovery — September 5, 2026

Direct retrieval and full Whisper transcription succeeded for the exact Riva Rank 10 expert-verdict source, Dr. Faith Rank 8 magnesium source, Dr. Faith Rank 4 symptom-checklist source, both uniquely documented Drew right-way references (oregano and collagen), and Naturo’s exact 11.9M suppressed-knowledge URL. No substitute same-creator videos were used. The Drew right-way framework lists multiple Drew examples, so both were retained. No uniquely identified Drew symptom-checklist citation was preserved in the active framework; Dr. Faith Rank 4 was used as the second symptom-checklist creator because it is the exact citation recorded by the framework.

## Validation-count correction — September 5, 2026

- **Right-way:** Corrected `HOOK_FRAMEWORKS.md` from an erroneous 5-of-5 statement to **3 of 5 creators' analyzed top-performing samples (90-day window)**. The retained verified creators named in the entry are rphreviews, Dr. Faith, and Drew. Riva’s previously cited collagen line is explicitly excluded and is not counted.
- **After-1-Month:** The prior 3-of-5 figure was unsupported. The exact retained evidence supports **2 of 5 creators' analyzed top-performing samples (90-day window): Drew and rphreviews**. Drew’s astaxanthin and saffron timeline references and rphreviews Rank 26 astaxanthin are retained. No third creator is currently verified.
- **New standalone transcript:** `research/RPHREVIEWS_AFTER_1_MONTH_ASTAXANTHIN_RANK26_VERBATIM_TRANSCRIPT_2026-09-05.md`.
