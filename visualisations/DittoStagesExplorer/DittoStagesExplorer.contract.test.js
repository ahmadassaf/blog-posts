import assert from 'node:assert/strict';
import test from 'node:test';

import { defaultStageId, diffDocuments, findStage, inputDocument, map, mappingLinesFor, mappings, mappingSource, postMap, preMap, runPipeline, stages, stageView } from './DittoStagesExplorer.data.js';

const expectedMapOutput = {
  'email': { 'value': 'mina@example.org' },
  'name': 'Mina Okafor',
  'phone': {},
  'source': 'crm-export',
  'website': 'https://mina.example'
};

const expectedOutput = {
  'email': { 'value': 'mina@example.org' },
  'name': 'Mina Okafor',
  'source': 'crm-export',
  'website': 'https://mina.example'
};

test('_preMap returns the input document unchanged', () => {
  assert.equal(preMap(inputDocument), inputDocument);
  assert.deepEqual(runPipeline().preMap, inputDocument);
});

test('_map builds the output from the mapping file alone, in mapping-file order', () => {
  const result = map(inputDocument, mappings);

  assert.deepEqual(result, expectedMapOutput);
  assert.deepEqual(Object.keys(result), Object.keys(mappings));
  assert.ok(!('firstName' in result), 'input keys do not carry over');
});

test('_map resolves plugins, literals, fallbacks and result references in rule order', () => {
  const rules = {
    'handle': 'nickname||>>anonymous',
    'kept': 'firstName||>>unused',
    'name': '@concatName(firstName|lastName)',
    'shown': '!name',
    'tag': '>>fixed'
  };

  assert.deepEqual(map(inputDocument, rules), {
    'handle': 'anonymous',
    'kept': 'Mina',
    'name': 'Mina Okafor',
    'shown': 'Mina Okafor',
    'tag': 'fixed'
  });
  assert.deepEqual(map(inputDocument, { 'early': '!name', 'name': 'firstName' }), { 'name': 'Mina' }, 'a reference to a rule not yet mapped resolves to nothing');
});

test('_postMap drops empty objects and nil values and strips $$key markers', () => {
  assert.deepEqual(postMap(expectedMapOutput), expectedOutput);
  assert.deepEqual(postMap({ 'a': null, 'b': { '$$key': 'x', 'value': 1 }, 'c': undefined, 'd': 0 }), { 'b': { 'value': 1 }, 'd': 0 });
});

test('the pipeline exposes every stage and the output equals the post-map result', () => {
  const pipeline = runPipeline();

  assert.deepEqual(Object.keys(pipeline).sort(), stages.map((stage) => stage.id).sort());
  assert.deepEqual(pipeline.map, expectedMapOutput);
  assert.deepEqual(pipeline.postMap, expectedOutput);
  assert.deepEqual(pipeline.output, expectedOutput);
});

test('stages match the tool: input, _preMap, _map, _postMap, output, each with one short line', () => {
  assert.deepEqual(stages.map((stage) => stage.name), [ 'Input document', '_preMap', '_map', '_postMap', 'Unified output' ]);
  for (const stage of stages) {
    assert.ok(stage.line.trim().length > 0, `${stage.id} has a line`);
    assert.ok(stage.line.length <= 140, `${stage.id} line stays short`);
    assert.ok([ 'none', 'changes', 'all' ].includes(stage.highlight), `${stage.id} highlight mode`);
    assert.ok(stage.mappingKeys.every((key) => key in mappings), `${stage.id} names real mapping rules`);
  }
  assert.equal(findStage('nope').id, defaultStageId);
});

test('stage views mark exactly what each stage changed', () => {
  const changed = (stageId) => stageView(stageId).filter((line) => line.change !== 'same');

  assert.equal(changed('input').length, 0);
  assert.equal(changed('preMap').length, 0, '_preMap leaves the document unchanged');
  assert.ok(stageView('map').every((line) => line.change === 'added' || line.text === '{' || line.text === '}'), '_map lines are all new');
  assert.deepEqual(changed('postMap').map((line) => [ line.change, line.text ]), [[ 'removed', '"phone": {},' ]]);
  assert.equal(changed('output').length, 0);
});

test('diffDocuments keeps removed keys in their original position and values readable', () => {
  const lines = diffDocuments({ 'a': 1, 'b': [ 'x', 'y' ], 'c': { 'd': 2 } }, { 'a': 1, 'c': { 'd': 3 } });

  assert.deepEqual(lines.map((line) => `${line.change}|${line.depth}|${line.text}`), [
    'same|0|{',
    'same|1|"a": 1,',
    'removed|1|"b": ["x", "y"],',
    'same|1|"c": {',
    'changed|2|"d": 3',
    'same|1|}',
    'same|0|}'
  ]);
});

test('mapping-file highlights point at the named rules', () => {
  const sourceLines = mappingSource.split('\n');

  assert.deepEqual(mappingLinesFor([ 'phone' ]), [ 5 ]);
  assert.ok(sourceLines[4].includes('"phone"'));
  assert.deepEqual(mappingLinesFor(findStage('map').mappingKeys), [ 2, 3, 4, 5, 6 ]);
  assert.deepEqual(mappingLinesFor([]), []);
});
