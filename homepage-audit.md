# KOMO homepage audit

**Date:** 26 November 2026
**Build checked:** local dev server (`http://localhost:8443`), working tree on `main`

## Summary

Nothing on the homepage is broken. Every feature tested works on desktop (1440 × 900) and on a phone (390 × 844), and the browser reported no errors. Several placeholders are still waiting for real details; the WhatsApp number must be set before launch.

## What was tested

### Build and loading

| Check | Result |
|---|---|
| Type check (`tsc --noEmit`) | Pass |
| Production build (`vite build`) | Pass (large-bundle warning, see below) |
| Browser console errors or warnings | None (only an expected reduced-motion notice) |
| Failed network requests | None |
| Broken images | None |
| Links to missing in-page sections | None |
| Duplicate element IDs | None |
| Sideways scrolling at 1440px and at 390px | None |

### Interactions

| Section | What was tested | Result |
|---|---|---|
| 02 What brings you in? | Scrolling stops at the cards until a visitor picks one | Works |
| 02 What brings you in? | Hovering a card opens it | Works |
| 02 → 03 | "Compare the Head Spas" zooms into Section 03 with Waterfall and Meridian in colour and the other two in greyscale; keyboard focus moves to the Section 03 heading | Works |
| 03 Choose your session | Hovering a panel opens it | Works |
| 03 → Arrange your visit | "Request Signature" jumps to the visit form with Signature selected and the message pre-filled | Works |
| First-visit carousel | Next and Previous step through the cards and the counter follows (01 → 03 → 02) | Works |
| Visit KOMO | Switching to another outlet updates the details and links | Works |
| Google reviews | Each dot brings its review to the front | Works |
| Header | The menu opens, and Escape closes it | Works |
| Reduced motion | All card text is visible and Section 02 still fills one screen | Works |

## Placeholders still to replace

### 1. WhatsApp number (needed before launch)

"WhatsApp Us", "Get a Single Visit Quote" and "Ask for a single-visit quote" open WhatsApp without a number (`https://wa.me/?text=…`). Visitors would have to pick a contact themselves, so the message would not reach KOMO.

**Fix:** set `ORCHARD_WHATSAPP` in `src/content/contact.ts` to the Orchard number in international format, digits only (for example `6512345678`).

### 2. Links to pages this build doesn't have

These point to pages that don't exist yet:

| Link | Destination |
|---|---|
| Privacy Policy | `/privacy-policy/` |
| Booking and Trial Terms | `/booking-and-trial-terms/` |
| Your First Visit (footer) | `/first-visit/` |
| Ask About Great World Opening Details | `/first-visit/?outlet=Great+World…` |
| Ask About Holland Village Opening Details | `/first-visit/?outlet=Holland+Village…` |

### 3. Links with no destination

These 14 items look like links but do nothing, and keyboard users can't reach them:

- Header menu: Services, Scalp & Hair Concerns, Your First Visit, About KOMO, Locations
- Section 02: Explore Hair Care
- Section 03: Explore Signature, Explore Advanced, Explore Waterfall, Explore Meridian
- Section 03: Read the Award Feature
- First visit: How Scalp Imaging Works, Read The Straits Times Feature on the Orchard Scan
- Reviews: Read more reviews on Google

### 4. Language switch

The 中文 button changes which button is highlighted, but the page has no Chinese text yet.

### 5. Reviews

The review cards still show preview text ("Preview reviewer A", "B" and "C") in place of approved Google reviews.

## Other notes

- **Bundle size:** the build warns that the main script is large (662 KB, or 223 KB compressed). It is not broken, but splitting it would make the first load faster.
- **Short screens:** on screens about 720px tall, the Section 02 oily-roots card grows slightly when opened (to fit its copy at full text size) instead of cutting the text off. The section still fills one screen.
