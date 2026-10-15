import assert from 'node:assert/strict';
import test from 'node:test';

import { baselineHours, comparePrediction, predictionSnapshot, trials, withinWorkingDay } from './ImprovementKataExplorer.data.js';

test('working-day counts agree with the explicit eight-hour boundary and baseline', () => {
  assert.equal(withinWorkingDay(baselineHours), 4);
  assert.equal(withinWorkingDay([ 8, 8.01 ]), 1);
  assert.deepEqual([ 'window', 'backup', 'reminder' ].map((id) => withinWorkingDay(trials[id].hours)), [ 3, 4, 3 ]);
  for (const trial of Object.values(trials)) assert.equal(trial.observations.length, trial.hours.length);
});

test('prediction comparison handles a miss, a match, and a conservative prediction without a false success claim', () => {
  assert.deepEqual(comparePrediction(trials.window.hours, 4), { 'actual': 3, 'comparison': '1 fewer than you predicted.' });
  assert.deepEqual(comparePrediction(trials.backup.hours, 4), { 'actual': 4, 'comparison': 'The count matches your prediction.' });
  assert.deepEqual(comparePrediction(trials.reminder.hours, 0), { 'actual': 3, 'comparison': '3 more than you predicted.' });
});

test('recording a prediction copies the assumption independently of later draft changes', () => {
  const draft = { 'expected': 4, 'note': ' Protected time will help. ' };
  const saved = predictionSnapshot(draft.expected, draft.note);

  draft.expected = 5;
  draft.note = 'A different assumption';
  assert.deepEqual(saved, { 'expected': 4, 'note': 'Protected time will help.' });
  assert.throws(() => predictionSnapshot(6, ''), RangeError);
});
