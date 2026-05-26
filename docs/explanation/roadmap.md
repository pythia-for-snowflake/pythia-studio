# Roadmap — pinky-studio
*Update date : 2026-05-26 09:00*

Ordered backlog. Items at the top are ready to start; items further down need a prerequisite.

---

## After Pinky Config refactor

- **Cost Helper Tool** — Snowflake credit estimator + Account Usage query builder +
  storage retention calculator. Trigger: real consumption data from 2-3 pipelines in prod.

- **Design system HTML page** — migrate pinky-streamlit design system docs to an HTML
  format consistent with the rest of the pdoc reference. Trigger: pinky-streamlit out
  of "coming soon".

- **Pinky Config: data admin project type** — refine the "data admin" step-1 type
  (secrets, network rules, resource monitors, setup SQL) as snowflake-provider adds
  support for these objects.

---

## Backlog

- **Pinky Config UX iteration** — one Claude Design pass after the refactor ships.
- **Hub offline UX** — better management of local wget mirrors.
- **New tools** — gated by MVP framework: core / internal dependency / consumer enabler.
  Decide via council before building.
