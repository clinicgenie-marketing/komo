# Asset register

Status: 5 November 2026. On 5 November 2026 the owner added 46 photographs to `src/assets/` and confirmed they are real KOMO photography approved for website use. Fourteen are now used in the concepts. Logo and Flow artwork are still missing, and the hero video is still optional.

## Photographs in use

| ID | Shot reference | File in `src/assets/` | Alt text (what the frame shows) | Used in | Status |
|---|---|---|---|---|---|
| `treatment-hero` | SG 12.1 P1 Treatment hero | `series/Relaxing Shampoo Basin Scalp Massage.png` | Therapist rinsing a reclining customer’s lathered hair at the basin. | C1 hero, C2 step 4 | Approved by owner |
| `treatment-wide` | SG 12.1 P1 Treatment hero (wide view) | `series/Calming Scalp Massage at KOMO.png` | Therapist washing a reclining customer’s hair at the basin in a timber-lined treatment room. | C3 hero poster | Approved by owner |
| `health-consultation` | SG 12.1 P1 Health | `series/Serene KOMO Spa Consultation.png` | A KOMO therapist and a customer talking together in a quiet seating area. | C1 pillars and scalp care, C2 step 2, C3 pillars | Approved by owner |
| `joy-massage` | SG 12.1 P1 Joy | `series/KOMO Spa Head Massage Relaxation.png` | Customer resting with an eye pillow while a therapist massages her scalp. | C1 pillars and scalp spa, C3 pillars | Approved by owner |
| `beauty-mirror` | SG 12.1 P1 Beauty | `series/Calm KOMO Spa Blow-Dry Scene.png` | Therapist drying a customer’s hair beside an illuminated round mirror. | C1 pillars, C2 step 5, C3 pillars | Approved by owner |
| `vitality-departure` | SG 12.1 P1 Vitality | `series/Warm Spa Locker Moment.png` | Customer with her bag at the timber lockers beside a curved corridor. | C1 pillars, C3 pillars | Approved by owner |
| `arrival-signage` | SG 12.1 P1 Arrival | `series/Welcoming KOMO Wellness Reception.png` | A therapist welcoming a customer at the curved reception counter beneath the KOMO sign. | C2 step 1 | Approved by owner |
| `flow-architecture` | SG 12.1 P1 Flow architecture | `Warm Minimalist Salon Interior.png` | KOMO treatment area with cream chairs, round illuminated mirrors and pale timber counters. | C1 space, C2 hero, C3 space | Approved by owner |
| `entrance` | SG 12.1 P1 Arrival (wider view) | `Bright KOMO Scalp Care Clinic Storefront.png` | The KOMO storefront, with its sign above an open, light reception area. | C2 finding us | Approved by owner |
| `assessment-detail` | SG 12.1 P2 Treatment sequence | `series/Modern KOMO Scalp Consultation.png` | Therapist examining a seated customer’s scalp with a handheld camera, the image shown on a screen. | C2 step 3 | Approved by owner. Which services include assessment is still unconfirmed (D04) |
| `water-detail` | SG 11.2 Sensory detail | `series/Serene Salon Hair Wash.png` | Water from a hand shower running through a customer’s hair at the basin. | C1 experience, C3 sensory | Approved by owner |
| `linen-detail` | SG 11.2 Sensory detail | `Warm Modern Spa Shampoo Lounge.png` | Rolled towels on a lit timber shelf beside the basin loungers. | C3 sensory | Approved by owner |
| `hair-texture` | SG 11.2 Sensory detail | `series/Relaxing Head Massage in a Spa.png` | A therapist’s hand resting in a customer’s long hair during a head massage. | C1 hair care | Approved by owner |
| `therapist-portrait` | SG 12.1 P2 Therapist portrait | `series/Bright Salon Hair Wash Spa Moment.png` | A KOMO therapist in uniform washing a customer’s hair at the basin. | C3 first visit | Approved by owner |

