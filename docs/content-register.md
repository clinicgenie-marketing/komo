# Content register

Status: homepage concept exploration, 5 November 2026. Single source of truth for the records in `src/data/records.ts`. Nothing here has been verified by KOMO.

Key: **source-only** = taken from a supplied document, not confirmed as true or current. **pending** = known to be required, value not supplied. **draft** = wording not owner-approved. Source abbreviations: SG = `KOMO_Botanical_Sanctuary_Style_Guide.md`, ARCH = `Architecture.md`.

The production build fails while any of these required records is unapproved (`assertPublishable` in `src/lib/publication.ts`), and concept routes are never generated in production.

## Missing source documents

| Item | Status | Effect |
|---|---|---|
| `PRD.md` | Not supplied with the pack | Product scope, acceptance criteria (AC-01 to AC-10), source page inventory and the "three source-supported treatments" could not be read. Treatment choices use the three service categories named in SG 15.1 instead of actual menu names. |
| `Design.md` | Excluded on instruction | The style guide replaces it for every visual decision. |
| Existing website, URL inventory, booking links | Not supplied; not inspected | No existing destination could be reused. |

## Records

| ID | Verification | Publish | Source |
|---|---|---|---|
| `copy-hero-support` | source-only | draft | SG 15.2 hero example |
| `copy-positioning` | source-only | draft | SG 1.1 positioning |
| `copy-promise` | source-only | draft | SG 1.2 emotional promise |
| `copy-experience-intro` | source-only | draft | SG 1.3, 15.1 step 2 |
| `copy-boundary` | source-only | draft | SG 1.5 brand boundaries |
| `copy-request-note` | source-only | draft | SG 16.2, Rules 5 |
| `treatment-scalp-care` | source-only | draft | SG 15.1 step 3 service categories; SG 4 Health |
| `treatment-scalp-spa` | source-only | draft | SG 15.1 step 3 service categories; SG 4 Joy |
| `treatment-hair-care` | source-only | draft | SG 15.1 step 3 service categories; SG 4 Beauty |
| `location-wheelock-place` | source-only | draft | SG 15.2 (location); SG 5 outlet photograph description |
| `pillar-health` / `-joy` / `-beauty` / `-vitality` | source-only | draft | SG 4 four pillars table (descriptions are the guide's suggested lines) |
| `step-arrival` | source-only | draft | SG 20.3 first visit sequence; SG 3 journey |
| `step-conversation` | source-only | draft | SG 20.3; SG 18.2 |
| `step-assessment` | source-only | draft | SG 20.3 ("assessment where included"); SG 1.5 |
| `step-treatment` | source-only | draft | SG 20.3; SG 12.1 |
| `step-finish` | source-only | draft | SG 20.3; SG 4 Vitality |
| `faq-first-visit` | source-only | draft | SG 20.3 |
| `faq-medical` | source-only | draft | SG 1.5 (needs owner review of the "speak with a doctor" line) |
| `faq-choose` | source-only | draft | SG 15.1; SG 4 |
| `faq-price-duration` | source-only | draft | SG 15.3; Task.md D04 |
| `faq-request` | source-only | draft | SG 16.2; Rules 5; Task.md D07 |
| `faq-where` | source-only | draft | SG 15.2 |
| `appointment` destination | pending | draft | ARCH 6; provider not supplied (D07) |
| `whatsapp` destination | pending | draft | Number not supplied (D05) |
| `phone` destination | pending | draft | Number not supplied (D05) |
| `directions` destination | pending | draft | Map link not supplied (D05) |

## Unresolved facts (stored as null, shown as labelled placeholders in preview)

| Fact | Records | Blocks |
|---|---|---|
| Actual treatment names (currently the category names Scalp care, Scalp spa, Hair care) | treatments | Final menu presentation |
| Duration, price, tax display and terms for each treatment | treatments | Price and duration publication |
| Inclusions and whether each service includes a scalp assessment | treatments, `step-assessment` | Treatment descriptions; first-visit accuracy |
| What the scalp assessment does (SG 1.5 requires verified capabilities; any AI-assisted element is undescribed) | `step-assessment` | Any description beyond "your therapist explains what it looks at" |
| Unit number, postal address, opening hours, map link | `location-wheelock-place` | Location and visit details |
| Booking provider, WhatsApp number, telephone number | destinations | Every appointment action |
| How and when appointments are confirmed | `copy-request-note`, `faq-request` | Confirmation wording |
| Privacy policy and terms text | footer | Public release |
| Owner approval of all draft wording | all | Public release |

## Wording decisions taken in drafts

- Treatment summaries, "suited to" lines and step details were written from the guide's pillar meanings and first-visit sequence. They avoid durations, inclusions and outcomes.
- Copy avoids: diagnosis, regrowth, guaranteed, clinically proven, permanent and medical claims (SG 18.3). The build tests check for these words.
- No em dashes (SG 18.1). Checked by the build tests.
- "Sending a request does not confirm a booking" is used in place of any success or confirmation state.
