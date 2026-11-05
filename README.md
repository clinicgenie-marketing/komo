# KOMO Wellness website

Private homepage concept exploration for KOMO Wellness, Singapore. Built with Astro (static) following `KOMO_Botanical_Sanctuary_Style_Guide.md`. Nothing here is deployed or approved for publication.

## Commands

```bash
npm install
npm run dev            # http://localhost:4321/concepts/
npm run build          # private preview build in dist/
npm run preview        # build and serve dist/
npm run check          # Astro and TypeScript checks
npm test               # build plus output and publication-guard tests
npm run qa:browser     # Playwright and axe checks (run after npm run build)
npm run build:production  # production target: concept routes excluded, drafts blocked
```

## Preview routes

- `/concepts/` comparison index
- `/concept-1/` Editorial sanctuary
- `/concept-2/` The care journey
- `/concept-3/` Immersive retreat

## Where things live

- `src/styles/tokens.css` design tokens (style guide 8 to 10, 17, 23); `src/styles/base.css` base and shared component styles
- `src/data/records.ts` all shared content, validated by `src/lib/schema.ts`
- `src/lib/publication.ts` the single publication predicate and production guard
- `src/components/concepts/` one file per homepage composition
- `docs/` content and asset registers, decisions and QA record
- `Task.md` sequencing, status and progress log

`PRD.md` was not supplied with the document pack. `Design.md` is intentionally not used; the style guide replaces it.
