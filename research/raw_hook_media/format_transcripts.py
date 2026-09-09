from pathlib import Path
import re

items = [
    {
        "source": "drew_nad_dosing_exact_transcription.txt",
        "output": Path("../NAD_DOSING_DREW_VERBATIM_TRANSCRIPT_2026-09-04.md"),
        "title": "NAD Dosing — Drew Reviews",
        "url": "https://www.tiktok.com/@drew.review1/video/7605736101134830862",
    },
    {
        "source": "naturo_age_reversal_transcription.txt",
        "output": Path("../AGE_REVERSAL_NATURO_VERBATIM_TRANSCRIPT_2026-09-04.md"),
        "title": "Age Reversal — Naturopathic Apothecary",
        "url": "https://www.tiktok.com/@naturopathicapothecary1/video/7628589452616617229",
    },
]

for item in items:
    raw = Path(item["source"]).read_text(encoding="utf-8")
    start = raw.find("Timestamped segments:")
    end = raw.find("Complete transcription result saved", start)
    if start < 0 or end < 0:
        raise RuntimeError(f"Could not find transcript boundaries in {item['source']}")
    block = raw[start:end]
    lines = []
    for line in block.splitlines():
        match = re.match(r"^\[[^]]+\]\s*(.*)$", line.strip())
        if match and match.group(1).strip():
            lines.append(match.group(1).strip())
    if not lines:
        raise RuntimeError(f"No spoken lines found in {item['source']}")
    text = "\n\n".join(lines)
    document = f"# {item['title']} — Verbatim Transcript\n\nSource: {item['url']}\n\n{text}\n"
    item["output"].write_text(document, encoding="utf-8")
    print(item["output"])
