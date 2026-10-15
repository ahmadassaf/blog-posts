/*
 * A small, real knowledge graph from the Semantic Web's own history: who built what, where, and
 * which standards depend on which. Every edge is a directed, labelled statement (subject, predicate,
 * object); nodes carry one type and, for the property-graph view, a few key-value properties.
 */

export const nodeTypes = [
  { 'id': 'person', 'label': 'Person', 'tone': 'accent' },
  { 'id': 'organisation', 'label': 'Organisation', 'tone': 'discovery' },
  { 'id': 'place', 'label': 'Place', 'tone': 'success' },
  { 'id': 'standard', 'label': 'Standard', 'tone': 'warning' },
  { 'id': 'work', 'label': 'Idea or work', 'tone': 'danger' }
];

export const nodes = [
  { 'id': 'tbl', 'label': 'Tim Berners-Lee', 'properties': { 'born': 1955, 'knighted': 2004 }, 'type': 'person' },
  { 'id': 'hendler', 'label': 'James Hendler', 'properties': { 'field': 'AI' }, 'type': 'person' },
  { 'id': 'lassila', 'label': 'Ora Lassila', 'properties': { 'field': 'Knowledge representation' }, 'type': 'person' },
  { 'id': 'cern', 'label': 'CERN', 'properties': { 'founded': 1954 }, 'type': 'organisation' },
  { 'id': 'w3c', 'label': 'W3C', 'properties': { 'founded': 1994 }, 'type': 'organisation' },
  { 'id': 'mit', 'label': 'MIT', 'properties': { 'founded': 1861 }, 'type': 'organisation' },
  { 'id': 'geneva', 'label': 'Geneva', 'properties': {}, 'type': 'place' },
  { 'id': 'switzerland', 'label': 'Switzerland', 'properties': {}, 'type': 'place' },
  { 'id': 'london', 'label': 'London', 'properties': {}, 'type': 'place' },
  { 'id': 'cambridge', 'label': 'Cambridge, MA', 'properties': {}, 'type': 'place' },
  { 'id': 'www', 'label': 'World Wide Web', 'properties': { 'proposed': 1989 }, 'type': 'work' },
  { 'id': 'semweb', 'label': 'The Semantic Web', 'properties': { 'published': 2001, 'venue': 'Scientific American' }, 'type': 'work' },
  { 'id': 'linkeddata', 'label': 'Linked Data', 'properties': { 'coined': 2006 }, 'type': 'work' },
  { 'id': 'rdf', 'label': 'RDF', 'properties': { 'version': '1.1', 'year': 2014 }, 'type': 'standard' },
  { 'id': 'owl', 'label': 'OWL', 'properties': { 'version': '2', 'year': 2009 }, 'type': 'standard' },
  { 'id': 'sparql', 'label': 'SPARQL', 'properties': { 'version': '1.1', 'year': 2013 }, 'type': 'standard' }
];

export const edges = [
  { 'from': 'tbl', 'label': 'invented', 'properties': { 'year': 1989 }, 'to': 'www' },
  { 'from': 'tbl', 'label': 'workedAt', 'properties': { 'from': 1984, 'until': 1994 }, 'to': 'cern' },
  { 'from': 'tbl', 'label': 'founded', 'properties': { 'year': 1994 }, 'to': 'w3c' },
  { 'from': 'tbl', 'label': 'bornIn', 'properties': {}, 'to': 'london' },
  { 'from': 'tbl', 'label': 'coined', 'properties': { 'year': 2006 }, 'to': 'linkeddata' },
  { 'from': 'tbl', 'label': 'authored', 'properties': { 'role': 'lead author' }, 'to': 'semweb' },
  { 'from': 'hendler', 'label': 'authored', 'properties': {}, 'to': 'semweb' },
  { 'from': 'lassila', 'label': 'authored', 'properties': {}, 'to': 'semweb' },
  { 'from': 'hendler', 'label': 'contributedTo', 'properties': {}, 'to': 'owl' },
  { 'from': 'lassila', 'label': 'contributedTo', 'properties': { 'as': 'RDF M&S co-editor' }, 'to': 'rdf' },
  { 'from': 'cern', 'label': 'locatedIn', 'properties': {}, 'to': 'geneva' },
  { 'from': 'geneva', 'label': 'locatedIn', 'properties': {}, 'to': 'switzerland' },
  { 'from': 'w3c', 'label': 'hostedBy', 'properties': { 'since': 1994 }, 'to': 'mit' },
  { 'from': 'mit', 'label': 'locatedIn', 'properties': {}, 'to': 'cambridge' },
  { 'from': 'w3c', 'label': 'publishes', 'properties': {}, 'to': 'rdf' },
  { 'from': 'w3c', 'label': 'publishes', 'properties': {}, 'to': 'owl' },
  { 'from': 'w3c', 'label': 'publishes', 'properties': {}, 'to': 'sparql' },
  { 'from': 'sparql', 'label': 'queries', 'properties': {}, 'to': 'rdf' },
  { 'from': 'owl', 'label': 'extends', 'properties': {}, 'to': 'rdf' },
  { 'from': 'linkeddata', 'label': 'uses', 'properties': {}, 'to': 'rdf' },
  { 'from': 'linkeddata', 'label': 'builtOn', 'properties': {}, 'to': 'www' },
  { 'from': 'semweb', 'label': 'envisions', 'properties': {}, 'to': 'linkeddata' }
];

