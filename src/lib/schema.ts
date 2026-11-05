/**
 * Content contracts (Architecture.md section 4).
 * Records are validated when imported, so an invalid record fails the build.
 * Unknown facts are null, never zero or an invented value.
 */
import { z } from 'astro/zod';

export const verificationStatus = z.enum(['source-only', 'pending', 'verified', 'rejected']);
export const publishStatus = z.enum(['draft', 'approved']);

export const evidence = z.object({
  id: z.string().min(1),
  /** Internal evidence pointer. Never rendered into page markup. */
  sourceRef: z.string().min(1),
  verificationStatus,
  verifiedBy: z.string().nullable(),
  verifiedAt: z.string().nullable(),
  publishStatus,
});

const nullableText = z.string().min(1).nullable();

export const price = z.object({
  amountMinor: z.number().int().nonnegative(),
  currency: z.literal('SGD'),
  kind: z.enum(['standard', 'introductory', 'from']),
  taxDisplay: z.string().min(1),
  eligibility: nullableText,
  terms: nullableText,
  validUntil: nullableText,
});

export const treatment = evidence.extend({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Confirmed service name. Null until the actual menu name is confirmed (D04). */
  name: nullableText,
  /** Verified service category from the style guide (15.1, section 3). */
  category: z.enum(['Scalp care', 'Scalp spa', 'Hair care']),
  summary: z.string().min(1),
  focus: z.string().min(1),
  suitedTo: z.string().min(1),
  /** Whether a scalp assessment is part of this service. Null means unconfirmed. */
  includesAssessment: z.boolean().nullable(),
  experienceSteps: z.array(z.string()),
  inclusions: z.array(z.string()),
  durationMinutes: z.number().int().positive().nullable(),
  price: price.nullable(),
  heroAssetId: z.string().min(1),
  relatedTreatmentIds: z.array(z.string()),
  appointmentDestinationId: z.string().min(1),
});

export const address = z.object({
  building: z.string().min(1),
  street: nullableText,
  unit: nullableText,
  postalCode: nullableText,
  city: z.literal('Singapore'),
});

export const location = evidence.extend({
  kind: z.enum(['customer-outlet', 'office']),
  name: z.string().min(1),
  address,
  phone: nullableText,
  whatsapp: nullableText,
  email: nullableText,
  hours: z.array(z.object({ days: z.string(), opens: z.string(), closes: z.string() })).nullable(),
  mapUrl: z.url().nullable(),
  description: z.string().min(1),
  features: z.array(z.string()),
});

export const destination = evidence.extend({
  kind: z.enum(['booking-provider', 'whatsapp', 'phone', 'map', 'email']),
  label: z.string().min(1),
  /** Absolute URL or tel:/mailto:. Null until the owner confirms the destination (D07). */
  url: nullableText,
  opensNewTab: z.boolean(),
});

export const asset = evidence.extend({
  /** Local path once an approved original exists. Null while only a shot brief exists. */
  src: nullableText,
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  alt: z.string(),
  decorative: z.boolean(),
  /** Shot reference from the style guide shot list (12.1). */
  shotRef: z.string().min(1),
  brief: z.string().min(1),
  subject: z.string().min(1),
  kind: z.enum(['documentary', 'concept']),
  /** 'video' assets are served from public/ and need a poster image asset. */
  mediaType: z.enum(['image', 'video']).default('image'),
  usageRights: nullableText,
  focalPoint: z.string(),
  /** CSS object-position used when a responsive crop has to cut the frame. */
  objectPosition: z.string().default('50% 50%'),
});

export const pillar = evidence.extend({
  name: z.enum(['Health', 'Joy', 'Beauty', 'Vitality']),
  meaning: z.string().min(1),
  description: z.string().min(1),
  assetId: z.string().min(1),
  /** Which visit moment this pillar expresses (used by the care journey concept). */
  visitMoment: z.string().min(1),
});

export const visitStep = evidence.extend({
  order: z.number().int().positive(),
  title: z.string().min(1),
  short: z.string().min(1),
  detail: z.string().min(1),
  /** True where the step only happens for some services. */
  conditional: z.boolean(),
  conditionNote: nullableText,
  assetId: z.string().min(1),
});

export const faq = evidence.extend({
  question: z.string().min(1),
  answer: z.array(z.string().min(1)).min(1),
});

export const copyBlock = evidence.extend({
  text: z.string().min(1),
});

export type Evidence = z.infer<typeof evidence>;
export type Treatment = z.infer<typeof treatment>;
export type Location = z.infer<typeof location>;
export type Destination = z.infer<typeof destination>;
export type Asset = z.infer<typeof asset>;
export type Pillar = z.infer<typeof pillar>;
export type VisitStep = z.infer<typeof visitStep>;
export type Faq = z.infer<typeof faq>;
export type CopyBlock = z.infer<typeof copyBlock>;
