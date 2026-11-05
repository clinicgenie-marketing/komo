/**
 * Shared content records for every homepage concept.
 *
 * Status key (Architecture.md 4):
 *  - verificationStatus 'source-only': taken from a supplied document; not confirmed as true or current.
 *  - publishStatus 'draft': wording not yet approved by the owner.
 * Nothing here has been verified by KOMO. See docs/content-register.md.
 *
 * Source abbreviations used in sourceRef:
 *  HC = KOMO_Singapore_Homepage_Content.md (owner-supplied homepage copy, 5 Nov 2026;
 *       its editorial notes ask for contact details, inclusions and scalp-analysis
 *       availability to be confirmed before publishing)
 *  SG = KOMO_Botanical_Sanctuary_Style_Guide.md (section number follows)
 *  ARCH = Architecture.md
 */
import { z } from 'astro/zod';
import {
  asset, contentItem, copyBlock, destination, faq, location, pillar, treatment, visitStep,
} from '../lib/schema.ts';

const draft = (id: string, sourceRef: string) => ({
  id,
  sourceRef,
  verificationStatus: 'source-only' as const,
  verifiedBy: null,
  verifiedAt: null,
  publishStatus: 'draft' as const,
});

/* ------------------------------------------------------------------ copy */

export const copy = z.record(z.string(), copyBlock).parse({
  heroEyebrow: { ...draft('copy-hero-eyebrow', 'HC Hero'), text: 'Scalp wellness & head spa in Singapore' },
  heroTitle: { ...draft('copy-hero-title', 'HC Hero'), text: 'Understand your scalp. Find your kind of care.' },
  heroSupport: {
    ...draft('copy-hero-support', 'HC Hero'),
    text: 'Personalised scalp care, botanical formulations and relaxing head spa rituals, brought together at KOMO Wellness, Wheelock Place.',
  },
  heroSecondary: {
    ...draft('copy-hero-secondary', 'HC Hero'),
    text: 'Discover a considered approach to caring for your scalp and hair, with time to settle in and unwind.',
  },
  introTitle: { ...draft('copy-intro-title', 'HC Thoughtful care'), text: 'Thoughtful care, from the roots' },
  introLead: { ...draft('copy-intro-lead', 'HC Thoughtful care'), text: 'Your scalp deserves care that considers the whole picture.' },
  introBody: {
    ...draft('copy-intro-body', 'HC Thoughtful care'),
    text: 'At KOMO, we bring together AI-powered scalp analysis, herbal science and attentive service to understand your needs and shape your care.',
  },
  introBody2: {
    ...draft('copy-intro-body-2', 'HC Thoughtful care'),
    text: 'Whether you’re noticing changes in your scalp, caring for dry hair or making time for a relaxing head spa, we’ll help you find a place to begin.',
  },
  brandTagline: { ...draft('copy-brand-tagline', 'HC Thoughtful care and Footer; supplied wall sign imagery'), text: 'Integrative care for your scalp & hair' },
  brandDescriptor: { ...draft('copy-brand-descriptor', 'Supplied brand imagery: folder cover and signage'), text: 'Scalp & Hair Wellness' },
  careTitle: { ...draft('copy-care-title', 'HC Find your kind of care'), text: 'Find your kind of care' },
  careIntro: {
    ...draft('copy-care-intro', 'HC Find your kind of care'),
    text: 'A fresher-feeling scalp. Softer hair. A little time to yourself. Explore care that fits what you need.',
  },
  scienceTitle: { ...draft('copy-science-title', 'HC Science & Refinement'), text: 'Science & Refinement, in every visit' },
  scienceIntro: {
    ...draft('copy-science-intro', 'HC Science & Refinement'),
    text: 'Understanding your scalp is one part of the experience. How you feel throughout your visit matters too.',
  },
  concernsTitle: { ...draft('copy-concerns-title', 'HC What have you noticed'), text: 'What have you noticed about your scalp and hair?' },
  concernsIntro: {
    ...draft('copy-concerns-intro', 'HC What have you noticed'),
    text: 'Perhaps your scalp feels oily soon after washing. Your hair feels drier than usual. Or you’ve noticed more flakes or shedding.',
  },
  concernsBody: {
    ...draft('copy-concerns-body', 'HC What have you noticed'),
    text: 'Tell us what’s changed and what you’d like from your visit. Our team can help you understand the available care options.',
  },
  concernsSpa: {
    ...draft('copy-concerns-spa', 'HC What have you noticed'),
    text: 'You’re also welcome to visit simply for a relaxing head spa experience.',
  },
  favouritesTitle: { ...draft('copy-favourites-title', 'HC Explore KOMO favourites'), text: 'Explore KOMO favourites' },
  visitTitle: { ...draft('copy-visit-title', 'HC Your first KOMO visit'), text: 'Your first KOMO visit' },
  visitIntro: {
    ...draft('copy-visit-intro', 'HC Your first KOMO visit'),
    text: 'You don’t need to have everything figured out before you arrive. We’ll guide you through the experience.',
  },
  homeCareTitle: { ...draft('copy-home-care-title', 'HC Care that continues'), text: 'Care that continues with you' },
  homeCareLead: {
    ...draft('copy-home-care-lead', 'HC Care that continues'),
    text: 'Your scalp’s needs can change with your routine. Your care can change with them.',
  },
  homeCareBody: {
    ...draft('copy-home-care-body', 'HC Care that continues'),
    text: 'Our team can recommend products to complement your treatment and help you build a manageable home-care routine. At future visits, we can review your needs and adjust your care recommendations.',
  },
  spaceTitle: { ...draft('copy-space-title', 'HC Location'), text: 'A little space to slow down, on Orchard Road' },
  spaceBody: {
    ...draft('copy-space-body', 'HC Location'),
    text: 'Step into KOMO at Wheelock Place for personalised scalp and hair care in a warm, considered setting.',
  },
  spaceBody2: {
    ...draft('copy-space-body-2', 'HC Location'),
    text: 'Make room for a visit during your week or take a little longer to unwind at the weekend.',
  },
  faqTitle: { ...draft('copy-faq-title', 'HC Before you visit'), text: 'Before you visit' },
  closeTitle: { ...draft('copy-close-title', 'HC Make room for care'), text: 'Make room for care' },
  closeBody: {
    ...draft('copy-close-body', 'HC Make room for care'),
    text: 'Get to know your scalp. Find a treatment that fits. Enjoy a little time for yourself.',
  },
  boundary: {
    ...draft('copy-boundary', 'SG 1.5 brand boundaries'),
    text: 'KOMO provides scalp and hair wellness care in a spa setting. Our services do not diagnose or treat medical conditions.',
  },
  requestNote: {
    ...draft('copy-request-note', 'SG 16.2, Rules 5'),
    text: 'Sending a request does not confirm a booking. Your appointment is only confirmed when KOMO confirms it with you.',
  },
});

