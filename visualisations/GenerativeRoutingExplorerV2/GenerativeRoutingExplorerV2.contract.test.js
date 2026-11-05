import assert from 'node:assert/strict';
import test from 'node:test';

import { acquisitionRecord, computeFinding, countStale, defaultAssumptions, describeAssumption, followUp, formatDelta, formatMoney, latestEurByPeriod, reviewFinding, routeOrder, routes } from './GenerativeRoutingExplorerV2.data.js';

test('every route lists the assumptions it depends on and appears once in the trail order', () => {
  assert.deepEqual([ ...routeOrder ].sort(), Object.keys(routes).sort());
  for (const route of Object.values(routes)) for (const key of route.depends) assert.ok(key in defaultAssumptions, `${key} is a known assumption`);
  assert.deepEqual(routes.currency.depends, routes.period.depends);
});

test('the default scenario reproduces the figures the post quotes', () => {
  const currency = computeFinding('currency', defaultAssumptions);

  assert.equal(latestEurByPeriod.FY2025 / defaultAssumptions.rate, 12);
  assert.equal(formatMoney(currency.value), '£12.00m');
  assert.deepEqual(currency.assumptions, { 'period': 'FY2025', 'rate': 1.2 });
  assert.match(currency.summary, /\+£2\.00m against the £10m acquisition record/u);
  assert.equal(computeFinding('period', { ...defaultAssumptions, 'period': 'FY2024' }).value, acquisitionRecord.valueGbp);
  assert.equal(computeFinding('definition', defaultAssumptions).value, 10);
  assert.equal(computeFinding('sources', { ...defaultAssumptions, 'source': 'draft' }).value, 12);
  assert.throws(() => computeFinding('evidence', defaultAssumptions), RangeError);
});

test('a saved finding keeps its own assumptions and flips to needs-review when the rate changes', () => {
  const saved = computeFinding('currency', defaultAssumptions);
  const fresh = reviewFinding(saved, defaultAssumptions);

  assert.equal(fresh.stale, false);
  assert.deepEqual(fresh.changes, []);
  assert.equal(fresh.delta, 0);

  const review = reviewFinding(saved, { ...defaultAssumptions, 'rate': 1.35 });

  assert.equal(review.stale, true);
  assert.deepEqual(review.changes, [{ 'from': 1.2, 'key': 'rate', 'label': 'Exchange rate', 'to': 1.35 }]);
  assert.equal(formatMoney(review.current.value), '£10.67m');
  assert.equal(formatDelta(review.delta), '−£1.33m');
  assert.equal(formatMoney(saved.value), '£12.00m', 'the saved value is untouched until it is recomputed');
});

test('only the assumptions a route depends on can stale it, and recomputing brings it current', () => {
  const definition = computeFinding('definition', defaultAssumptions);
  const sources = computeFinding('sources', defaultAssumptions);
  const rateChanged = { ...defaultAssumptions, 'rate': 1.4 };

  assert.equal(reviewFinding(definition, rateChanged).stale, false);
  assert.equal(reviewFinding(sources, rateChanged).stale, false);
  assert.equal(reviewFinding(definition, { ...defaultAssumptions, 'adjustment': false }).delta, 2);
  assert.equal(reviewFinding(sources, { ...defaultAssumptions, 'source': 'draft' }).delta, 2);

  const findings = { 'currency': computeFinding('currency', defaultAssumptions), definition, 'period': computeFinding('period', defaultAssumptions) };

  assert.equal(countStale(findings, rateChanged), 2);

  const recomputed = { ...findings, 'currency': reviewFinding(findings.currency, rateChanged).current };

  assert.equal(countStale(recomputed, rateChanged), 1);
  assert.equal(reviewFinding(recomputed.currency, rateChanged).stale, false);
});

test('a period change reports both the old and new value and formats assumptions for people', () => {
  const saved = computeFinding('period', defaultAssumptions);
  const review = reviewFinding(saved, { ...defaultAssumptions, 'period': 'FY2024' });

  assert.deepEqual(review.changes.map((change) => `${change.label}: ${describeAssumption(change.key, change.from)} → ${describeAssumption(change.key, change.to)}`), [ 'Latest period: FY2025 → FY2024' ]);
  assert.equal(formatDelta(review.delta), '−£2.00m');
  assert.equal(describeAssumption('rate', 1.2), '€1.20 per £1');
  assert.equal(describeAssumption('adjustment', false), 'add-back kept');
  assert.equal(describeAssumption('source', 'draft'), 'Draft report (2 June)');
  assert.equal(formatDelta(0.004), 'no change');
});

test('follow-up guidance tracks the live assumptions and stays silent for the what-if examples', () => {
  assert.equal(followUp('currency', defaultAssumptions).target, 'period');
  assert.match(followUp('currency', defaultAssumptions).title, /periods differ/u);
  assert.match(followUp('period', { ...defaultAssumptions, 'period': 'FY2024' }).title, /reconcile/u);
  assert.match(followUp('period', defaultAssumptions).title, /remaining difference/u);
  assert.equal(followUp('definition', defaultAssumptions), null);
  assert.equal(followUp('sources', defaultAssumptions), null);
});
