/**
 * Content for the RDF engine figures: the layered architecture, the path a
 * query takes through the engine, and the metadata carried by a fact.
 * Kept apart from the component so the contract test can check it without
 * rendering anything.
 */

export const statuses = {
  'live': 'Core engine',
  'prototype': 'Add-on'
};

export const layers = [
  {
    'id': 'interfaces',
    'kind': 'row',
    'label': 'Interfaces',
    'parts': [
      {
        'agent': 'A small, closed, typed schema is far easier for a language model to query correctly than an open graph.',
        'description': 'Applications and agents read through a GraphQL schema that the database generates from the knowledge model. Change the model and the API changes with it.',
        'id': 'graphql',
        'label': 'GraphQL',
        'status': 'live',
        'sub': 'generated from the model',
        'title': 'An API generated from the model'
      },
      {
        'agent': 'Any tool that already speaks SPARQL works on the first day.',
        'description': 'SPARQL 1.1 query and update over an API compatible with RDF4J, so existing RDF software connects unchanged.',
        'id': 'sparql',
        'label': 'SPARQL 1.1',
        'status': 'live',
        'sub': 'RDF4J-compatible API',
        'title': 'The standard, for tools and libraries'
      },
      {
        'agent': 'It sits above the same visibility check as every other interface, so an agent cannot retrieve what its user cannot see.',
        'description': 'An MCP server on the same engine exposes the model, its description and its search to an agent as tools.',
        'id': 'mcp',
        'label': 'MCP',
        'status': 'prototype',
        'sub': 'tools for agents',
        'title': 'A door built for agents'
      },
      {
        'agent': 'A write becomes visible when its snapshot is published, never halfway.',
        'description': 'Large loads are sorted and written as a batch, then published as one snapshot. Published changes can feed search and streaming systems downstream.',
        'id': 'import',
        'label': 'Bulk import',
        'status': 'live',
        'sub': 'and change feeds',
        'title': 'Loading and publishing'
      }
    ]
  },
  {
    'id': 'engine',
    'kind': 'tinted',
    'label': 'One query engine',
    'parts': [
      {
        'agent': 'Nobody tunes an agent\'s queries by hand, so the planner has to.',
        'description': 'Every request is compiled into the same kind of plan. The planner uses counts kept about the data to choose the order of work.',
        'id': 'planner',
        'label': 'Planner',
        'status': 'live',
        'sub': 'uses statistics',
        'title': 'Plans with statistics'
      },
      {
        'agent': 'A query that asks for ten rows reads about ten entries.',
        'description': 'Results flow in small batches of compact identifiers and are turned back into text at the end.',
        'id': 'executor',
        'label': 'Streaming executor',
        'status': 'live',
        'sub': 'batches of identifiers',
        'title': 'Works in batches of identifiers'
      },
      {
        'agent': 'A terrible query fails quickly, with a message the agent can act on.',
        'description': 'Each query has a budget of keys read, rows returned and time. It is checked before each batch is read, and going over produces a specific refusal.',
        'id': 'budgets',
        'label': 'Budgets',
        'status': 'live',
        'sub': 'checked per batch',
        'title': 'Limits checked before the work'
      },
      {
        'agent': 'Permissions hold however the query was composed.',
        'description': 'The scan drops every fact the caller may not see before any other part of the query runs.',
        'id': 'visibility',
        'label': 'Visibility check',
        'status': 'prototype',
        'sub': 'runs before anything else',
        'title': 'One enforcement point'
      }
    ]
  },
  {
    'id': 'indexes',
    'kind': 'boxed',
    'label': 'Index layer, written before a snapshot is published',
    'parts': [
      {
        'agent': 'Text is only handled at the edges of a query.',
        'description': 'IRIs and literals are swapped for identifiers on the way in, so indexes and joins work on small fixed-size values.',
        'id': 'identifiers',
        'label': 'Identifiers',
        'status': 'live',
        'sub': 'compact names',
        'title': 'Every name becomes a compact identifier'
      },
      {
        'agent': 'Exploratory questions stay cheap from any direction.',
        'description': 'Each fact is stored in several orderings, so a lookup by subject, by predicate or by object is a short range read.',
        'id': 'orderings',
        'label': 'Fact orderings',
        'status': 'live',
        'sub': 'several sort orders',
        'title': 'The same facts in several orders'
      },
      {
        'agent': 'Counting a type with a million members takes under a millisecond.',
        'description': 'Counts are kept up to date as data is written. The planner uses them, and some questions are answered from them directly.',
        'id': 'statistics',
        'label': 'Statistics',
        'status': 'live',
        'sub': 'counts kept current',
        'title': 'Counts the database keeps about itself'
      },
      {
        'agent': 'An answer can cite where each fact came from.',
        'description': 'Each fact carries a reference to a shared provenance record and a visibility label.',
        'id': 'metadata',
        'label': 'Fact metadata',
        'status': 'prototype',
        'sub': 'source and label',
        'title': 'A source and a label on every fact'
      },
      {
        'agent': 'Search by words when the agent does not know the identifier.',
        'description': 'A keyword index written alongside the facts and published in the same snapshot.',
        'id': 'text',
        'label': 'Full text',
        'status': 'prototype',
        'sub': 'keyword index',
        'title': 'Keyword search'
      },
      {
        'agent': 'Search by meaning, under the same visibility rule.',
        'description': 'A vector index published in the same snapshot as the facts it describes.',
        'id': 'vectors',
        'label': 'Vectors',
        'status': 'prototype',
        'sub': 'similarity index',
        'title': 'Similarity search'
      }
    ]
  },
  {
    'id': 'storage',
    'kind': 'tinted',
    'label': 'Reading and writing',
    'parts': [
      {
        'agent': 'Warm lookups take milliseconds. The first touch after a restart is slower.',
        'description': 'Reads go to memory first, then to a cache on the server\'s local disk, then to object storage.',
        'id': 'tiers',
        'label': 'Read tiers',
        'status': 'live',
        'sub': 'memory, disk, bucket',
        'title': 'Memory, then disk, then the bucket'
      },
      {
        'agent': 'A long query sees one consistent view, and the past stays readable.',
        'description': 'A repository has one writer at a time. Each write ends by publishing a snapshot, and every read is pinned to one.',
        'id': 'snapshots',
        'label': 'Snapshots',
        'status': 'live',
        'sub': 'immutable, per write',
        'title': 'Every write publishes an immutable snapshot'
      }
    ]
  },
  {
    'id': 'bucket',
    'kind': 'boxed',
    'label': 'Object storage',
    'outside': true,
    'parts': [
      {
        'agent': 'An idle dataset costs what its bytes cost to store.',
        'description': 'All data lives in a bucket. Servers hold no data of their own, so any number can read from the same bucket and any of them can be replaced.',
        'id': 'bucket',
        'label': 'Object storage',
        'status': 'live',
        'sub': 'one writer, any number of readers',
        'title': 'The only copy of the data'
      }
    ]
  }
];

