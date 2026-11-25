# KOMO homepage baseline brief

Recorded 23 November 2026 from `main` at `a52b7c1` plus uncommitted edits to `src/App.tsx` and `src/index.css`.
Mode: baseline. No site files were changed.

## References

| Reference | Location | Status |
|---|---|---|
| Storyboard (motion reference, frames 01–18) | `docs/KOMO_Homepage_Storyboard.pdf` (6 pages, 3 frames each) | Present, dated sequence 01–06 |
| Design review (motion and interaction reference only) | `docs/KOMO_Homepage_Design_Review.pdf` (9 pages, 23 Nov 2026) | Present |
| Homepage copy (owner-maintained) | `docs/content/KOMO_Homepage_Content.md` | Present. **Confirmed correct by the owner (23 Nov 2026) and the source of truth for wording, link labels and link groups.** Where it differs from the design review, follow the content file. The owner updates it; read it at every `build NN` rather than copying text from this brief. |

Note: `docs/` is untracked.

**Precedence (owner, 23 Nov 2026):** the storyboard and design review are the reference for **animation and motion only** (entry, trigger, what moves, settled state, the layout that motion depends on). All content — headings, copy, CTA labels, links, link groups, session names and durations — comes from `docs/content/KOMO_Homepage_Content.md`. Copy or labels quoted in the PDFs are not authoritative.

