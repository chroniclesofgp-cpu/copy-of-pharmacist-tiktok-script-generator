from pathlib import Path
import re

for source, output in [
    ("analysis/adoseofwellness_transcripts_gmv_full.txt", "/tmp/riva_openings_full.txt"),
    ("analysis/faithfuldoc_transcripts_gmv_full.txt", "/tmp/faith_openings_full.txt"),
]:
    text = Path(source).read_text(encoding="utf-8", errors="replace").splitlines()
    rank = url = first = ""
    rows = []
    for line in text:
        if line.startswith("RANK:"):
            rank, url, first = line, "", ""
        elif line.startswith("URL:"):
            url = line
        elif re.match(r"^\[[0-9]", line) and not first:
            first = line
            rows.append(f"{rank} | {url} | first={first}")
    Path(output).write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(output, len(rows))
