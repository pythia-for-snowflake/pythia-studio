# MVP — pinky-studio
*Update date : 2026-05-26 09:00*

## Scope

The studio is live on GitHub Pages. The MVP is reached for all tools except
Pinky Config, whose UX refactor was unblocked on 2026-05-26.

## Delivered

- `index.html` — landing page with card grid (dynamic from Gist repos.json)
- `pages/palette-title-generator/` — Pinky Design: color harmony, tokens, app title PNG export
- `pages/hub-online/` — curated live docs links
- `pages/hub-articles/` — articles from Gist
- `pages/duckdb-explorer/` — Pinky QueryFile: local XLSX/CSV/Parquet/S3/HTTP explorer
- `assets/pdoc/pythia.css` — deployed, referenced by pinky-core and pinky-streamlit docs
- `tests/` — 18 visual regression tests (Playwright, 3 browsers)
- `scripts/check_links.sh` — external link validation
- Pre-push hook — link check + visual regression tests when HTML/CSS/JS changed
- Gist `f1b86f55e7ec008146c56417cc342815` — presets, emojis, articles, repos.json

## Next step — Pinky Config refactor

Design unblocked on 2026-05-26. Target: wizard 8-step with collapsible sidebar:

- Step 1 (required): project type — Python package / data project / data admin
- Step 1b (required): git provider (GitHub / GitLab) — cascades to step 7
- Step 2: conda env + dependencies
- Step 3: pre-commit hooks
- Step 4: commit convention — gitmoji builder + emoji list helper
- Step 5: offline API doc config
- Step 6: repo structure (generated from step 1 type)
- Step 7: GitHub / GitLab guide (from step 1b provider)
- Step 8: Review & Export — full script + pyproject.toml + .pre-commit-config.yaml + tree + .zip

Navigation: collapsible left sidebar with Material Icons (collapsed = icon, expanded = icon + title).
Step 1 and 1b required; rest bypassable. State persisted in localStorage.

## Out of scope

- Backend / server
- Build step / JS framework
- Authentication
