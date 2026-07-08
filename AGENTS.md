# AGENTS.md

## What this is

Static portfolio website for Arash Nicoomanesh (AI Engineer), deployed to GitHub Pages at `aragit.github.io`. No build step, no package manager, no CI. Raw HTML/CSS/JS edited directly and pushed to `main`.

## Core files

| File | Lines | Role |
|------|-------|------|
| `index.html` | 916 | Single-page landing: hero, architecture, services, solutions, blog cards, contact |
| `style.css` | ~12K | All styles for `index.html`. Dark theme, CSS custom properties, huge file |
| `script.js` | 869 | Behaviors: hamburger nav, service modal, chat modal, typewriter, focus trap |

## Directory structure

```
blog/                    # Self-contained blog page (inline <style>, not style.css)
services/                # Individual service pages (each has inline <style>)
  the-blueprint.html
  llm-engineering.html
  agentic-ai.html
  deploy-scale.html
  paid-poc.html
  mentoring.html
case-studies/            # Individual case study pages
  styles.css             # Shared case study styles (imported by some)
  medical-triage/        # Has own styles.css + medical-triage.html
  clinical-oncology/
  drug-repurposing/
  icu-forecasting/
  marketing-roi/
  prd-recomm-qa/
assets/                  # Architecture diagrams (PNG)
icons/                   # SVG icons
```

## Style system

- **Design tokens** in `style.css` `:root`: `--bg:#000`, `--panel:rgba(22,22,22,0.78)`, `--accent:#ff6b00`, `--text:#f2f2f2`, `--muted:#a8aeb3`
- `--accent` (#ff6b00) is the brand orange used everywhere: links, hovers, borders, icons
- `style.css` is ~12K lines — use Grep/Glob to find specific sections, don't read the whole file
- Sub-pages (`services/`, `case-studies/`, `blog/`) are **self-contained** — they duplicate CSS inline in `<style>` blocks, not referencing the root `style.css`
- `case-studies/styles.css` is a shared stylesheet for older case study pages (clinical-oncology, drug-repurposing, etc.)
- `case-studies/medical-triage/styles.css` is medical-triage-specific

## Deployment

- Push to `main` → auto-deploys to GitHub Pages
- Canonical URL: `https://aragit.github.io/`
- Cache-busting: `index.html` references `style.css?v=<timestamp>` — when editing CSS, update the `v=` param in `index.html` line 36

## Backup pattern

Previous sessions created hundreds of `*.backup.YYYYMMDD_HHMMSS` files. These are NOT active code. Don't read or modify backup files. If you need to see a prior state, check git history instead (if the repo has git initialized).

## Python helper scripts

One-off regex-based scripts for bulk HTML edits. They read/write `index.html` directly:
- `fix_article_cards.py` — replaces article cards section
- `update_case_studies.py` — replaces case studies section
- `update_tags.py`, `cleanup_logo_css.py`, `fix_spacing_clean.py`, etc.

These are historical utilities. Don't run them unless you need the specific edit they perform.

## Gotchas

- `style.css` is enormous. Always Grep for the section you need, never read it linearly.
- Sub-pages have their own inline styles that may diverge from the root design tokens.
- The `fix_website.sh` script hardcodes `cd ~/portfolio` — it assumes a different path than this repo's actual location.
- `index.html` has inline `<style>` overrides at the top (lines 27-33) that force-hide `.cs-image` and force card sizing — these override `style.css`.
- Blog page (`blog/index.html`) is fully self-contained and does NOT use `style.css` or `script.js`.