/** Science & Refinement, in every visit (HC). */
export const scienceItems = z.array(contentItem).parse([
  {
    ...draft('science-understanding', 'HC Science & Refinement; SG 1.5 (describe AI-assisted assessment by verified capability)'),
    title: 'A closer understanding',
    text: ['AI-powered scalp imaging gives our team a closer view of your scalp and hair. We explain what we see and use those insights to inform your care recommendations.'],
    assetId: 'assessment-detail',
  },
  {
    ...draft('science-herbal', 'HC Science & Refinement; SG 1.5 (botanical origin is not proof of safety or effect)'),
    title: 'Herbal science',
    text: ['Botanical ingredients and formulation research underpin KOMO’s scalp and hair care range, with products selected to complement your treatment.'],
    assetId: 'product-display',
  },
  {
    ...draft('science-details', 'HC Science & Refinement'),
    title: 'Care in the details',
    text: ['A considered service process brings consistency to each visit, with attention to your comfort, preferences and personal pace.'],
    assetId: 'linen-detail',
  },
]);

/** What have you noticed? (HC). Shown as a list; they are prompts, not services. */
export const concerns = [
  'Oiliness and build-up',
  'Dryness and sensitivity',
  'Flakes and scalp discomfort',
  'Hair thinning and shedding',
  'Dry or damaged-feeling hair',
] as const;

