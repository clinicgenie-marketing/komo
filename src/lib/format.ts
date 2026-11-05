import type { Treatment } from './schema.ts';

const sgd = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' });

/** Formats integer minor units as an unambiguous SGD amount, e.g. "S$128.00". */
export function formatPrice(price: NonNullable<Treatment['price']>): string {
  const amount = sgd.format(price.amountMinor / 100);
  return price.kind === 'from' ? `From ${amount}` : amount;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hours = `${h} hour${h === 1 ? '' : 's'}`;
  return m === 0 ? hours : `${hours} ${m} minutes`;
}

/** Display name: the confirmed service name, else the verified category. */
export function treatmentTitle(t: Treatment): string {
  return t.name ?? t.category;
}
