import assert from 'node:assert/strict';
import test from 'node:test';

import { architectureLabel, flow, summarise, systems } from './LinkedDataQualityFrameworkV2.data.js';

const ids = systems.map((system) => system.id);

test('every subsystem carries the fields the figure and legend draw', () => {
  assert.equal(systems.length, 5);
  assert.equal(new Set(ids).size, ids.length);
  for (const system of systems) {
    for (const field of [ 'description', 'icon', 'id', 'label', 'summary', 'type' ]) assert.equal(typeof system[field], 'string', `${system.id}.${field}`);
    assert.ok(system.summary.length <= 60, `${system.id} summary fits on one line`);
    assert.ok(system.groups.length > 0, `${system.id} has module groups`);
    for (const group of system.groups) {
      assert.equal(typeof group.label, 'string');
      assert.ok(group.items.length > 0, `${system.id} ${group.label} lists modules`);
    }
  }
});

test('the flow visits every subsystem once, in data order, with a drawable direction', () => {
  assert.deepEqual(flow.map((edge) => edge.from), ids.slice(0, -1));
  assert.deepEqual(flow.map((edge) => edge.to), ids.slice(1));
  for (const edge of flow) assert.ok([ 'right', 'down', 'left' ].includes(edge.direction), `${edge.from}-${edge.to} direction`);
});

test('text alternatives are complete sentences built from the same data', () => {
  assert.equal(summarise(systems[0]), 'Portal adapters: CKAN, DKAN, Other portals.');
  assert.match(architectureLabel(), /^Roomba quality assessment architecture: 5 subsystems in sequence, Data portal identifier, then .*Profile and report generator\.$/);
});
