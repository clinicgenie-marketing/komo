# QA record

## 2026-11-05 | Homepage concept exploration

Environment: Linux cloud container, Node 22.23.4, npm 10.9.9, Astro 7.4.5, TypeScript 6.0.3, Playwright 1.63.0 (pre-installed Chromium), axe-core 4.11.0. Local preview build only; nothing deployed.

### Commands and actual results

| Command | Result |
|---|---|
| `npm run check` (`astro check`) | 0 errors, 0 warnings, 0 hints (26 files) |
| `npm run build` | 5 pages built: `/404.html`, `/concepts/`, `/concept-1/`, `/concept-2/`, `/concept-3/` |
| `npm run build:production` | 1 page built (`/404.html`). No concept routes generated |
| `npm test` | 25 of 25 passed |
| `npm run qa:browser` (after `npm run build`) | 80 of 80 passed. Full output in `qa-output/browser-qa.json` (git-ignored) |

### What `npm test` covers (tests/build.test.mjs)

Routes and real 404 exist; `noindex, nofollow` on every preview page; one h1 and no skipped heading levels; no `href="#"` or empty links; every in-page link has a target and ids are unique; required homepage content is present in each concept; no lorem ipsum, `[TBC]`, em dashes, prices, durations, unsupported claim words or confirmation states; no internal evidence fields in markup; no form or video; placeholders labelled; every appointment action resolves to on-page guidance while unverified; publication predicate behaviour; production guard throws on the current draft records; no fact is invented in records; destination protocol allowlist; production build excludes every concept route.

### What `npm run qa:browser` covers (tests/browser-qa.mjs), per concept

- No horizontal scroll at 320, 375, 768, 1024 and 1440px.
- No console errors at those widths.
- 200% zoom equivalent (640px CSS viewport at device scale 2) reflows and keeps navigation reachable.
- First Tab reaches the skip link; mobile menu starts collapsed, opens with Enter, Tab moves into it, Escape closes it and returns focus to the button, menu links navigate and close it.
- Anchor targets are not hidden under the sticky header.
- Visible focus outline on keyboard focus; FAQ disclosure operates with Enter.
- Concept 3's fixed mobile action bar does not cover the end of the page.
- Desktop shows inline navigation without the menu button.
- Reduced motion: no smooth scrolling and transitions reduced to 0.01ms.
- axe-core WCAG 2.0/2.1/2.2 A and AA plus best-practice rules at 375 and 1440px: 0 violations.
- Comparison index links to all three concepts; an unknown route returns HTTP 404.

Issues found and fixed during this pass: classes passed to child components were ignored by Astro scoped styles (images collapsed in grids); pillar labels stretched; placeholder labels hidden under overlapping panels on full-bleed images; Concept 3 action bar was outside a landmark (axe `region`); two QA script faults (programmatic focus and smooth scroll) corrected so the checks measure the real behaviour.

### Contrast (calculated from tokens, WCAG relative luminance)

axe reported some Concept 2 text as "incomplete" (it cannot resolve the background behind the decorative timeline line) and one Concept 3 eyebrow where the panel overlaps the image. The pairs involved were checked directly:

| Pair | Ratio |
|---|---|
| Olive on ivory / ivory on olive | 8.86:1 |
| Olive on soft white | 9.93:1 |
| Muted olive (secondary) on ivory | 5.84:1 |
| Muted olive on soft white | 6.54:1 |
| Olive on warm stone | 5.42:1 |
| Olive on timber placeholder fill | 6.59:1 |
| Olive on sage (temporary placeholder labels only) | 4.54:1 |
| Focus outline, olive against ivory | 8.86:1 |

Sage and stone are never used as text colours (SG 8.4).

### Visual review

Screenshots reviewed at 1440 and 375px for all three concepts (written to `qa-output/screens/` by the QA script, also 768px). Layout composition, crops and placeholder legibility were corrected as listed above.

### Weight (preview build)

| Item | Size |
|---|---|
| Concept HTML | 29 to 34 KB raw, about 6 KB gzip each |
| CSS (two shared files) | about 7.4 KB gzip combined |
| JavaScript | One small inline module (navigation only); no external scripts |
| Fonts | System fonts only |
| Third-party requests | None |
| Images | None yet (placeholders). Image budgets (hero at most 250 KB) cannot be measured until approved assets exist |

### Not run, and why

- Lighthouse or other lab performance measurement: no real images, so results would not represent the page. Run when assets land (T55).
- Screen reader testing with VoiceOver or NVDA: not available in this container. Semantic structure, labels and announcements were checked through axe and the build tests only.
- Real devices and Safari/Firefox: only Chromium was available.
- Booking, WhatsApp, telephone and map destinations: none supplied, so no handoff could be tested.
- Analytics and consent: not implemented (D10).

## 2026-11-05 | Concept 3 hero: video layout

Change: overlay header (logo top left, navigation in a soft-white box top right), full-screen hero media with a poster placeholder and a background video player, and a solid olive description panel bottom left. `@types/node` 22.20.5 added for the build-time WebM check.

| Command | Result |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints (29 files) |
| `npm test` | 25 of 25 passed. The video check now forbids a `<video>` element while no approved asset exists, and any `autoplay` attribute |
| `npm run qa:browser` | 82 of 82 passed. Two new checks: logo top left and nav box top right over the hero media; panel bottom left with its actions above the fold at 1440 x 900 |

Video behaviour was tested on a throwaway copy of the repository (in the session scratchpad, not committed) with a generated 4 second test clip marked as approved. 13 of 13 passed:

- Plays after page load with normal motion and fades in over the poster.
- The video file is requested only after the window load event.
- Pause button visible and labelled; Enter pauses and relabels to Play; Space resumes.
- Video is muted.
- axe WCAG 2.2 AA: 0 violations with the video present.
- No console errors.
- Reduced motion: video does not start, the file is not downloaded and the poster stays; the visitor can still press Play.
- Mobile (375px): the pause button is clear of the navigation box and the panel.

That test showed bright frames showing through the original 94% panel, so the panel is now solid olive. Focus rings on the logo and pause button were strengthened to stay visible over footage.

Not tested: real KOMO footage (none supplied), H.264 playback (Playwright's Chromium has no H.264; WebM was used), Safari autoplay rules on iOS.

Preview note: the private preview banner sits above the hero, so on tablets and phones the panel starts about 100px lower than it will without the banner.

## 2026-11-05 | Approved photography wired into the concepts

Environment as above, plus sharp (bundled with Astro) for image processing.

| Command | Result |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints |
| `npm run build` | 5 pages. `dist/` 8.8 MB; no PNG originals copied (was 93 MB with an eager glob, fixed by registering only used photos) |
| `npm test` | 26 of 26 passed (new: approved assets must be verified, recorded, registered and on disk; pictures carry AVIF and WebP sources, intrinsic size and alt; no PNG served; no PNG in `dist/_astro`) |
| `npm run qa:browser` | 82 of 82 passed, including axe WCAG 2.2 AA at 375 and 1440px with real photos |
| Manual scroll check, all concepts at 1440 and 375px | Every image loaded, none broken |

Image weight measured in headless Chrome (AVIF served):

| Concept | First view at 1440px | Whole page at 1440px | First view at 375px | Whole page at 375px |
|---|---|---|---|---|
| Concept 1 | 47 KB | 250 KB | 10 KB | 98 KB |
| Concept 2 | 67 KB | 164 KB | 14 KB | 110 KB |
| Concept 3 | 86 KB | 277 KB | 37 KB | 132 KB |

Every hero is well under the 250 KB hero budget. Not run: Lighthouse and real-user field data, iOS Safari, screen readers.
