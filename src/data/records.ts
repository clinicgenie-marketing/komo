/**
 * Shared content records for every homepage concept.
 *
 * Status key (Architecture.md 4):
 *  - verificationStatus 'source-only': taken from a supplied document; not confirmed as true or current.
 *  - publishStatus 'draft': wording not yet approved by the owner.
 * Nothing here has been verified by KOMO. See docs/content-register.md.
 *
 * Source abbreviations used in sourceRef:
 *  SG = KOMO_Botanical_Sanctuary_Style_Guide.md (section number follows)
 *  ARCH = Architecture.md
 */
import { z } from 'astro/zod';
import {
  asset, copyBlock, destination, faq, location, pillar, treatment, visitStep,
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
  heroSupport: {
    ...draft('copy-hero-support', 'SG 15.2 hero example'),
    text: 'Personalised scalp and hair care in a calm, welcoming space at Wheelock Place.',
  },
  positioning: {
    ...draft('copy-positioning', 'SG 1.1 positioning'),
    text: 'KOMO offers personalised scalp and hair care within a restorative spa experience, combining attentive consultation, appropriate care and time to unwind.',
  },
  promise: {
    ...draft('copy-promise', 'SG 1.2 emotional promise'),
    text: 'A place to unwind and feel cared for.',
  },
  experienceIntro: {
    ...draft('copy-experience-intro', 'SG 1.3, 15.1 step 2'),
    text: 'Every visit begins with listening. We talk through what you have noticed, plan care around you and leave time for you to unwind.',
  },
  boundary: {
    ...draft('copy-boundary', 'SG 1.5 brand boundaries'),
    text: 'KOMO provides scalp and hair wellness care in a spa setting. Our services do not diagnose or treat medical conditions.',
  },
  brandTagline: {
    ...draft('copy-brand-tagline', 'Supplied brand imagery: illuminated wall sign (src/assets/KOMO Integrative Scalp & Hair Care.png)'),
    text: 'Integrative care for your scalp & hair',
  },
  brandDescriptor: {
    ...draft('copy-brand-descriptor', 'Supplied brand imagery: folder cover and signage (src/assets/KOMO Scalp & Hair Wellness Cover.png)'),
    text: 'Scalp & Hair Wellness',
  },
  belief: {
    ...draft('copy-belief', 'Supplied brand imagery: wall display panel (src/assets/KOMO Scalp Wellness Wall Display.png)'),
    text: 'We believe beauty and confidence start at the roots.',
  },
  requestNote: {
    ...draft('copy-request-note', 'SG 16.2, Rules 5'),
    text: 'Sending a request does not confirm a booking. Your appointment is only confirmed when KOMO confirms it with you.',
  },
});

/** The three parts of the experience (SG 15.1 step 2). */
export const experienceParts = [
  {
    title: 'Consultation',
    text: 'Your therapist asks what you have noticed and what you would like from the visit, then explains the options in plain language.',
  },
  {
    title: 'Personalised care',
    text: 'Your care is planned around your scalp, your hair and what matters to you, rather than a fixed routine.',
  },
  {
    title: 'Restorative time',
    text: 'Unhurried, attentive care in a light, calm space, with time to settle before you return to your day.',
  },
] as const;

/* ------------------------------------------------------------ treatments */

export const treatments = z.array(treatment).parse([
  {
    ...draft('treatment-scalp-care', 'SG 15.1 step 3 service categories; SG 4 Health'),
    slug: 'scalp-care',
    name: null,
    category: 'Scalp care',
    summary: 'Care that begins with understanding your scalp, planned around what you and your therapist notice together.',
    focus: 'Understanding and caring for your scalp',
    suitedTo: 'You have noticed something about your scalp and would like it explained clearly.',
    includesAssessment: null,
    experienceSteps: [],
    inclusions: [],
    durationMinutes: null,
    price: null,
    heroAssetId: 'health-consultation',
    relatedTreatmentIds: ['treatment-scalp-spa'],
    appointmentDestinationId: 'appointment',
  },
  {
    ...draft('treatment-scalp-spa', 'SG 15.1 step 3 service categories; SG 4 Joy'),
    slug: 'scalp-spa',
    name: null,
    category: 'Scalp spa',
    summary: 'A restorative scalp spa ritual, with unhurried hands-on care and time that feels your own.',
    focus: 'Restorative comfort and a calm break',
    suitedTo: 'You would like a pause from a busy week and attentive, hands-on care.',
    includesAssessment: null,
    experienceSteps: [],
    inclusions: [],
    durationMinutes: null,
    price: null,
    heroAssetId: 'joy-massage',
    relatedTreatmentIds: ['treatment-scalp-care'],
    appointmentDestinationId: 'appointment',
  },
  {
    ...draft('treatment-hair-care', 'SG 15.1 step 3 service categories; SG 4 Beauty'),
    slug: 'hair-care',
    name: null,
    category: 'Hair care',
    summary: 'Care for your hair, chosen around its texture and the way you look after it day to day.',
    focus: 'Comfort and confidence in your hair',
    suitedTo: 'You would like care for your hair that suits its texture and your routine.',
    includesAssessment: null,
    experienceSteps: [],
    inclusions: [],
    durationMinutes: null,
    price: null,
    heroAssetId: 'hair-texture',
    relatedTreatmentIds: ['treatment-scalp-spa'],
    appointmentDestinationId: 'appointment',
  },
]);

/* ---------------------------------------------------------------- outlet */

