'use client';

/**
 * THESIS: Ditto replaces per-source transformation scripts with one declarative journey: every document walks the same three stages toward one shape.
 * OWN-WORLD: A horizontal pipeline: the raw input on the left, the unified output on the right, three stages between them, and the mappings file feeding the middle one.
 * STORY: Select any stop (input, _preMap, _map, _postMap, output) to read what happens there; input and output show a tiny JSON fragment.
 * FIRST VIEWPORT: The full pipeline with _map selected and the readout explaining how the mappings file drives the transformation.
 * FORM: A responsive SVG with selectable stages driving a shared readout.
 */

import { useState } from 'react';

import styles from './DittoStagesExplorer.module.css';

const stages = [
  {
    'blurb': 'The raw document exactly as the external source sends it: its own field names, its own nesting. Ditto never asks the source to change; the mapping file absorbs the difference.',
    'id': 'input',
    'json': '{\n  "firstName": "Jane",\n  "lastName": "Doe",\n  "website": "janedoe.com"\n}',
    'kind': 'ARRIVES AS-IS',
    'name': 'Input document'
  },
  {
    'blurb': 'The pre-mapping process: it runs before the main mapping and transforms the input data. Plugin functions prepare the raw document here, reshaping awkward fields so the declarative step that follows stays clean.',
    'id': 'preMap',
    'kind': 'PLUGINS PREPARE',
    'name': '_preMap'
  },
  {
    'blurb': 'The unification step, and the heart of Ditto: the mapping file is read and the data is mapped accordingly. Each key in the mapping names an output field and declares where its value comes from, including plugin calls such as @concatName(firstName|lastName).',
    'id': 'map',
    'kind': 'MAPPINGS APPLIED',
    'name': '_map'
  },
  {
    'blurb': 'The post-mapping process: it runs after the main mapping is done and transforms the mapping result. Plugins get a final pass over the output for cleanup and enrichment before the document leaves the pipeline.',
    'id': 'postMap',
    'kind': 'PLUGINS REFINE',
    'name': '_postMap'
  },
  {
    'blurb': 'Every source, whatever shape it arrived in, leaves in this one shape. Because the mapping file fully describes the output, the same input and the same mappings always produce the same result.',
    'id': 'output',
    'json': '{\n  "name": "Jane Doe",\n  "links": ["janedoe.com"]\n}',
    'kind': 'ONE SHAPE OUT',
    'name': 'Unified output'
  }
];

const DittoStagesExplorer = ({
  title = 'Ditto\'s three-stage mapping pipeline',
  description = 'One mappings file describes the output; three stages get every document there. Plugins prepare the input, the declarative mapping unifies it, and plugins polish the result. Select any stop to read what happens there.',
  className = ''
}) => {
  const [ activeStageId, setActiveStageId ] = useState('map');
  const activeStage = stages.find((stage) => stage.id === activeStageId) || stages[0];

  const selectStage = (stageId) => {
    return {
      'aria-label': `Read about ${stages.find((stage) => stage.id === stageId).name}`,
      'aria-pressed': activeStageId === stageId,
      'data-active': activeStageId === stageId,
      'onClick': () => setActiveStageId(stageId),
      'onFocus': () => setActiveStageId(stageId),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveStageId(stageId);
        }
      },
      'role': 'button',
      'tabIndex': 0
    };
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the diagram</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable Ditto pipeline diagram' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 420' role='group' aria-label='Ditto three-stage mapping pipeline'>
          {/* Quiet dashed path segments between the stops, no arrowheads */}
          <path d='M 186 215 C 198 215, 202 215, 214 215' className={ styles.path } />
          <path d='M 370 215 C 394 215, 410 215, 434 215' className={ styles.path } />
          <path d='M 566 215 C 590 215, 606 215, 630 215' className={ styles.path } />
          <path d='M 786 215 C 798 215, 802 215, 814 215' className={ styles.path } />

          {/* Input document */}
          <g className={ styles.stageNode } { ...selectStage('input') }>
            <rect x='26' y='188' width='152' height='54' rx='27' />
            <text x='102' y='210' textAnchor='middle' className={ styles.stageKind }>ARRIVES AS-IS</text>
            <text x='102' y='228' textAnchor='middle' className={ styles.stageName }>Input document</text>
          </g>

          {/* _preMap */}
          <g className={ styles.stageNode } { ...selectStage('preMap') }>
            <rect x='222' y='188' width='140' height='54' rx='27' />
            <text x='292' y='210' textAnchor='middle' className={ styles.stageKind }>PLUGINS PREPARE</text>
            <text x='292' y='228' textAnchor='middle' className={ styles.stageMono }>_preMap</text>
          </g>

          {/* _map: the big central stop, driven by the mappings file */}
          <g className={ styles.mapNode } { ...selectStage('map') }>
            <text x='500' y='60' textAnchor='middle' className={ styles.mappingsLabel }>mappings file drives this stage</text>
            <g className={ styles.mappingsDoc }>
              <rect x='460' y='72' width='80' height='52' rx='6' />
              <line x1='472' y1='87' x2='528' y2='87' />
              <line x1='472' y1='98' x2='528' y2='98' />
              <line x1='472' y1='109' x2='516' y2='109' />
            </g>
            <path d='M 500 130 L 500 151' className={ styles.mappingsFeed } />
            <circle cx='500' cy='215' r='58' />
            <text x='500' y='201' textAnchor='middle' className={ styles.stageKind }>MAPPINGS</text>
            <text x='500' y='213' textAnchor='middle' className={ styles.stageKind }>APPLIED</text>
            <text x='500' y='236' textAnchor='middle' className={ styles.mapName }>_map</text>
          </g>

          {/* _postMap */}
          <g className={ styles.stageNode } { ...selectStage('postMap') }>
            <rect x='638' y='188' width='140' height='54' rx='27' />
            <text x='708' y='210' textAnchor='middle' className={ styles.stageKind }>PLUGINS REFINE</text>
            <text x='708' y='228' textAnchor='middle' className={ styles.stageMono }>_postMap</text>
          </g>

          {/* Unified output */}
          <g className={ styles.stageNode } { ...selectStage('output') }>
            <rect x='822' y='188' width='152' height='54' rx='27' />
            <text x='898' y='210' textAnchor='middle' className={ styles.stageKind }>ONE SHAPE OUT</text>
            <text x='898' y='228' textAnchor='middle' className={ styles.stageName }>Unified output</text>
          </g>

          <text x='500' y='330' textAnchor='middle' className={ styles.pipelineHint }>the output of each stage feeds the next</text>
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeStage.name}</span>
          <span className={ styles.readoutText }>{activeStage.blurb}</span>
        </div>
        {activeStage.json ? (
          <pre className={ styles.readoutJson }>
            <code>{activeStage.json}</code>
          </pre>
        ) : null}
        <span className={ styles.readoutMeta }>one mappings file · deterministic output · plugins hook before and after</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeStage.name}: {activeStage.blurb}
      </p>
    </figure>
  );
};

export default DittoStagesExplorer;
