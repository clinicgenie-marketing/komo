# KOMO website implementation tasks

Version 1.0 | 5 November 2026 | Initial state: preparation documents created; website implementation not started

Updated 5 November 2026: homepage concept exploration added (see progress log). The wider website build is not complete.

Note: `PRD.md` was not supplied with the pack. `Design.md` is not used on owner instruction; `KOMO_Botanical_Sanctuary_Style_Guide.md` replaces it wherever these documents reference `Design.md`.

## 1. Working protocol

Read all five root documents before beginning. Complete the first unblocked phase, verify its deliverables and update this file. Never mark a task complete simply because its checkbox exists. Use:

- `[ ]` not started.
- `[-]` in progress.
- `[x]` completed with evidence in the progress log.
- `[!]` blocked; include the dependency and continue independent work.

The initial task statuses below are intentionally incomplete. No repository, live integration or deployed site has been verified as part of preparing this pack.

## 2. Phase 0: discovery and pre-build decisions

Depends on: access to the intended repository and this pack.

- [-] T00 Read applicable repository instructions and all five documents. Inspect git status; preserve unrelated work.
- [x] T01 Identify actual framework, package manager, versions, scripts, routing, styling and deployment setup. Reuse the working stack where appropriate.
- [!] T02 Inventory existing pages/URLs, language navigation, login, booking links, contact actions, forms, analytics and embeds. Distinguish observed behaviour from assumptions.
- [-] T03 Create source, content and asset registers. Bring supplied documents/assets into the project only through authorised access; preserve source text separately from revised copy.
- [ ] T04 Record existing page content and useful metadata/redirect evidence. If live access is unavailable, record it and continue with the supplied source inventory.
- [ ] T05 Resolve the initial sitemap and architecture decision. Confirm what stays external and what is built locally.
- [ ] T06 Fill the decision register below. Identify which unknowns affect prototype work and which affect public release only.

Exit criteria: repository facts recorded; initial route map and integration inventory exist; no unsupported assumption is silently treated as final. Output a short implementation plan tied to these phases. Do not spend this phase repeatedly requesting approval for ordinary local work.

## 3. Phase 1: foundation and content contracts

Depends on: T01 and T05. Asset confirmation may remain open for a private prototype.

- [ ] T10 Configure the selected stack only if needed. Keep one package manager, lockfile and routing system.
- [-] T11 Implement central design tokens and semantic base styles from `Design.md`.
- [ ] T12 Create base page layout, metadata helper, site configuration and external destination registry.
- [-] T13 Create typed/validated treatment, location, asset and page records with evidence and approval states.
- [-] T14 Implement draft preview labels and production publication guards, including sitemap/schema exclusion.
- [-] T15 Implement reusable buttons, links, container, heading and disclosure patterns with accessible states.
- [-] T16 Add environment key names/descriptions to `.env.example` only where needed. Do not invent credentials.

Exit criteria: a representative local page builds; draft records cannot enter a public build accidentally; tokens and common controls are usable by keyboard. Confirm AC-03 and AC-05 foundations.

## 4. Phase 2: visual direction and homepage

Depends on: Phase 1; use explicit asset placeholders if originals are missing.

- [-] T20 Build desktop and mobile header, navigation and footer.
- [-] T21 Build homepage hero with meaningful draft copy, clear actions and intentional image crops.
- [-] T22 Build distinct treatment choices and a verified/draft-labelled first-visit sequence.
- [-] T23 Build philosophy and outlet sections using the approved direction; omit unsupported claim modules.
- [-] T24 Add practical FAQs and final appointment action with accurate behaviour.
- [-] T25 Review the homepage at 375, 768, 1024 and 1440px, plus 320px reflow, 200% zoom and keyboard use.
- [ ] T26 Correct composition, spacing, typography, crops and component states before reusing the pattern across inner pages.

Exit criteria: the homepage demonstrates the Botanical Sanctuary system, navigation works and no dead CTA is concealed by the design. Record visual review evidence. Confirm AC-02, AC-04 and AC-06 for the implemented path.

## 5. Phase 3: inner pages and content

Depends on: Phase 2 component review and relevant approved/draft content records.

