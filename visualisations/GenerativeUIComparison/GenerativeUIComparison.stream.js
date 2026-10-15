export const STREAM_START_MS = 240;
export const WORD_INTERVAL_MS = 34;
export const ITEM_INTERVAL_MS = 380;

const words = (text) => text.match(/\S+\s*/g) || [];

export const countAnswerWords = (answer) => [ answer.introduction, ...answer.lines, answer.conclusion ]
  .reduce((count, text) => count + words(text).length, 0);

// Keep the answer's actual paragraphs and list items as their words arrive.
export const streamAnswer = (answer, wordLimit) => {
  const parts = [ answer.introduction, ...answer.lines, answer.conclusion ];
  let remaining = wordLimit;
  let activePart = -1;
  const visible = parts.map((text, index) => {
    const tokens = words(text);
    const count = Math.max(0, Math.min(tokens.length, remaining));
    remaining -= tokens.length;
    if (count > 0) activePart = index;
    return tokens.slice(0, count).join('');
  });

  return {
    introduction: visible[0],
    lines: visible.slice(1, -1),
    conclusion: visible.at(-1),
    activePart: wordLimit >= countAnswerWords(answer) ? -1 : activePart
  };
};

export const getRichItemCount = (response) => {
  const { query, rows, monthly, exceptions } = response;
  const count = query.view === 'comparison' ? monthly.length : rows.length;

  // Filters, heading, then the content selected by the question.
  if (query.view === 'exceptions') return 2 + Math.max(1, exceptions.length) + 1;
  if (query.view === 'summary') return 4;
  if (query.view === 'table' || query.view === 'chart') return 2 + count + 1;
  return 2 + count * 2 + 1;
};

export const getStreamProgress = (elapsed, answer, itemCount) => ({
  words: Math.max(0, Math.floor((elapsed - STREAM_START_MS) / WORD_INTERVAL_MS)),
  items: Math.max(0, Math.floor((elapsed - STREAM_START_MS) / ITEM_INTERVAL_MS) + 1),
  duration: STREAM_START_MS + Math.max(countAnswerWords(answer) * WORD_INTERVAL_MS, itemCount * ITEM_INTERVAL_MS)
});
