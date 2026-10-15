import assert from 'node:assert/strict';
import test from 'node:test';

import { createResponse, getTextAnswer, parsePrompt, presets } from './GenerativeUIComparison.data.js';
import { createWorkspace, submitQuery, toggleReview, updateScope } from './GenerativeUIComparison.workspace.js';

const initial = () => createWorkspace(parsePrompt(presets[0].prompt).query);
const submit = (workspace, prompt) => submitQuery(workspace, parsePrompt(prompt, workspace.scope).query);

test('a follow-up with no region or month preserves local filters and applies them to both answers', () => {
  const filtered = updateScope(initial(), { month: 'April', region: 'Germany' });
  const next = submit(filtered, 'Show orders as a table');

  assert.deepEqual(next.scope, { month: 'April', region: 'Germany' });
  assert.equal(next.query.view, 'table');
  const response = createResponse(next.query);
  assert.deepEqual(response.rows.map((row) => row.id), [ 'germany-april' ]);
  assert.equal(response.totals.orders, 700);
  assert.match(getTextAnswer(response).introduction, /Germany in April 2026 totals 700/);
  assert.equal(filtered.query.region, 'All regions', 'local controls leave the existing written answer unchanged');
});

test('explicit new scope overrides conflicting filters, including a request for all regions', () => {
  const filtered = updateScope(initial(), { month: 'April', region: 'Germany' });
  const next = submit(filtered, 'Show May revenue across all regions');

  assert.deepEqual(next.scope, { month: 'May', region: 'All regions' });
  assert.equal(createResponse(next.query).totals.revenue, 353000);
  const oneField = submit(filtered, 'Show orders in May');
  assert.deepEqual(oneField.scope, { month: 'May', region: 'Germany' });
});

test('review selections survive format, metric, and scope changes without becoming new selections', () => {
  const review = submit(initial(), presets[2].prompt);
  const row = createResponse(review.query).exceptions[0];
  const saved = toggleReview(review, row);
  const next = submit(saved, 'Show April orders for France as a table');

  assert.equal(next.agenda.length, 1);
  assert.equal(next.agenda[0].id, 'germany-may');
  assert.equal(next.agenda[0].gap, -18000);
  assert.equal(next.query.metric, 'orders');
  assert.equal(next.query.region, 'France');
  assert.deepEqual(toggleReview(next, row).agenda, []);
  assert.equal(saved.agenda.length, 1, 'state updates do not mutate earlier work');
});

test('record inspection stays only while the new view still contains that record', () => {
  const inspected = { ...initial(), selectedId: 'germany-may' };
  assert.equal(submit(inspected, 'Show orders as a table').selectedId, 'germany-may');
  assert.equal(updateScope(inspected, { region: 'Germany' }).selectedId, 'germany-may');
  assert.equal(updateScope(inspected, { month: 'April' }).selectedId, null);
  assert.equal(submit(inspected, 'Show revenue for UK').selectedId, null);
  assert.equal(submit(inspected, 'Compare revenue between April and May').selectedId, null);
  assert.equal(submit({ ...initial(), selectedId: 'uk-may' }, 'Show only regions below revenue target').selectedId, null);
});

test('a two-month comparison does not invent a new single-month filter for the following view', () => {
  const filtered = updateScope(initial(), { month: 'April', region: 'Germany' });
  const comparison = submit(filtered, 'Compare revenue between April and May');
  const summary = submit(comparison, 'Summarize revenue');

  assert.equal(comparison.query.view, 'comparison');
  assert.deepEqual(summary.scope, { month: 'April', region: 'Germany' });
});

test('repeating a question keeps review work; reset creates an empty default workspace', () => {
  const review = submit(initial(), presets[2].prompt);
  const row = createResponse(review.query).exceptions[0];
  const saved = toggleReview(review, row);
  const repeated = submit(saved, saved.query.prompt);

  assert.deepEqual(repeated.agenda, saved.agenda);
  assert.deepEqual(initial().agenda, []);
  assert.deepEqual(initial().scope, { month: 'May', region: 'All regions' });
});