/* ------------------------------------------------------------ treatments */

/*
 * One record per care category, carrying its featured treatment (HC Find your
 * kind of care and Explore KOMO favourites). Names are the owner's treatment
 * names; durations, inclusions and prices are still unknown (D04).
 */
export const treatments = z.array(treatment).parse([
  {
    ...draft('treatment-scalp-care', 'HC Find your kind of care; HC Explore KOMO favourites'),
    slug: 'scalp-care',
    name: 'Signature Scalp Care',
    category: 'Scalp care',
    categorySummary: 'Focused care for concerns such as excess oil, dryness and build-up, with treatment options selected around your scalp’s needs.',
    tagline: 'A fresh start for your scalp',
    summary: 'Focused cleansing and care, with options for oiliness, dryness, flakes and scalp comfort. Personalised around what your scalp needs.',
    includesAssessment: null,
    experienceSteps: [],
    inclusions: [],
    durationMinutes: null,
    price: null,
    heroAssetId: 'health-consultation',
    relatedTreatmentIds: ['treatment-head-spa'],
    appointmentDestinationId: 'appointment',
  },
  {
    ...draft('treatment-head-spa', 'HC Find your kind of care; HC Explore KOMO favourites'),
    slug: 'head-spa',
    name: 'Aromatic Waterfall Relaxing Scalp Spa',
    category: 'Head spa',
    categorySummary: 'Settle into flowing water, aromatic care and gentle scalp massage. A relaxing experience with attention to your scalp and hair.',
    tagline: 'Let the day slow down',
    summary: 'Flowing water, aromatic care and gentle scalp massage come together in a soothing head spa experience. Settle in and enjoy a little uninterrupted time.',
    includesAssessment: null,
    experienceSteps: [],
    inclusions: [],
    durationMinutes: null,
    price: null,
    heroAssetId: 'water-detail',
    relatedTreatmentIds: ['treatment-scalp-care'],
    appointmentDestinationId: 'appointment',
  },
  {
    ...draft('treatment-hair-care', 'HC Find your kind of care; HC Explore KOMO favourites'),
    slug: 'hair-care',
    name: 'Moisturising Cuticle Hair Care',
    category: 'Hair care',
    categorySummary: 'Conditioning treatments for hair that feels dry, rough or difficult to manage, with a focus on moisture, softness and shine.',
    tagline: 'A little more care for thirsty hair',
    summary: 'A conditioning treatment designed to replenish moisture and improve softness, smoothness and shine in dry, rough-feeling hair.',
    includesAssessment: null,
    experienceSteps: [],
    inclusions: [],
    durationMinutes: null,
    price: null,
    heroAssetId: 'hair-texture',
    relatedTreatmentIds: ['treatment-head-spa'],
    appointmentDestinationId: 'appointment',
  },
]);

/* ---------------------------------------------------------------- outlet */

export const outlet = location.parse({
  ...draft('location-wheelock-place', 'HC Location and Footer (address); SG 5 outlet photograph description'),
  kind: 'customer-outlet',
  name: 'KOMO Wellness Singapore',
  address: { building: 'Wheelock Place', street: '501 Orchard Road', unit: '#03-03A', postalCode: '238880', city: 'Singapore' },
  phone: '+65 6224 5497',
  whatsapp: '+65 8087 7376',
  email: 'info_sg@komowellness.com',
  hours: null,
  mapUrl: null,
  description: 'A light, contemporary space with cream walls, pale timber and broad curves, softly lit by a flowing ceiling light.',
  features: [
    'A curved reception counter that welcomes you in',
    'A flowing ceiling light above cream walls and pale timber',
    'Arched openings that lead into the treatment area',
    'Illuminated mirrors and touches of greenery',
  ],
});

/* --------------------------------------------------------- destinations */

/*
 * Telephone, WhatsApp and email come from the owner's homepage content, but its
 * editorial notes ask for them to be confirmed, so they stay unverified: shown
 * as text marked "to be confirmed", never as live links (Rules 7, 8).
 */
