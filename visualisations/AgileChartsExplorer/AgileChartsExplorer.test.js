import assert from 'node:assert/strict';
import test from 'node:test';

import { burndownRows, charts, cumulativeBoundaries, mean, remainingWork, rollingMean } from './AgileChartsExplorer.data.js';

test('the same burndown can conceal different completion and scope histories', () => {
  const [ completed, rescoped ] = charts.burndown.scenarios;

  assert.deepEqual(completed.values, rescoped.values);
  assert.deepEqual(burndownRows(completed).at(-1), { 'completed': 50, 'day': 10, 'remaining': 0, 'removed': 0 });
  assert.deepEqual(burndownRows(rescoped).at(-1), { 'completed': 36, 'day': 10, 'remaining': 0, 'removed': 14 });
  for (const scenario of charts.burndown.scenarios)
    for (const row of burndownRows(scenario)) {
      assert.equal(row.remaining + row.completed + row.removed, 50);
      assert.ok(row.remaining >= 0 && row.completed >= 0 && row.removed >= 0);
    }

});

test('burnup and burndown reconcile when scope changes but completion does not', () => {
  const [ fixed, expanded, revised ] = charts.epic.scenarios;

  assert.deepEqual(fixed.completed, expanded.completed);
  assert.deepEqual(fixed.completed, revised.completed);
  assert.equal(remainingWork(fixed.scope, fixed.completed).at(-1), 10);
  assert.equal(remainingWork(expanded.scope, expanded.completed).at(-1), 50);
  assert.equal(remainingWork(revised.scope, revised.completed).at(-1), 0);
  for (const scenario of charts.epic.scenarios)
    assert.ok(remainingWork(scenario.scope, scenario.completed).every((value) => value >= 0));

});

test('trailing mean uses exactly five completed items and never includes unfinished ages', () => {
  assert.deepEqual(rollingMean([ 2, 14, 5, 18, 8, 1 ]), [ null, null, null, null, 9.4, 9.2 ]);
  const narrow = charts.control.scenarios[0];
  const result = rollingMean(narrow.dots.map((dot) => dot.days));

  assert.equal(result.at(-1), 5.8);
  assert.equal(Math.max(...narrow.unfinished.map((item) => item.age)), 18);
  assert.ok(narrow.dots.every((dot) => dot.days <= 7));
  for (const scenario of charts.control.scenarios) {
    const durations = scenario.dots.map((dot) => dot.days);

    assert.equal(rollingMean(durations).at(-1), mean(durations.slice(-5)));
  }
});

test('cumulative flow boundaries conserve each state and remain cumulative', () => {
  for (const scenario of charts.flow.scenarios) {
    const boundaries = cumulativeBoundaries(scenario.states);

    for (let index = 0; index < 8; index++) {
      assert.equal(boundaries.active[index] - boundaries.done[index], scenario.states.active[index]);
      assert.equal(boundaries.queued[index] - boundaries.active[index], scenario.states.queued[index]);
      assert.ok(Object.values(boundaries).every((values) => index === 0 || values[index] >= values[index - 1]));

    }
  }
  assert.deepEqual(cumulativeBoundaries(charts.flow.scenarios[2].states).queued, Array(8).fill(32));
});
