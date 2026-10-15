import assert from 'node:assert/strict';
import test from 'node:test';

import { createResponse, getTextAnswer, parsePrompt, presets } from './GenerativeUIComparison.data.js';
import { countAnswerWords, getRichItemCount, getStreamProgress, streamAnswer } from './GenerativeUIComparison.stream.js';

test('streamed words remain an exact prefix and finish as the complete calculated answer', () => {
  for (const { prompt } of presets) {
    const answer = getTextAnswer(createResponse(parsePrompt(prompt).query));
    const total = countAnswerWords(answer);
    const full = [ answer.introduction, ...answer.lines, answer.conclusion ].join('');
    let previous = '';

    for (let limit = 0; limit <= total; limit++) {
      const visible = streamAnswer(answer, limit);
      const text = [ visible.introduction, ...visible.lines, visible.conclusion ].join('');
      assert.ok(full.startsWith(text));
      assert.ok(text.startsWith(previous));
      previous = text;
    }

    const { activePart, ...completed } = streamAnswer(answer, Infinity);
    assert.deepEqual(completed, answer);
    assert.equal(activePart, -1);
    assert.equal(previous, full);
  }
});

test('streaming starts empty and its completion includes every word and UI item for every view', () => {
  const prompts = [ ...presets.map(({ prompt }) => prompt), 'Show revenue as a chart', 'Show orders as a table in April', 'Summarize conversion in May', 'Review revenue exceptions for UK in May' ];
  for (const prompt of prompts) {
    const response = createResponse(parsePrompt(prompt).query);
    const answer = getTextAnswer(response);
    const itemCount = getRichItemCount(response);
    const start = getStreamProgress(0, answer, itemCount);
    assert.equal(start.words, 0);
    assert.equal(start.items, 0);
    const halfway = getStreamProgress(500, answer, itemCount);
    assert.ok(halfway.words > 0 && halfway.words < countAnswerWords(answer));
    assert.ok(halfway.items > 0 && halfway.items < itemCount);
    const end = getStreamProgress(start.duration, answer, itemCount);
    assert.ok(end.words >= countAnswerWords(answer));
    assert.ok(end.items >= itemCount);
  }
});
