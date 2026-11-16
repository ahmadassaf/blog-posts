import assert from 'node:assert/strict';
import test from 'node:test';

import { allParts, defaultPartId, facts, findPart, hasDisagreement, isVisible, journey, labelText, layers, statuses, tokens, visibleFacts } from './RdfEngineFigure.data.js';

const partFields = [ 'agent', 'description', 'id', 'label', 'status', 'sub', 'title' ];
const stepFields = [ 'before', 'id', 'label', 'now', 'title' ];

test('every part carries its text and a known status', () => {
  assert.ok(allParts.length > 0);
  for (const part of allParts) {
    for (const field of partFields) {
      assert.equal(typeof part[field], 'string', `${part.id}.${field} is a string`);
      assert.ok(part[field].trim().length > 0, `${part.id}.${field} is not empty`);
    }
    assert.ok(part.status in statuses, `${part.id} has a known status`);
  }
});

test('layer and part ids are unique, and both statuses appear', () => {
  assert.equal(new Set(layers.map((layer) => layer.id)).size, layers.length);
  assert.equal(new Set(allParts.map((part) => part.id)).size, allParts.length);
  assert.deepEqual([ ...new Set(allParts.map((part) => part.status)) ].sort(), Object.keys(statuses).sort());
});

test('only the bucket sits outside the server', () => {
  assert.deepEqual(layers.filter((layer) => layer.outside).map((layer) => layer.id), [ 'bucket' ]);
});

test('findPart returns the requested part and falls back to the default', () => {
  assert.equal(findPart('mcp').label, 'MCP');
  assert.equal(findPart('nope').id, defaultPartId);
  assert.equal(findPart(undefined).id, defaultPartId);
});

test('every step of the journey describes before and now', () => {
  assert.equal(new Set(journey.map((step) => step.id)).size, journey.length);
  for (const step of journey)
    for (const field of stepFields) assert.ok(step[field].trim().length > 0, `${step.id}.${field} is not empty`);
});

test('facts only require tokens that exist', () => {
  const known = tokens.map((token) => token.id);

  for (const fact of facts)
    for (const token of fact.requires) assert.ok(known.includes(token), `${fact.id} requires a known token`);
});

test('a label needs every one of its tokens, and an empty label is public', () => {
  const rating = facts.find((fact) => fact.id === 'rating');
  const based = facts.find((fact) => fact.id === 'based');

  assert.equal(isVisible(based, []), true);
  assert.equal(isVisible(rating, [ 'sourceA' ]), false);
  assert.equal(isVisible(rating, [ 'teamB' ]), false);
  assert.equal(isVisible(rating, [ 'sourceA', 'teamB' ]), true);
  assert.equal(labelText(based), 'public');
  assert.equal(labelText(rating), 'sourceA & teamB');
});

test('a caller with no tokens sees only public facts, and one with all sees everything', () => {
  assert.deepEqual(visibleFacts([]).map((fact) => fact.id), [ 'based' ]);
  assert.equal(visibleFacts(tokens.map((token) => token.id)).length, facts.length);
});

test('disagreement shows only when both conflicting facts are visible', () => {
  assert.equal(hasDisagreement([ 'sourceA' ]), false);
  assert.equal(hasDisagreement([ 'sourceB' ]), false);
  assert.equal(hasDisagreement([ 'sourceA', 'sourceB' ]), true);
});
