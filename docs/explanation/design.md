# Design — pinky-studio
*Update date : 2026-05-26 09:00*

Architecture decisions and constraints for the pinky-studio static HTML toolset.

---

## Zero-dependency philosophy

Every tool is a standalone HTML file. No build step, no bundler, no framework.
Open `index.html` in a browser and it works — or serve via GitHub Pages with no CI pipeline.

**Why:** Snowflake developers already have a heavy toolchain. The studio must be
instantly usable without installing anything extra. A build step would add friction
for every tool change.

**Exception:** Pinky QueryFile requires a local FastAPI/DuckDB backend because DuckDB's
Excel extension is not available in WASM. This backend is dev-only — the studio itself
remains static.

---

## One directory = one tool

Each tool lives under `pages/<name>/` with its own `index.html`, `app.css`, `app.js`.
Page-specific CSS overrides the shared `:root` tokens for that tool's accent color.
Shared tokens are in the root `app.css` (loaded by every page via `../../app.css`).

**Why:** isolation — a change to one tool cannot break another. No shared state, no
shared logic beyond the CSS design tokens.

---

## Gist as live data source

Volatile data (repos.json, presets, emojis, articles) lives in a GitHub Gist
(`f1b86f55e7ec008146c56417cc342815`), fetched at runtime. Adding a new repo card or
article requires no deploy — edit the Gist.

**Why:** GitHub Pages is static. This pattern gives live updates without a backend.

---

## assets/pdoc/pythia.css — frozen filename

The shared pdoc theme (`assets/pdoc/pythia.css`) is referenced by pinky-core and
pinky-streamlit docs via a hardcoded GitHub Pages URL. The filename `pythia.css` is
intentionally kept even after the org rename — changing it would break all deployed API
reference sites. Only rename if all consumers are updated in the same deploy.

---

## Out of scope

- Build system, bundler, or transpilation
- Authentication or user accounts
- Server-side rendering
- Mobile-first design (desktop dev tool, not a consumer product)
