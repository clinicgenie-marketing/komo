/** 02 What brings you in? — copy from docs/content/KOMO_Homepage_Content.md. */
import { images, type ImageSlot } from "@/content/images";
import { sessions } from "@/content/sessions";

export const CONCERNS_HEADING = "What brings you in?";

/**
 * The heading's id. Section 01's scroll sequence reveals this element in the
 * hero's copy space, so it is the one and only Section 02 heading.
 */
export const CONCERNS_HEADING_ID = "concerns-heading";

const sessionName = (short: string) => sessions.find((session) => session.short === short)!.name;

export type MirrorAction = {
  label: string;
  /**
   * An explicit choice that leads into Section 03, which then scrolls into
   * view: the named sessions become its matches, or `null` keeps all four in
   * full colour (information-only path). Without it the action is a link;
   * only the homepage is being built, so links carry no destination yet.
   */
  matches?: string[] | null;
  href?: string;
};

export type Mirror = {
  id: string;
  label: string;
  body: string;
  actions: MirrorAction[];
  /**
   * The session whose photograph this mirror reflects, and where the
   * handover zoom lands (Section 02 → 03). The centre mirror is the default
   * path for a visitor who scrolls on without choosing.
   */
  reflects: string;
  /**
   * The reflection's own photograph, when it differs from the session's
   * (`focus` is its focal point, as CSS object-position). Without it the
   * mirror shows the session's photograph.
   */
  image?: ImageSlot;
  focus?: string;
  /** Decorative concern icon (the headline carries the meaning). */
  icon: string;
};

const icon = (file: string) => `/images/icons/concerns/${file}`;

// Storyboard references 02.2–02.4, in order. Only the sentences are shown.
export const mirrors: Mirror[] = [
  {
    id: "oily-roots",
    reflects: sessionName("Signature"),
    icon: icon("oily-roots.png"),
    label: "My roots feel oily, but my ends feel dry.",
    body: "Those are two different parts of your hair routine. Start with Signature Scalp Care for a scalp cleanse. If it’s your lengths that feel rough when you comb them, explore conditioning and hair care.",
    actions: [
      { label: "Explore Scalp Concerns", matches: [sessionName("Signature")] },
      { label: "Explore Hair Care" },
    ],
  },
  {
    id: "hair-in-brush",
    reflects: sessionName("Advanced"),
    icon: icon("hair-in-brush.png"),
    label: "I’m seeing more hair in my brush.",
    body: "You can look at the area that concerns you with a KOMO consultant and discuss how you care for your scalp. Finding the cause of hair loss calls for a medical assessment.",
    // Information only: leads to Section 03 with all four in full colour.
    actions: [{ label: "Read About Hair Fall and Thinning", matches: null }],
  },
  {
    id: "head-massage",
    reflects: sessionName("Waterfall"),
    icon: icon("head-massage.svg"),
    // Section 03's Waterfall card keeps the water photograph; this mirror
    // shows the head massage itself.
    image: images.basin.massage,
    focus: "45% 40%",
    label: "I’d like a head massage.",
    body: "Choose Waterfall for a rhythmic scalp massage, or explore Meridian if you enjoy focused pressure and gua sha.",
    actions: [
      {
        label: "Compare the Head Spas",
        matches: [sessionName("Waterfall"), sessionName("Meridian")],
      },
    ],
  },
];