export const defaultPartId = 'planner';

export const allParts = layers.flatMap((layer) => layer.parts);

export const findPart = (id) => allParts.find((part) => part.id === id) || allParts.find((part) => part.id === defaultPartId);

export const journey = [
  {
    'before': 'SPARQL went through a borrowed evaluator and GraphQL through its own executor. Each read the indexes in its own way.',
    'id': 'compile',
    'label': 'Compile',
    'now': 'Every interface compiles to the same kind of plan. SPARQL does this today; GraphQL has yet to move across.',
    'title': 'Turn the request into a plan'
  },
  {
    'before': 'There were no statistics about the data, so the order of joins was a guess.',
    'id': 'plan',
    'label': 'Plan',
    'now': 'The planner uses counts kept about the data to start from the most selective part of the query.',
    'title': 'Decide the order of work'
  },
  {
    'before': 'Whole index ranges were loaded before any limit applied. A query asking for ten rows could read millions of entries.',
    'id': 'read',
    'label': 'Read',
    'now': 'Ranges stream in small batches, and the budget is checked before each batch is read.',
    'title': 'Fetch from the indexes'
  },
  {
    'before': 'The benchmark\'s count query took 19.5 seconds at ten million statements.',
    'id': 'answer',
    'label': 'Answer',
    'now': 'The same query takes a millisecond, answered from statistics the database already keeps.',
    'title': 'Return the result'
  }
];

export const tokens = [
  { 'id': 'sourceA', 'label': 'Source A' },
  { 'id': 'sourceB', 'label': 'Source B' },
  { 'id': 'teamB', 'label': 'Team B' }
];

export const facts = [
  { 'id': 'based', 'object': 'Lisbon', 'predicate': 'is based in', 'requires': [], 'source': 'Public register', 'subject': 'Company A' },
  { 'id': 'headcount-a', 'object': '120 people', 'predicate': 'employs', 'requires': [ 'sourceA' ], 'source': 'Source A report', 'subject': 'Company A' },
  { 'id': 'headcount-b', 'object': '140 people', 'predicate': 'employs', 'requires': [ 'sourceB' ], 'source': 'Source B report', 'subject': 'Company A' },
  { 'id': 'rating', 'object': 'watch list', 'predicate': 'is rated', 'requires': [ 'sourceA', 'teamB' ], 'source': 'Internal note', 'subject': 'Company A' }
];

/* A label is the set of tokens a caller must hold. An empty set is public. */
export const isVisible = (fact, held = []) => fact.requires.every((token) => held.includes(token));

export const labelText = (fact) => (fact.requires.length ? fact.requires.join(' & ') : 'public');

export const visibleFacts = (held = []) => facts.filter((fact) => isVisible(fact, held));

/* Two visible facts with the same subject and predicate but different values. */
export const hasDisagreement = (held = []) => {
  const seen = new Map();

  for (const fact of visibleFacts(held)) {
    const key = `${fact.subject}|${fact.predicate}`;

    if (seen.has(key) && seen.get(key) !== fact.object) return true;
    seen.set(key, fact.object);
  }

  return false;
};
