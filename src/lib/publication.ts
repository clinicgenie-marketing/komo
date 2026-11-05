/**
 * Publication guard (Architecture.md 4, Task.md T14).
 *
 * One predicate decides whether a record may appear in public output. Templates,
 * a future sitemap and structured data must all use `isPublishable` so drafts
 * cannot leak through a secondary path.
 */
import type { Evidence } from './schema.ts';

export type BuildTarget = 'preview' | 'production';

export function resolveBuildTarget(value: string | undefined): BuildTarget {
  return value === 'production' ? 'production' : 'preview';
}

type EnvHost = { process?: { env: Record<string, string | undefined> } };

/** Read at build time from the KOMO_BUILD_TARGET environment variable. */
export const buildTarget: BuildTarget = resolveBuildTarget(
  (globalThis as EnvHost).process?.env.KOMO_BUILD_TARGET,
);

export const isPreview = buildTarget === 'preview';

/** Concept explorations are private preview routes and are never generated in production. */
export function previewRoutesEnabled(target: BuildTarget = buildTarget): boolean {
  return target === 'preview';
}

export function isPublishable(record: Pick<Evidence, 'publishStatus' | 'verificationStatus'>): boolean {
  return record.publishStatus === 'approved' && record.verificationStatus === 'verified';
}

export class PublicationError extends Error {
  readonly ids: string[];
  constructor(ids: string[]) {
    super(`Unapproved content cannot enter a production build: ${ids.join(', ')}`);
    this.name = 'PublicationError';
    this.ids = ids;
  }
}

/**
 * Required content for a public page. In preview, drafts are allowed (and shown
 * with labels). In production, any unapproved required record fails the build.
 */
export function assertPublishable(
  records: ReadonlyArray<Pick<Evidence, 'id' | 'publishStatus' | 'verificationStatus'>>,
  target: BuildTarget = buildTarget,
): void {
  if (target !== 'production') return;
  const blocked = records.filter((r) => !isPublishable(r)).map((r) => r.id);
  if (blocked.length > 0) throw new PublicationError(blocked);
}

/** Optional modules: shown in preview; omitted from production unless approved. */
export function showOptional(record: Pick<Evidence, 'publishStatus' | 'verificationStatus'>, target: BuildTarget = buildTarget): boolean {
  return target === 'preview' || isPublishable(record);
}
