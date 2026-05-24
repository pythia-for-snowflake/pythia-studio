# AGENT.md — pythia-studio

Browser-based tools for the pythia-for-snowflake suite.
No build step — open any `.html` directly or serve via GitHub Pages.

---

## What this repo is

`pythia-studio` is a collection of **standalone HTML tools** that support local development,
design, and exploration workflows around the pythia suite.
Each tool is a single self-contained `.html` file with no build pipeline and no external runtime
(except where a local backend is explicitly required).

---

## Repository structure

```
pythia-studio/
├── index.html              ← landing page (card grid, loads repos.json from Gist)
├── repos.json              ← product/API card data (fetched from Gist, kept in sync locally)
├── assets/                 ← logos, icons, fonts used by the static pages
├── tools/                  ← one .html file per tool
│   ├── duckdb-explorer.html    ← Pythia QueryFile — local file explorer (FastAPI/DuckDB backend)
│   ├── palette-title-generator.html
│   ├── env-generator.html
│   ├── hub-online.html
│   ├── hub-articles.html
│   └── hub-offline.html
├── duckdb_explorer/        ← FastAPI backend for Pythia QueryFile
│   ├── server.py           ← /health · /upload · /query endpoints
│   └── requirements.txt
├── scripts/                ← dev helpers (serve, lint…)
├── tests/                  ← backend tests (pytest)
├── pdoc-pythia.css         ← shared CSS for pdoc API reference pages
├── LICENSE
├── README.md
└── AGENT.md                ← this file
```

---

## Tools overview

| Tool | File | Backend required |
|------|------|-----------------|
| Pythia QueryFile | `tools/duckdb-explorer.html` | Yes — `uvicorn duckdb_explorer.server:app` |
| Pythia Design | `tools/palette-title-generator.html` | No |
| Env Generator | `tools/env-generator.html` | No |
| Stack Reference | `tools/hub-online.html` | No |
| Articles | `tools/hub-articles.html` | No |

### Pythia QueryFile — backend

```bash
# from pythia-studio/
uvicorn duckdb_explorer.server:app --port 8000
```

- Accepts local paths, S3 URLs (`s3://…`), HTTP URLs
- Loads DuckDB `excel` + `httpfs` extensions on startup
- Endpoints: `GET /health`, `POST /upload`, `POST /query`

---

## Stack

- HTML / CSS / vanilla JS — no framework, no bundler
- DuckDB (via FastAPI backend) — `duckdb>=1.2.0`
- FastAPI + uvicorn — local backend for Pythia QueryFile only
- Python 3.11 (backend only)
- Material Symbols Outlined — Google Fonts CDN (icon ligatures)
- Syne + Courier New — UI fonts

---

## Commit convention

Format: `<emoji> <type>(<scope>): <description>`

| Scope | Covers |
|-------|--------|
| `queryfile` | `tools/duckdb-explorer.html` + `duckdb_explorer/` backend |
| `studio` | `index.html`, `repos.json`, global layout/landing page |
| `tools` | Any other tool under `tools/` |
| `assets` | `assets/` — logos, icons |
| `docs` | `README.md`, `AGENT.md`, `pdoc-pythia.css` |
| `ci` | `scripts/`, `tests/`, GitHub Actions |

See workspace-level CLAUDE.md for the full emoji ↔ type table.

---

## Agents available (in pythia-for-snowflake workspace)

| Command | What it does |
|---------|-------------|
| `/commit` | Analyse git diff → propose gitmoji commit message |
| `/yml_audit` | Audit YAML files (comments + PII tags) |
| `/code_comments` | Add English comments to Python source |
| `/enrich_readme` | Complete README placeholders |
| `/explain` | Explain the repo (dev / archi / infra profile) |
| `/clean_history` | Rewrite git history with clean commits |