- [ ] T30 Build Treatments hub with meaningful service comparison.
- [ ] T31 Build the three source-supported treatment detail routes using one adaptable template.
- [ ] T32 Build About with the four pillars and authentic brand story.
- [ ] T33 Build Technology with only substantiated explanations; avoid unverified statistics and credentials.
- [ ] T34 Build Locations with role-labelled addresses, verified contact data and directions.
- [ ] T35 Build Contact with real appointment handoff and accurate confirmation expectations.
- [ ] T36 Add approved privacy/terms text; leave public release blocked if required text is unavailable.
- [ ] T37 Implement actual not-found handling and review internal links, breadcrumbs and related treatments.
- [ ] T38 Review content for British English, unsupported claims, missing terms, duplication and placeholder leakage.

Exit criteria: scoped route set is complete locally; unresolved content is visible in registers and blocks public output appropriately. Confirm AC-01, AC-03 and AC-06.

## 6. Phase 4: appointment and measurement

Depends on: verified destinations and chosen integration model. UI can proceed earlier with safe draft configuration.

- [ ] T40 Verify appointment provider, WhatsApp and telephone destinations with the owner and actual link behaviour.
- [ ] T41 Implement external handoff, correct CTA wording and optional non-sensitive treatment context.
- [ ] T42 Decide whether a custom request form is required. If no, mark T43 as not applicable with a reason rather than incomplete.
- [ ] T43 Conditional: implement a real request backend, validation, abuse protection, idempotency, acceptance contract and failure states. Test without sending real customer messages.
- [ ] T44 Confirm analytics property ownership and approved consent behaviour; implement allowlisted event payloads if authorised.
- [ ] T45 Verify contact clicks do not trigger confirmed-booking events. Test consent acceptance, rejection and withdrawal if tracking is enabled.

Exit criteria: appointment actions are real and correctly described; any form can prove acceptance and handle errors; events contain no personal data and match actual outcomes. Confirm AC-02 and AC-09. A backend is not required to complete a verified external-handoff build.

## 7. Phase 5: SEO, performance and migration

Depends on: final route/content set, verified canonical domain and URL inventory.

- [ ] T50 Add unique titles, descriptions, canonical URLs and social metadata for public pages.
- [ ] T51 Add appropriate verified structured data and validate it against the rendered content.
- [ ] T52 Generate the approved-page sitemap; configure separate preview and production indexing behaviour.
- [ ] T53 Finalise redirects, including decisions on `/home` and `/collections`. Test status codes, targets and loops.
- [ ] T54 Optimise image formats, responsive sources, dimensions, focal points and loading priorities.
- [ ] T55 Measure representative home/treatment/location pages on mobile lab settings; record budgets, results and any exceptions.
- [ ] T56 Check loaded scripts, fonts, embeds, console errors, missing assets and unnecessary third-party requests.

Exit criteria: metadata/URLs are coherent; draft content stays out of indexable output; migration is explicit; performance evidence is recorded rather than assumed. Confirm AC-07 and relevant AC-08 checks.

## 8. Phase 6: quality review and handover

Depends on: relevant implementation phases. Run focused checks earlier as work lands.

- [ ] T60 Run production build, type checks, linting if configured and meaningful automated journeys.
- [ ] T61 Complete the QA matrix below; document exact commands, environment and results in `docs/qa.md`.
- [ ] T62 Review actual rendered pages for responsive design, cropping, contrast and readable legal/price terms.
- [ ] T63 Test keyboard, screen-reader spot checks, focus, mobile menu, disclosures, reduced motion and zoom/reflow.
- [ ] T64 Verify no draft facts, unlicensed assets, placeholder links, exposed secrets or false success states enter public output.
- [ ] T65 Write `docs/handover.md`: setup, commands, content edits, assets, environment key names, analytics semantics, unresolved issues, release and rollback procedure.
- [ ] T66 Review the diff and map evidence to all PRD acceptance criteria. Report the local result and remaining release dependencies.

Exit criteria: local build is reviewable, relevant checks pass or documented blockers remain, and the owner can understand how to maintain and release it. Confirm AC-08 and AC-10.

## 9. Phase 7: release after explicit authorisation

Depends on: owner release authorisation, final facts/legal/assets, selected host and all required checks. This pack alone does not authorise a launch.