export const views = [
  { 'description': 'Every node looks the same; the meaning lives in the directed, labelled edges.', 'id': 'labelled', 'label': 'Labelled edges' },
  { 'description': 'Each node has exactly one type, so the graph partitions into people, places, organisations and standards.', 'id': 'typed', 'label': 'Typed nodes' },
  { 'description': 'Nodes and edges also carry key-value properties, such as when an edge became true.', 'id': 'property', 'label': 'Property graph' }
];

export const nodeById = Object.fromEntries(nodes.map((node) => [ node.id, node ]));

// Outgoing and incoming statements for one node, as readable subject-predicate-object triples.
export const statementsFor = (nodeId) => edges
  .filter((edge) => edge.from === nodeId || edge.to === nodeId)
  .map((edge) => {
    return { ...edge, 'direction': edge.from === nodeId ? 'out' : 'in' };
  });

export const neighboursOf = (nodeId) => new Set(statementsFor(nodeId).map((edge) => (edge.from === nodeId ? edge.to : edge.from)));

// A seeded generator keeps the layout identical on the server, in the browser and across visits.
const seeded = (seed) => {
  let state = seed;

  return () => {
    state += 0x6D2B79F5;
    let value = state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

// Pushes two positions apart, half the shortfall each, until they are `gap` apart.
const nudgeApart = (first, second, gap) => {
  const delta = first.map((value, axis) => value - second[axis]);
  const distance = Math.max(0.001, Math.hypot(...delta));

  if (distance >= gap) return;
  const shift = (gap - distance) / 2;

  delta.forEach((value, axis) => {
    first[axis] += (value / distance) * shift;
    second[axis] -= (value / distance) * shift;
  });
};

/**
 * A small 3D force layout: nodes repel, edges pull like springs, and everything drifts to the
 * centre. It runs once, deterministically, and is scaled so the graph fits a radius of `radius`.
 *
 * @param {Object} [options] - Layout options
 * @param {number} [options.iterations=400] - Simulation steps
 * @param {number} [options.radius=10] - Radius the finished layout is scaled to
 * @returns {Record<string, [number, number, number]>} Position per node id
 */
export const layoutGraph = ({ iterations = 400, radius = 10 } = {}) => {
  const random = seeded(7);
  const positions = nodes.map(() => [ random() - 0.5, random() - 0.5, random() - 0.5 ].map((value) => value * radius));
  const index = Object.fromEntries(nodes.map((node, position) => [ node.id, position ]));

  for (let step = 0; step < iterations; step++) {
    const cooling = 1 - step / iterations;
    const forces = positions.map(() => [ 0, 0, 0 ]);

    for (let first = 0; first < positions.length; first++)
      for (let second = first + 1; second < positions.length; second++) {
        const delta = positions[first].map((value, axis) => value - positions[second][axis]);
        const distanceSquared = Math.max(0.01, delta.reduce((sum, value) => sum + value * value, 0));
        const push = 30 / distanceSquared;

        delta.forEach((value, axis) => {
          forces[first][axis] += value * push;
          forces[second][axis] -= value * push;
        });
      }

    for (const edge of edges) {
      const from = index[edge.from];
      const to = index[edge.to];
      const delta = positions[to].map((value, axis) => value - positions[from][axis]);
      const distance = Math.max(0.01, Math.hypot(...delta));
      const pull = (distance - 4) * 0.08;

      delta.forEach((value, axis) => {
        forces[from][axis] += (value / distance) * pull;
        forces[to][axis] -= (value / distance) * pull;
      });
    }

    positions.forEach((position, node) => position.forEach((value, axis) => {
      const force = forces[node][axis] - value * 0.02;

      position[axis] = value + Math.max(-1, Math.min(1, force)) * cooling;
    }));
  }

  /*
   * Centre, then scale by the 85th-percentile distance rather than the farthest node, so one outlier
   * cannot squeeze the rest into the middle; the few beyond the radius are pulled back onto it.
   */
  const centre = [ 0, 1, 2 ].map((axis) => positions.reduce((sum, position) => sum + position[axis], 0) / positions.length);
  const centred = positions.map((position) => position.map((value, axis) => value - centre[axis]));
  const distances = centred.map((position) => Math.hypot(...position)).sort((first, second) => first - second);
  const extent = distances[Math.floor((distances.length - 1) * 0.85)];

  const placed = centred.map((position) => {
    const scaled = position.map((value) => (value / extent) * radius);
    const distance = Math.hypot(...scaled);

    return distance > radius ? scaled.map((value) => (value / distance) * radius) : scaled;
  });

  // A last separation pass keeps every pair at least `gap` apart so spheres and labels never collide
  const gap = radius * 0.32;

  for (let pass = 0; pass < 60; pass++)
    for (let first = 0; first < placed.length; first++)
      for (let second = first + 1; second < placed.length; second++) nudgeApart(placed[first], placed[second], gap);

  // Separation may nudge a node past the radius; scale everything back inside it
  const reach = Math.max(...placed.map((position) => Math.hypot(...position)));

  return Object.fromEntries(nodes.map((node, position) => [ node.id, placed[position].map((value) => (reach > radius ? (value / reach) * radius : value)) ]));
};
