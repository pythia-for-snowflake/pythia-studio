# 🔮 pythia-studio
*Update date : 2026-05-24 16:54*

Browser-based tools for the [pythia-for-snowflake](https://github.com/pythia-for-snowflake) suite.  
No build step — open any `.html` directly or serve via GitHub Pages.

**→ [pythia-for-snowflake.github.io/pythia-studio](https://pythia-for-snowflake.github.io/pythia-studio)**

---

## Tools

| Tool | Path | Description |
|------|------|-------------|
| Pythia QueryFile | `pages/duckdb-explorer/` | Query local XLSX, CSV, Parquet and S3/HTTP files — multi-source, auto-preview, column stats. Requires local FastAPI backend. |
| Pythia Design | `pages/palette-title-generator/` | Signature color → harmony → semantic tokens → app title PNG export |
| Env Generator | `pages/env-generator/` | conda env · dependencies · pre-commit hooks · commit convention |
| Stack Reference | `pages/hub-online/` | Curated live docs: Snowflake, Snowpark, Streamlit, DuckDB, Python, Anthropic |
| Articles | `pages/hub-articles/` | Articles that validate the pythia architecture approach |

---

## Structure

```
pythia-studio/
├── index.html              ← GitHub Pages entry point
├── app.css                 ← shared CSS tokens and base styles
├── assets/
│   ├── images/             ← logos and icons
│   └── pdoc/
│       └── pythia.css      ← shared pdoc theme (referenced by snowflake-kit docs)
├── pages/                  ← one directory per tool (index.html + app.css + app.js)
│   ├── duckdb-explorer/
│   ├── palette-title-generator/
│   ├── env-generator/
│   ├── hub-online/
│   └── hub-articles/
├── duckdb_explorer/        ← FastAPI/DuckDB backend for Pythia QueryFile
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
conda create -n pythia-studio python=3.11 pip -y
conda activate pythia-studio
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
Pythia QueryFile backend: Python 3.11 · FastAPI · DuckDB · uvicorn.  
Tests: Python 3.11 · Playwright · pytest · Pillow.

---

## Part of pythia-for-snowflake

Repo links point to the org once public; private during development.  
The studio index fetches live status from a Gist — no deploy needed when a repo launches.

| Repo | Role | Status |
|------|------|--------|
| [`snowflake-kit`](https://github.com/pythia-for-snowflake/snowflake-kit) | Pure Python utils — fmt, validate, security, sql | public |
| [`snowflake-kit-streamlit`](https://github.com/pythia-for-snowflake/snowflake-kit-streamlit) | Streamlit in Snowflake framework | soon |
| [`snowflake-kit-snowpark`](https://github.com/pythia-for-snowflake/snowflake-kit-snowpark) | Snowpark helpers, Excel | soon |
| [`snowflake-kit-connect`](https://github.com/pythia-for-snowflake/snowflake-kit-connect) | Third-party connectors — HTTP, Workday, INSEE | soon |
| [`snowflake-kit-airflow`](https://github.com/pythia-for-snowflake/snowflake-kit-airflow) | Airflow integration — PythiaTaskSensor | soon |
| [`snowflake-provider`](https://github.com/pythia-for-snowflake/snowflake-provider) | IaC engine — YAML → Snowflake objects | soon |
| [`snowflake-tools`](https://github.com/pythia-for-snowflake/snowflake-tools) | Local dev CLI | soon |
| [`pythia-monitor`](https://github.com/pythia-for-snowflake/pythia-monitor) | Native App — Snowsight replicas + cost guardrails | soon |

---

MIT License
