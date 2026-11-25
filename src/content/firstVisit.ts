/**
 * 05 What happens on a first visit? — copy from
 * docs/content/KOMO_Homepage_Content.md (Section 05). Photos from images.ts.
 */
import { images, type ImageSlot } from "@/content/images";

export type VisitSetting = "mirror" | "basin";

export type VisitLink = { label: string; href: string | null; external?: boolean };

export type VisitPhoto = ImageSlot & {
  /** Short step label shown on the photo (storyboard frames 08–09). */
  caption: string;
};

export const FIRST_VISIT_HEADING = "What happens on a first visit?";

// Destinations: "How Scalp Imaging Works" follows the footer's About › Scalp
// Imaging group (route unconfirmed). The Straits Times feature URL is not in
// the project, so that link stays hidden until it is supplied.
const SCALP_IMAGING_HREF = "/about/scalp-imaging/";
const STRAITS_TIMES_FEATURE_URL: string | null = null;

export const settings: Record<
  VisitSetting,
  { label: string; title: string; body: string; photos: VisitPhoto[]; links: VisitLink[] }
> = {
  mirror: {
    label: "Mirror",
    title: "At the mirror.",
    body: "Part your hair where you’ve noticed a change. It’s easier to show your consultant the spot than to find the right words for it. Scalp imaging gives you both a close view of that area while you talk through cosmetic care.",
    photos: [
      { ...images.mirror.parting, caption: "Parting" },
      { ...images.mirror.imaging, caption: "Imaging" },
      { ...images.mirror.discussion, caption: "Discussion" },
    ],
    links: [
      { label: "How Scalp Imaging Works", href: SCALP_IMAGING_HREF },
      {
        label: "Read The Straits Times Feature on the Orchard Scan",
        href: STRAITS_TIMES_FEATURE_URL,
        external: true,
      },
    ],
  },
  basin: {
    label: "Basin",
    title: "At the basin.",
    body: "For Meridian, that means massage and gua sha. For a scalp care visit, the conversation turns to cleansing and the product selected for your scalp. If you have an ingredient in mind, this is a good moment to see the bottle.",
    photos: [
      { ...images.basin.basin, caption: "Basin" },
      { ...images.basin.massage, caption: "Massage" },
      { ...images.basin.care, caption: "Care" },
    ],
    links: [],
  },
};

export const settingOrder: VisitSetting[] = ["mirror", "basin"];
