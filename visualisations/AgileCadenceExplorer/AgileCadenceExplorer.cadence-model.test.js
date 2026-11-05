import assert from 'node:assert/strict';
import test from 'node:test';

import { createKanbanState, createScrumState, getKanbanCounts, getKanbanMove, getScrumStatus, KANBAN_LIMITS, moveKanbanItem, moveScrumDay, releaseScrumIncrement, SCRUM_READY_DAY, SCRUM_REVIEW_DAY } from './cadence-model.mjs';

const stageOf = (state, itemId) => state.items.find((item) => item.id === itemId).stage;

test('a full stage blocks the pull and leaves the board unchanged', () => {
  const state = createKanbanState();

  assert.equal(getKanbanCounts(state.items).review, KANBAN_LIMITS.review);
  assert.equal(getKanbanMove(state, 'saved').blocked, true);

  const blocked = moveKanbanItem(state, 'saved');

  assert.deepEqual(blocked.items, state.items);
  assert.match(blocked.feedback, /Review is full \(2\/2\)/);
  assert.equal(moveKanbanItem(state, 'unknown'), state);
});

test('the limit applies only to the destination stage, and finishing a review opens a slot', () => {
  let state = moveKanbanItem(createKanbanState(), 'export');

  assert.equal(stageOf(state, 'export'), 'progress', 'In Progress had capacity even though Review was full');
  assert.match(state.feedback, /Review is still full/);
  assert.equal(getKanbanMove(state, 'saved').blocked, true);

  state = moveKanbanItem(state, 'empty');
  assert.equal(stageOf(state, 'empty'), 'done');
  assert.equal(getKanbanMove(state, 'saved').blocked, false);

  state = moveKanbanItem(state, 'saved');
  assert.equal(stageOf(state, 'saved'), 'review');
  assert.equal(getKanbanCounts(state.items).review, KANBAN_LIMITS.review);
});

test('release needs a ready increment and records the day it happened', () => {
  const early = releaseScrumIncrement(moveScrumDay(createScrumState(), SCRUM_READY_DAY - 2));

  assert.equal(early.releasedDay, null);
  assert.match(early.feedback, new RegExp(`day ${SCRUM_READY_DAY}`));

  const released = releaseScrumIncrement(moveScrumDay(createScrumState(), 7));

  assert.equal(released.releasedDay, 7);
  assert.deepEqual(getScrumStatus(released), { 'ready': true, 'released': true });
  assert.equal(releaseScrumIncrement(released), released, 'a released increment cannot be released twice');
});

test('moving to a day before the release clears it, so the release never predates the current day', () => {
  const released = releaseScrumIncrement(moveScrumDay(createScrumState(), 7));
  const later = moveScrumDay(released, SCRUM_REVIEW_DAY);

  assert.equal(later.releasedDay, 7);
  assert.equal(getScrumStatus(later).released, true);
  assert.equal(moveScrumDay(released, 7).releasedDay, 7, 'the release day itself keeps the release');

  const earlier = moveScrumDay(released, 6);

  assert.equal(earlier.releasedDay, null);
  assert.deepEqual(getScrumStatus(earlier), { 'ready': true, 'released': false });
  assert.equal(releaseScrumIncrement(earlier).releasedDay, 6, 'releasing again records the new day');

  assert.equal(moveScrumDay(released, 0), released);
  assert.equal(moveScrumDay(released, SCRUM_REVIEW_DAY + 1), released);
  assert.equal(moveScrumDay(released, 7.5), released);
});
