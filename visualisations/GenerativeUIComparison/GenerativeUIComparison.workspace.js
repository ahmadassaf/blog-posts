import { createResponse } from './GenerativeUIComparison.data.js';

export const createWorkspace = (query) => ({
  query,
  scope: { month: query.month, region: query.region },
  selectedId: null,
  agenda: []
});

const retainedInspection = (selectedId, query) => {
  if (![ 'overview', 'table', 'summary', 'exceptions' ].includes(query.view)) return null;
  return createResponse(query).visibleRows.some((row) => row.id === selectedId) ? selectedId : null;
};

export const submitQuery = (workspace, query) => ({
  ...workspace,
  query,
  scope: { month: query.month, region: query.region },
  selectedId: retainedInspection(workspace.selectedId, query)
});

export const updateScope = (workspace, change) => {
  const scope = { ...workspace.scope, ...change };

  return {
    ...workspace,
    scope,
    selectedId: retainedInspection(workspace.selectedId, { ...workspace.query, ...scope })
  };
};

export const toggleReview = (workspace, row) => ({
  ...workspace,
  agenda: workspace.agenda.some((item) => item.id === row.id)
    ? workspace.agenda.filter((item) => item.id !== row.id)
    : [ ...workspace.agenda, row ]
});
