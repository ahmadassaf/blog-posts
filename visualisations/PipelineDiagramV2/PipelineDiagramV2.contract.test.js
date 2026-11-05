import assert from 'node:assert/strict';
import test from 'node:test';

import { buildFigure, scriptFor, stopBoundary } from './PipelineDiagramV2.model.js';

// The exact props the post passes to the diagram.
const props = {
  'destination': { 'label': 'Server' },
  'pipeline': {
    'label': 'Travis CI',
    'stages': [
      { 'detail': 'Travis runs build.sh, where grunt build generates the site into _site; a broken build stops the run here.', 'failure': 'Broken build', 'label': 'Build' },
      { 'detail': 'test.sh runs HTML-Proofer over _site to validate the HTML, check external links for 4xx errors and confirm the favicon; a failure stops the run before anything is deployed.', 'failure': 'Broken build', 'label': 'Validate' },
      { 'action': 'Upload', 'detail': 'Only after the build and validation pass, deploy.sh commits _site to a fresh repository and force-pushes it over SSH to the server.', 'label': 'Deploy', 'output': 'Server' }
    ],
    'trigger': 'Trigger Travis'
  },
  'platform': { 'detail': 'Push to a branch or open a pull request', 'feedback': 'Link to deployed site', 'label': 'GitHub', 'success': 'Build passes' },
  'source': { 'action': 'Push changes', 'label': 'Local changes' }
};

test('the figure prints three stages with their scripts, the route, and one stop boundary', () => {
  const figure = buildFigure(props);

  assert.deepEqual(figure.stages.map((stage) => [ stage.number, stage.label, stage.script ]), [[ 1, 'Build', 'build.sh' ], [ 2, 'Validate', 'test.sh' ], [ 3, 'Deploy', 'deploy.sh' ]]);
  assert.deepEqual(figure.stages.map((stage) => stage.detail), props.pipeline.stages.map((stage) => stage.detail));
  assert.deepEqual(figure.route, [ 'Local changes', 'GitHub', 'Travis CI', 'Server' ]);
  assert.deepEqual(figure.stop, {
    'afterIndex': 1,
    'note': 'Deploy to Server runs only after Build and Validate pass.',
    'title': 'Run stops here on failure'
  });
});

test('script names come from an explicit field first and are never invented', () => {
  assert.equal(scriptFor({ 'detail': 'runs build.sh then more', 'script': 'make site' }), 'make site');
  assert.equal(scriptFor({ 'detail': 'No script is named here.' }), null);
  assert.equal(scriptFor({}), null);
});

test('the stop boundary disappears when no stage can fail or when every stage can', () => {
  assert.equal(stopBoundary([{ 'label': 'A' }, { 'label': 'B' }], { 'label': 'X' }), null);
  assert.equal(stopBoundary([{ 'failure': 'x', 'label': 'A' }, { 'failure': 'y', 'label': 'B' }], { 'label': 'X' }), null);
  assert.equal(stopBoundary([{ 'failure': 'x', 'label': 'A' }, { 'label': 'B' }]).note, 'B runs only after A passes.');
});
