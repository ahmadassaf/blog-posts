import assert from 'node:assert/strict';
import test from 'node:test';

import {
  blockCatalog,
  composeView,
  getRevenueTotals,
  initialComposition,
  moveBlock,
  promptExamples,
  revenueRows,
  toggleBlock
} from './GenerativeUIBlockBuilder.data.js';

test('each editable example composes the named blocks in the stated order', () => {
  const expected = [
    [ 'revenue-summary', 'revenue-chart', 'revenue-table' ],
    [ 'revenue-table', 'revenue-notes' ],
    [ 'revenue-chart', 'revenue-summary' ]
  ];

  promptExamples.forEach((prompt, index) => {
    const result = composeView(prompt, initialComposition);
    assert.equal(result.ok, true);
    assert.deepEqual(result.composition, expected[index]);
  });
});

test('case and repeated names do not change stable block identities or first-mentioned order', () => {
  const result = composeView('NOTES, then Chart and notes, then SUMMARY and chart', initialComposition);
  assert.equal(result.ok, true);
  assert.deepEqual(result.composition, [ 'revenue-notes', 'revenue-chart', 'revenue-summary' ]);
  assert.equal(new Set(blockCatalog.map((block) => block.id)).size, blockCatalog.length);
});

test('missing names, unsupported blocks and unrecognized instructions preserve the existing view', () => {
  const current = [ 'revenue-notes', 'revenue-table' ];

  for (const prompt of [ '', 'Show me something useful', 'Chart and map', 'Summary without table', 'Table after chart', '2 charts', null ]) {
    const result = composeView(prompt, current);
    assert.equal(result.ok, false, `${prompt} is outside the documented parser`);
    assert.equal(result.composition, current, 'rejection must preserve the exact current composition');
    assert.match(result.message, /not changed/);
  }
});

test('manual composition can remove every block, restore one, and move without changing its identity', () => {
  const original = [ 'revenue-summary', 'revenue-table' ];
  const withNotes = toggleBlock(original, 'revenue-notes');
  const moved = moveBlock(withNotes, 'revenue-notes', -1);
  assert.deepEqual(moved, [ 'revenue-summary', 'revenue-notes', 'revenue-table' ]);
  assert.deepEqual(original, [ 'revenue-summary', 'revenue-table' ], 'manual operations are immutable');
  assert.equal(moveBlock(moved, 'revenue-summary', -1), moved);
  assert.equal(moveBlock(moved, 'revenue-table', 1), moved);
  assert.equal(toggleBlock(moved, 'unknown-block'), moved);

  let empty = moved;
  moved.forEach((id) => { empty = toggleBlock(empty, id); });
  assert.deepEqual(empty, []);
  assert.deepEqual(toggleBlock(empty, 'revenue-notes'), [ 'revenue-notes' ]);
});

test('summary and rendered charts and table share the same fictional May sales figures', () => {
  assert.deepEqual(getRevenueTotals(), { revenue: 353000, target: 360000 });
  const germany = revenueRows.find((row) => row.id === 'germany');
  assert.equal(germany.target - germany.revenue, 18000);
  const source = structuredClone(revenueRows);
  composeView('Chart then summary', initialComposition);
  toggleBlock(initialComposition, 'revenue-notes');
  assert.deepEqual(revenueRows, source, 'composition never changes source figures');
});