export const destinations = z.array(destination).parse([
  {
    ...draft('appointment', 'ARCH 6 baseline external handoff; provider not supplied (Task.md D07)'),
    verificationStatus: 'pending',
    kind: 'booking-provider',
    label: 'Request an appointment',
    display: null,
    url: null,
    opensNewTab: false,
  },
  {
    ...draft('whatsapp', 'HC Footer (WhatsApp); to be confirmed per HC editorial notes'),
    kind: 'whatsapp',
    label: 'WhatsApp',
    display: '+65 8087 7376',
    url: 'https://wa.me/6580877376',
    opensNewTab: true,
  },
  {
    ...draft('phone', 'HC Footer (Call); to be confirmed per HC editorial notes'),
    kind: 'phone',
    label: 'Call',
    display: '+65 6224 5497',
    url: 'tel:+6562245497',
    opensNewTab: false,
  },
  {
    ...draft('email', 'HC Footer (Email); to be confirmed per HC editorial notes'),
    kind: 'email',
    label: 'Email',
    display: 'info_sg@komowellness.com',
    url: 'mailto:info_sg@komowellness.com',
    opensNewTab: false,
  },
  {
    ...draft('directions', 'HC Location (Get directions); map link not supplied (Task.md D05)'),
    verificationStatus: 'pending',
    kind: 'map',
    label: 'Get directions',
    display: null,
    url: null,
    opensNewTab: false,
  },
]);

/* --------------------------------------------------------------- pillars */

export const pillars = z.array(pillar).parse([
  {
    ...draft('pillar-health', 'SG 4 four pillars table'),
    name: 'Health',
    meaning: 'Understanding and caring for the scalp',
    description: 'Care that begins with understanding your scalp.',
    assetId: 'health-consultation',
    visitMoment: 'Conversation and assessment',
  },
  {
    ...draft('pillar-joy', 'SG 4 four pillars table'),
    name: 'Joy',
    meaning: 'Enjoying time that feels your own',
    description: 'A little time to settle, unwind and enjoy.',
    assetId: 'joy-massage',
    visitMoment: 'Treatment',
  },
  {
    ...draft('pillar-beauty', 'SG 4 four pillars table'),
    name: 'Beauty',
    meaning: 'Personal comfort and confidence',
    description: 'Care for your hair. Confidence in yourself.',
    assetId: 'beauty-mirror',
    visitMoment: 'Finish',
  },
  {
    ...draft('pillar-vitality', 'SG 4 four pillars table'),
    name: 'Vitality',
    meaning: 'A refreshed feeling associated with the visit',
    description: 'A restorative pause before returning to your day.',
    assetId: 'vitality-departure',
    visitMoment: 'Leaving',
  },
]);

/* ----------------------------------------------------------- first visit */

export const visitSteps = z.array(visitStep).parse([
  {
    ...draft('step-arrive', 'HC Your first KOMO visit'),
    order: 1,
    title: 'Arrive and settle in',
    short: 'Meet the team and share what you’ve noticed.',
    detail: 'Meet the team and share what you’ve noticed about your scalp, hair and everyday routine.',
    conditional: false,
    conditionNote: null,
    assetId: 'arrival-signage',
  },
  {
    ...draft('step-understand', 'HC Your first KOMO visit; scalp-analysis availability to be confirmed per HC editorial notes'),
    order: 2,
    title: 'Understand your scalp',
    short: 'Review your scalp analysis with a consultant.',
    detail: 'Review your scalp analysis with a consultant, ask questions and explore the care options available to you.',
    conditional: false,
    conditionNote: null,
    assetId: 'assessment-detail',
  },
  {
    ...draft('step-treatment', 'HC Your first KOMO visit'),
    order: 3,
    title: 'Enjoy your treatment',
    short: 'Care shaped around your needs.',
    detail: 'Settle into your selected treatment, with care shaped around your needs and attention to your comfort.',
    conditional: false,
    conditionNote: null,
    assetId: 'treatment-hero',
  },
  {
    ...draft('step-forward', 'HC Your first KOMO visit'),
    order: 4,
    title: 'Take your care forward',
    short: 'Home care guidance and next steps.',
    detail: 'Receive guidance on suitable home care and discuss any recommended next steps.',
    conditional: false,
    conditionNote: null,
    assetId: 'product-display',
  },
]);

