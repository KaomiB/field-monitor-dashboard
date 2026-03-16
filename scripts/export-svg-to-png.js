#!/usr/bin/env node
/**
 * Export SVG files to PNG for Google Docs (preserves text by using system fonts in headless Chrome).
 * Usage: npx puppeteer scripts/export-svg-to-png.js
 *    or: node scripts/export-svg-to-png.js   (after: npm install puppeteer)
 *
 * Requires: Node 18+ and `puppeteer` (installed via npm in this folder or run with npx).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIAGRAMS = path.join(ROOT, 'diagrams');
const SVGS = [
  { in: 'component_diagram_light.svg', out: 'component_diagram_light.png' },
  { in: 'component_diagram.svg', out: 'component_diagram.png' },
  { in: 'schematic_diagram.svg', out: 'schematic_diagram.png' },
];

function getViewBox(svgPath) {
  const raw = fs.readFileSync(svgPath, 'utf8');
  const m = raw.match(/viewBox=["']?\s*([\d.\s]+)["']?/);
  if (m) {
    const parts = m[1].trim().split(/\s+/);
    return { w: Number(parts[2]), h: Number(parts[3]) };
  }
  const w = raw.match(/width=["']?\s*([\d.]+)/);
  const h = raw.match(/height=["']?\s*([\d.]+)/);
  return { w: w ? Number(w[1]) : 1340, h: h ? Number(h[1]) : 880 };
}

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (_) {
    console.error('Missing puppeteer. Run from repo root: npm install puppeteer');
    console.error('  Or run: npx puppeteer scripts/export-svg-to-png.js');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Force light mode so SVG colors (e.g. component_diagram_light) are not altered by system dark theme
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);

  for (const { in: nameIn, out: nameOut } of SVGS) {
    const svgPath = path.join(DIAGRAMS, nameIn);
    if (!fs.existsSync(svgPath)) {
      console.warn('Skip (not found):', nameIn);
      continue;
    }
    let svgContent = fs.readFileSync(svgPath, 'utf8');
    const { w, h } = getViewBox(svgPath);
    const scale = 2; // 2x for sharper PNG in Google Docs
    // Force SVG to render at exact size (otherwise it may default to 300x150)
    if (!/^\s*<svg[^>]*\swidth=/.test(svgContent))
      svgContent = svgContent.replace(/<svg/, `<svg width="${w}" height="${h}"`);
    // Use transparent so the SVG's own background (e.g. #f2f4f0 or #151d16) shows through
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;background:transparent;">${svgContent}</body></html>`;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: Math.round(w), height: Math.round(h), deviceScaleFactor: scale });
    const outPath = path.join(DIAGRAMS, nameOut);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log('Written:', nameOut);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
