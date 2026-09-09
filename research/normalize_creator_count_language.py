from pathlib import Path
import re

ROOT = Path('/home/ubuntu/pharma-script-gen')
FILES = [
    'HOOK_FRAMEWORKS.md',
    'POST_WRITE_CHECKLIST.md',
    'PRE_SESSION_BRIEF.md',
    'BUYER_PSYCHOLOGY_LEVERS.md',
    'SCRIPT_ARCHITECTURE_GUIDE.md',
    'PHRASE_BANK.md',
]

for rel in FILES:
    p = ROOT / rel
    text = p.read_text()

    # Explicit "confirmed: X/5 creators" and "X/5 creators" forms.
    text = re.sub(
        r'Confirmed:\s*(\d)/5 creators\s*—',
        lambda m: f"Confirmed via direct transcript review in {m.group(1)} of 5 creators' analyzed top-performing samples (90-day window) —",
        text,
        flags=re.I,
    )
    text = re.sub(
        r'(?<!of )(?<!in )(\d)/5 creators\b',
        lambda m: f"{m.group(1)} of 5 creators' analyzed top-performing samples (90-day window)",
        text,
    )
    text = re.sub(
        r'\b(\d)\/5 creators\b',
        lambda m: f"{m.group(1)} of 5 creators' analyzed top-performing samples (90-day window)",
        text,
    )
    text = re.sub(
        r'CONFIRMED \((\d)/5 creators([^)]*)\)',
        lambda m: f"CONFIRMED — {m.group(1)} of 5 creators' analyzed top-performing samples (90-day window){m.group(2)}",
        text,
    )
    text = re.sub(
        r'confirmed in (\d)/5 creators',
        lambda m: f"confirmed via direct transcript review in {m.group(1)} of 5 creators' analyzed top-performing samples (90-day window)",
        text,
        flags=re.I,
    )
    # Structural table variants such as "3 creators / 4 examples".
    text = re.sub(
        r'\b(\d) creators / (\d+) examples\b',
        lambda m: f"confirmed via direct transcript review in {m.group(1)} of 5 creators' analyzed top-performing samples (90-day window); {m.group(2)} retained examples",
        text,
    )
    p.write_text(text)

# Replace the old universal framing in the two governing docs.
for rel in ['HOOK_FRAMEWORKS.md', 'SCRIPT_ARCHITECTURE_GUIDE.md', 'POST_WRITE_CHECKLIST.md']:
    p = ROOT / rel
    text = p.read_text()
    text = text.replace(
        'Patterns confirmed in 3/5 creators qualify as universal structural rules. Patterns in 1–2 creators are documented as execution notes.',
        "Creator counts are sample-scoped. Use the wording 'Confirmed via direct transcript review in [N] of 5 creators' analyzed top-performing samples (90-day window).' Do not treat a reviewed sample count as a claim about all content a creator publishes.",
    )
    text = text.replace(
        'All are confirmed universal [5/5] unless noted.',
        "All are sample-scoped observations from the analyzed top-performing corpus; do not convert a 5/5 sample observation into a universal claim about all creator content.",
    )
    text = text.replace(
        'Standard Structural Rules — Confirmed Universal [5/5]',
        'Standard Structural Rules — Sample-Scoped Evidence Summary',
    )
    p.write_text(text)

print('Normalized remaining creator-count language.')