/* ------------------------------------------------------------------ FAQs */

export const faqs = z.array(faq.extend({ pendingFact: z.string().nullable() })).parse([
  {
    ...draft('faq-choose', 'HC Before you visit'),
    question: 'How do I choose a treatment?',
    answer: ['Start with what you’d like from your visit, whether that’s focused scalp care, conditioning for your hair or a relaxing head spa. If you’re unsure, speak with our team before booking.'],
    pendingFact: null,
  },
  {
    ...draft('faq-analysis', 'HC Before you visit; scalp-analysis availability to be confirmed per HC editorial notes'),
    question: 'What happens during the scalp analysis?',
    answer: ['Scalp imaging gives our team a closer view of your scalp and hair. A consultant explains the observations and discusses how they inform your care options.'],
    pendingFact: 'Which treatments include a scalp analysis is to be confirmed',
  },
  {
    ...draft('faq-no-concern', 'HC Before you visit'),
    question: 'Can I visit if I don’t have a particular scalp concern?',
    answer: ['Yes. You can explore our head spa treatments simply as a way to enjoy scalp and hair care while taking time to relax.'],
    pendingFact: null,
  },
  {
    ...draft('faq-time', 'HC Before you visit; Task.md D04'),
    question: 'How much time should I allow?',
    answer: ['Appointment time depends on your selected treatment. Ask our team to confirm the total duration, including consultation and hair finishing, when booking.'],
    pendingFact: 'Treatment durations to be confirmed by KOMO',
  },
  {
    ...draft('faq-sensitive', 'HC Before you visit'),
    question: 'What if I have a sensitive scalp or product allergies?',
    answer: ['Let our team know before your appointment so we can discuss the products and treatment steps with you.'],
    pendingFact: null,
  },
  {
    // Not in the supplied content. Kept from SG 1.5 because the page invites visitors
    // to mention thinning and shedding; flagged for the owner in docs/content-register.md.
    ...draft('faq-medical', 'SG 1.5 brand boundaries (added; not in HC)'),
    question: 'Is KOMO a medical clinic?',
    answer: [
      'No. KOMO provides scalp and hair wellness care in a spa setting. Our services do not diagnose or treat medical conditions.',
      'If you have a medical concern about your scalp or hair, please speak with a doctor.',
    ],
    pendingFact: null,
  },
]);

/* ---------------------------------------------------------------- assets */

/*
 * Image files live in src/assets/. Every photograph below is a supplied concept
 * image (kind 'concept'): it sets the art direction but has not been confirmed
 * as documenting KOMO's actual premises, staff, equipment or results, and its
 * usage rights are unrecorded. Preview builds show it; the production guard in
 * ImageSlot blocks it until the record is verified and approved (SG 13.2, 24).
 */
const shot = (
  id: string,
  shotRef: string,
  subject: string,
  brief: string,
  alt: string,
  focalPoint = 'centre',
  src: string | null = null,
) => ({
  ...draft(id, `SG ${shotRef}`),
  verificationStatus: 'pending' as const,
  src,
  width: null,
  height: null,
  alt,
  decorative: false,
  shotRef,
  brief,
  subject,
  kind: src ? ('concept' as const) : ('documentary' as const),
  usageRights: null,
  focalPoint,
});

const P = 'photography/';

