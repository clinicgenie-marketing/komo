/**
 * Build-output and publication-guard tests.
 * Run with `npm test` (builds the preview first). Uses Node's built-in test runner.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { assertPublishable, isPublishable, PublicationError, resolveBuildTarget } from '../src/lib/publication.ts';
import { homepageRequiredRecords, destinations, treatments, assets } from '../src/data/records.ts';
import { resolveDestination, safeExternalUrl } from '../src/lib/destinations.ts';

const DIST = 'dist';
const CONCEPTS = ['concept-1', 'concept-2', 'concept-3'];
const PREVIEW_ROUTES = ['concepts', ...CONCEPTS];
const read = (route) => readFileSync(join(DIST, route, 'index.html'), 'utf8');
const textOnly = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, ' ');

test('every preview route and a real 404 page are generated', () => {
  for (const r of PREVIEW_ROUTES) assert.ok(existsSync(join(DIST, r, 'index.html')), `missing /${r}/`);
  assert.ok(existsSync(join(DIST, '404.html')), 'missing 404.html');
});

for (const route of PREVIEW_ROUTES) {
  test(`/${route}/ is kept out of search indexing`, () => {
    assert.match(read(route), /<meta name="robots" content="noindex, nofollow"/);
  });
}

for (const route of CONCEPTS) {
  test(`/${route}/ has one h1 and no skipped heading levels`, () => {
    const html = read(route);
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    assert.equal(levels.filter((l) => l === 1).length, 1, 'exactly one h1');
    assert.equal(levels[0], 1, 'first heading is h1');
    for (let i = 1; i < levels.length; i++) {
      assert.ok(levels[i] <= levels[i - 1] + 1, `heading jumps from h${levels[i - 1]} to h${levels[i]}`);
    }
  });

  test(`/${route}/ has no dead links and every in-page link has a target`, () => {
    const html = read(route);
    assert.doesNotMatch(html, /href="#"/, 'href="#" found');
    assert.doesNotMatch(html, /href=""/, 'empty href found');
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids.filter((x, i) => ids.indexOf(x) !== i)}`);
    for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.includes(target), `in-page link #${target} has no target`);
    }
  });

  test(`/${route}/ contains the required homepage content`, () => {
    const text = textOnly(read(route));
    for (const required of [
      'Explore treatments', 'Request an appointment',
      'Scalp care', 'Scalp spa', 'Hair care',
      'Health', 'Joy', 'Beauty', 'Vitality',
      'Wheelock Place', 'Arrival', 'Conversation', 'Scalp assessment', 'Treatment', 'Finish',
      'Is KOMO a medical clinic?',
    ]) assert.ok(text.includes(required), `missing "${required}"`);
    const html = read(route);
    assert.match(html, /id="appointment"/, 'appointment guidance section');
    assert.match(html, /<footer/, 'footer');
    assert.match(html, /aria-controls="site-nav"/, 'responsive navigation toggle');
  });

  test(`/${route}/ shows no fabricated facts, internal notes or forbidden copy`, () => {
    const html = read(route);
    const text = textOnly(html);
    assert.doesNotMatch(text, /lorem ipsum|\[TBC\]|TODO/i);
    assert.doesNotMatch(text, /—/, 'em dash in copy (style guide 18.1)');
    assert.doesNotMatch(text, /S\$\s?\d|\$\d|\d+\s?(minutes|mins)\b/i, 'a price or duration appears; none is verified');
    assert.doesNotMatch(text, /guarantee|clinically proven|regrowth|follicle|permanent|diagnos(e|is) your/i, 'unsupported claim wording');
    assert.doesNotMatch(text, /\b(booked|booking confirmed|appointment confirmed|thank you for your booking)\b/i, 'false confirmation state');
    assert.doesNotMatch(html, /sourceRef|verifiedBy|source-only|Task\.md|Architecture\.md/, 'internal evidence leaked');
    assert.doesNotMatch(html, /<form/i, 'no request form exists, so none should render');
    assert.doesNotMatch(html, /<video/i, 'no video element until an approved video asset exists');
    assert.doesNotMatch(html, /\sautoplay[\s=>]/i, 'no autoplay attribute; playback is started by script only when motion is allowed');
  });

  test(`/${route}/ marks unconfirmed facts and placeholder imagery visibly`, () => {
    const html = read(route);
    assert.match(html, /class="placeholder-fact/, 'preview placeholders shown');
    assert.match(html, /official artwork required/, 'logo placeholder labelled');
    // Every image is either a labelled placeholder or a supplied concept image; none is presented as approved.
    const statuses = [...html.matchAll(/data-asset-status="([a-z]+)"/g)].map((m) => m[1]);
    assert.ok(statuses.length > 0, 'image slots rendered');
    for (const st of statuses) assert.ok(['concept', 'placeholder'].includes(st), `unexpected asset status ${st}`);
    if (statuses.includes('concept')) {
      assert.match(textOnly(html), /Photographs are supplied concept images, not confirmed records/, 'concept imagery disclosed in the preview banner');
    }
    // Photographs are re-encoded and responsive, never the 2 MB originals.
    assert.doesNotMatch(html, /src="[^"]+\.png"/, 'original PNG served directly');
    for (const [, img] of html.matchAll(/<img([^>]*class="slot__media[^>]*)>/g)) {
      assert.match(img, /srcset="/, 'responsive srcset on every photograph');
      assert.match(img, /width="\d+" height="\d+"|height="\d+"[^>]*width="\d+"/, 'intrinsic dimensions on every photograph');
    }
    // Every appointment action points to the on-page guidance while no destination is verified.
    for (const [, href] of html.matchAll(/<a href="([^"]+)"[^>]*data-placement=/g)) {
      assert.equal(href, '#appointment');
    }
  });
}

test('publication predicate requires approval and verification', () => {
  const base = { id: 'x' };
  assert.equal(isPublishable({ ...base, publishStatus: 'approved', verificationStatus: 'verified' }), true);
  assert.equal(isPublishable({ ...base, publishStatus: 'approved', verificationStatus: 'source-only' }), false);
  assert.equal(isPublishable({ ...base, publishStatus: 'draft', verificationStatus: 'verified' }), false);
  assert.equal(resolveBuildTarget(undefined), 'preview');
  assert.equal(resolveBuildTarget('production'), 'production');
});

test('production guard rejects the current draft homepage records', () => {
  assert.doesNotThrow(() => assertPublishable(homepageRequiredRecords, 'preview'));
  assert.throws(() => assertPublishable(homepageRequiredRecords, 'production'), PublicationError);
});

test('no fact is invented in the shared records', () => {
  for (const t of treatments) {
    assert.equal(t.durationMinutes, null, `${t.slug} duration`);
    assert.equal(t.price, null, `${t.slug} price`);
    assert.equal(t.verificationStatus === 'verified', false);
  }
  for (const d of destinations) assert.equal(d.url, null, `${d.id} url`);
});

test('supplied photographs are recorded as unapproved concept images with existing files', () => {
  const files = new Set(readdirSync('src/assets', { recursive: true }).map(String));
  for (const a of assets) {
    assert.equal(isPublishable(a), false, `${a.id} must not be approved without verification and rights`);
    if (a.src === null) continue;
    assert.equal(a.kind, 'concept', `${a.id} with a file is a concept image until KOMO confirms it documents the outlet`);
    assert.equal(a.usageRights, null, `${a.id} usage rights are unrecorded`);
    assert.ok(files.has(a.src), `${a.id} file missing: src/assets/${a.src}`);
    assert.ok(a.decorative || a.alt.length > 0, `${a.id} needs alt text`);
  }
});

test('destinations only resolve when verified and on an allowlisted protocol', () => {
  const verified = { ...destinations[0], publishStatus: 'approved', verificationStatus: 'verified' };
  assert.equal(resolveDestination({ ...verified, url: 'https://example.com/book' }).href, 'https://example.com/book');
  assert.equal(resolveDestination({ ...verified, url: 'javascript:alert(1)' }).href, null);
  assert.equal(resolveDestination({ ...destinations[0], url: 'https://example.com/book' }).href, null, 'unverified');
  assert.equal(safeExternalUrl('tel:+6500000000'), 'tel:+6500000000');
  assert.equal(safeExternalUrl('not a url'), null);
});

test('production build excludes every concept route', () => {
  rmSync('dist-production', { recursive: true, force: true });
  execSync('npx astro build --outDir dist-production', {
    env: { ...process.env, KOMO_BUILD_TARGET: 'production' },
    stdio: 'pipe',
  });
  for (const r of PREVIEW_ROUTES) {
    assert.equal(existsSync(join('dist-production', r)), false, `/${r}/ must not be built for production`);
  }
  const notFound = readFileSync(join('dist-production', '404.html'), 'utf8');
  assert.doesNotMatch(notFound, /concepts/, 'production 404 does not link to previews');
});
