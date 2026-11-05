# Asset register

Status: 5 November 2026. No photography, logo or Flow artwork was supplied. Every image slot renders a labelled placeholder that reserves the final aspect ratio. No generated or stock imagery is used, so nothing on the page implies it documents real KOMO premises, staff, equipment or outcomes.

| ID | Shot reference | Subject | Planned alt text | Used in | Status |
|---|---|---|---|---|---|
| `treatment-hero` | SG 12.1 P1 Treatment hero | Treatment hero | Therapist's hands giving a scalp treatment to a reclining customer. | C1 hero, C2 step 4, C3 hero | Required |
| `health-consultation` | SG 12.1 P1 Health | Consultation | Therapist discussing a scalp assessment with a seated customer. | C1 pillars and scalp care, C2 step 2, C3 pillars | Required |
| `joy-massage` | SG 12.1 P1 Joy | Relaxed massage | Customer relaxing during a gentle scalp massage. | C1 pillars and scalp spa, C3 pillars | Required |
| `beauty-mirror` | SG 12.1 P1 Beauty | Mirror moment | Customer looking at their hair in an illuminated mirror after their appointment. | C1 pillars, C2 step 5, C3 pillars | Required |
| `vitality-departure` | SG 12.1 P1 Vitality | Departure | Customer walking out through the curved reception area. | C1 pillars, C3 pillars | Required |
| `arrival-signage` | SG 12.1 P1 Arrival | Arrival | Customer arriving at the KOMO reception counter beneath the signage. | C2 step 1 | Required |
| `flow-architecture` | SG 12.1 P1 Flow architecture | The outlet | The KOMO outlet at Wheelock Place, with a flowing ceiling light above curved cream walls. | C1 space (arch mask), C2 hero, C3 space | Required |
| `entrance` | SG 12.1 P1 Arrival (wider view) | Entrance | The entrance to KOMO at Wheelock Place, with its signage. | C2 finding us | Required |
| `assessment-detail` | SG 12.1 P2 Treatment sequence | Assessment | Therapist showing a customer the result of their scalp assessment. | C2 step 3 | Required if assessment is offered |
| `water-detail` | SG 11.2 Sensory detail | Water and lather | Warm water running through lathered hair at the basin. | C1 experience, C3 sensory | Required |
| `linen-detail` | SG 11.2 Sensory detail | Linen | Folded towels on a pale timber surface. | C3 sensory | Optional |
| `hair-texture` | SG 11.2 Sensory detail | Hair texture | Close view of natural hair texture after care. | C1 hair care | Required |
| `hero-video` | SG 17 Website video; SG 20.1 The ritual | Hero video | None (decorative; the hero text carries the meaning) | C3 hero (poster: `treatment-hero`) | Optional; poster required |
| `therapist-portrait` | SG 12.1 P2 Therapist portrait | Therapist | A KOMO therapist in uniform in the treatment area. | C3 first visit | Optional |

For every photograph, record photographer or source, date, depicted service, location, release and usage rights, approved crops and focal point (SG 24). Capture wide, medium and close views with safe crops for 16:9, 4:5, 1:1, 3:2 and 21:9 (the ratios used by the concepts).

## Brand artwork

| Asset | Status | Handling |
|---|---|---|
| Official KOMO master logo (vector, light and reversed) | **Missing** | Header (upper left) and footer show a dashed "KOMO logo, official artwork required" placeholder. Not reconstructed from a typeface (SG 6.1). Replace the contents of `src/components/ui/LogoPlaceholder.astro`. |
| KOMO Flow master curve and variants | **Missing** | Omitted from all three concepts (SG 7, Rules 6). The C1 outlet image uses an architectural arch mask (SG 10.3), which is not the Flow motif. |
| Final branded fonts | Not selected | Georgia and the system sans stack are used, per SG 9.1. |
| Hero video | None supplied | Concept 3 hero shows the poster placeholder. The video player switches on automatically once an approved file exists (see below). |

## Implementation when assets arrive

`ImageSlot.astro` already renders an approved asset as a sized `<img>` with `loading`, `decoding`, `fetchpriority` (hero only) and `sizes`. Before release, move approved originals into `src/assets/` and switch the component to Astro's `<Picture>` for AVIF/WebP responsive sources (SG 13.4, ARCH 9, Task.md T54).

## Hero video (Concept 3)

Put the approved file at `public/video/komo-hero.mp4` (H.264). Optionally add `public/video/komo-hero.webm` (VP9) with the same name; it is served first when present. Then set `src: '/video/komo-hero.mp4'`, the dimensions and the approval fields on the `hero-video` record in `src/data/records.ts`.

Video goes in `public/` because Astro does not process video files. Photos, including the poster, go in `src/assets/photography/`.

Starting specification: silent, 10 to 20 seconds, seamless loop, 1920 x 1080 (or 1280 x 720), under about 5 MB, quiet and stable framing (SG 17). Keep the left third and the bottom calmer, because the text panel sits there. Check the top of the frame too: the logo sits there on a darkening scrim. If the footage is very light, test whether the olive logo on a light scrim reads better than the reversed logo.

Behaviour (tested on 2026-11-05 with a generated fixture clip, see `docs/qa.md`): poster first; video downloads only after the page has loaded; muted and hidden from assistive technology; visible Pause / Play button; does not start under reduced motion or data saving, though the visitor can still press Play.
