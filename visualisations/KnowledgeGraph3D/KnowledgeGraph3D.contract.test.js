import assert from 'node:assert/strict';
import test from 'node:test';

import { edges, layoutGraph, neighboursOf, nodeById, nodes, nodeTypes, statementsFor } from './KnowledgeGraph3D.data.js';

test('KnowledgeGraph3D edges only join known nodes and every node takes part', () => {
  for (const edge of edges) {
    assert.ok(nodeById[edge.from], `unknown subject ${edge.from}`);
    assert.ok(nodeById[edge.to], `unknown object ${edge.to}`);
  }

  for (const node of nodes) assert.ok(statementsFor(node.id).length > 0, `${node.id} has no statements`);
});

test('KnowledgeGraph3D nodes carry exactly one known type', () => {
  const types = new Set(nodeTypes.map((type) => type.id));

  for (const node of nodes) assert.ok(types.has(node.type), `${node.id} has type ${node.type}`);
});

test('KnowledgeGraph3D layout is deterministic, finite and fits the requested radius', () => {
  const first = layoutGraph({ 'radius': 10 });
  const second = layoutGraph({ 'radius': 10 });

  assert.deepEqual(first, second);
  for (const position of Object.values(first)) {
    assert.ok(position.every(Number.isFinite));
    assert.ok(Math.hypot(...position) <= 10.0001);
  }
});

test('KnowledgeGraph3D neighbourhoods follow edges in both directions', () => {
  assert.ok(neighboursOf('rdf').has('w3c'));
  assert.ok(neighboursOf('w3c').has('rdf'));
  assert.ok(!neighboursOf('london').has('rdf'));
});
