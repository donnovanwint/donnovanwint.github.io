// Regenerate assets/resume.pdf from resume-src/resume.html
//
// Requires Chrome + puppeteer-core:
//   npm i -D puppeteer-core
//   node resume-src/render.mjs
//
// Adjust CHROME below if your Chrome lives elsewhere.
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const here = dirname(fileURLToPath(import.meta.url));

// src (in resume-src/) -> output pdf (in assets/)
const JOBS = [
  ['resume.html', 'resume.pdf'],
  ['resume-backend.html', 'Donnovan_Wint_Backend_Resume.pdf'],
  ['resume-qa.html', 'Donnovan_Wint_QA_Automation_Resume.pdf'],
];

const footer = `<div style="font-family:Georgia,serif;font-size:7.5pt;color:#8a8a8a;width:100%;padding:0 0.6in;">
  <div style="text-align:center;">Philadelphia, PA&nbsp;&nbsp;|&nbsp;&nbsp;484-888-1308&nbsp;&nbsp;|&nbsp;&nbsp;donnovanwint@gmail.com&nbsp;&nbsp;|&nbsp;&nbsp;donwint.com</div>
  <div style="text-align:right;margin-top:2px;letter-spacing:.5px;">DONNOVAN WINT JR.&nbsp;&nbsp;|&nbsp;&nbsp;<span class="pageNumber"></span></div>
</div>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
for (const [src, out] of JOBS) {
  const page = await browser.newPage();
  await page.goto('file://' + join(here, src), { waitUntil: 'networkidle0' });
  const outPath = join(here, '..', 'assets', out);
  await page.pdf({
    path: outPath,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: footer,
    margin: { top: '0.5in', bottom: '0.62in', left: '0.6in', right: '0.6in' },
  });
  await page.close();
  console.log('Wrote', outPath);
}
await browser.close();
