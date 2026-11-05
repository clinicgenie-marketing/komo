# Content register

Status: homepage concept exploration, 5 November 2026. Single source of truth for the records in `src/data/records.ts`. Nothing here has been verified by KOMO.

Source of the homepage copy: `docs/source/KOMO_Singapore_Homepage_Content.md` (HC), supplied by the owner on 5 November 2026. Its own editorial notes say contact details, treatment inclusions and scalp-analysis availability must be confirmed before publishing, and prices and durations added.

Key: **source-only** = taken from a supplied document, not confirmed as true or current. **pending** = known to be required, value not supplied. **draft** = wording not owner-approved. Source abbreviations: SG = `KOMO_Botanical_Sanctuary_Style_Guide.md`, ARCH = `Architecture.md`.

The production build fails while any of these required records is unapproved (`assertPublishable` in `src/lib/publication.ts`), and concept routes are never generated in production.

## Missing source documents

| Item | Status | Effect |
|---|---|---|
| `PRD.md` | Not supplied with the pack | Product scope, acceptance criteria (AC-01 to AC-10), source page inventory and the "three source-supported treatments" could not be read. Treatment choices use the three service categories named in SG 15.1 instead of actual menu names. |
| `Design.md` | Excluded on instruction | The style guide replaces it for every visual decision. |
| Existing website, URL inventory, booking links | Not supplied; not inspected | No existing destination could be reused. |

## Records

All records below are `source-only` and `draft`. Records are in `src/data/records.ts`.

| Area | Records | Source |
|---|---|---|
| Hero, introduction, section headings and intros, closing | `copy-*` (hero eyebrow, title, support, secondary; intro title, lead, two bodies; care, science, concerns, favourites, visit, home care, space, FAQ and close headings and text) | HC, section by section |
| Brand lines | `copy-brand-tagline`, `copy-brand-descriptor` | HC footer and wall sign; folder cover |
| Boundary and request note | `copy-boundary`, `copy-request-note` | SG 1.5; SG 16.2 and Rules 5 |
| Science & Refinement | `science-understanding`, `science-herbal`, `science-details` | HC |
| What have you noticed | `concerns` list (5 prompts) | HC |
| Treatments | `treatment-scalp-care` (Signature Scalp Care), `treatment-head-spa` (Aromatic Waterfall Relaxing Scalp Spa), `treatment-hair-care` (Moisturising Cuticle Hair Care) | HC Find your kind of care and Explore KOMO favourites. Duration, inclusions, price and whether a scalp analysis is included are null |
| First visit | `step-arrive`, `step-understand`, `step-treatment`, `step-forward` | HC |
| FAQs | `faq-choose`, `faq-analysis`, `faq-no-concern`, `faq-time`, `faq-sensitive` | HC |
| FAQ added | `faq-medical` (Is KOMO a medical clinic?) | SG 1.5. **Not in HC.** Kept because the page invites people to mention thinning and shedding; the owner should approve or remove it |
| Outlet | `location-wheelock-place`: Wheelock Place, 501 Orchard Road, #03-03A, Singapore 238880 | HC location and footer. Opening hours and map link not supplied |
| Contact | `phone` +65 6224 5497, `whatsapp` +65 8087 7376, `email` info_sg@komowellness.com | HC footer. Shown as text marked "To be confirmed", not as links, until verified |
| Appointment | `appointment` | No booking provider supplied (D07) |

The previous draft records (style guide hero and promise, the three-part experience, five-step visit) were replaced. The Health, Joy, Beauty and Vitality pillar records remain in `records.ts` for a later About page but are no longer on the homepage, because HC does not include them.

## Departures from the supplied content, and why

| Supplied | On the concepts | Reason |
|---|---|---|
| Book a Visit, Book Your KOMO Visit | Request an appointment | No booking system is connected. Rules 5: a label must match what the button does, and a request is not a booking. Switch back once a real booking destination is verified |
| Ask Us on WhatsApp, WhatsApp Our Team, Get Directions | Not shown as buttons; the WhatsApp number shows in contact details | The number is unconfirmed and no map link was supplied, so a live link could reach the wrong place (Rules 7, 8) |
| Meet KOMO, Discover Our Approach, Explore KOMO Home Care, View All FAQs, Plan Your Visit, Plan Your First Visit, footer links to About, Journal | Omitted | Those pages do not exist yet; no dead links (Rules 7) |
| Explore Scalp Care, Explore Head Spa, Explore Hair Care | Link to the matching favourite on the same page | Real in-page navigation until treatment pages exist |
| Find Your Treatment, Explore Treatments | Link to the favourites and care sections | As above |
| Title Case headings and labels (Scalp Care, Head Spa) | Sentence case (Scalp care, Head spa). Treatment names keep their capitals | Rules 5 sentence case. "Science & Refinement" keeps its capitals as named brand panels |

## Observed in supplied brand imagery, not used

The botanical wall display (`src/assets/KOMO Scalp Wellness Wall Display.png`) also lists services (Scalp care, Scalp spa, Hair care, Deep scalp care) and product steps (Cleanse, Wash, Nourish, Care, Treat, Style, Body). HC names Head spa rather than Scalp spa and does not mention Deep scalp care. Confirm with KOMO whether the wall display is current. The "We believe beauty and confidence start at the roots" line from the wall is no longer used; HC's "Thoughtful care, from the roots" covers the same idea.

