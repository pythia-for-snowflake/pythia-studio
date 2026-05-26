# Git — pinky-studio
*Update date : 2026-05-26 09:00*

Commit scopes and branch strategy.

---

## Commit scopes

Scopes are derived from the directory level — one scope per tool or concern.

| Scope | Covers |
|-------|--------|
| `studio` | `index.html`, `app.css`, `repos.json` — landing page and shared tokens |
| `design` | `pages/palette-title-generator/` |
| `config` | `pages/env-generator/` |
| `queryfile` | `pages/duckdb-explorer/` + `duckdb_explorer/` backend |
| `hub` | `pages/hub-online/`, `pages/hub-articles/` |
| `assets` | `assets/` — logos, icons, pdoc CSS |
| `docs` | `docs/`, `README.md`, `AGENT.md` |
| `ci` | `scripts/`, `tests/`, hooks |

---

## Branch strategy

```
main        ← stable, direct push allowed (solo repo)
feature/*   ← one task = one branch
```
