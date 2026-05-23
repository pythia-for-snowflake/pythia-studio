import io
from pathlib import Path

import pytest
from PIL import Image, ImageChops

PAGES = [
    ("index",     "/"),
    ("palette",   "/tools/palette-title-generator.html"),
    ("hub-online", "/tools/hub-online.html"),
    ("hub-articles", "/tools/hub-articles.html"),
    ("env-generator", "/tools/env-generator.html"),
    ("hub-offline", "/tools/hub-offline.html"),
]

SNAPSHOTS_DIR = Path(__file__).parent / "snapshots"
BASE_URL = "http://127.0.0.1:18765"
THRESHOLD = 0.01  # 1 % of pixels may differ (font hinting across OS)


def _diff_ratio(a: bytes, b: bytes) -> float:
    img_a = Image.open(io.BytesIO(a)).convert("RGB")
    img_b = Image.open(io.BytesIO(b)).convert("RGB")
    if img_a.size != img_b.size:
        return 1.0
    diff = ImageChops.difference(img_a, img_b)
    total_channels = img_a.size[0] * img_a.size[1] * 3
    diff_sum = sum(diff.getflattened_data())
    return diff_sum / (total_channels * 255)


@pytest.mark.parametrize("name,path", PAGES)
def test_snapshot(page, name, path, browser_name):
    page.goto(f"{BASE_URL}{path}")
    page.wait_for_load_state("networkidle", timeout=10_000)

    current = page.screenshot(full_page=True)

    baseline = SNAPSHOTS_DIR / browser_name / f"{name}.png"
    if not baseline.exists():
        baseline.parent.mkdir(parents=True, exist_ok=True)
        baseline.write_bytes(current)
        pytest.skip(f"baseline saved → {baseline.relative_to(Path(__file__).parent)}")

    ratio = _diff_ratio(baseline.read_bytes(), current)
    assert ratio <= THRESHOLD, (
        f"[{browser_name}] {name}: pixel diff {ratio:.2%} exceeds threshold {THRESHOLD:.0%}"
    )