- [ ] T70 Confirm final production domain, integration configuration, access and rollback revision. Preserve existing audience unless the owner requests a change.
- [ ] T71 Confirm production indexing, canonical, redirect and analytics settings; keep previews protected.
- [ ] T72 Deploy the exact reviewed revision through the project's authorised workflow.
- [ ] T73 Smoke-test production routes, assets, redirects, metadata and actual contact destinations. Avoid real booking submissions unless explicitly arranged.
- [ ] T74 Record revision, release time, verification and rollback result/readiness. Monitor genuine errors and gather field performance when sufficient data exists.

Exit criteria: the reviewed revision is live, production checks pass, operational ownership is clear and no release blocker remains hidden.

## 10. Decision and dependency register

Initial status for every row: open. Fill with actual answers, dates and evidence.

| ID | Decision / missing input | Working approach | What it blocks |
|---|---|---|---|
| D01 | Intended repository and actual stack | Preserve existing; new-repo default in Architecture.md | Framework-specific implementation |
| D02 | Final routes and old URL inventory | Proposed sitemap in PRD.md | Migration and release; not layout prototyping |
| D03 | Owner-approved rewritten copy | Source copy retained separately; revisions marked draft | Publication of affected content |
| D04 | Treatment duration, inclusions and current price/terms | Unknown values null; source prices unverified | Final menu/price publication |
| D05 | Current outlet details, hours and contact ownership | Source records role-labelled | Production contact/location details |
| D06 | Official logo, imagery and usage rights | Labelled placeholders in private preview | Final visual approval and release |
| D07 | Booking provider and request/confirmation behaviour | External handoff baseline | Live appointment journey |
| D08 | Chinese and login functionality to retain | Audit first; no fake controls | Final navigation/migration |
| D09 | Claim evidence and optional review/award sections | Omit unverified claims | Only affected optional modules |
| D10 | Analytics property and privacy/consent choices | Tracking disabled until defined | Measurement, not visual build |
| D11 | Final legal text and form data ownership if used | Owner-reviewed text required | Public release; custom form if selected |
| D12 | Host, domain, deployment authorisation | Local/preview work only initially | Production configuration and release |
| D13 | Final branded fonts and Flow master | Georgia/system baseline; Flow optional | Only final font/Flow substitution |

## 11. QA matrix

| Area | Minimum meaningful check |
|---|---|
| Routes | Every scoped route; unknown treatment slug returns 404 |
| Navigation | Desktop/mobile, active route, Escape/focus return, no hidden focus targets |
| Appointment | Correct provider/account/service; accurate action label; no false confirmation |
| Optional form | Invalid, valid, duplicate, timeout, throttled and provider-failure behaviour |
| Content | Verified required facts, commercial terms, no unsupported claims/placeholders |
| Publication | Draft excluded from HTML, sitemap and schema; required missing data fails public build |
| Responsive | 320px reflow; 375, 768, 1024 and 1440px reviews; 200% zoom |
| Accessibility | Keyboard, contrast, focus, labels, alt text, announcements, reduced motion |
| SEO | Unique metadata, canonical host, visible/schema consistency, sitemap and robots |
| Migration | Redirect status and final target, no loops/chains, real 404s |
| Performance | Representative mobile lab settings; image/JS/transfer budgets; layout stability |
| Privacy | No personal data in analytics/URLs; correct consent behaviour if tracking exists |
| Build/security | Configured checks pass; no leaked secret or untrusted HTML injection |

## 12. Progress log template

Append an entry per meaningful implementation phase:

```markdown
### YYYY-MM-DD | Phase / task IDs
Status: in progress / completed / blocked
Resulting behaviour:
Files changed:
Decisions and evidence:
Checks run and actual results:
Checks not run and why:
Blockers / owner input needed:
Next unblocked task:
```

Do not fill the template with invented pass results. Keep a task blocked only where its actual dependency is missing; continue useful independent work.

## 13. Progress log

### 2026-11-05 | Homepage concept exploration (T00, T01, T03, T11, T13 to T16, T20 to T25 for concept routes only)
Status: completed for the private concept preview. The wider website build is not complete and none of the tasks above are marked done on the strength of this work except T01.

