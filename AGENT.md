# AGENT.md — pinky-studio
*Update date : 2026-05-25 16:31*

Browser-based tools for the pinky-and-snowflake suite.
No build step — open any `.html` directly or serve via GitHub Pages.

---

## What this repo is

`pinky-studio` is a collection of **standalone HTML tools** that support local development,
design, and exploration workflows around the pinky suite.
Each tool lives in its own directory under `pages/` — `index.html` + `app.css` + `app.js`.
No build step, no framework, no external runtime (except where a local backend is explicitly required).

---

## Repository structure

```
pinky-studio/
├── index.html              ← landing page (card grid, loads repos.json from Gist)
├── app.css                 ← shared CSS tokens and base styles (loaded by every page)
├── repos.json              ← product/API card data (fetched from Gist, kept in sync locally)
├── assets/
│   ├── images/             ← logos and icons (pinky, snowflake, streamlit, anthropic…)
│   └── pdoc/
│       └── pythia.css      ← shared CSS for pdoc API reference pages (filename unchanged)
├── pages/                  ← one directory per tool
│   ├── duckdb-explorer/    ← Pinky QueryFile — local file explorer (FastAPI/DuckDB backend)
│   ├── palette-title-generator/
│   ├── env-generator/
│   ├── hub-online/
│   └── hub-articles/
├── duckdb_explorer/        ← FastAPI backend for Pinky QueryFile
│   ├── server.py           ← /health · /upload · /query endpoints
│   └── requirements.txt
├── scripts/                ← dev helpers (serve, lint…)
├── tests/                  ← backend tests (pytest)
├── LICENSE
├── README.md
└── AGENT.md                ← this file
```

Each page directory contains:
- `index.html` — page structure (loads `../../app.css` then `./app.css`)
- `app.css` — page-specific styles; overrides `:root` tokens for the page's accent color
- `app.js` — page logic

---

## Tools overview

| Tool | Path | Backend required |
|------|------|-----------------|
| Pinky QueryFile | `pages/duckdb-explorer/` | Yes — `uvicorn duckdb_explorer.server:app` |
| Pinky Design | `pages/palette-title-generator/` | No |
| Env Generator | `pages/env-generator/` | No |
| Stack Reference | `pages/hub-online/` | No |
| Articles | `pages/hub-articles/` | No |

### Pinky QueryFile — backend

```bash
# from pinky-studio/
uvicorn duckdb_explorer.server:app --port 8000
```

- Accepts local paths, S3 URLs (`s3://…`), HTTP URLs
- Loads DuckDB `excel` + `httpfs` extensions on startup
- Endpoints: `GET /health`, `POST /upload`, `POST /query`

---

## Stack

- HTML / CSS / vanilla JS — no framework, no bundler
- DuckDB (via FastAPI backend) — `duckdb>=1.2.0`
- FastAPI + uvicorn — local backend for Pinky QueryFile only
- Python 3.11 (backend only)
- Material Symbols Outlined — Google Fonts CDN (icon ligatures)
- Syne + Courier New — UI fonts

---

## Commit convention

Format: `<emoji> <type>(<scope>): <description>`

| Scope | Covers |
|-------|--------|
| `queryfile` | `pages/duckdb-explorer/` + `duckdb_explorer/` backend |
| `studio` | `index.html`, `app.css`, `repos.json`, global layout/landing page |
| `design` | `pages/palette-title-generator/` |
| `env` | `pages/env-generator/` |
| `hub` | `pages/hub-online/`, `pages/hub-articles/` |
| `assets` | `assets/` — logos, icons, pdoc CSS |
| `docs` | `README.md`, `AGENT.md` |
| `ci` | `scripts/`, `tests/`, GitHub Actions |

See workspace-level CLAUDE.md for the full emoji ↔ type table.

---

## Agents available (in pinky workspace)

| Command | What it does |
|---------|-------------|
| `/commit` | Analyse git diff → propose gitmoji commit message |
| `/yml_audit` | Audit YAML files (comments + PII tags) |
| `/code_comments` | Add English comments to Python source |
| `/enrich_readme` | Complete README placeholders |
| `/explain` | Explain the repo (dev / archi / infra profile) |
| `/clean_history` | Rewrite git history with clean commits |
