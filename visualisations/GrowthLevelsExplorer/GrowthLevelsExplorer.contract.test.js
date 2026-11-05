import assert from 'node:assert/strict';
import test from 'node:test';

import { defaultLevelId, findLevel, levelLabel, levels } from './GrowthLevelsExplorer.data.js';

const requiredFields = [ 'description', 'evidence', 'experiment', 'id', 'kind', 'leadership', 'name', 'support', 'technical' ];

test('every level carries examples, evidence, support and an experiment as non-empty text', () => {
  assert.equal(levels.length, 6);
  for (const level of levels)
    for (const field of requiredFields) {
      assert.equal(typeof level[field], 'string', `${level.id}.${field} is a string`);
      assert.ok(level[field].trim().length > 0, `${level.id}.${field} is not empty`);
    }
});

test('level ids and names are unique and ordered from L1 to L6', () => {
  assert.deepEqual(levels.map((level) => level.id), [ 'l1', 'l2', 'l3', 'l4', 'l5', 'l6' ]);
  assert.deepEqual(levels.map((level) => level.name), [ 'L1', 'L2', 'L3', 'L4', 'L5', 'L6' ]);
  assert.equal(new Set(levels.map((level) => level.kind)).size, levels.length);
});

test('findLevel returns the requested level and falls back to the default for unknown ids', () => {
  assert.equal(findLevel('l5').name, 'L5');
  assert.equal(findLevel('nope').id, defaultLevelId);
  assert.equal(findLevel(undefined).id, defaultLevelId);
  assert.ok(levels.some((level) => level.id === defaultLevelId));
});

test('levelLabel is the name and scope only', () => {
  assert.equal(levelLabel(findLevel('l3')), 'L3: Open project');
  assert.equal(levelLabel(findLevel('l6')), 'L6: Company');
});
