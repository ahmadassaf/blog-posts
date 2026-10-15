import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createResponse,
  formatMetric,
  getTextAnswer,
  parsePrompt,
  presets,
  salesRecords,
  sortRows,
  summarize
} from './GenerativeUIComparison.data.js';

test('the three rough requests select distinct interfaces over the same sample', () => {
  assert.equal(salesRecords.length, 6);
  const parsed = presets.map((preset) => parsePrompt(preset.prompt));
  assert.ok(parsed.every((result) => result.ok));
  assert.deepEqual(parsed.map((result) => result.query.view), [ 'overview', 'comparison', 'exceptions' ]);
  assert.deepEqual(parsed.map((result) => result.query.region), [ 'All regions', 'UK', 'All regions' ]);
});

test('the text answer and dashboard share May revenue, targets and exceptions', () => {
  const response = createResponse(parsePrompt(presets[0].prompt).query);
  const answer = getTextAnswer(response);

  assert.equal(response.totals.revenue, 353000);
  assert.equal(response.totals.target, 360000);
  assert.equal(response.totals.gap, -7000);
  assert.equal(response.totals.orders, 2345);
  assert.equal(response.totals.visits, 56000);
  assert.deepEqual(response.exceptions.map((row) => row.region), [ 'Germany' ]);
  assert.match(answer.introduction, /£353,000.*£360,000.*−£7,000/);
  assert.ok(answer.lines.some((line) => /Germany: £102,000, −£18,000/.test(line)));
});

test('conversion is a weighted aggregate, not the average of regional percentages', () => {
  const response = createResponse(parsePrompt('Summarize conversion in May').query);
  assert.equal(response.totals.conversion, 2345 / 56000 * 100);
  const unweighted = response.rows.reduce((sum, row) => sum + row.conversion, 0) / response.rows.length;
  assert.notEqual(response.totals.conversion, unweighted);
  assert.equal(formatMetric(response.totals.conversion, 'conversion'), '4.19%');
  assert.match(getTextAnswer(response).introduction, /Conversion .* is 4\.19%/);
  assert.doesNotMatch(getTextAnswer(response).introduction, /totals/);
  assert.match(getTextAnswer(response).conclusion, /2,345 orders divided by 56,000 visits/);
});

test('region and month scope apply identically to rows, aggregates and comparisons', () => {
  const response = createResponse(parsePrompt('Give me a revenue table for France in April').query);
  assert.equal(response.query.view, 'table');
  assert.equal(response.recordCount, 1);
  assert.equal(response.totals.revenue, 76000);
  assert.deepEqual(response.rows.map((row) => row.id), [ 'france-april' ]);
  assert.deepEqual(response.monthly.map((row) => row.revenue), [ 76000, 95000 ]);

  const uk = createResponse(parsePrompt(presets[1].prompt).query);
  assert.deepEqual(uk.monthly.map((row) => row.revenue), [ 120000, 156000 ]);
  assert.match(getTextAnswer(uk).introduction, /increased by £36,000/);
});

test('unsupported requests return an error without manufacturing a fallback query', () => {
  for (const prompt of [ '', 'Write me a poem', 'Show revenue in Spain', 'Show revenue in Japan', 'Show revenue for Norway', 'Show revenue for June', 'Forecast sales', 'Show profit for UK', 'Show weekly revenue', 'Show orders below target', 'Show revenue and orders', 'Show revenue for Germany and France', 'Show revenue with no chart', 'Show revenue without a table' ]) {
    const result = parsePrompt(prompt);
    assert.equal(result.ok, false, prompt);
    assert.ok(result.message);
    assert.equal(result.query, undefined, 'failed parsing cannot silently change the current answer');
  }
});

test('editable prompt keywords select metrics and layout with honest defaults', () => {
  const orders = parsePrompt('Show orders by region in April').query;
  assert.equal(orders.metric, 'orders');
  assert.equal(orders.month, 'April');
  assert.equal(orders.region, 'All regions');
  assert.equal(createResponse(orders).totals.orders, 2000);
  assert.equal(parsePrompt('Summarize conversion in May').query.view, 'summary');
  assert.equal(parsePrompt('Show revenue as a table').query.view, 'table');
  assert.equal(parsePrompt('Show revenue as just a chart').query.view, 'chart');
  assert.equal(parsePrompt('Show revenue as a chart and table').query.view, 'overview');
});

test('unsupported periods never silently become the default May response', () => {
  for (const prompt of [
    'Show revenue in May 2019', 'Show revenue in May 2030', 'Show revenue on May 16',
    'Show revenue on 16 May 2026', 'Show revenue on 2026-05-16', 'Show revenue for 05/2026',
    'Show last month revenue', 'Show revenue this year', 'Show year-to-date revenue',
    'Show Q2 revenue', 'Show annual revenue', 'Show 2026 revenue'
  ]) {
    assert.equal(parsePrompt(prompt).ok, false, prompt);
  }
  assert.equal(parsePrompt('Show revenue in May 2026').query.month, 'May');
  assert.equal(parsePrompt('Compare revenue for April and May 2026').query.view, 'comparison');
});

test('scope and metric qualifiers cannot silently override a named region or missing targets', () => {
  assert.equal(parsePrompt('Show all UK revenue in May').query.region, 'UK');
  assert.equal(parsePrompt('Show revenue across all regions in May').query.region, 'All regions');
  assert.equal(parsePrompt('Show revenue for UK in Norway').ok, false);
  assert.equal(parsePrompt('Show revenue for the United States').ok, false);
  assert.equal(parsePrompt('Show sales and orders').ok, false);
  for (const metric of [ 'orders', 'conversion' ]) {
    for (const target of [ 'target', 'targets' ]) {
      assert.equal(parsePrompt(`Show ${metric} against ${target}`).ok, false);
    }
  }
  assert.equal(parsePrompt('Show revenue against targets').query.highlightBelowTarget, true);
  assert.equal(parsePrompt('Compare revenue exceptions in April and May').ok, false);
});

test('conversion comparisons describe a rate difference in percentage points', () => {
  const response = createResponse(parsePrompt('Compare UK conversion in April and May').query);
  const answer = getTextAnswer(response);
  assert.match(answer.introduction, /increased by 0\.55 percentage points/);
  assert.deepEqual(answer.lines, [ 'April: 4.00%.', 'May: 4.55%.' ]);
});

test('the review ranks real shortfalls and offers a genuine empty scope', () => {
  const query = parsePrompt(presets[2].prompt).query;
  const april = createResponse({ ...query, month: 'April' });
  assert.deepEqual(april.visibleRows.map((row) => [ row.region, row.gap ]), [ [ 'UK', -10000 ], [ 'France', -4000 ], [ 'Germany', -2000 ] ]);
  assert.equal(createResponse({ ...query, region: 'UK' }).visibleRows.length, 0);
  assert.equal(createResponse({ ...query, region: 'Germany' }).visibleRows.length, 1);
});

test('sorting is deterministic and does not mutate the shared source or calculated rows', () => {
  const response = createResponse(parsePrompt(presets[0].prompt).query);
  const original = structuredClone(response.rows);
  assert.deepEqual(sortRows(response.rows, 'revenue', 'ascending').map((row) => row.region), [ 'France', 'Germany', 'UK' ]);
  assert.deepEqual(sortRows(response.rows, 'gap', 'ascending').map((row) => row.region), [ 'Germany', 'France', 'UK' ]);
  assert.deepEqual(response.rows, original);
  assert.equal(summarize(salesRecords).revenue, 647000);
  assert.equal(summarize([]).conversion, 0);
});
