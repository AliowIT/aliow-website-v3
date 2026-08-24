import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Mobile viewport
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:5179/');
await page.waitForTimeout(1200);

// Screenshot 1: mobile nav closed
await page.screenshot({ path: 'test-mobile-closed.png', fullPage: false });

// Check hamburger is visible
const hamburger = page.locator('.nav-hamburger');
const hamVisible = await hamburger.isVisible();
console.log('Hamburger visible (should be true):', hamVisible);

// Check nav-links is hidden
const navLinksVisible = await page.locator('.nav-links').isVisible();
console.log('Nav-links visible (should be false):', navLinksVisible);

// Click hamburger to open menu
await hamburger.click();
await page.waitForTimeout(300);

// Screenshot 2: mobile menu open
await page.screenshot({ path: 'test-mobile-open.png', fullPage: false });

// Check menu overlay is visible
const menuVisible = await page.locator('.mobile-menu').isVisible();
console.log('Mobile menu visible after click (should be true):', menuVisible);

// Check links in menu
const links = await page.locator('.mobile-menu-links a').allTextContents();
console.log('Menu links:', links);

// Click a link and check menu closes
await page.locator('.mobile-menu-links a[href="#what"]').click();
await page.waitForTimeout(300);
const menuGone = await page.locator('.mobile-menu').count() === 0;
console.log('Menu gone after link click (should be true):', menuGone);

// Desktop: hamburger hidden, nav visible
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(200);
const hamDesktop = await page.locator('.nav-hamburger').isVisible();
const navDesktop = await page.locator('.nav-links').isVisible();
console.log('Hamburger on desktop (should be false):', hamDesktop);
console.log('Nav-links on desktop (should be true):', navDesktop);

await page.screenshot({ path: 'test-desktop.png', fullPage: false });

await browser.close();
console.log('Done.');
