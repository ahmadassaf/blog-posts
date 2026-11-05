import assert from 'node:assert/strict';
import test from 'node:test';

import { barLineRanges, buildConfigLines, configSource, layoutConfig, pluginNotes, regionLineNumbers, regions } from './GaudiBarLayoutV2.data.js';

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

  assert.deepEqual(Object.keys(numbers).sort(), regions.map((region) => region.id).sort());
  assert.equal(new Set(claimed).size, claimed.length);

  for (const region of regions) {
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
  for (const region of regions)
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
  const placed = regions.flatMap((region) => region.plugins);

  assert.equal(new Set(placed).size, placed.length);
  for (const plugin of placed) assert.equal(typeof pluginNotes[plugin], 'string', `${plugin} needs a one-line note`);
  assert.deepEqual(layoutConfig.bottom.middle, []);
  assert.deepEqual(layoutConfig.top.middle, []);
});
