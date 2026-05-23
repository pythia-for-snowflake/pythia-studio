# 🔮 pythia-studio

Browser-based tools for the [pythia-for-snowflake](https://github.com/pythia-for-snowflake) suite.  
No build step — open any `.html` directly or serve via GitHub Pages.

**→ [pythia-for-snowflake.github.io/pythia-studio](https://pythia-for-snowflake.github.io/pythia-studio)**

---

## Tools

| Tool | File | Description |
|------|------|-------------|
| Pythia Design | `tools/palette-title-generator.html` | Signature color → harmony → semantic tokens → app title PNG export |
| Env Generator | `tools/env-generator.html` | conda env · dependencies · pre-commit hooks · commit convention |
| Doc Hub — online | `tools/hub-online.html` | Curated live docs: Snowflake, Snowpark, Streamlit, Python, Anthropic |
| Doc Hub — offline | `tools/hub-offline.html` | Manage local wget mirrors of API docs |
| Articles | `tools/hub-articles.html` | Articles that validate the pythia architecture approach |

---

## Structure

```
pythia-studio/
├── index.html              ← GitHub Pages entry point
├── assets/                 ← images
├── pdoc-pythia.css         ← shared pdoc theme (referenced by snowflake-kit docs)
├── tools/                  ← HTML tool pages
└── scripts/
    ├── check_links.sh      ← validates all external URLs in tools/
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
