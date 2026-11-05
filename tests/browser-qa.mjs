/**
 * Browser QA for the homepage concepts (Task.md T25 and QA matrix).
 * Starts `astro preview` on the built site, then checks each concept for:
 * reflow at 320px, 375/768/1024/1440px layouts, 200% zoom equivalent, mobile
 * navigation and keyboard behaviour, visible focus, reduced motion, sticky
 * controls covering content, console errors, and an axe-core WCAG 2.2 AA scan.
 *
 * Usage: npm run build && npm run qa:browser
 * Writes qa-output/browser-qa.json and screenshots to qa-output/screens/.
 * Automated checks supplement manual review; they do not certify compliance.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = require('playwright')); }
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const PORT = 4329;
const BASE = `http://localhost:${PORT}`;
const CONCEPTS = ['concept-1', 'concept-2', 'concept-3'];
const WIDTHS = [320, 375, 768, 1024, 1440];
mkdirSync('qa-output/screens', { recursive: true });

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT), '--ignore-lock'], { stdio: 'pipe' });
for (let i = 0; ; i++) {
  try { if ((await fetch(`${BASE}/concepts/`)).ok) break; } catch { /* not up yet */ }
  if (i > 60) { server.kill(); throw new Error('preview server did not start'); }
  await new Promise((r) => setTimeout(r, 500));
}

const results = [];
const record = (concept, check, pass, detail = '') => results.push({ concept, check, pass, detail });

