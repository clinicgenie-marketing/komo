/**
 * 06 A closer look at the bottle — copy from
 * docs/content/KOMO_Homepage_Content.md (Section 06).
 */
import { images } from "@/content/images";

export const product = {
  heading: "A closer look at the bottle",
  /** Revealed left, right, left (storyboard frame 10). */
  nameLines: ["Scalp Oil", "Balancing", "Essence"] as const,
  fullName: "Scalp Oil Balancing Essence",
  body: "Horse chestnut seed extract appears alongside niacinamide and menthol on KOMO’s Scalp Oil Balancing Essence label. It’s a leave-in essence applied directly to the scalp. If you’re checking an ingredient, the label on the exact bottle is the place to start.",
  // No product or ingredient routes exist in the project yet. These follow the
  // footer's "Products & Ingredients" item and are unconfirmed.
  links: [
    { label: "Explore Products and Ingredients", href: "/products-and-ingredients/" },
    { label: "Check an Ingredient", href: "/products-and-ingredients/#check-an-ingredient" },
  ],
  /**
   * Ingredient cut-outs that slide out from behind the bottle (frame 11), in
   * reveal order. The horse chestnut leads, as the copy names it.
   *   side     which edge of the bottle's body it emerges from
   *   top      resting height of its centre, as a fraction of the bottle
   *   size     width as a fraction of the body's width
   *   overlap  share of its width left behind the bottle once revealed
   *   rotate   tilt (degrees) it turns to while emerging
   */
  ingredients: [
    {
      key: "chestnut",
      image: images.product.horseChestnut,
      side: 1,
      top: 0.64,
      size: 0.86,
      overlap: 0.18,
      rotate: 0,
    },
    {
      key: "avocado",
      image: images.product.avocado,
      side: -1,
      top: 0.72,
      size: 0.82,
      overlap: 0.2,
      rotate: -8,
    },
    {
      key: "olives",
      image: images.product.olives,
      side: 1,
      top: 0.38,
      size: 0.66,
      overlap: 0.22,
      rotate: 6,
    },
    {
      key: "myrothamnus",
      image: images.product.myrothamnus,
      side: -1,
      top: 0.46,
      size: 0.3,
      overlap: 0.3,
      rotate: -14,
    },
  ] as const,
};

/**
 * The bottle. Until an approved transparent cut-out of the Scalp Oil Balancing
 * Essence bottle is supplied, a schematic placeholder (as drawn in storyboard
 * frames 10–12) is used. To switch, set:
 *
 *   { kind: "image", src: "/images/product/scalp-oil-balancing-essence.png",
 *     label: { x, y, width, height } }
 *
 * where `label` is the front label's box as fractions of the visible bottle
 * (after transparent padding is trimmed). The close-up zooms to that box, so
 * the PNG needs enough pixels for the label to stay sharp at ~2.5× its normal
 * display size on a 2× screen (roughly 2400px tall for a full bottle).
 */
export type BottleAsset =
  | { kind: "placeholder" }
  | {
      kind: "image";
      src: string;
      /** Width ÷ height of the visible bottle. */
      ratio: number;
      /** The body's left edge and width as fractions of the bottle's width
       *  (the horse chestnut hides behind the body in frame 10). */
      bodyX: { x: number; width: number };
      label: { x: number; y: number; width: number; height: number };
    };

// Supplied cut-out ("KOMO Scalp Soothing Essence Bottle_transparent.png"),
// trimmed to the bottle's edges (571×1379). The label box frames the KOMO
// wordmark down to "100ML".
export const bottle: BottleAsset = {
  kind: "image",
  src: "/images/product/scalp-soothing-essence.png",
  ratio: 571 / 1379,
  bodyX: { x: 117 / 571, width: 453 / 571 },
  label: { x: 130 / 571, y: 600 / 1379, width: 436 / 571, height: 665 / 1379 },
};

/** Label box of the placeholder bottle, as fractions of its 200×520 viewBox. */
export const PLACEHOLDER_LABEL = { x: 18 / 200, y: 190 / 520, width: 164 / 200, height: 190 / 520 };