Resulting behaviour:
- Three functional homepage concepts at `/concept-1/` (Editorial sanctuary), `/concept-2/` (The care journey) and `/concept-3/` (Immersive retreat), plus a comparison index at `/concepts/` and a real 404.
- One token system, one content record set, shared header, footer, FAQ, facts and appointment components. Each composition lives in its own file with scoped styles.
- Unconfirmed facts render as labelled preview placeholders. Photographs and the logo are labelled placeholders. KOMO Flow is omitted (no master artwork).
- Appointment actions lead to on-page appointment guidance that says no booking destination is connected yet. No form, no fake success state, no analytics.
- Concept routes are generated only for the preview target and carry `noindex, nofollow`. `KOMO_BUILD_TARGET=production` builds no concept routes, and the publication guard throws if any required draft record would be rendered.

Files changed: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.env.example`, `README.md`, `src/**`, `tests/build.test.mjs`, `tests/browser-qa.mjs`, `docs/content-register.md`, `docs/asset-register.md`, `docs/decisions.md`, `docs/qa.md`, and the four supplied documents copied to the root.

Decisions and evidence:
- Repository was empty (no commits). Astro 7.4.5 + TypeScript 6.0.3 + npm chosen per Architecture.md 1. See `docs/decisions.md`.
- Treatment choices use the three categories from the style guide (Scalp care, Scalp spa, Hair care) because actual menu names were not supplied.

Checks run and actual results (details in `docs/qa.md`):
- `npm run check`: 0 errors, 0 warnings.
- `npm run build`: 5 pages. `npm run build:production`: 404 only.
- `npm test`: 25/25 passed.
- `npm run qa:browser`: 80/80 passed (320/375/768/1024/1440px reflow, 200% zoom equivalent, mobile navigation and Escape/focus return, skip link, visible focus, anchors clear of sticky header, fixed bar not covering content, reduced motion, console errors, axe WCAG 2.2 AA with 0 violations, 404 status).
- Visual review of screenshots at 1440 and 375px; layout issues corrected.

Checks not run and why: lab performance (no real images yet); screen reader and non-Chromium browsers (not available in the container); destination handoff (no destinations supplied); analytics and consent (not implemented).

Decision register status at this date:

| ID | Status | Note |
|---|---|---|
| D01 | Resolved for this repository | Empty repo; Astro baseline adopted |
| D02 | Open | Only concept routes exist; no URL inventory supplied |
| D03 | Open | All copy draft; see `docs/content-register.md` |
| D04 | Open | Treatment names, durations, inclusions, prices, terms unknown |
| D05 | Open | Unit number, hours, phone, WhatsApp, map link unknown; Wheelock Place is source-only |
| D06 | Open | No logo, photography or usage rights supplied |
| D07 | Open | No booking provider; confirmation behaviour unknown |
| D08 | Open | Chinese and login functionality not audited (no live site access) |
| D09 | Open | No claim modules built |
| D10 | Open | Tracking disabled |
| D11 | Open | Privacy and terms text missing |
| D12 | Open | No host, domain or deployment |
| D13 | Open | Georgia/system baseline in use; Flow omitted |

Blockers / owner input needed: `PRD.md`; choice of homepage concept; actual treatment menu facts; booking and contact destinations; official logo and authentic photography; privacy and terms text.

Next unblocked task: once a concept is chosen, refine it (T26) and build the inner-page templates from the same records (Phase 3), keeping facts as placeholders until D04 to D07 are answered.

### 2026-11-05 | Homepage exploration: Concept 3 hero revision (owner request)
Status: completed for the private preview.

Resulting behaviour: Concept 3 now opens with full-screen hero media. The logo sits top left on a controlled scrim, the navigation and appointment action sit in a soft-white box top right, and the description and actions sit in a solid olive panel bottom left. A silent background video plays there once an approved file is added. Until then a labelled poster placeholder shows, and no video element renders.

Files changed: `src/components/ui/HeroVideo.astro` (new), `src/components/layout/SiteHeader.astro` (overlay variant), `src/components/concepts/Concept3Immersive.astro`, `src/components/concepts/ConceptIndex.astro`, `src/lib/schema.ts`, `src/data/records.ts` (`hero-video` asset), `tests/build.test.mjs`, `tests/browser-qa.mjs`, `package.json`, `package-lock.json`, `docs/asset-register.md`, `docs/decisions.md`, `docs/qa.md`.

Decisions and evidence: owner instruction overrides the no-hero-video baseline in Architecture.md 9, within the style guide's motion and accessibility conditions (see `docs/decisions.md`).

Checks run and actual results: `npm run check` 0 errors; `npm test` 25/25; `npm run qa:browser` 82/82; video behaviour fixture test 13/13 (details in `docs/qa.md`).

Checks not run and why: real footage and iOS Safari playback (no asset, no device).

Blockers / owner input needed: approved hero video and poster photograph with usage rights; reversed (light) logo artwork for use over media.

Next unblocked task: unchanged. Choose a concept, then refine it (T26).

### 2026-11-05 | Homepage exploration: brand redesign of all three concepts (owner request)
Status: completed for the private preview.

Resulting behaviour: the three concepts keep their structure and content but now take their look from KOMO's own brand material. Headings, navigation and buttons use Jost, a geometric face that sits with the rounded KOMO wordmark. Deep green and gold from the KOMO folder anchor the contrast sections (C1 belief and space, C2 visit summary, treatment menu and close, C3 hero panel and treatments) and the footer. Images take the outlet's shapes: backlit timber arches (C1 hero and pillars, C3 first visit) and round illuminated mirrors (treatment rows, step markers, porthole details). Each concept carries the brand belief or tagline from KOMO's signage. All supplied photographs now show in preview as concept images.

Files changed: `package.json`, `package-lock.json` (`@fontsource-variable/jost` 5.3.0), `src/styles/tokens.css`, `src/styles/base.css`, `src/layouts/PreviewLayout.astro`, `src/lib/images.ts` (new), `src/data/records.ts`, `src/components/ui/ImageSlot.astro`, `src/components/ui/HeroVideo.astro`, `src/components/ui/AppointmentAction.astro`, `src/components/ui/LogoPlaceholder.astro`, `src/components/layout/SiteHeader.astro`, `src/components/layout/SiteFooter.astro`, `src/components/layout/PreviewBanner.astro`, the three concept components and the index, `src/assets/photography/` (14 new files), `tests/build.test.mjs`, `docs/decisions.md`, `docs/asset-register.md`, `docs/content-register.md`, `docs/qa.md`.

Decisions and evidence: see `docs/decisions.md` (three entries dated 2026-11-05 for the redesign). The new palette and font are proposals sampled from the supplied images, not approved brand values.

Checks run and actual results: `npm run check` 0 errors; `npm test` 26/26; `npm run qa:browser` 82/82 (details in `docs/qa.md`).

Checks not run and why: lab performance with photographs, screen reader, Safari and Firefox (not available).

Blockers / owner input needed: official logo artwork (now the most visible gap, since the photographs show the real wordmark); provenance, rights and confirmation for every photograph; approval of Jost and the green and gold tokens (D13); approval of the three brand lines; whether Deep scalp care, listed on the wall display, is a current service.

Next unblocked task: unchanged. Choose a concept, then refine it (T26).

### 2026-11-05 | Homepage exploration: supplied homepage content applied (owner request)
Status: completed for the private preview.

Resulting behaviour: all three concepts now carry the owner's `KOMO_Singapore_Homepage_Content.md` (kept in `docs/source/`): hero, Thoughtful care, Find your kind of care, Science & Refinement, What have you noticed, KOMO favourites with the three named treatments, the four-step first visit, home care, the Orchard Road address, the five FAQs and the closing invitation. Each concept keeps its own composition and brand treatment. Telephone, WhatsApp and email show as text marked "To be confirmed". Departures from the supplied wording are listed in `docs/content-register.md`.

Files changed: `src/lib/schema.ts`, `src/data/records.ts`, `src/components/ui/Fact.astro`, `src/components/ui/OutletAddress.astro` (new), `src/components/layout/ContactChannels.astro`, `src/components/layout/SiteFooter.astro`, the three concept components and the index, `src/styles/base.css`, `tests/build.test.mjs`, `tests/browser-qa.mjs`, `docs/source/KOMO_Singapore_Homepage_Content.md` (new), `docs/content-register.md`, `docs/decisions.md`, `docs/qa.md`.

Checks run and actual results: `npm run check` 0 errors; `npm test` 29/29; `npm run qa:browser` 82/82.

Blockers / owner input needed: confirm telephone, WhatsApp and email (then they become links); prices, durations and inclusions for the three treatments; which treatments include the scalp analysis; opening hours and a map link; a booking destination (so Request an appointment can become Book a visit); whether to keep the added "Is KOMO a medical clinic?" FAQ; whether the four pillars belong on the homepage.

Next unblocked task: choose a concept, then refine it (T26).
