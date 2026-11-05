# KOMO website architecture

Version 1.0 | 5 November 2026 | Proposed technical baseline

## 1. Architecture decision

Inspect the existing repository before scaffolding. Preserve its working framework, package manager, lockfile, integrations and deployment conventions unless there is a concrete reason to change them. The earlier KOMO site context suggests Vue, but no repository has been inspected for this pack; do not treat that as a verified implementation fact.

For a genuinely new repository, the proposed default is Astro with TypeScript, static page generation and native CSS tokens. This suits a content-led marketing site with limited interaction. Use small client-side modules or framework islands only where necessary. An existing Vue or Next.js project can meet the same requirements without migration.

This is a project choice rather than a claim that one framework is universally best. At implementation time, check official documentation for current supported versions, deployment compatibility and APIs. Pin the selected versions in the lockfile. Do not install an unspecified latest stack or duplicate frameworks.

## 2. System boundaries

The browser receives pre-rendered pages and optimised assets. Approved structured content supplies templates. Appointment CTAs hand off to a verified external destination by default. Analytics receives allowlisted non-personal interaction events only when permitted by the agreed consent model.

No application database, authentication service, mail provider or payment processor is required for the baseline. Existing operational services remain separate. Do not connect a website form to an internal platform, database or sender by assumption.

## 3. Suggested repository structure

Adapt naming to the existing framework. The following is the new-Astro baseline, not a requirement to restructure a working repository.

```text
/
  PRD.md
  Architecture.md
  Rules.md
  Design.md
  Task.md
  package.json
  [existing package-manager lockfile]
  .env.example
  src/
    assets/                 # imported, processed images
    components/
      layout/               # header, navigation, footer
      ui/                   # buttons, cards, disclosures
      sections/             # page sections with real reuse
    layouts/                # base page and treatment page
    content/                # approved editorial entries
    data/                   # treatment, location and site records
    lib/                    # metadata, publication checks, events
    pages/                  # routes matching PRD.md
    styles/                 # tokens, base, components
  public/                   # stable assets, approved icons, robots
  tests/                    # focused integration and journey checks
  docs/
    sources/                # supplied source references
    content-register.md
    asset-register.md
    redirects.csv
    decisions.md
    qa.md
    handover.md
```

Never put unreviewed raw source copy, secrets or internal notes in a publicly served directory. Do not over-abstract sections that occur only once. Use semantic HTML before adding a component library.

## 4. Content schema and publication safety

Use structured records validated during the build. Zod or the framework's existing schema solution is appropriate; avoid adding a second validator unnecessarily.

### Shared evidence fields

| Field | Meaning |
|---|---|
| `id` | Stable internal identifier |
| `sourceRef` | Source document or evidence reference |
| `verificationStatus` | `source-only`, `pending`, `verified` or `rejected` |
| `verifiedBy`, `verifiedAt` | Actual review record; never populate speculatively |
| `publishStatus` | `draft` or `approved` |

Content approval and fact verification are distinct. A rewritten paragraph can remain draft even when its address is verified. A design approval does not verify operational facts.

### Treatment record

- `slug`, `name`, `category`, `summary`, `description`.
- `experienceSteps[]`, `inclusions[]`, `faqs[]` with verified service context.
- `durationMinutes: number | null`; null means unknown, not zero.
- `price: { amountMinor, currency: 'SGD', kind, taxDisplay, eligibility, terms, validUntil } | null`.
- `heroAssetId`, `relatedTreatmentIds[]`, `appointmentDestinationId`.
- `seo: { title, description, canonicalPath }` and evidence/publication fields.

Store money as integer minor units; format with an appropriate Singapore currency formatter. Do not compare usual and promotional prices without verified terms. Avoid ambiguous dollar labels.

### Location record

`id`, `kind` (`customer-outlet` or `office`), `name`, structured address, phone, WhatsApp, email, verified hours, optional map URL/coordinates, source and publication fields. Unknown hours stay null. Never invent opening times or coordinates.

### Asset record

`id`, local path, dimensions, alt text, decorative flag, crop/focal point, subject/service, source, usage rights and approval state. Track concept imagery separately from documentary outlet/treatment photography.

### Build behaviour

- Development may render labelled draft placeholders. Draft status must be obvious on the page.
- Public builds exclude optional unapproved sections. Public builds fail when required facts, legal copy, contact destinations or core page content remain unapproved.
- Internal source references and reviewer details must not leak into rendered public markup.
- A single publication predicate should drive templates, sitemap and structured data so drafts cannot leak through secondary paths.

## 5. Routes and migration

- Generate treatment detail routes from approved treatment records; unknown slugs return a real 404.
- Prefer `/` for the proposed homepage. Map `/home` only after inventory confirms migration needs.
- Proposed old-to-new candidates: `/home` to `/`; `/collections` to `/treatments`. Confirm old subpaths and query behaviour before adding permanent redirects.
- Keep redirect records as `old_path,new_path,status,reason,verified`. Avoid chains, loops, blanket redirects and redirecting unrelated missing pages to home.
- If existing URLs are useful and stable, retaining them can be preferable to changing them. Document the final decision.
- Use one canonical domain. Configure host and HTTPS redirects at the deployment layer and verify with HTTP requests.

## 6. Appointment integration

### Baseline external handoff

Resolve a destination by ID from central configuration. Validate the URL/protocol, account ownership, intended service and mobile behaviour. Use plain, non-sensitive prefilled WhatsApp text only if approved. Do not add symptoms, names, phone numbers or form answers to query strings.

