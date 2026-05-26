# Config — pinky-studio
*Update date : 2026-05-26 09:00*

Environment variables, dependencies, and configuration options.

---

## Runtime

No install required for the HTML tools — open any `pages/*/index.html` directly or
serve via GitHub Pages. No build step.

## Backend — Pinky QueryFile only

```bash
conda create -n pinky-studio python=3.11 pip -y
conda activate pinky-studio
pip install -r duckdb_explorer/requirements.txt
uvicorn duckdb_explorer.server:app --port 8000
```

## Test environment

```bash
conda activate pinky-studio
pip install -r tests/requirements.txt
playwright install
```

## Backend dependencies

| Package | Version | Why |
|---------|---------|-----|
| `duckdb` | `>=1.2.0` | Query engine — Excel + httpfs extensions |
| `fastapi` | `>=0.110.0` | HTTP server for /query, /upload, /health |
| `python-multipart` | `>=0.0.9` | File upload support |
| `uvicorn` | `>=0.29.0` | ASGI server |

## Test dependencies

| Package | Why |
|---------|-----|
| `playwright` | Browser automation for visual regression |
| `pytest-playwright` | pytest integration |
| `Pillow` | Screenshot comparison |

## Environment variables

None — all configuration is passed via the browser or CLI arguments.
