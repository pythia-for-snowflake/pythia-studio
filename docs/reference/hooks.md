# Hooks — pinky-studio
*Update date : 2026-05-26 09:00*

Git hooks configured for this repo and why each one exists.

> pinky-studio uses hand-installed git hooks (`.git/hooks/`) rather than pre-commit,
> because it has no Python package structure and no pyproject.toml.

---

| Hook | Trigger | What it does | Why |
|------|---------|-------------|-----|
| `pre-commit` | Every commit | Detects zero-width spaces in staged HTML/CSS/JS/Python/Markdown/JSON/YAML/shell files via `scripts/hooks/check_zws.py` | Prevents invisible copy-paste artifacts from Teams/Outlook reaching the repo |
| `pre-push` | `git push` when HTML/CSS/JS changed | 1. Runs `scripts/check_links.sh` (validates all external URLs in `pages/`) 2. Runs Playwright visual regression tests (Chromium + Firefox + WebKit) | Catches broken links and visual regressions before they reach GitHub Pages |

The pre-push hook skips both checks if no `.html`, `.css`, or `.js` files changed —
doc-only or backend-only pushes are fast.