export const outlet = location.parse({
  ...draft('location-wheelock-place', 'SG 15.2 hero example (location); SG 5 outlet photograph description'),
  kind: 'customer-outlet',
  name: 'KOMO at Wheelock Place',
  address: { building: 'Wheelock Place', street: null, unit: null, postalCode: null, city: 'Singapore' },
  phone: null,
  whatsapp: null,
  email: null,
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

export const destinations = z.array(destination).parse([
  {
    ...draft('appointment', 'ARCH 6 baseline external handoff; provider not supplied (Task.md D07)'),
    verificationStatus: 'pending',
    kind: 'booking-provider',
    label: 'Request an appointment',
    url: null,
    opensNewTab: false,
  },
  {
    ...draft('whatsapp', 'ARCH 8 event contract; number not supplied (Task.md D05)'),
    verificationStatus: 'pending',
    kind: 'whatsapp',
    label: 'Contact via WhatsApp',
    url: null,
    opensNewTab: false,
  },
  {
    ...draft('phone', 'ARCH 8 event contract; number not supplied (Task.md D05)'),
    verificationStatus: 'pending',
    kind: 'phone',
    label: 'Call KOMO',
    url: null,
    opensNewTab: false,
  },
  {
    ...draft('directions', 'ARCH 8 event contract; map link not supplied (Task.md D05)'),
    verificationStatus: 'pending',
    kind: 'map',
    label: 'Get directions',
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
    ...draft('step-arrival', 'SG 20.3 first visit sequence; SG 3 journey'),
    order: 1,
    title: 'Arrival',
    short: 'A calm welcome at Wheelock Place.',
    detail: 'You are welcomed at reception in a light, calm space with curved walls and pale timber.',
    conditional: false,
    conditionNote: null,
    assetId: 'arrival-signage',
  },
  {
    ...draft('step-conversation', 'SG 20.3; SG 18.2 (ask what the customer has noticed)'),
    order: 2,
    title: 'Conversation',
    short: 'Tell us what you have noticed.',
    detail: 'Your therapist asks what you have noticed and what you would like from the visit, without judgement or pressure.',
    conditional: false,
    conditionNote: null,
    assetId: 'health-consultation',
  },
  {
    ...draft('step-assessment', 'SG 20.3 (assessment where included); SG 1.5 (describe assessment by verified capabilities)'),
    order: 3,
    title: 'Scalp assessment',
    short: 'Where your service includes one.',
    detail: 'Some services include a scalp assessment. Your therapist explains what it looks at and talks you through what they see.',
    conditional: true,
    conditionNote: 'Included with some services only',
    assetId: 'assessment-detail',
  },
  {
    ...draft('step-treatment', 'SG 20.3; SG 12.1 treatment hero'),
    order: 4,
    title: 'Treatment',
    short: 'Unhurried, hands-on care.',
    detail: 'Your care is carried out at an unhurried pace, with your neck supported and time to unwind.',
    conditional: false,
    conditionNote: null,
    assetId: 'treatment-hero',
  },
  {
    ...draft('step-finish', 'SG 20.3; SG 4 Vitality'),
    order: 5,
    title: 'Finish',
    short: 'Time to settle before your day.',
    detail: 'A moment to settle and ask any questions before you return to your day.',
    conditional: false,
    conditionNote: null,
    assetId: 'beauty-mirror',
  },
]);

/* ------------------------------------------------------------------ FAQs */

export const faqs = z.array(faq.extend({ pendingFact: z.string().nullable() })).parse([
  {
    ...draft('faq-first-visit', 'SG 20.3'),
    question: 'What happens on a first visit?',
    answer: [
      'A visit follows a simple order: arrival, a conversation with your therapist, a scalp assessment where your service includes one, your treatment and a calm finish.',
      'The exact steps depend on the service you choose. Each treatment description says what it includes.',
    ],
    pendingFact: 'Which services include an assessment is to be confirmed',
  },
  {
    ...draft('faq-medical', 'SG 1.5 brand boundaries'),
    question: 'Is KOMO a medical clinic?',
    answer: [
      'No. KOMO provides scalp and hair wellness care in a spa setting. Our services do not diagnose or treat medical conditions.',
      'If you have a medical concern about your scalp or hair, please speak with a doctor.',
    ],
    pendingFact: null,
  },
  {
    ...draft('faq-choose', 'SG 15.1 step 3; SG 4'),
    question: 'Which treatment should I choose?',
    answer: [
      'Scalp care suits you if you have noticed something about your scalp and would like it explained. Scalp spa suits you if you would like a restorative break with hands-on care. Hair care focuses on the hair itself, chosen around its texture and your routine.',
      'If you are unsure, mention it in your request and your therapist can talk the options through with you.',
    ],
    pendingFact: null,
  },
  {
    ...draft('faq-price-duration', 'SG 15.3 treatment page specification; Task.md D04'),
    question: 'How much does a treatment cost, and how long does it take?',
    answer: [
      'Each treatment shows its duration, what is included and its price, with any terms beside the price.',
    ],
    pendingFact: 'Durations, inclusions and prices to be confirmed by KOMO',
  },
  {
    ...draft('faq-request', 'SG 16.2; Rules 5; Task.md D07'),
    question: 'How do I request an appointment?',
    answer: [
      'Choose Request an appointment and let us know which treatment interests you and when you would prefer to come.',
      'Sending a request does not confirm a booking. Your appointment is only confirmed when KOMO confirms it with you.',
    ],
    pendingFact: 'Booking channel and confirmation method to be confirmed',
  },
  {
    ...draft('faq-where', 'SG 15.2 (location)'),
    question: 'Where is KOMO?',
    answer: ['KOMO is at Wheelock Place, Singapore.'],
    pendingFact: 'Unit number, opening hours and directions to be confirmed',
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
  ...treatments,
  outlet,
  ...pillars,
  ...visitSteps,
  ...faqs,
  getDestination('appointment'),
];
