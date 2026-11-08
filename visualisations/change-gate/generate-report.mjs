/**
 * Produce article screenshots from the real change-gate formatter and synthetic inputs.
 * No API client, network request, environment file or deployment configuration is loaded.
 *
 * Run with the source repository's installed tsx loader:
 * node --import <source-root>/node_modules/tsx/dist/loader.mjs generate-report.mjs \
 *   --source-root <source-root> --blog-root <blog-root> --playwright-root <package-root>
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => {
  if (i % 2 === 0) pairs.push([value.replace(/^--/, ''), all[i + 1]]);
  return pairs;
}, []));
assert(args['source-root'] && args['blog-root'] && args['playwright-root'], 'Provide all three package roots.');
const sourceRoot = path.resolve(args['source-root']);
const blogRequire = createRequire(path.join(path.resolve(args['blog-root']), 'package.json'));
const { chromium } = createRequire(path.join(path.resolve(args['playwright-root']), 'package.json'))('@playwright/test');
const { remark } = await import(pathToFileURL(blogRequire.resolve('remark')));
const { default: gfm } = await import(pathToFileURL(blogRequire.resolve('remark-gfm')));
const { default: sharp } = await import(pathToFileURL(blogRequire.resolve('sharp')));
const { renderComment } = await import(pathToFileURL(path.join(sourceRoot, 'src/render.ts')));
const { assessRisk } = await import(pathToFileURL(path.join(sourceRoot, 'src/risk.ts')));
const { evaluate } = await import(pathToFileURL(path.join(sourceRoot, 'src/evaluate.ts')));
const { defaultPolicy } = await import(pathToFileURL(path.join(sourceRoot, 'src/policy.ts')));
const fixture = JSON.parse(await readFile(path.join(directory, 'report-fixture.json'), 'utf8'));
const policy = { ...defaultPolicy, ...fixture.policyOverrides };
const risk = assessRisk({ snap: fixture.snapshot, reviewers: fixture.reviewers, policy });
const decision = evaluate(fixture.snapshot, policy, { checkName: 'change-gate', risk });
assert.equal(decision.changeClass, 'normal');
assert.equal(decision.action, 'withhold');
assert.equal(risk.grade, 'high');
let markdown = renderComment(decision, fixture.snapshot, fixture.mode, fixture.checkUrl);
markdown = markdown.replace(/evaluated \d{4}-\d{2}-\d{2}T[^\s]+/, `evaluated ${fixture.evaluatedAt}`);
await writeFile(path.join(directory, 'report-output.md'), markdown);

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const render = node => {
  const children = () => (node.children || []).map(render).join('');
  switch (node.type) {
    case 'root': return children();
    case 'text': return escape(node.value);
    case 'paragraph': return `<p>${children()}</p>`;
    case 'heading': return `<h${node.depth}>${children()}</h${node.depth}>`;
    case 'strong': return `<strong>${children()}</strong>`;
    case 'emphasis': return `<em>${children()}</em>`;
    case 'inlineCode': return `<code>${escape(node.value)}</code>`;
    case 'link': return `<span class="link">${children()}</span>`;
    case 'list': return `<ul>${children()}</ul>`;
    case 'listItem': return `<li>${children()}</li>`;
    case 'blockquote': return `<blockquote>${children()}</blockquote>`;
    case 'html': {
      assert(['<details><summary>Full report</summary>', '</details>'].includes(node.value.trim()), 'Unexpected raw HTML');
      return node.value;
    }
    case 'table': return `<table>${node.children.map((row, i) => `<tr>${row.children.map(cell => `<${i ? 'td' : 'th'}>${cell.children.map(render).join('')}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</table>`;
    default: throw new Error(`Unsupported markdown node ${node.type}`);
  }
};
const body = render(remark().use(gfm).parse(markdown));
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Illustrative change-gate report</title><style>
*{box-sizing:border-box}body{margin:0;padding:28px;background:#f6f8fa;color:#1f2328;font:18px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
main{border:1px solid #c8cdd3;border-radius:10px;background:white;overflow:hidden}.example{margin:0;padding:14px 22px;background:#f6f8fa;border-bottom:1px solid #d1d9e0;color:#495460;font-size:15px}.report{padding:6px 24px 20px}.report h3{font-size:23px;line-height:1.35;margin:18px 0}.report p{margin:16px 0}.report ul{padding-left:23px;margin:16px 0}.report li p{margin:5px 0}code{font:0.9em/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;background:#eff1f4;padding:2px 5px;border-radius:4px;overflow-wrap:anywhere}.link{color:#0969da}summary{cursor:default;font-weight:600}details{margin:22px 0}table{border-collapse:collapse;font-size:15px}td,th{padding:8px;border:1px solid #d1d9e0;text-align:left;vertical-align:top}blockquote{margin:16px 0;color:#495460}
@media(max-width:600px){body{padding:10px;font-size:17px}.example{padding:12px 15px;font-size:13px}.report{padding:2px 15px 14px}.report h3{font-size:21px}.report p{margin:14px 0}.report ul{padding-left:20px}.report li{overflow-wrap:anywhere}}
</style><main><p class="example">Illustrative report · synthetic data</p><section class="report">${body}</section></main></html>`;
await writeFile('/tmp/change-gate-report.html', html);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const outputs = [];
try {
  for (const [variant, width] of [['desktop', 940], ['mobile', 360]]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 2 });
    await page.setContent(html);
    const contentHeight = await page.locator('main').evaluate(element => Math.ceil(element.getBoundingClientRect().height));
    await page.setViewportSize({ width, height: contentHeight + (width < 600 ? 20 : 56) });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert(!overflow, `${variant} overflow`);
    const screenshot = await page.screenshot({ fullPage: false, animations: 'disabled' });
    const target = path.join(directory, `report-${variant}.png`);
    await sharp(screenshot).withMetadata({ exif: { IFD0: { ImageDescription: 'Rendered screenshot of the change-gate comment formatter with synthetic fixture data; not a production pull request.', Artist: 'Generated from report-fixture.json with generate-report.mjs' } } }).png().toFile(target);
    const metadata = await sharp(target).metadata();
    outputs.push({ file: path.basename(target), width: metadata.width, height: metadata.height });
    await page.close();
  }
} finally { await browser.close(); }
const formatter = await readFile(path.join(sourceRoot, 'src/render.ts'));
await writeFile(path.join(directory, 'provenance.json'), JSON.stringify({
  origin: 'Screenshots of actual renderComment output, generated locally using entirely synthetic inputs. No production UI was captured.',
  source: 'change-gate/src/render.ts',
  sourceSha256: createHash('sha256').update(formatter).digest('hex'),
  fixture: 'report-fixture.json',
  mode: fixture.mode,
  networkCalls: false,
  outputs
}, null, 2) + '\n');
console.log(JSON.stringify({ decision: decision.action, class: decision.changeClass, risk: risk.grade, outputs }));