> **Fresh build (23 Nov 2026, owner's request):** all previous homepage design has been removed. `src/App.tsx` now holds only `Arrow`, `WaveCorner` and `SiteHeader` plus an empty `<main id="main">`, and `src/index.css` only tokens, base, header and contour styles. `src/components/ui/logo-hover-effect.tsx` was deleted. The “Existing components” table and the “Current implementation” column below describe the **old** design, kept for reference. The old code, including its uncommitted edits, is recoverable from the git ref `refs/backup/pre-fresh-build` (`git show refs/backup/pre-fresh-build:src/App.tsx`). Build every section from scratch; do not reuse the old hero engine, `ServiceChapters`, `FirstVisit`, locations or footer.

## Images

All photos for sections 02–07 come from **`src/content/images.ts`**. Each slot is `{ src, alt, source?, placeholder }`.
- KOMO's own images (not placeholders): Signature (`Treatment Scalp Care.png`), mirror discussion (`Luxury KOMO Spa Consultation.png`), horse chestnut (`Chestnut.png`), Orchard outlet (`KOMO_Home_SobreImg2.png`).
- Pexels placeholders (free licence, no attribution required; page URL kept in `source`) in `public/images/placeholders/`: hero 1 and 2, Advanced, Waterfall, Meridian, mirror parting and imaging, basin set, bottle, Great World, Holland Village.
- Weak fits to replace first: “Imaging” (a dropper at the roots, not a scalp camera), Holland Village (a pink treatment room), and the bottle (generic amber dropper, not the KOMO label, so frame 12's readable label needs the real product shot).
- Section 08 has no portraits: reviews use supplied, attributable content only.
- Contour artwork: `public/images/komo-contour.svg` (stand-in).

## Route and entry point

- Single-page Vite app with no router. `index.html` → `src/main.tsx` → `src/App.tsx` (default export `App`). The homepage is the only route served; every other `href` (`/treatments/`, `/about/`, `/locations/`, `/first-visit/`) is a dead link in this project.
- `index.html` `lang` and `<title>` are filled by the Figma Make plugin from `.figma/make/site.json`, which is `{}`. `App` sets `document.title` and the meta description at runtime.
- `<header>` is rendered inside `<main>` (landmark issue to fix when building section 01).

## Stack and tooling

| Area | Finding |
|---|---|
| Runtime | React 19, React DOM 19 |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, but nearly all styling is hand-written BEM-ish CSS in `src/index.css` (1,328 lines). Tokens on `:root`: `--ivory #f4f0e7`, `--olive #34463a`, `--sage #a6b29a`, `--stone #c9bcae`, `--pad`. Fonts: DM Sans (body), Manrope 300 (headings) from Google Fonts. |
| Motion packages | `gsap` 3.15.1 (includes ScrollTrigger: `gsap/ScrollTrigger`) and `motion` 14.14.0 (React API: `motion/react`), added 23 Nov 2026, not yet imported. Existing scroll motion is still hand-rolled: `scroll` listeners + `requestAnimationFrame`, inline style writes, `IntersectionObserver` reveals, `position: sticky`. No Embla or Lenis. |
| Language routing | **None.** No i18n, no EN/中文 switch, no `/zh` path. **Deferred by the owner: do not build or change the language toggle until asked.** |
| Tests | **None.** No test script, no Playwright dependency or config. `.playwright-mcp/` holds only console logs from an MCP browser session, so browser checks must go through the Playwright MCP tools against the running dev server. |
| Scripts | `dev`, `build`, `preview`, `format` (oxfmt) |
| Toolchain | Node 22, pnpm 10.34.3 (`.mise.toml`); `node_modules` is npm-installed. Both `package-lock.json` and `pnpm-lock.yaml` are kept in sync (`pnpm install --lockfile-only`). |
| Alias | `@` → `src` |

## Existing components (all in `src/App.tsx` unless noted)

| Component / block | Lines (approx.) | What it does | Reuse potential |
|---|---|---|---|
| `images` map | 4–10 | 3 Unsplash URLs + 1 local outlet photo. `images.scalp` unused. | Replace with KOMO photography |
| `Arrow` | 12 | Inline arrow SVG | Keep |
| `wavePath`, `WaveCorner`, `HeroWaves` | 25–178 | **Procedurally generated** 22-line contour corner pieces | Visual stand-in only; see discrepancies |
| `useWaveParallax` | 101–160 | Cursor-following wave parallax (fine pointer, motion allowed) | **Conflicts** with “keep the lines still” |
| `Image` | 65 | Image wrapper with note | Keep |
| `services` + `ServiceChapters` | 180–418 | Sticky photo left, scrolling chapters right, active index by viewport midpoint, bg colour hand-over, stacked under 900px | Closest base for 03 Sessions (pin + synchronised state), but content and layout differ |
| `Approach` | 237–255 | Editorial interlude inside `ServiceChapters` | Not in storyboard |
| `FirstVisit` | 425–474 | Two-column text, one-time reveal | Not the storyboard's 05 (no toggle/arc) |
| `SiteFooter` | 476–579 | Logo + descriptor, 4 links, policy row (no hrefs), fade-in, cursor waves | Base for 11 Footer |
| `App` hero effect | 581–795 | Sticky hero; one image frame scales from card to full screen, fades `LogoHoverEffect`, reveals copy, hands off into services media | Base for 02 Hero scroll engine, but sequence differs |
| `LogoHoverEffect` | `src/components/ui/logo-hover-effect.tsx` | KOMO SVG logo with cursor spotlight | Keep for header/hero logo |
| Header | 799–815 | Desktop text nav left, wordmark centre, “Request a visit” right | Base for 01 Header |
| Locations | 865–894 | Full-bleed outlet photo, “Find your KOMO” | Base for 07 Outlets (single outlet only) |

Reduced motion: handled in CSS (`@media (prefers-reduced-motion: reduce)` at `index.css:1263`) and by early returns in hero, `FirstVisit`, `SiteFooter`. Breakpoints: 900px and 600px.

## 11-section mapping

| # | Section | Frames | Current implementation | Gap |
|---|---|---|---|---|
| 01 | Header | 01 | `.site-header` (App.tsx:799). Text nav, wordmark, “Request a visit”. | Needs Menu button + disclosure panel with contour crop at outer edge holding the five content-file links (Services, Scalp & Hair Concerns, Your First Visit, About KOMO, Locations), CTA casing “Request a Visit”. EN / 中文 switch is **deferred**; leave no placeholder control. Move `<header>` outside `<main>`. |
| 02 | Hero | 01–04 | `.hero` + scroll engine (App.tsx:581–853). One Unsplash image card expands; H1 “Scalp care, hair care and time for yourself”. | Two-photo sequence (photo 1 full-screen with H1; photo 2 box rises and fills); H1 must be “Head spa and scalp care in Singapore”; frame 03 lead upper-left / support lower-right / Compare the Sessions lower-left; contract to centred rounded square on sage + contour field. |
| 03 | Choose your session | 04–06 | `ServiceChapters` with 3 items (Scalp care / Head spa / Hair care). | Four sessions (Signature, Advanced, Aromatic Waterfall, Meridian Hydro); pinned 100vh split; central counter 01/04–04/04 that *is* the contracted hero square; release after 04/04; detail link + visit request carrying session; “treatment time” labels. |
| 04 | What brings you in? | 07 | None (heading reused by `ServiceChapters`). | Three concern cards with line icons, sage hover/focus preview, selection opens panel below, mobile disclosures. |
| 05 | Your first visit | 08–09 | `FirstVisit` (text only). | Mirror / Basin toggle, two photo sets on shallow arc, drag/swipe + buttons, links to How Scalp Imaging Works and Orchard scan feature. |
| 06 | A closer look at the bottle | 10–12 | None. | Centred bottle, alternating name reveal, horse chestnut behind, scroll to readable label, ingredient text, two links. |
| 07 | Visit KOMO | 13 | `.locations` single photo. | Stacked panels in 100vh, vertical right-hand tabs (Orchard active, Great World, Holland Village), sideways open, continuous contour slices, opening-update actions. |
| 08 | Reviews | 14 | None. | Arc carousel, tilted centre portrait, lower-left arrows, lower-right name/quote/source. Needs supplied attributable content. |
| 09 | Arrange your visit | 15 | None (CTAs link to dead `/first-visit/#visit-form`). | Sage booking block, inline session selector, editable WhatsApp message for Orchard, Copy Message fallback, Help Me Choose, Get a Single Visit Quote, terms beside action. |
| 10 | First visit FAQs | 16 | None. | Two-column, three collapsed disclosures with +/−, full width on mobile. |
| 11 | Footer | 17–18 | `SiteFooter`. | Ivory FAQ panel uncovers olive footer on desktop; four link groups per the content file (Explore / About / Visit / Information; Information holds Privacy Policy, Website Terms, Booking and Trial Terms); mobile expandable groups; contour at edge opposite opening sweep. |

## Discrepancies with the locked design

1. **Contour artwork** is generated in code (`wavePath`) rather than KOMO's original artwork, and it moves with the cursor (`useWaveParallax` in hero, locations and footer). The design review requires the original artwork and still lines.
2. **H1 copy**: “Scalp care, hair care and time for yourself” vs. “Head spa and scalp care in Singapore”.
3. **CTA casing**: “Request a visit” in four places; required “Request a Visit”.
4. **Section order and content**: current page is Hero → 3 service chapters → Approach → First visit text → Locations → Footer. Seven storyboard sections (04, 05 interaction, 06, 08, 09, 10, and 07 as tabs) do not exist.
5. **Sessions**: current three categories include Moisturising Cuticle Hair Care, which is not one of the four storyboard sessions; Advanced Scalp Care and Meridian Hydro are missing.
6. **Placeholder photography** from Unsplash (hero, hair, Waterfall chapter); `image-note` “Illustrative imagery” is shown.
7. **Language switch** absent (deferred by the owner). `<html lang>` renders as `en` in dev.
8. **Links**: all internal routes 404 in this project; policy links have no destinations; footer link set differs from the three-group spec.
9. **Landmarks**: `<header>` sits inside `<main>`.
10. **Meta description** names services but no prices — compliant; keep it that way.
11. `html { scroll-behavior: smooth }` globally — check it does not fight scroll-driven pinning in 02/03/06.

## Assets

Present in `public/images/`:

| File | Size | Likely use |
|---|---|---|
| `Treatment Scalp Care.png` | 2.2 MB | Session image (Signature) — in use |
| `KOMO_Home_SobreImg2.png` | 0.5 MB | Outlet photo — in use |
| `Luxury KOMO Spa Consultation.png` | 2.1 MB | Candidate for Mirror set (05) — unused |
| `Chestnut.png` | 2.1 MB | Candidate horse chestnut (06) — unused, to confirm |
| `Avocado.png`, `Olive.png` | 2.1 MB, 2.0 MB | Ingredient imagery, not in storyboard — unused |
| `ChatGPT Image Nov 16, 2026, 10_43_35 AM-3.png` | 1.7 MB | Generated image; check against “approved KOMO photographic direction” before any use |
| `komo-logo.svg/.png`, `komo-wordmark.svg` | — | Logo — in use |

All PNGs are 1.7–2.2 MB; plan WebP/AVIF exports before launch.

Missing (per design review page 09):

- Original KOMO contour artwork file (vector) — **blocks** faithful 02, 03, 07, 11.
- Hero photograph 1 and 2, plus mobile crops.
- Four session photographs (Advanced, Waterfall, Meridian at least).
- Mirror sequence (Parting, Imaging, Discussion) and Basin sequence (Basin, Massage, Care).
- Bottle product shot with readable label; confirmed horse chestnut asset.
- Outlet photography for Great World and Holland Village.
- Review portraits, approved testimonial and attributed Google reviews with permissions and listing URL.
- Line icons for the three concerns.
- Chinese copy for the language switch (deferred).
- Orchard WhatsApp number, opening-update destinations, Orchard map link, booking/privacy/terms URLs.

## Build guidance per section

- Scroll-scrubbed and pinned scenes (02, 03, 06, 11): GSAP ScrollTrigger, registered once and cleaned up per component (`gsap.context` / `ctx.revert()` in the effect cleanup; React StrictMode runs effects twice). Component-level state transitions, hover/focus, toggles and drag (01, 04, 05, 07, 08): Motion (`motion/react`). Avoid driving the same element from both. Retire the hand-rolled hero engine when 02 is rebuilt.
- 05 and 08 have no carousel package; native CSS scroll snap plus buttons is the zero-dependency route.
- 01, 04, 10 disclosures: native `<button aria-expanded>` per the APG disclosure pattern.
- Verification: no test runner. Use the Playwright MCP browser against the dev server (`$PORT`, default 8443) for desktop/mobile, touch and reduced-motion emulation.

## Open decisions

1. ~~Motion library~~ — resolved: both GSAP and Motion installed.
2. Whether to retire `ServiceChapters`, `Approach` and `FirstVisit` or adapt them.
3. ~~Language routing~~ — deferred by the owner; out of scope until requested.
4. ~~Content file vs. design review~~ — resolved: the content file wins on wording, menu links and footer groups.

## Build log

### 01 Header — built 23 Nov 2026

- `SiteHeader` in `src/App.tsx`, rendered before `<main>` (landmark fix). Styles under “01 Header” in `src/index.css`.
- Solid ivory fixed bar, `--header-h` 56px (52px ≤600px). Logo is absolutely positioned at the exact viewport centre, independent of the side controls; verified 0px offset at 320, 390 and 1440px with no overlap or horizontal scroll (≤380px tightens padding, logo and CTA). `html { scroll-padding-top: var(--header-h) }` so anchors land below the bar.
- Menu is an APG disclosure: `<button aria-expanded aria-controls="site-menu">`, label stays “Menu”, icon crosses to a close mark. Closes on Escape (focus returns to Menu), link click, scrim click, pointer press outside, or Tab leaving the header. Closed panel is `visibility: hidden`, so its links leave the tab order.
- Motion (`motion/react`): panel clip-path reveal from the Menu side, link stagger. Reduced motion: instant, no stagger.
- Contour: `WaveCorner` now references the static asset `public/images/komo-contour.svg#lines` via `<use>` (evenly spaced offsets of one master curve; stand-in for the original artwork, same 600×400 box so all crops still work). Generator kept outside the repo. Large crop in a sage field occupying 38% of the 700px panel (lower edge ≤600px). Still; no parallax in the menu.
- Links per content file. `Services → /treatments/`, `Your First Visit → /first-visit/`, `About KOMO → /about/`, `Locations → /locations/` (existing routes, not in this project). `Scalp & Hair Concerns → #concerns` is a homepage anchor. `Request a Visit` keeps the existing route `/first-visit/#visit-form` (`REQUEST_VISIT_HREF`).
- Removed: transparent/`on-dark` header switching (`updateHeader` in the hero engine), the hero-driven header wordmark fade, `.header-nav`, `.header-link`, `.desktop-only`.

Adjoining state for later sections:
- **02 Hero:** the bar is opaque and covers the top `--header-h` of the viewport. Compose hero frames below it, or let the photo run under it knowingly. The old hero's large `LogoHoverEffect` still shows alongside the header logo until 02 is rebuilt.
- **04 Concerns** must use `id="concerns"`. **09 Arrange your visit** must use `id="arrange-your-visit"`; when it ships, change `REQUEST_VISIT_HREF` to `#arrange-your-visit`.
- `data-header-dark` attributes on `.location-overlay` and `<footer>` are now inert; remove them when 07 and 11 are rebuilt.
- `<footer>` is still inside `<main>`; fix in 11.

### 03 Choose your session — built 23 Nov 2026

- Files: `src/sections/Sessions.tsx`, `src/content/sessions.ts` (copy verbatim from the content file), styles under “03 Choose your session” in `src/index.css`. `Arrow` and `WaveCorner` moved to `src/components/`.
- **Pinned** (≥1024×640, motion allowed, copy fits): one GSAP ScrollTrigger timeline, pinned below the header. Labels: `intro` (frame 04: sage field, still contour, stone square “01/04”) → `s0` (frame 05: ivory panel and photo frame open, square becomes the olive counter on the divide) → `s1`–`s3` (frame 06: each photo rises from the bottom of the frame) → `end` (release). ~0.6 viewport of scroll per timeline second.
- **No snapping.** Directional label snapping pulled slow, notch-by-notch scrolling backwards (snap tweens flip ScrollTrigger's direction). Instead each session has a hold as long as its transition: half of all scroll is a settled reading position. Labels sit mid-hold.
- One `active` index (synced from the timeline's own `onUpdate`, so large jumps are correct) drives the counter, list, details and Request a Visit. All four details share one grid cell, so the heading and details block never shift.
- **Flow** (narrow, short, reduced motion, or pinned copy would be clipped, rechecked on every resize): four cards in reading order with photo, counter, copy, treatment time and actions.
- `#sessions` links, a fresh load of `/#sessions` and hash changes all settle on Signature (`s0`). Focus entering the scene at the intro frame jumps to Signature. Session list buttons are keyboard access to every session.
- Removed global `html { scroll-behavior: smooth }` (fights ScrollTrigger). Added `main { padding-top: var(--header-h) }`.

Handover:
- **02 Hero → 03:** 02 must end with its contracted photo exactly on `.sessions-counter` at `intro`: centred in the stage below the header, size `var(--session-square)` (min(22vmin, 220px)), radius `var(--session-square-radius)`, then cross-fade to the stone square reading “01/04”. Its Compare the Sessions CTA should use `href="#sessions"`; Sessions already intercepts it. 02 sits above 03 in `<main>`; ScrollTrigger refresh order follows DOM order.
- **03 → 09:** Request a Visit goes to `/first-visit/?session=<full session name>#visit-form` (`visitHref()` in `src/content/sessions.ts`); Get a Single Visit Quote adds `enquiry=single-visit-quote`. When 09 ships, point `visitHref()` at `#arrange-your-visit` and read `session` / `enquiry` from the URL to preselect the selector.
- Pending destinations: Harper's BAZAAR award feature URL (`AWARD_FEATURE_URL`, action hidden while `null`); detail routes `/treatments/advanced-scalp-care/` and `/treatments/meridian-hydro-restoring-scalp-spa/` follow the existing pattern but are unconfirmed.
- Type sizes site-wide are in px, so a browser's text-size setting (as opposed to zoom) does not enlarge them. Consider moving to rem.

### 02 Hero (with intro loader) — built 23 Nov 2026

- Owner's direction: no old animations; on load, a contour curve animation plays, then the hero photo is revealed. This loader is an owner-approved exception to “keep the lines still”: the lines draw in once, then stay still while the panel lifts away.
- Files: `src/sections/Hero.tsx`, `src/content/hero.ts` (copy verbatim from the content file), `src/lib/stage.ts` (shared `PIN_QUERY`, header height, square metrics, stage-change event). Styles under “Intro loader” and “02 Hero” in `src/index.css`.
- **Intro loader:** fixed ivory panel portalled to `<body>` (covers the header). It fetches `komo-contour.svg`, draws its 22 lines (stroke-dashoffset, staggered, ~2s) while photo 1 decodes (capped at 4s), then lifts away (clip-path) as photo 1 settles from 1.08 scale and the H1 rises in. Scroll is locked meanwhile. Plays on every full load; skipped under reduced motion.
- **Pinned scene** (same `PIN_QUERY` as 03): labels `first` (frame 01, H1 on photo 1, still corner contour) → `rise` (frame 02, photo 2 rises in a rounded box) → `copy` (frame 03, full-screen photo 2; lead upper left, support lower right, Compare the Sessions lower left) → `square` (frame 04, contracted to the session square on the sage field with the shared `.stage-contour` crop). `refreshPriority: 1` so 03 is always measured after the hero's pin spacing.
- **Handover to 03:** when 03 is pinned, `.hero` overlaps it by one stage height (`:has(+ .sessions.is-pinned)` negative margin). At release the hero hides (`onLeave`) with 03's intro frame exactly underneath (verified: same square position/size and identical photo crop via container units). 03's `intro` then cross-fades the photo out of the square to the stone “01/04”. Reverse scroll restores the hero (`onEnterBack`).
- **Flow** (narrow, short, reduced motion): photo 1 with the H1, then photo 2 with lead, support and CTA in reading order.
- The page has exactly one H1 (“Head spa and scalp care in Singapore”).

### 05 What happens on a first visit? — built 23 Nov 2026

- Files: `src/sections/FirstVisit.tsx`, `src/content/firstVisit.ts` (copy verbatim from the content file), styles under “05 What happens on a first visit?” in `src/index.css`. Mounted after 03 in `App.tsx`; 04 is pending and will sit between them.
- Mirror / Basin is an APG tabs pair (arrow keys, Home/End, roving tabindex); Mirror selected on entry. One tab panel holds the selected setting's copy, links and carousel. Both settings' copy share one grid cell, so switching never shifts the carousel (measured 0px page movement).
- Carousel: native horizontal scroller with `scroll-snap-type: x mandatory`. A shallow arc is computed from each slide's distance to the centre (`--d`, `--d2`): the centre sits lowest and upright, and neighbours lift (`--arc-lift`) and tilt (`--arc-tilt`). Mouse drag pauses snapping, then settles on the nearest photo. Touch and trackpads scroll natively (vertical gestures scroll the page). Previous/Next use `aria-disabled` so focus is kept at either end. A polite live region announces the photo after interaction. Each setting is a closed set: dragging never changes the setting. Reduced motion means instant jumps and no fade-in.
- Photos (`src/content/images.ts`): Mirror = parting (Pexels 5301576), imaging (Pexels 28994388, a dropper at the roots: **no real scalp-imaging photo yet**), discussion (KOMO `Luxury KOMO Spa Consultation.png`). Basin = basin (Pexels 3993449), massage (Pexels 8088603), care (Pexels 3865570, a facial gua sha). Captions Parting / Imaging / Discussion and Basin / Massage / Care follow storyboard frames 08–09 (not in the content file, so confirm).
- Links: “How Scalp Imaging Works” → `/about/scalp-imaging/` (unconfirmed route). “Read The Straits Times Feature on the Orchard Scan” is hidden until its URL is supplied (`STRAITS_TIMES_FEATURE_URL`).

### 03 change — 23 Nov 2026

- Removed “Planning for one visit?” (heading, body and Get a Single Visit Quote) from section 03 at the owner's request, along with its copy in `src/content/sessions.ts`, its styles and the `enquiry=single-visit-quote` parameter. `visitHref()` now only carries `session`. The pinned comparison now releases straight into 05. The content file still lists this block; the site intentionally omits it.

### 06 A closer look at the bottle — built 23 Nov 2026

- Files: `src/sections/Product.tsx`, `src/content/product.ts` (copy verbatim; bottle config), styles under “06 A closer look at the bottle” in `src/index.css`. Mounted after 05.
- Pinned scene on any width with motion allowed and ≥480px height (`SCENE_QUERY`; mobile included). Labels: `name` (Scalp Oil from the left, Balancing from the right, Essence from the left, each settling with a hold) → `ingredient` (the horse chestnut slides from behind the bottle's right edge to an 18% overlap, the bottle stays in front, and Balancing steps aside by the same width) → zoom (one continuous move with the front label as the target; name, ingredient and contour leave) → `label` hold, then release. The paragraph and links follow in flow. Verified: the bottle centre is off by 0px through the name and ingredient phases (1440×900, 1024×640, 390×844), mid-zoom stops hold, reverse retraces, no horizontal overflow.
- Reduced motion: heading, name, bottle, chestnut, label detail, paragraph and links in reading order, with no pin.
- Screen readers get the product name once (a visually hidden full name; the three display lines and the bottle are `aria-hidden`).
- **Missing asset (blocks final frames 10–12):** an approved transparent cut-out of the KOMO Scalp Oil Balancing Essence bottle with a front-facing label, about 2400px tall so the label stays sharp at roughly 2.5× on 2× screens. Until then a schematic vector placeholder (as drawn in the storyboard: olive body, ivory label with the KOMO wordmark and the product name only) is used. To switch, set `bottle` in `src/content/product.ts` to `{ kind: "image", src, label: { x, y, width, height } }`; the component trims transparent padding so the visible bottle is centred, and zooms to the label box.
- Note: the KOMO bottle visible in `Treatment Scalp Care.png` appears to read “Scalp Balancing Essence”; confirm the exact product name against the content file's “Scalp Oil Balancing Essence”.
- Horse chestnut: `Chestnut.png` in a circular crop (frame 11). Confirm it depicts horse chestnut; it reads more like a nut in an opened shell.
- Links (unconfirmed, no product routes exist): Explore Products and Ingredients → `/products-and-ingredients/`; Check an Ingredient → `/products-and-ingredients/#check-an-ingredient`.

#### 06 change — supplied bottle cut-out (2026-11-23)

- Asset: `public/images/KOMO Scalp Soothing Essence Bottle_transparent.png` (1024×1536) trimmed to the bottle's edges → `public/images/product/scalp-soothing-essence.png` (571×1379). `bottle` in `src/content/product.ts` now points to it, with the label box (KOMO wordmark to "100ML") and the body's horizontal extent.
- The spray nozzle makes the image wider than the body, so the horse chestnut now rests centred on the body (`--body-x`, `--body-w`) and stays fully hidden in frame 10; the frame 11 move is measured from that resting point.
- Reduced-motion layout: bottle box given a definite height and the asset's ratio; label detail takes its aspect ratio from the label box.
- Open: the bottle reads "Scalp Soothing Essence", while the content file names "Scalp Oil Balancing Essence". The source is 1379px tall, so the label close-up is upscaled about 2× on high-density screens.

### Build 07 — Visit KOMO (2026-11-23)

- Files: `src/sections/Outlets.tsx`, `src/content/outlets.ts` (new); `src/content/sessions.ts` (`visitHref(session?, outlet?)`), `src/App.tsx` (mounted after `<Product />`), `src/index.css` (07 block).
- Scene: one viewport below the header (grows with content); three full-height tabs on the right (Orchard sage, Great World stone, Holland Village olive), names read upwards. Orchard open on entry. Not pinned.
- Motion (Motion 14): the selected panel slides out from the rail over the open one; each selection adds a layer on top, so rapid switching never leaves a gap; lower layers are dropped once the top settles. Contour (`/images/komo-contour.svg`) is one 180%-wide composition offset 40% per outlet, counter-moved so lines stay still. Reduced motion: direct switch.
- Accessibility: APG tabs (vertical, arrows/Home/End, automatic selection); one tabpanel (top layer); lower layers `inert` + `aria-hidden`; source order heading → tabs → panel.
- Destinations: Get Directions → Google Maps search for "KOMO Wellness, 501 Orchard Road, Singapore 238880" (unconfirmed, no map pin supplied); Read Orchard Guest Reviews → `#reviews` (Section 08, not built); Request a Visit → `/first-visit/?outlet=Orchard#visit-form`; opening enquiries → `/first-visit/?outlet=<name>&message=<message>#visit-form` until `WHATSAPP_NUMBER` is set in `outlets.ts`, then `wa.me` with the message. Message wording ("Hello KOMO, I’d like opening details for <outlet>, please.") needs approval.
- Assets: Orchard uses `KOMO_Home_SobreImg2.png`. No approved Great World or Holland Village photographs, so those panels show their colour field and contour; the Pexels stand-ins in `images.outlets` are no longer used.

### Build 08 — Reviews (2026-11-23)

- Files: `src/sections/Reviews.tsx`, `src/content/reviews.ts` (new); `src/App.tsx` (mounted after `<Outlets />`), `src/index.css` (08 block).
- Scene: "Reviews" upper left; portraits on a shallow arc dipping at the centre (active tilted −3°, neighbours lifted and tilted with the curve, sliced at the edges); arrows lower left (`Previous review` / `Next review`); name, quotation, source lower right on the background; faint still contour behind. Mobile: portrait centred with neighbour glimpses, arrows then text beneath, natural height.
- Motion (Motion 14): one unbounded target drives a continuous position; the attribution switches when the latest movement settles. List wraps. Horizontal swipe/drag (pointer events, `touch-action: pan-y`); no autoplay. Reduced motion: direct switch. Live region announces "Review n of N: name, source" once per change after interaction.
- Content: Section 08 holds placeholders only. Four labelled preview entries (`import.meta.env.DEV` only) exercise the interaction, including a long quotation; production builds contain none and render no Reviews section until `publishedReviews` is filled. One entry → no arrows or swipe.
- Outstanding: approved testimonial (name, quotation), verified Orchard Google reviews (display names, quotations, review URLs), any approved guest–portrait pairings. Until then `#reviews` (Orchard's "Read Orchard Guest Reviews") has no target in production.

### Build 09 — Arrange your visit (2026-11-23)

- Files: `src/sections/ArrangeVisit.tsx`, `src/content/arrangeVisit.ts`, `src/content/contact.ts` (new); `src/App.tsx` (header CTA → anchor; mounted after `<Reviews />`), `src/sections/Sessions.tsx` (Request a Visit → anchor + `data-session`), `src/content/sessions.ts` (`visitHref` removed), `src/content/outlets.ts` (Orchard Request a Visit → anchor), `src/index.css` (09 block).
- One anchor: `#arrange-your-visit` (`VISIT_HREF`). `data-session` preselects; general requests keep the current choice; `?session=` honoured on load; hash on load re-settles after pins. Focus moves to the selector on arrival.
- Selector: radio pills, four sessions in order + "Still deciding" (quote path). Choosing updates the editable draft only; if the visitor edited it, only the session name is swapped.
- Paths: Request a Visit → WhatsApp with the draft; Help Me Choose on WhatsApp → help draft (no session needed); Get a Single Visit Quote → quote draft (session or "still deciding"; GST-inclusive total, inclusions, extras/package conditions, arrival-to-departure time; no prices). Copy Message copies the draft; on failure the draft is selected and the status explains.
- Unresolved: `ORCHARD_WHATSAPP` (null → `wa.me/?text=` picker), Privacy Policy `/privacy-policy/` and Booking and Trial Terms `/booking-and-trial-terms/` (assumed), message wording and the "Your message to Orchard" / "Still deciding" labels need approval. Great World / Holland Village opening enquiries stay on their own route (`outlets.ts`).

### Build 10 — First visit questions (2026-11-23)

- Files: `src/sections/Faq.tsx`, `src/content/faq.ts` (new); `src/App.tsx` (mounted after `<ArrangeVisit />`), `src/index.css` (10 block).
- Ivory two-column layout: heading left, three collapsed rows right; full width ≤800px. APG disclosures: `h3 > button[aria-expanded][aria-controls]`, plus → minus icon, rows open independently. Height via `grid-template-rows` 0fr → 1fr; closed answers `visibility: hidden` (out of tab order and a11y tree). Reduced motion: no transitions.
- Handover to 11: `.faq` is the ivory panel (own background, `position: relative; z-index: 1`) that should lift off the olive footer on desktop.
- Not in this build: Section 04 (What brings you in?) is still pending; Section 06 was extended outside this session with four ingredient cut-outs (horse chestnut, avocado, olives, Myrothamnus).
- 10 verification pass (brief re-issued): heading cap height trimmed (`text-box: trim-start cap alphabetic`) so it aligns with the first row's top edge; pointer, keyboard (focus stays on the question) and touch toggles checked on all three rows; third answer readable at 320px; collapsing at the page end settles smoothly (the page currently ends here, so the scroll position clamps until Section 11 follows).

### Build 11 — Footer (2026-11-23)

- Files: `src/sections/Footer.tsx`, `src/content/footer.ts` (new); `src/App.tsx` (`<SiteFooter />` after `<main>`), `src/index.css` (11 block).
- No footer existed before; the app has one route (the homepage), so there is no inner page to compare. One `<footer>` renders.
- Reveal (frame 17): pure CSS. When `.is-reveal` applies (width ≥ 761px, motion allowed, footer height ≤ viewport − header), the footer is `position: sticky; bottom: 0; z-index: 0` and `html.has-footer-reveal main` gets an ivory background on its own layer (`position: relative; z-index: 1`). The footer therefore shows only below the end of `<main>`, i.e. the FAQ panel's lower edge uncovers it. Focus entering the footer scrolls to the end so no focused link sits under the panel. Otherwise: ordinary flow.
- Frame 18: ivory `komo-logo.svg` (mask) with descriptor; Explore / About / Visit columns; legal links under a fine divider; hero contour returns rotated 180° at the lower right, clear of all links. Mobile (≤760px): groups are disclosures (`h2 > button[aria-expanded]`), legal links always visible.
- Routes reused: `/treatments/`, `#concerns`, `/products-and-ingredients/`, `/about/scalp-imaging/`, `/first-visit/`, plus `/privacy-policy/` and `/booking-and-trial-terms/` from Section 09. UNCONFIRMED (no existing route): `/guides/`, `/about/our-team/`, `/about/press-and-recognition/`, `/about/komo-around-the-world/`, `/locations/orchard/`, `/locations/great-world/`, `/locations/holland-village/`, `/contact/`, `/website-terms/`. `#concerns` waits for Section 04.

#### 09 change — fit within one viewport (2026-11-23)

- Desktop (> 900px): two columns. Left: heading, intro, selector, Request a Visit. Right: one solid field (`.arrange-side`) with the editable message, Copy Message · Privacy Policy · Booking and Trial Terms, then Still deciding? + Help Me Choose / Get a Single Visit Quote. Section is `min-height: 100svh − header`, content centred; measured exactly one viewport at 1440×900, 1366×768, 1280×720, 1024×768 and 1024×640 (was 945–980px).
- Phones (≤ 900px one column; ≤ 760px message folded behind a "Your message to Orchard" disclosure, opened automatically if copying fails): two sessions per row, smaller contour crop beside the heading. 390×844: 915px (was 1381px), with heading → Request a Visit inside the first screen; 320×640: 966px.

#### 01 change — transparent, adaptive header (2026-11-23)

- `.site-header`: transparent, no border. Menu, logo and Request a Visit each carry `data-tone` ("light" = ivory, "dark" = olive) set by `useHeaderTones` in `src/App.tsx`: it reads what lies beneath each control (`elementsFromPoint`, skipping the header). An ancestor's `data-header-tone` wins; photographs are measured (downscaled canvas copy, object-fit aware, luminance > 0.55 → olive); otherwise the first opaque background colour (luminance < 0.4 → ivory). Sampled per frame for 0.9s after scroll/resize/click/key, and every 400ms. Menu open → solid ivory bar, olive controls.
- Hero (pinned): both photo layers extend up behind the header (`top: -header`, stage `clip-path: inset(-header 0 0 0)` instead of overflow hidden); clip boxes are offset by the header height, full frame covers the band. A sage `.hero-bleed` band sits under the photos and fades with the square contraction, so the band above 03's stage (ivory) matches at hand-over. Pin positions unchanged.
- 03 counter photo resized to the hero photo's new box (`100cqh + header`, centred `header/2` higher): hero and counter photos measured identical (0, 0, 1440×900) at the release point.
- Hero (flow: mobile / reduced motion): photo 1 runs to the top (`margin-top: -header; height: 100svh`).
- `data-header-tone="light"` on hero photo 1 and 2 (both shaded); `"dark"` on the sage band.

#### Hero photo 2 replaced (2026-11-23)

- `images.hero.second` → `/images/placeholders/hero-2.png` (supplied KOMO photograph, 1536×1024 PNG, 1.9 MB), `placeholder: false`, alt updated. Used by the pinned hero (frames 02–04), the 03 counter hand-over photo and the flow hero.

#### Hero photo 1 replaced (2026-11-23)

- `images.hero.first` → `/images/placeholders/hero-1.png` (supplied, 1536×1024 PNG, 2.0 MB), `placeholder: false`, alt updated. `.hero-first-photo { object-position: 78% 50% }` keeps the guest's face in narrow (phone) crops; desktop framing unchanged. Checked at 1440×900, 1024×768, 390×844 and 320×640; header controls ivory over it.

#### Favicon — KOMO brandmark (2026-11-23)

- No separate brandmark file exists in the project, so the icon is built from the K of `komo-wordmark.svg`: ivory K on an olive rounded square. `public/favicon.svg` (source), `public/favicon.png` (96×96, replaces the Figma Make default; injected by the Vite plugin), `public/apple-touch-icon.png` (180×180, full-bleed olive). `index.html` links the SVG and the touch icon. Replace these files if an official KOMO brandmark is supplied.

### Colour distribution — 80% dark green (2026-11-23)

- Measured before: dark green 1.6% of the page, ivory 50%, photos 36%. After: dark green 82.6% of coloured surfaces (56% of all pixels incl. photographs 32%); ivory 3.7%, sage 5%, stone 3.1%. Sampled at 61 scroll positions, 1440×900.
- Tokens: `--green` / `--cream` (fixed). `.tone-dark` swaps the role tokens (`--ivory` → surface green, `--olive` → ink cream) and sets background/colour, so light-section rules invert with it. Applied to Sessions, First visit, Product, Reviews. Body is green with cream text; `main` in footer-reveal mode is green.
- Direct changes: intro loader, hero stage and header band, sessions stage, sessions left veil (green 0.94), outlets view → green; sessions counter text and arc captions use `--green`; flow hero copy cream with a cream CTA; sessions counter pill animates to cream with green text (Sessions.tsx); FAQ sets its own olive text; focus ring cream in dark sections.
- Light accents kept: Arrange your visit (sage), FAQ panel (ivory, contrasts with the footer it uncovers), outlet address field and "Visit KOMO" label, outlet tabs (sage / stone / olive), review portrait cards (stone), menu panel.
- Header: a control straddling a light and a dark area gets `data-tone="mixed"` (cream with a soft dark halo).
- Checks: text contrast audit (all visible text ≥ 3:1 against its solid background at 31 positions, desktop and 390px; the one flag was a parser false positive, measured 6.68:1); header tone check at 41 positions.

#### 09 change — split in half with a veiled photograph (2026-11-23)

- `.arrange-inner` is two equal halves, one viewport below the header (`min-height: 100svh − header`). Left: heading, intro, selector, Request a Visit on solid sage. Right (`.arrange-media`): `images.arrange.procedure` (KOMO "Treatment Scalp Care.png", decorative here, empty alt) covering the half, `.arrange-veil` at `rgb(166 178 154 / 0.8)`, the still contour across it, and the message panel (`.arrange-side`) centred on its clear field.
- Measured: exactly one viewport at 1440×900 and 1024×640 (halves 720/720 and 512/512). Phones stack: selector block, then the photo block with the panel (390×844: 943px).

#### Cream for Sessions and Product (2026-11-23)

- `.tone-light` (cream surface, olive text) replaces `.tone-dark` on Choose your session and A closer look at the bottle. Hero field / header band and sessions stage are cream (so the hero → sessions hand-over stays seamless); stage contour in sage; sessions details veil cream 0.94; counter pill back to green with cream text. The hero's band no longer fades; the pinned sessions stage draws a matching cream band behind the header (`::before`, with `clip-path` replacing `overflow: hidden`).
- Header tone sampler now walks the whole element stack and uses the first painted thing (tagged area, photograph or opaque fill), and reads `color(srgb …)` fills.
- Measured (1440×900, 49 positions): dark green 12.7% of coloured surfaces (8.5% of all pixels), cream 49.7%, photographs ~33%. Sessions and Product are the two longest pinned scenes, so they decide the balance.

#### Product back to dark green (2026-11-23)

- A closer look at the bottle uses `.tone-dark` again (Choose your session stays cream). Ingredient cut-outs: `drop-shadow(0 14px 22px rgb(12 18 14 / 0.55)) drop-shadow(0 0 14px rgb(244 240 231 / 0.16))` so the green ingredients separate from the background.

#### Palette preview — proposed ivory-led scheme (2026-11-23)

- `?palette=ivory` sets `html[data-palette="ivory"]` (src/main.tsx) and applies `src/styles/palette-ivory.css` (imported at the top of index.css; every rule scoped to that attribute, so the default palette is untouched). Warm Ivory #F4F0E7 dominant, Soft Cream #FAF8F2 cards/panels, Deep Olive #34463A headings and primary buttons, Muted Sage #D6D7CE only for Arrange your visit and accents, Natural Taupe #B8AA96 borders/contours, Charcoal Olive #30372F body text and the footer.
- Comparison: `.playwright-mcp/palette-compare.jpg` (same nine scroll positions, current vs proposed). Text contrast ≥ 4.5:1 except the Great World tab (4.43:1, large text, passes 3:1).
- To adopt: move these values into the base tokens and drop `.tone-dark` from First visit, Product and Reviews; to discard: delete the file, its import and the main.tsx switch.

#### 08 change — two review types in one carousel (2026-11-23)

- `src/content/reviews.ts`: `Review = Testimonial | GoogleReview`. Testimonial: name, quote, optional approved portrait. GoogleReview (curated by hand): public name, exact text, `rating` 1–5, `date` (month and year), `url` to the review on Google (null hides "View on Google"). `ORCHARD_GOOGLE_REVIEWS_URL` (null, unconfirmed) shows "See all Orchard reviews on Google" when set.
- Arc cards: testimonials keep the portrait / silhouette; Google reviews are a cream card (stars, excerpt clamped to 7 lines, reviewer initial, "Google review"). Attribution line under the quote: stars + visually hidden "Rated n out of 5", "Google review · date", "View on Google" (new tab). Ivory palette: soft cream card with taupe border.
- Labels not in the content file: "View on Google", "See all Orchard reviews on Google".

#### Orchard outlet photo (2026-11-23)

- `images.outlets.orchard` → `KOMO-landmark.png` (storefront with the lit KOMO sign and reception; 1536×1024 PNG, 2.6 MB). Replaces `KOMO_Home_SobreImg2.png` (file kept). Checked at 1440×900, 1024×768 and 390×844: the address card covers the screen wall and planter, the sign and reception stay clear; phone crop centres on the sign. Header controls ivory over it.

#### First visit — Mirror photographs (2026-11-23)

- `images.mirror.parting` → `KOMO Scalp Consultation in Warm Spa Clinic.png`; `images.mirror.imaging` → `KOMO Scalp Analysis Workstation.png` (both supplied KOMO, 1536×1024). Third (Discussion) unchanged. Captions Parting / Imaging / Discussion kept; Pexels placeholders for those two slots no longer used.
