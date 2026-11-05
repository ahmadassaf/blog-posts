/**
 * Linked Data Quality Framework (static figure) data
 *
 * The five Roomba subsystems in processing order. `summary` is the one-line
 * strap drawn inside each block; `description` is the full sentence shown once
 * in the legend under the figure. Module groups are the boxes inside a block.
 */

export const systems = [
  {
    'description': 'Recognizes the catalogue implementation and selects the adapter that knows how to enter it.',
    'groups': [{ 'items': [ 'CKAN', 'DKAN', 'Other portals' ], 'label': 'Portal adapters' }],
    'icon': 'Grid',
    'id': 'portal',
    'label': 'Data portal identifier',
    'summary': 'Detects the portal software and picks an adapter.',
    'type': 'Source boundary'
  },
  {
    'description': 'Retrieves, normalizes, and caches the descriptive metadata exposed by the selected portal.',
    'groups': [{ 'items': [ 'Fetch', 'Normalize', 'Cache' ], 'label': 'Metadata lifecycle' }],
    'icon': 'FileText',
    'id': 'metadata',
    'label': 'Metadata extractor',
    'summary': 'Fetches, normalizes and caches dataset metadata.',
    'type': 'Ingestion subsystem'
  },
  {
    'description': 'Samples attached resources and sends representative data through format-specific validation.',
    'groups': [
      { 'items': [ 'Random sampling', 'Weighted sampling' ], 'label': 'Sampler' },
      { 'items': [ 'CSV validator', 'RDF validator' ], 'label': 'Validator' }
    ],
    'icon': 'Cubes',
    'id': 'resources',
    'label': 'Instance and resource extractor',
    'summary': 'Samples resources and validates them by format.',
    'type': 'Processing subsystem'
  },
  {
    'description': 'Combines topical, statistical, and metadata profilers to turn extracted evidence into quality indicators.',
    'groups': [
      { 'items': [ 'Topical profiler' ], 'label': 'Content' },
      { 'items': [ 'Statistical profiler' ], 'label': 'Statistics' },
      { 'items': [ 'General', 'Ownership', 'Access', 'Provenance' ], 'label': 'Metadata profiler', 'wide': true }
    ],
    'icon': 'Check',
    'id': 'profile',
    'label': 'Profile validator',
    'summary': 'Turns extracted evidence into quality indicators.',
    'type': 'Assessment subsystem'
  },
  {
    'description': 'Packages the validated evidence and scores into durable profiles and a readable assessment report.',
    'groups': [{ 'items': [ 'Dataset profile', 'Indicator scores', 'Quality report' ], 'label': 'Published outputs' }],
    'icon': 'ChartArea',
    'id': 'report',
    'label': 'Profile and report generator',
    'summary': 'Publishes the profile, scores and report.',
    'type': 'Output boundary'
  }
];

/**
 * Directed edges between subsystems, in processing order. `direction` is the
 * arrow drawn in the two-row layout; every edge points down in a single column.
 */
export const flow = [
  { 'direction': 'right', 'from': 'portal', 'to': 'metadata' },
  { 'direction': 'right', 'from': 'metadata', 'to': 'resources' },
  { 'direction': 'down', 'from': 'resources', 'to': 'profile' },
  { 'direction': 'left', 'from': 'profile', 'to': 'report' }
];

export const summarise = (system) => {
  const modules = system.groups
    .map((group) => `${group.label}: ${group.items.join(', ')}`)
    .join('; ');

  return `${modules}.`;
};

export const architectureLabel = () => {
  const order = systems.map((system) => system.label);

  return `Roomba quality assessment architecture: ${systems.length} subsystems in sequence, ${order.join(', then ')}.`;
};
