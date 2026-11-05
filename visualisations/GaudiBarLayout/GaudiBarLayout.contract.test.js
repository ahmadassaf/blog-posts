import assert from 'node:assert/strict';
import test from 'node:test';

import { barLineRanges, buildConfigLines, configRegions, configSource, layoutConfig, pluginNotes, regionLineNumbers } from './GaudiBarLayout.config.js';
import { gaudiBarRegions } from './GaudiBarLayout.data.js';

test('GaudiBarLayout preserves three clear regions while leaving the lower middle empty', () => {
  const topRegions = gaudiBarRegions.filter((region) => region.bar === 'top');
  const bottomRegions = gaudiBarRegions.filter((region) => region.bar === 'bottom');

  assert.deepEqual(topRegions.map((region) => region.label), [ 'Left region', 'Middle region', 'Right region' ]);
  assert.deepEqual(bottomRegions.map((region) => region.label), [ 'Left region', 'Middle region', 'Right region' ]);
  assert.equal(bottomRegions[1].widgets.length, 0);
  assert.equal(bottomRegions[2].widgets.length, 5);
});

test('GaudiBarLayout region and widget labels remain unique within their scope', () => {
  assert.equal(new Set(gaudiBarRegions.map((region) => region.id)).size, gaudiBarRegions.length);

  for (const region of gaudiBarRegions)
    assert.equal(new Set(region.widgets.map((widget) => widget.label)).size, region.widgets.length);
});

// The scene's selection drives the config highlight, so every scene region id must have a config line.
test('every scene region id has a line in the config mapping, and nothing else does', () => {
  const numbers = regionLineNumbers(layoutConfig);

  assert.deepEqual(Object.keys(numbers).sort(), gaudiBarRegions.map((region) => region.id).sort());
  for (const region of gaudiBarRegions) assert.equal(region.bar, configRegions.find((entry) => entry.id === region.id).bar);
});

// The snippet the post prints under "Setting Up the Layout", verbatim.
const postSnippet = [
  'module.exports = {',
  '    top: {',
  '        left: ["weather", "crypto", "github", "prayerTime"],',
  '        middle: [],',
  '        right: ["dnd", "time", "battery", "network"]',
  '    },',
  '    bottom: {',
  '        left: ["yabai"],',
  '        middle: [],',
  '        right: ["stats"]',
  '    }',
  '}'
].join('\n');

test('the rendered config matches the lib/configs.js snippet in the post line for line', () => {
  assert.equal(configSource, postSnippet);
});

test('every region maps to exactly one line, lines never overlap, and each line names its own plugins', () => {
  const numbers = regionLineNumbers(layoutConfig);
  const lines = buildConfigLines(layoutConfig);
  const claimed = Object.values(numbers).flat();

  assert.deepEqual(Object.keys(numbers).sort(), configRegions.map((region) => region.id).sort());
  assert.equal(new Set(claimed).size, claimed.length);

  for (const region of configRegions) {
    assert.equal(numbers[region.id].length, 1, `${region.id} should occupy one line`);
    const [ text ] = numbers[region.id].map((number) => lines[number - 1].text);

    assert.match(text.trim(), new RegExp(`^${region.region}: \\[`));
    for (const plugin of region.plugins) assert.ok(text.includes(`"${plugin}"`), `${plugin} should appear on the ${region.id} line`);
    if (region.plugins.length === 0) assert.ok(text.includes('[]'), `${region.id} should render an empty array`);
  }
});

test('region lines sit inside the braces of their own primary bar', () => {
  const numbers = regionLineNumbers(layoutConfig);
  const ranges = barLineRanges(layoutConfig);

  assert.ok(ranges.top.end < ranges.bottom.start, 'top closes before bottom opens');
  for (const region of configRegions)
    for (const number of numbers[region.id]) {
      assert.ok(number > ranges[region.bar].start, `${region.id} line ${number} is after ${region.bar} opens`);
      assert.ok(number < ranges[region.bar].end, `${region.id} line ${number} is before ${region.bar} closes`);
    }
});

test('the mapping follows the config it is given, not the default', () => {
  const custom = { 'bottom': { 'left': [], 'middle': [ 'date' ], 'right': [] }, 'top': { 'left': [ 'time' ], 'middle': [], 'right': [] } };
  const lines = buildConfigLines(custom);
  const numbers = regionLineNumbers(custom);

  assert.equal(lines[numbers['bottom-middle'][0] - 1].text.trim(), 'middle: ["date"],');
  assert.equal(lines[numbers['top-left'][0] - 1].text.trim(), 'left: ["time"],');
  assert.equal(lines[numbers['top-right'][0] - 1].text.trim(), 'right: []');
});

test('every configured plugin has one note, is placed once, and the lower middle stays empty', () => {
  const placed = configRegions.flatMap((region) => region.plugins);

  assert.equal(new Set(placed).size, placed.length);
  for (const plugin of placed) assert.equal(typeof pluginNotes[plugin], 'string', `${plugin} needs a one-line note`);
  assert.deepEqual(layoutConfig.bottom.middle, []);
  assert.deepEqual(layoutConfig.top.middle, []);
});
