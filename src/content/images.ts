/**
 * Homepage image slots, sections 02–07.
 *
 * `placeholder: true` marks Pexels stock (free to use under the Pexels licence,
 * https://www.pexels.com/license/) standing in until the approved KOMO
 * photography arrives. To swap a photo, replace the file or change `src`; every
 * section reads from here. KOMO's own images keep `placeholder: false`.
 * Section 08 portraits are intentionally absent: reviews use supplied,
 * attributable content only.
 */
export type ImageSlot = {
  src: string;
  alt: string;
  /** Pexels page for stock placeholders, for licence checks and replacement. */
  source?: string;
  placeholder: boolean;
};

const pexels = (file: string, id: number, alt: string): ImageSlot => ({
  src: `/images/placeholders/${file}.jpg`,
  alt,
  source: `https://www.pexels.com/photo/${id}/`,
  placeholder: true,
});

const komo = (file: string, alt: string): ImageSlot => ({
  src: `/images/${encodeURI(file)}`,
  alt,
  placeholder: false,
});

export const images = {
  // 02 Hero
  hero: {
    // Supplied photograph: water falling on a guest's scalp at the basin.
    first: {
      src: "/images/placeholders/hero-1.png",
      alt: "Water falls onto a guest's hair as she rests, eyes closed, at the basin",
      placeholder: false,
    },
    // MISSING ASSET: the same frame before the water falls (same camera,
    // framing and light; dry hair, no water sheet). When supplied, set it here
    // and Section 01 reveals the water over it on the first scroll. Until
    // then the sequence holds on `first`.
    dry: null as ImageSlot | null,
    // Supplied photograph: the closer frame, water on her hairline and
    // steam rising beside her.
    second: {
      src: "/images/placeholders/hero-2.png",
      alt: "A closer view of the guest at the basin as water runs through her hair and steam rises beside her",
      placeholder: false,
    },
  },

  // 03 Choose your session (Signature, Advanced, Waterfall, Meridian)
  sessions: {
    signature: komo(
      "Treatment Scalp Care.png",
      "A KOMO therapist misting a guest's scalp as she rests with her eyes closed",
    ),
    advanced: pexels(
      "session-advanced",
      28994390,
      "A dropper applying scalp essence along a parting",
    ),
    // Water meeting the scalp: the supplied hero photograph, cropped close.
    waterfall: komo(
      "placeholders/hero-1.png",
      "Water falls onto a guest's hairline as she rests at the basin",
    ),
    meridian: komo(
      "placeholders/meridian-hydro-restoring-scalp-spa.png",
      "A KOMO therapist working along a guest's scalp during the Meridian Hydro Restoring Scalp Spa",
    ),
  },

  // 05 Your first visit
  mirror: {
    parting: komo(
      "KOMO Scalp Consultation in Warm Spa Clinic.png",
      "A KOMO consultant holds a scalp camera to a guest's parting, the close-up shown on a screen beside them",
    ),
    imaging: komo(
      "KOMO Scalp Analysis Workstation.png",
      "KOMO's scalp analysis screen, showing a magnified scalp image beside its findings",
    ),
    discussion: komo(
      "Luxury KOMO Spa Consultation.png",
      "A KOMO consultant talking through notes with a guest",
    ),
  },
  basin: {
    basin: pexels("basin-basin", 3993449, "A guest's hair cleansed at the basin"),
    massage: komo(
      "Luxury KOMO Head Massage.png",
      "A KOMO therapist massages a guest's hairline as she rests under a KOMO eye pillow",
    ),
    care: pexels("basin-care", 3865570, "A rounded gua sha tool used with gentle pressure"),
    // Card 06 and the start of the bottle handover into Section 05.
    treatment: komo(
      "Treatment Scalp Care.png",
      "A KOMO therapist mists a guest's scalp with Scalp Balancing Essence as she rests",
    ),
  },

  // 06 A closer look at the bottle
  product: {
    bottle: pexels("product-bottle", 12563412, "An amber scalp essence bottle with a dropper"),
    // Transparent cut-outs, trimmed to their edges and resized to 900px
    // (sources: public/images/*-transparent.png).
    horseChestnut: komo("ingredients/chestnut.webp", "A horse chestnut seed in its opened shell"),
    avocado: komo("ingredients/avocado.webp", "A halved avocado with its stone"),
    olives: komo("ingredients/olives.webp", "Two green olives on a leafy sprig"),
    myrothamnus: komo("ingredients/myrothamnus.webp", "A sprig of Myrothamnus flabellifolia"),
  },

  // 09 Arrange your visit: background of the right half, under an 80% sage
  // veil (decorative there, so the section gives it empty alt text).
  arrange: {
    procedure: komo(
      "Treatment Scalp Care.png",
      "A KOMO therapist misting a guest's scalp as she rests with her eyes closed",
    ),
  },

  // 07 Visit KOMO
  outlets: {
    orchard: komo(
      "KOMO-landmark.png",
      "The KOMO Orchard storefront, with its lit sign above the reception desk",
    ),
    greatWorld: pexels("outlet-great-world", 11774389, "A softly lit treatment room"),
    hollandVillage: pexels(
      "outlet-holland-village",
      6899549,
      "A bright treatment room with a single bed",
    ),
  },
} as const;