export const assets = z.array(asset).parse([
  shot('treatment-hero', '12.1 P1 Treatment hero', 'Treatment hero',
    'Reclining customer with neck supported, therapist’s hands at the scalp, real KOMO equipment. Leave negative space for text.',
    'Therapist rinsing a reclining customer’s lathered hair at the basin.', '45% 50%', `${P}komo_treatment_basin-rinse_3x2.webp`),
  shot('treatment-basin', '12.1 P1 Treatment hero (wide)', 'Treatment at the basin',
    'Wider view of a therapist in KOMO uniform at the basin, with KOMO products in frame.',
    'A KOMO therapist washing a reclining customer’s hair at the basin, beside a trolley of KOMO products.', '60% 40%', `${P}komo_treatment_basin-therapist_3x2.webp`),
  shot('health-consultation', '12.1 P1 Health', 'Consultation',
    'Therapist and customer seated together, discussing a scalp assessment. Listening, not selling.',
    'A KOMO therapist and a customer talking together in a quiet seating area.', '50% 45%', `${P}komo_health_consultation_3x2.webp`),
  shot('joy-massage', '12.1 P1 Joy', 'Relaxed massage',
    'Customer relaxed during a gentle scalp massage. Calm expression, supported posture.',
    'Customer resting with an eye pillow while a therapist massages her scalp.', '50% 50%', `${P}komo_joy_scalp-massage_3x2.webp`),
  shot('beauty-mirror', '12.1 P1 Beauty', 'Mirror moment',
    'Natural reflection in the illuminated mirror after care. Believable hair texture, no retouched outcome.',
    'Therapist drying a customer’s hair beside an illuminated round mirror.', '50% 45%', `${P}komo_beauty_mirror_2x3.webp`),
  shot('vitality-departure', '12.1 P1 Vitality', 'Departure',
    'Customer leaving with relaxed posture and natural movement through the curved space.',
    'Customer with her bag at the timber lockers beside a curved corridor.', '55% 45%', `${P}komo_vitality_departure_2x3.webp`),
  shot('arrival-signage', '12.1 P1 Arrival', 'Arrival',
    'Customer arriving beneath the official KOMO signage at the curved reception counter.',
    'A therapist welcoming a customer at the curved reception counter beneath the KOMO sign.', '55% 45%', `${P}komo_arrival_reception_3x2.webp`),
  shot('flow-architecture', '12.1 P1 Flow architecture', 'The outlet',
    'Wide view of the flowing ceiling light, curved walls, cream surfaces and pale timber. No people needed.',
    'KOMO treatment area with cream chairs, round illuminated mirrors and pale timber counters.', '50% 55%', `${P}komo_space_treatment-area_3x2.webp`),
  shot('assessment-detail', '12.1 P2 Treatment sequence', 'Assessment',
    'Therapist showing the customer what the assessment looks at. Screen content must be real and legible.',
    'Therapist examining a seated customer’s scalp with a handheld camera, the image shown on a screen.', '45% 50%', `${P}komo_health_assessment_3x2.webp`),
  shot('water-detail', '11.2 Sensory detail', 'Water and lather',
    'Close view of warm water and lather at the basin. Hands in frame, no face.',
    'Water from a hand shower running through a customer’s hair at the basin.', '55% 55%', `${P}komo_sensory_water_3x2.webp`),
  shot('linen-detail', '11.2 Sensory detail', 'Linen',
    'Folded towels and linen on pale timber, soft directional light.',
    'Rolled towels on a lit timber shelf beside the basin loungers.', '30% 40%', `${P}komo_sensory_linen_3x2.webp`),
  shot('hair-texture', '11.2 Sensory detail', 'Hair texture',
    'Natural hair texture after care, close but believable. No added shine or density.',
    'A therapist’s hand resting in a customer’s long hair during a head massage.', '45% 50%', `${P}komo_beauty_hair-touch_3x2.webp`),
  shot('entrance', '12.1 P1 Arrival (wider view)', 'Entrance',
    'The KOMO entrance at Wheelock Place as a first-time visitor sees it, with the official signage legible.',
    'The KOMO storefront, with its sign above an open, light reception area.', '50% 45%', `${P}komo_arrival_storefront_3x2.webp`),
  shot('therapist-portrait', '12.1 P2 Therapist portrait', 'Therapist',
    'Approachable therapist in the actual KOMO uniform, in the treatment area.',
    'A KOMO therapist in uniform washing a customer’s hair at the basin.', '50% 35%', `${P}komo_people_therapist_2x3.webp`),

  /* Brand and interior imagery supplied with the repository (src/assets/). */
  shot('brand-signage', '5 Architecture; 6 Identity (signage)', 'KOMO signage',
    'The illuminated KOMO wall sign with its descriptor.',
    'The illuminated KOMO sign on a warm wall, reading Integrative care for your scalp and hair.', '50% 50%', 'KOMO Integrative Scalp & Hair Care.png'),
  shot('brand-cover', '21 Packaging and physical applications', 'Brand folder',
    'Deep green KOMO folder with the gold wordmark, on a pale timber surface.',
    'A deep green KOMO Scalp and Hair Wellness folder with a gold wordmark.', '55% 50%', 'KOMO Scalp & Hair Wellness Cover.png'),
  shot('arch-display', '5 Architecture (arched openings)', 'Arched display',
    'The backlit timber arch with KOMO products on its shelves.',
    'A backlit pale timber arch with shelves of KOMO products and a small plant.', '40% 40%', 'KOMO Hair Wellness Display in a Spa Setting.png'),
  shot('porthole-display', '5 Architecture (arched openings)', 'Porthole view',
    'The arched display seen through a round opening in a warm wall.',
    'The lit timber arch display seen through a round opening in the wall.', '50% 50%', 'Warm Arched KOMO Display Through Porthole.png'),
  shot('wall-display', '14 Graphics; 4 Pillars', 'Brand wall',
    'The botanical KOMO wall display with its service, product and science panels.',
    'A KOMO wall display of leaf photographs and panels about scalp wellness, service and product.', '50% 50%', 'KOMO Scalp Wellness Wall Display.png'),
  shot('consultation-room', '12.1 P1 Health (setting)', 'Consultation room',
    'The consultation room with its oval timber table and arched display.',
    'A consultation room with an oval timber table, a backlit arch display and a scalp care poster.', '55% 50%', 'Modern KOMO Spa Consultation Room.png'),
  shot('treatment-area-sage', '12.1 P1 Flow architecture', 'Treatment area',
    'Sage treatment chairs facing round illuminated mirrors.',
    'Sage green treatment chairs facing round illuminated mirrors along a timber counter.', '50% 55%', 'Sage Green Salon Spa Interior.png'),
  shot('oak-cabinet', '5 Architecture (pale timber)', 'Oak joinery',
    'Symmetrical oak cabinetry with a warmly lit countertop.',
    'Pale oak cabinets with a warmly lit countertop holding flowers and hair tools.', '50% 55%', 'Symmetrical Oak Cabinet with Spa Countertop.png'),
  shot('vanity', '5 Architecture (illuminated mirror)', 'Vanity',
    'A round illuminated mirror above a timber vanity and cream chair.',
    'A round illuminated mirror above a pale timber vanity, with a cream upholstered chair.', '50% 40%', 'Warm Minimalist Beauty Vanity.png'),
  shot('product-display', '12.1 P2 Product still life', 'Product shelves',
    'KOMO product bottles on timber shelves with a scalp care guide.',
    'KOMO shampoo bottles on pale timber shelves beside a scalp condition guide and white flowers.', '50% 40%', 'KOMO Scalp & Hair Wellness Display.png'),
]);

/**
 * Hero video (style guide 17 Website video; 20.1 The ritual). Decorative ambience:
 * all meaning is in the hero text, so the video has no alt text and no sound.
 * Place the approved file at public/video/komo-hero.mp4 and set src to '/video/komo-hero.mp4'.
 */
assets.push(asset.parse({
  ...shot('hero-video', '17 Website video; 20.1 The ritual', 'Hero video',
    'Silent 10 to 20 second loop: warm water or a precise treatment action, attentive hands, then a wider view of the curved space. Quiet, stable framing.',
    ''),
  decorative: true,
  mediaType: 'video',
}));

export function getAsset(id: string) {
  const found = assets.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown asset id: ${id}`);
  return found;
}

export function getDestination(id: string) {
  const found = destinations.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown destination id: ${id}`);
  return found;
}

/** Every record a homepage depends on. Used by the production guard. */
export const homepageRequiredRecords = [
  ...Object.values(copy),
  ...scienceItems,
  ...treatments,
  outlet,
  ...visitSteps,
  ...faqs,
  ...destinations,
];
