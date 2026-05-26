# 🐁 pinky-studio
*Update date : 2026-05-26 09:00*

Browser-based tools for the [pinky-and-snowflake](https://github.com/pinky-and-snowflake) suite.  
No build step — open any `.html` directly or serve via GitHub Pages.

**→ [pinky-and-snowflake.github.io/pinky-studio](https://pinky-and-snowflake.github.io/pinky-studio)**

---

## Tools

| Tool | Path | Description |
|------|------|-------------|
| Pinky QueryFile | `pages/duckdb-explorer/` | Query local XLSX, CSV, Parquet and S3/HTTP files — multi-source, auto-preview, column stats. Requires local FastAPI backend. |
| Pinky Design | `pages/palette-title-generator/` | Signature color → harmony → semantic tokens → app title PNG export |
| Pinky Config | `pages/env-generator/` | conda env · dependencies · pre-commit hooks · commit convention |
| Stack Reference | `pages/hub-online/` | Curated live docs: Snowflake, Snowpark, Streamlit, DuckDB, Python, Anthropic |
| Articles | `pages/hub-articles/` | Articles that validate the pinky architecture approach |

---

## Structure

```
pinky-studio/
├── index.html              ← GitHub Pages entry point
├── app.css                 ← shared CSS tokens and base styles
├── assets/
│   ├── images/             ← logos and icons
│   └── pdoc/
│       └── pythia.css      ← shared pdoc theme (referenced by pinky-core docs)
├── pages/                  ← one directory per tool (index.html + app.css + app.js)
│   ├── duckdb-explorer/
│   ├── palette-title-generator/
│   ├── env-generator/
│   ├── hub-online/
│   └── hub-articles/
├── duckdb_explorer/        ← FastAPI/DuckDB backend for Pinky QueryFile
│   ├── server.py           ← /health · /upload · /query endpoints
│   └── requirements.txt
└── scripts/
    ├── check_links.sh      ← validates all external URLs in pages/
    └── run_tests.sh        ← visual regression tests across 3 browsers
```

---

## Visual regression tests

Screenshots are compared across Chromium, Firefox, and WebKit (Safari proxy).  
External network calls (Gist, microlink) are mocked for stable baselines.

```bash
# setup (once)
conda create -n pinky-studio python=3.11 pip -y
conda activate pinky-studio
pip install -r tests/requirements.txt
playwright install

# run
./scripts/run_tests.sh

# regenerate baselines after an intentional change
./scripts/run_tests.sh --update
```

Tests also run automatically on `git push` when `.html`, `.css`, or `.js` files have changed.

---

## Stack

Static HTML · CSS · vanilla JS — no dependencies, no framework, no build.  
Pinky QueryFile backend: Python 3.11 · FastAPI · DuckDB · uvicorn.  
Tests: Python 3.11 · Playwright · pytest · Pillow.

---

## Part of pinky-and-snowflake

Repo links point to the org once public; private during development.  
The studio index fetches live status from a Gist — no deploy needed when a repo launches.

| Repo | Role | Status |
|------|------|--------|
| [`pinky-core`](https://github.com/pinky-and-snowflake/pinky-core) | Pure Python utils — fmt, validate, security, sql | public |
| [`pinky-streamlit`](https://github.com/pinky-and-snowflake/pinky-streamlit) | Streamlit in Snowflake framework | soon |
| [`pinky-snowpark`](https://github.com/pinky-and-snowflake/pinky-snowpark) | Snowpark helpers, Excel | soon |
| [`pinky-connect`](https://github.com/pinky-and-snowflake/pinky-connect) | Third-party connectors — HTTP, Workday, INSEE | soon |
| [`pinky-airflow`](https://github.com/pinky-and-snowflake/pinky-airflow) | Airflow integration — PinkyTaskSensor | soon |
| [`snowflake-provider`](https://github.com/pinky-and-snowflake/snowflake-provider) | IaC engine — YAML → Snowflake objects | soon |
| [`snowflake-tools`](https://github.com/pinky-and-snowflake/snowflake-tools) | Local dev CLI | soon |
| [`pinky-monitor`](https://github.com/pinky-and-snowflake/pinky-monitor) | Native App — Snowsight replicas + cost guardrails | soon |

---

MIT License
