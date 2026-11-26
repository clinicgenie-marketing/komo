/**
 * 04 What happens on a first visit? — copy from
 * docs/content/KOMO_Homepage_Content.md. Photos from images.ts.
 *
 * One six-card timeline in two chapters: cards 01–03 at the mirror, 04–06 at
 * the basin. Only the homepage is being built, so the chapter links render
 * without a destination for now (`href` keeps the existing route, where one
 * exists; The Straits Times feature URL is not in the project).
 */
import { images, type ImageSlot } from "@/content/images";

export type VisitChapter = "mirror" | "basin";

export type VisitLink = { label: string; href: string | null; external?: boolean };

export type VisitPhoto = ImageSlot & {
  /** Step title, shown under the photograph. */
  caption: string;
  /** The step's description. */
  body: string;
  /** Links that belong to this step (e.g. the scalp imaging card). */
  links?: VisitLink[];
  chapter: VisitChapter;
};

export const FIRST_VISIT_HEADING = "What happens on a first visit?";

const SCALP_IMAGING_HREF = "/about/scalp-imaging/";
const STRAITS_TIMES_FEATURE_URL: string | null = null;

/** Chapter headings, centred above the carousel. */
export const chapters: Record<VisitChapter, { title: string }> = {
  mirror: { title: "At the mirror" },
  basin: { title: "At the basin" },
};

export const chapterOrder: VisitChapter[] = ["mirror", "basin"];

/**
 * The six cards, in order; the chapter changes between 03 and 04.
 *
 * DRAFT step copy: there is no approved per-step text, so each card carries
 * one sentence of its chapter's approved paragraph (content file, Section
 * 05), lightly split. Confirm or replace before publication.
 */
export const visitPhotos: VisitPhoto[] = [
  {
    ...images.mirror.parting,
    caption: "Parting",
    body: "Part your hair where you’ve noticed a change. It’s easier to show your consultant the spot than to find the right words for it.",
    chapter: "mirror",
  },
  {
    ...images.mirror.imaging,
    caption: "Imaging",
    body: "Scalp imaging gives you both a close view of that area.",
    links: [
      { label: "How Scalp Imaging Works", href: SCALP_IMAGING_HREF },
      {
        label: "Read The Straits Times Feature on the Orchard Scan",
        href: STRAITS_TIMES_FEATURE_URL,
        external: true,
      },
    ],
    chapter: "mirror",
  },
  {
    ...images.mirror.discussion,
    caption: "Discussion",
    body: "Look at that area together while you talk through cosmetic care.",
    chapter: "mirror",
  },
  {
    ...images.basin.basin,
    caption: "Basin",
    body: "For a scalp care visit, the conversation turns to cleansing and the product selected for your scalp.",
    chapter: "basin",
  },
  {
    ...images.basin.massage,
    caption: "Massage",
    body: "For Meridian, that means massage and gua sha.",
    chapter: "basin",
  },
  // The approved wide treatment still: the therapist's hands, with the
  // Scalp Oil Balancing Essence bottle on the left.
  {
    ...images.basin.treatment,
    caption: "Care",
    body: "If you have an ingredient in mind, this is a good moment to see the bottle.",
    chapter: "basin",
  },
];