Record a contact click as a contact click. Opening WhatsApp or a provider page does not prove a message was sent or an appointment confirmed. Use confirmation events only from a real verified provider callback, webhook or operational reconciliation.

### Conditional custom request form

Implement only when the owner chooses it and a real processing destination is ready. Before enabling:

1. Define necessary fields, consent wording, retention and access ownership.
2. Provide server-side validation, length limits, bot controls, rate limits and payload limits. Validate origin and apply CSRF protection where the request/authentication design requires it.
3. Select a durable store or provider API and idempotency handling. Do not rely on process memory for delivery or abuse protection in a distributed host.
4. Separate stored/accepted request status from notification delivery and appointment confirmation.
5. Keep secrets server-side and minimise/redact logs.
6. Handle timeout, rejected input, throttling, duplicate request, provider outage, success and notification failure accurately.

Return success only after the actual acceptance contract is met. If there is no backend, provide a clearly described external contact route; never simulate a successful request. Do not collect sensitive scalp history in an unrestricted free-text box.

## 7. SEO implementation

- Central metadata helper with page-specific title, description, canonical and social image.
- Absolute canonical URLs derived from verified environment configuration, never localhost or preview hostname in public output.
- Sitemap contains only public approved canonical pages returning 200.
- Preview protection uses access restriction where available and `noindex` metadata/headers; robots.txt alone does not prevent indexing or protect private content.
- Production robots policy and indexing checks are explicit release tasks.
- Use only appropriate schema supported by visible facts, such as Organisation, eligible local business, Service and BreadcrumbList. Validate the final vocabulary using primary documentation.
- Do not add medical business schema, unsupported aggregate ratings, invented reviews or claims of guaranteed search enhancements.
- Produce useful visible FAQs; schema eligibility is a separate question and does not promise a rich result.
- Validate social cards, real 404 status, trailing slash policy and internal links.

## 8. Analytics and privacy

Initial event contract:

| Event | Trigger | Permitted parameters |
|---|---|---|
| `view_treatment` | Treatment detail viewed | `treatment_id` |
| `appointment_click` | User follows provider CTA | `placement`, `treatment_id`, `destination_type` |
| `whatsapp_click` | WhatsApp action followed | `placement`, optional `treatment_id` |
| `phone_click` | Telephone link followed | `placement` |
| `directions_click` | Map/directions action followed | `location_id` |
| `request_accepted` | Optional real backend accepts request | Non-personal technical ID only if approved |

Do not send names, email addresses, phone numbers, free text, health details or full uncontrolled URLs. If the provider confirms appointments, define a separate deduplicated `booking_confirmed` event and document its source. Avoid double counting native/provider and custom events.

Keep analytics disabled until the property, event ownership and consent behaviour are confirmed. Implement acceptance, rejection and withdrawal according to the approved policy and current requirements; do not copy a generic banner while loading tracking before consent. Minimise third-party map, video and tracking requests through links, poster images or consent-aware loading.

## 9. Performance budgets

Working budgets to evaluate on representative pages, not performance guarantees:

- Initial first-party compressed JavaScript: target at most 100 KB per content page; explain exceptions.
- Initial mobile page transfer: target at most 1 MB excluding deferred video; hero image target at most 250 KB where image quality permits.
- Reserve image dimensions and responsive aspect ratios to reduce layout shift.
- Use AVIF/WebP variants where supported with suitable fallbacks, responsive source sets and correct sizes.
- Prioritise only the actual hero/LCP candidate; lazy-load offscreen imagery.
- Baseline fonts are local system fonts. If approved webfonts are added, subset and self-host with valid rights, minimal weights and appropriate loading behaviour.
- No autoplay hero video in the baseline. Optional video needs poster, pause controls where applicable, reduced-motion handling and no initial download penalty.
- Real-user targets after launch: LCP at most 2.5s, INP at most 200ms, CLS at most 0.1 at the 75th percentile where enough data exists. Lab tests are diagnostic and do not establish field performance.

Use official measurement documentation at implementation time. Record device/network settings and representative routes. Fix image, script and layout causes before chasing a single score.

## 10. Reliability, security and environments

- Environments: local, access-controlled preview and production. Do not send real customer requests from automated preview tests.
- Commit `.env.example` with key names and descriptions only. Keep real secrets out of git, browser bundles, screenshots and logs.
- Review externally supplied rich content; do not render arbitrary HTML unsanitised.
- Add suitable security headers through the host, test CSP against real embeds and maintain dependency hygiene without disruptive speculative upgrades.
- Normalise and allowlist external destinations; add safe link attributes when opening new tabs. Same-tab handoffs are acceptable when clearer.
- Keep a deployable known-good revision and document host-specific rollback. Back up data only if the chosen architecture actually stores data.
- A hosting provider is not selected by these documents. Verify runtime/redirect/header support before committing to integrations.

## 11. Verification and handover

Use the package manager already selected by the repository. Provide scripts for local development, build, preview, type checking, linting if configured and relevant tests. Record exact commands and results in `docs/qa.md`.

Minimum meaningful coverage: required routes, invalid treatment slug, responsive navigation/keyboard behaviour, correct CTA destinations, publication guard, redirects and metadata. Test conditional form failure paths only if a form exists. Combine automated checks with visual and keyboard review.

Handover must explain content edits, verified data ownership, assets, event semantics, environment key names, build/deploy commands, redirect maintenance, release blockers and rollback. Mark unrun checks as unrun.