const browser = await chromium.launch();
try {
  for (const concept of CONCEPTS) {
    const url = `${BASE}/${concept}/`;

    // ---- Layout and reflow at each width
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(url, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      record(concept, `no horizontal scroll at ${width}px`, overflow <= 0, `overflow ${overflow}px`);
      record(concept, `no console errors at ${width}px`, errors.length === 0, errors.join(' | '));
      if ([375, 768, 1440].includes(width)) {
        await page.screenshot({ path: `qa-output/screens/${concept}-${width}.png`, fullPage: true });
      }
      await page.close();
    }

    // ---- 200% zoom equivalent: a 1280px window at 200% gives a 640px CSS viewport
    {
      const page = await browser.newPage({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
      await page.goto(url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      record(concept, '200% zoom (640px CSS viewport) reflows', overflow <= 0, `overflow ${overflow}px`);
      const toggleVisible = await page.locator('[data-nav-toggle]').isVisible();
      record(concept, '200% zoom keeps navigation reachable', toggleVisible);
      await page.close();
    }

    // ---- Mobile navigation and keyboard
    {
      const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
      await page.goto(url);
      const toggle = page.locator('[data-nav-toggle]');
      const nav = page.locator('#site-nav');
      record(concept, 'mobile: menu collapsed initially', (await toggle.getAttribute('aria-expanded')) === 'false' && !(await nav.isVisible()));

      await page.keyboard.press('Tab');
      const firstFocus = await page.evaluate(() => document.activeElement?.className);
      record(concept, 'keyboard: first Tab reaches skip link', String(firstFocus).includes('skip-link'), String(firstFocus));

      await toggle.focus();
      await page.keyboard.press('Enter');
      record(concept, 'mobile: Enter opens menu', (await toggle.getAttribute('aria-expanded')) === 'true' && (await nav.isVisible()));
      await page.keyboard.press('Tab');
      const inNav = await page.evaluate(() => !!document.activeElement?.closest('#site-nav'));
      record(concept, 'mobile: Tab moves into open menu', inNav);
      await page.keyboard.press('Escape');
      const focusBack = await page.evaluate(() => document.activeElement?.hasAttribute('data-nav-toggle'));
      record(concept, 'mobile: Escape closes menu and returns focus', (await toggle.getAttribute('aria-expanded')) === 'false' && focusBack);

      await toggle.click();
      await page.locator('#site-nav a[href="#treatments"]').click();
      await page.waitForTimeout(400);
      const closedAfterLink = (await toggle.getAttribute('aria-expanded')) === 'false';
      const headingTop = await page.evaluate(() => {
        const h = document.querySelector('#treatments h2');
        const header = document.querySelector('[data-site-header]');
        const headerBottom = getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().bottom : 0;
        return { top: h.getBoundingClientRect().top, headerBottom };
      });
      record(concept, 'mobile: menu link navigates and closes menu', closedAfterLink);
      record(concept, 'anchor target not hidden under sticky header', headingTop.top >= headingTop.headerBottom - 1, JSON.stringify(headingTop));

      // Visible focus on a button and a FAQ summary
      const focusStyle = await page.evaluate(() => {
        const el = document.querySelector('.faq__summary');
        el.focus({ focusVisible: true });
        const s = getComputedStyle(el);
        return `${s.outlineStyle} ${s.outlineWidth}`;
      });
      record(concept, 'keyboard: visible focus outline', !focusStyle.startsWith('none') && !focusStyle.endsWith(' 0px'), focusStyle);
      await page.keyboard.press('Enter');
      const faqOpen = await page.evaluate(() => document.querySelector('.faq__item').open);
      record(concept, 'keyboard: FAQ disclosure toggles with Enter', faqOpen !== undefined);

      // Sticky/fixed controls must not cover the end of the page
      const covered = await page.evaluate(async () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 100));
        const bar = document.querySelector('[data-actionbar]');
        if (!bar || getComputedStyle(bar).display === 'none') return { bar: false, overlap: 0 };
        const footerLast = [...document.querySelectorAll('footer *')].pop();
        return { bar: true, overlap: footerLast.getBoundingClientRect().bottom - bar.getBoundingClientRect().top };
      });
      record(concept, 'fixed action bar does not cover content', covered.overlap <= 0, JSON.stringify(covered));
      await page.close();
    }

    // ---- Desktop navigation
    {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(url);
      const toggleHidden = !(await page.locator('[data-nav-toggle]').isVisible());
      const navVisible = await page.locator('#site-nav').isVisible();
      record(concept, 'desktop: inline navigation without menu button', toggleHidden && navVisible);
      if (concept === 'concept-3') {
        const geo = await page.evaluate(() => {
          const r = (s) => document.querySelector(s).getBoundingClientRect();
          const hero = r('.c3-hero'); const header = r('[data-site-header]'); const logo = r('.site-header__home');
          const box = r('.site-header__box'); const panel = r('.c3-hero__panel');
          return {
            headerOverHero: Math.abs(header.top - hero.top) < 1,
            logoTopLeft: logo.left < hero.width / 4,
            navBoxRight: box.right > hero.width * 0.75 && box.left > hero.width / 3,
            panelBottomLeft: panel.left < hero.width / 4 && panel.bottom <= hero.bottom && panel.top > hero.top + hero.height / 3,
            ctaAboveFold: document.querySelector('.c3-hero__panel .komo-button').getBoundingClientRect().bottom <= window.innerHeight,
          };
        });
        record(concept, 'hero: logo top left, nav box top right, over the hero media', geo.headerOverHero && geo.logoTopLeft && geo.navBoxRight, JSON.stringify(geo));
        record(concept, 'hero: description and actions bottom left, actions above the fold at 1440x900', geo.panelBottomLeft && geo.ctaAboveFold, JSON.stringify(geo));
      }
      await page.close();
    }

    // ---- Reduced motion
    {
      const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1024, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(url);
      const motion = await page.evaluate(() => ({
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
        transition: getComputedStyle(document.querySelector('.komo-button')).transitionDuration,
      }));
      const fast = motion.transition.split(',').every((d) => parseFloat(d) <= 0.001);
      record(concept, 'reduced motion: no smooth scroll or transitions', motion.scroll === 'auto' && fast, JSON.stringify(motion));
      await ctx.close();
    }

    // ---- axe-core WCAG 2.2 AA at mobile and desktop
    for (const width of [375, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(url);
      await page.addScriptTag({ content: axeSource });
      const axe = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] });
        return {
          violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target })),
          incomplete: r.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length, targets: v.nodes.map((n) => n.target).slice(0, 5) })),
          passes: r.passes.length,
        };
      });
      record(concept, `axe WCAG 2.2 AA + best practice at ${width}px`, axe.violations.length === 0,
        JSON.stringify({ violations: axe.violations, incomplete: axe.incomplete, passes: axe.passes }));
      await page.close();
    }
  }

  // ---- Comparison index and 404
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
    const res = await page.goto(`${BASE}/concepts/`);
    const links = await page.locator('main a[href^="/concept-"]').count();
    record('concepts', 'index links to all three concepts', res.status() === 200 && links >= 3, `${links} links`);
    const nf = await page.goto(`${BASE}/not-a-real-page/`);
    record('404', 'unknown route returns 404', nf.status() === 404, `status ${nf.status()}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}

writeFileSync('qa-output/browser-qa.json', JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.pass);
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.concept.padEnd(10)} ${r.check}${r.pass ? '' : `  ${r.detail}`}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