Still to record for every photograph (SG 24): photographer or source, capture date, depicted service, release and usage rights in writing, approved crops and focal point. The `usageRights` field holds the owner's confirmation until then.

### How photographs are served

`src/lib/images.ts` imports only the originals listed in the table, so the other 32 files in `src/assets/` never reach the build. `ImageSlot.astro` and the Concept 3 hero poster render a `<picture>` with AVIF and WebP sources and a JPEG fallback at 480, 800, 1200 and the original width (1536 or 1024px), with intrinsic width and height to prevent layout shift. The hero loads eagerly with high priority; every other photo is lazy-loaded. The PNG masters are never served. Each record's `objectPosition` keeps the subject in frame when a slot crops.

To use a different photo: import it in `src/lib/images.ts`, then point the asset record in `src/data/records.ts` at its path. `npm test` fails if a record points at an unregistered or missing file, or at an asset without recorded approval.

### Photos not used, and why

- Coloured-light device scenes (`Blue-Lit…`, `Glowing Green…`, `KOMO Green-Light…`, `KOMO Red Light…`, `Calm KOMO Scalp Treatment`, `Scalp Wellness Treatment at KOMO`, `Relaxing KOMO Scalp Treatment`): device treatments are not in the supplied service information, so showing them would imply services and mechanisms that are not yet confirmed.
- Facial and skincare scenes (`Calm Clinical Spa Facial Treatment`, `Calm KOMO Skincare Consultation`): outside the scalp and hair offer.
- `Sage Green Salon Spa Interior.png` has the same framing as `Warm Minimalist Salon Interior.png` with different chair colours. Confirm which reflects the outlet today before either is published.
- Signage, displays and product shelves (`KOMO Integrative…`, `KOMO Scalp & Hair Wellness…`, arched displays, porthole, cabinet, vanity, wall display, cover): available for inner pages and the outlet section later. Displays carry product and claim wording that must be checked before use.
- `Wheelock Place Office Exterior.png`: available for a location page; the building and unit details are still unconfirmed (D05).

## Brand artwork

| Asset | Status | Handling |
|---|---|---|
| Official KOMO master logo (vector, light and reversed) | **Missing** | Header (upper left) and footer show a dashed "KOMO logo, official artwork required" placeholder. Not reconstructed from a typeface (SG 6.1). Replace the contents of `src/components/ui/LogoPlaceholder.astro`. |
| KOMO Flow master curve and variants | **Missing** | Omitted from all three concepts (SG 7, Rules 6). The C1 outlet image uses an architectural arch mask (SG 10.3), which is not the Flow motif. |
| Final branded fonts | Not selected | Georgia and the system sans stack are used, per SG 9.1. |
| Hero video | None supplied | Concept 3 hero shows the approved `treatment-wide` photograph as its poster. The video player switches on automatically once an approved file exists (see below). |

## Hero video (Concept 3)

Put the approved file at `public/video/komo-hero.mp4` (H.264). Optionally add `public/video/komo-hero.webm` (VP9) with the same name; it is served first when present. Then set `src: '/video/komo-hero.mp4'`, the dimensions and the approval fields on the `hero-video` record in `src/data/records.ts`.

Video goes in `public/` because Astro does not process video files. Photos, including the poster, stay in `src/assets/` and are registered in `src/lib/images.ts`.

Starting specification: silent, 10 to 20 seconds, seamless loop, 1920 x 1080 (or 1280 x 720), under about 5 MB, quiet and stable framing (SG 17). Keep the left third and the bottom calmer, because the text panel sits there. Check the top of the frame too: the logo sits there on a darkening scrim. If the footage is very light, test whether the olive logo on a light scrim reads better than the reversed logo.

Behaviour (tested on 2026-11-05 with a generated fixture clip, see `docs/qa.md`): poster first; video downloads only after the page has loaded; muted and hidden from assistive technology; visible Pause / Play button; does not start under reduced motion or data saving, though the visitor can still press Play.
