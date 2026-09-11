import { chromium, expect } from '@playwright/test';

const browser = await chromium.launch();
try {
  for (const [name, viewport] of [['desktop', {width:1440,height:900}], ['mobile', {width:390,height:744}]]) {
    const page = await browser.newPage({viewport, reducedMotion: 'no-preference'});
    await page.route('https://prod.spline.design/**/scene.splinecode', () => {});
    await page.goto('http://localhost:3000/es');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.process-motion')).toHaveAttribute('data-motion','true');
    await page.evaluate(() => history.replaceState(null, '', '#process'));
    await page.locator('#process').evaluate(el => scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight*.48,behavior:'instant'}));
    await page.screenshot({path:`artifacts/process-transition-${name}.png`});
    await page.locator('#process').evaluate(el => el.scrollIntoView({behavior:'instant'}));
    await expect(page.locator('[data-process-title]').last()).toHaveCSS('opacity','1');
    await page.screenshot({path:`artifacts/process-${name}.png`});
    await page.locator('#process').evaluate(el => scrollTo({top:el.getBoundingClientRect().top+scrollY+innerHeight*3,behavior:'instant'}));
    await expect.poll(() => page.locator('.process-step').nth(3).evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
    await page.screenshot({path:`artifacts/process-timeline-${name}.png`});
    await page.locator('.process-footer').scrollIntoViewIfNeeded();
    await page.screenshot({path:`artifacts/process-footer-${name}.png`});
    await page.close();
  }
} finally { await browser.close(); }
