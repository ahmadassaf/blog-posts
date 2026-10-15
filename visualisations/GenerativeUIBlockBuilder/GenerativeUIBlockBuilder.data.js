export const revenueRows = Object.freeze([
  { id: 'uk', market: 'UK', revenue: 156000, target: 150000 },
  { id: 'germany', market: 'Germany', revenue: 102000, target: 120000 },
  { id: 'france', market: 'France', revenue: 95000, target: 90000 }
].map((row) => Object.freeze(row)));

export const blockCatalog = Object.freeze([
  { id: 'revenue-summary', name: 'Summary' },
  { id: 'revenue-chart', name: 'Chart' },
  { id: 'revenue-table', name: 'Table' },
  { id: 'revenue-notes', name: 'Notes' }
].map((block) => Object.freeze(block)));

export const promptExamples = Object.freeze([
  'Start with a summary, then chart and table',
  'Just a table and notes',
  'Chart first, then summary'
]);

export const initialComposition = Object.freeze([ 'revenue-summary', 'revenue-notes' ]);
export const initialNotes = 'Germany is £18,000 below target. Discuss the recovery plan at the next sales review.';

export const formatMoney = (value) => new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP', maximumFractionDigits: 0
}).format(value);

export const getRevenueTotals = () => revenueRows.reduce((totals, row) => ({
  revenue: totals.revenue + row.revenue,
  target: totals.target + row.target
}), { revenue: 0, target: 0 });

// This is intentionally a small text parser, not language-model inference.
// Names are read left to right; these connector words may surround them.
const connectors = new Set([
  'a', 'an', 'and', 'arrange', 'by', 'first', 'followed', 'include', 'it',
  'just', 'me', 'my', 'next', 'only', 'please', 'put', 'show', 'start',
  'the', 'then', 'view', 'with'
]);

export const composeView = (prompt, currentComposition) => {
  const words = typeof prompt === 'string' ? prompt.toLowerCase().match(/[a-z]+/g) || [] : [];
  const namedBlocks = new Map(blockCatalog.map((block) => [ block.name.toLowerCase(), block.id ]));
  const names = words.filter((word) => namedBlocks.has(word));

  if (!names.length) {
    return {
      ok: false,
      composition: currentComposition,
      message: 'Name at least one block: Summary, Chart, Table or Notes. Your view has not changed.'
    };
  }

  const unsupported = words.find((word) => !namedBlocks.has(word) && !connectors.has(word));

  if (unsupported || /[0-9]/.test(prompt)) {
    return {
      ok: false,
      composition: currentComposition,
      message: 'This small demo accepts the four block names in order, joined with words such as “then” or “and”. Try an example and edit its block names. Your view has not changed.'
    };
  }

  return {
    ok: true,
    composition: [ ...new Set(names.map((name) => namedBlocks.get(name))) ],
    message: 'View composed. Your figures and notes are unchanged.'
  };
};

export const toggleBlock = (composition, id) => {
  if (!blockCatalog.some((block) => block.id === id)) return composition;
  return composition.includes(id) ? composition.filter((blockId) => blockId !== id) : [ ...composition, id ];
};

export const moveBlock = (composition, id, direction) => {
  const index = composition.indexOf(id);
  const nextIndex = index + direction;
  if ((direction !== -1 && direction !== 1) || index < 0 || nextIndex < 0 || nextIndex >= composition.length) return composition;
  const result = [ ...composition ];
  [ result[index], result[nextIndex] ] = [ result[nextIndex], result[index] ];
  return result;
};
