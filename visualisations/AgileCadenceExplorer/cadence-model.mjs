// All cards, limits, and dates belong to a fictional teaching example.
export const KANBAN_LIMITS = Object.freeze({ 'progress': 2, 'review': 2 });
export const SCRUM_READY_DAY = 5;
export const SCRUM_REVIEW_DAY = 10;

const nextStages = { 'progress': 'review', 'ready': 'progress', 'review': 'done' };
const stageNames = { 'done': 'Done', 'progress': 'In Progress', 'ready': 'Ready', 'review': 'Review' };

export const createKanbanState = () => {
  return {
    'feedback': '',
    'items': [
      { 'id': 'export', 'stage': 'ready', 'title': 'Export search results' },
      { 'id': 'saved', 'stage': 'progress', 'title': 'Saved searches' },
      { 'id': 'empty', 'stage': 'review', 'title': 'Empty-state hints' },
      { 'id': 'typos', 'stage': 'review', 'title': 'Typo handling' }
    ]
  };
};

export const getKanbanCounts = (items) => items.reduce((counts, item) => {
  counts[item.stage] += 1;

  return counts;
}, { 'done': 0, 'progress': 0, 'ready': 0, 'review': 0 });

export const getKanbanMove = (state, itemId) => {
  const item = state.items.find((candidate) => candidate.id === itemId);
  const target = item && nextStages[item.stage];
  const counts = getKanbanCounts(state.items);

  return {
    'blocked': Boolean(target && KANBAN_LIMITS[target] && counts[target] >= KANBAN_LIMITS[target]),
    item,
    target
  };
};

export const moveKanbanItem = (state, itemId) => {
  const { blocked, item, target } = getKanbanMove(state, itemId);

  if (!item || !target) return state;

  if (blocked) {
    const recovery = target === 'review' ? 'Finish a review to open a slot.' : 'Move an item onward when the next stage has capacity.';

    return { ...state, 'feedback': `${stageNames[target]} is full (${KANBAN_LIMITS[target]}/${KANBAN_LIMITS[target]}). ${item.title} stays in ${stageNames[item.stage]}. ${recovery}` };
  }

  const items = state.items.map((candidate) => (candidate.id === itemId ? { ...candidate, 'stage': target } : candidate));
  const counts = getKanbanCounts(items);
  let recovery = '';

  if (target === 'done')
    recovery = ` Review now has ${KANBAN_LIMITS.review - counts.review} open ${KANBAN_LIMITS.review - counts.review === 1 ? 'slot' : 'slots'}. Done means ready for release in this example.`;
  else if (target === 'progress' && counts.review === KANBAN_LIMITS.review)
    recovery = ' Review is still full. Its limit does not block a different stage with space.';

  return { 'feedback': `${item.title} moved to ${stageNames[target]}.${recovery}`, items };
};

export const createScrumState = () => {
  return { 'day': 5, 'feedback': '', 'releasedDay': null };
};

export const moveScrumDay = (state, day) => (Number.isInteger(day) && day >= 1 && day <= SCRUM_REVIEW_DAY ? { ...state, day, 'feedback': '' } : state);

export const getScrumStatus = (state) => {
  return {
    'ready': state.day >= SCRUM_READY_DAY,
    'released': state.releasedDay !== null && state.day >= state.releasedDay
  };
};

export const releaseScrumIncrement = (state) => {
  const { ready, released } = getScrumStatus(state);

  if (!ready) return { ...state, 'feedback': `This example is still building and verifying the increment. It meets the Definition of Done on day ${SCRUM_READY_DAY}; choose that day or later to release it.` };
  if (released) return state;

  return {
    ...state,
    'feedback': state.day < SCRUM_REVIEW_DAY ? `Released on day ${state.day}. The Sprint continues, including its Review on day ${SCRUM_REVIEW_DAY}. Stakeholders can discuss what users have already experienced.` : 'Released on day 10. Waiting until the Review was a choice in this example; a usable increment was available from day 5.',
    'releasedDay': state.day
  };
};
