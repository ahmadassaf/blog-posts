'use client';

/**
 * THESIS: An RDF collection is a linked-list graph, so its first/rest topology must be visible at a glance.
 * OWN-WORLD: A cartographic route map—rest travels horizontally, first drops to each value, and nil is a hard terminus.
 * STORY: Walk the route from its first blank node to rdf:nil while the current cell and both outgoing edges are illuminated.
 * FIRST VIEWPORT: Three anonymous junctions form a staggered route with member branches above and below.
 * FORM: An interactive linked-list map with direct step controls and a closed visual endpoint.
 */

import { useState } from 'react';

import styles from './RdfCollectionExplorer.module.css';

const members = [ 'A', 'B', 'C' ];
const nodePositions = [
  { 'valueY': 330, 'x': 320, 'y': 135 },
  { 'valueY': 70, 'x': 610, 'y': 225 },
  { 'valueY': 330, 'x': 880, 'y': 135 }
];
const nilPosition = { 'x': 1110, 'y': 225 };

const RdfCollectionExplorer = ({
  title = 'A collection is a route through first and rest',
  description = 'Trace the rdf:rest chain as it bends between blank nodes; each rdf:first branch reveals the value stored there.',
  className = ''
}) => {
  const [ activeStep, setActiveStep ] = useState(0);
  const terminal = activeStep === members.length;
  const activeMember = members[activeStep];

  const selectStep = (step, label) => {
    return {
      'aria-label': label,
      'aria-pressed': activeStep === step,
      'data-active': activeStep === step,
      'onClick': () => setActiveStep(step),
      'onFocus': () => setActiveStep(step),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveStep(step);
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

      <p className={ styles.scrollHint }>Scroll horizontally to explore the graph</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable RDF collection graph' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1200 390' role='group' aria-labelledby='rdf-collection-title rdf-collection-description'>
          <title id='rdf-collection-title'>RDF collection linked-list graph</title>
          <desc id='rdf-collection-description'>Three blank list nodes connect through rdf:rest to rdf:nil. Each list node points through rdf:first to member A, B, or C.</desc>

          <defs>
            <marker id='rdf-collection-rest-arrow' viewBox='0 0 12 12' refX='10' refY='6' markerWidth='8' markerHeight='8' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ styles.restArrow } />
            </marker>
            <marker id='rdf-collection-first-arrow' viewBox='0 0 12 12' refX='10' refY='6' markerWidth='8' markerHeight='8' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ styles.firstArrow } />
            </marker>
          </defs>

          <g className={ styles.subject }>
            <circle cx='92' cy='225' r='56' />
            <text x='92' y='220' textAnchor='middle' className={ styles.subjectTitle }>ex:Blog</text>
            <text x='92' y='244' textAnchor='middle' className={ styles.subjectKind }>SUBJECT</text>
          </g>

          <path d='M 148 225 C 204 225, 230 135, 276 135' className={ styles.entryEdge } markerEnd='url(#rdf-collection-rest-arrow)' />
          <text x='204' y='158' textAnchor='middle' className={ styles.entryLabel }>ex:hasAdmins</text>

          {members.map((member, index) => {
            const { valueY, x, y } = nodePositions[index];
            const nextPosition = index < members.length - 1 ? nodePositions[index + 1] : nilPosition;
            const direction = valueY > y ? 1 : -1;
            const firstStartY = y + (direction * 38);
            const firstEndY = valueY - (direction * 44);
            const firstLabelY = (firstStartY + firstEndY) / 2;
            const restLabelY = Math.min(y, nextPosition.y) - 22;
            const active = activeStep === index;
            const visited = activeStep > index;

            return (
              <g className={ styles.listSegment } data-active={ active } data-visited={ visited } key={ member }>
                <path
                  d={ `M ${x + 40} ${y} C ${x + 105} ${y}, ${nextPosition.x - 105} ${nextPosition.y}, ${nextPosition.x - 44} ${nextPosition.y}` }
                  className={ styles.restEdge }
                  markerEnd='url(#rdf-collection-rest-arrow)'
                />
                <text x={ (x + nextPosition.x) / 2 } y={ restLabelY } textAnchor='middle' className={ styles.restLabel }>rdf:rest</text>

                <path
                  d={ `M ${x} ${firstStartY} C ${x} ${(firstStartY + firstEndY) / 2}, ${x} ${(firstStartY + firstEndY) / 2}, ${x} ${firstEndY}` }
                  className={ styles.firstEdge }
                  markerEnd='url(#rdf-collection-first-arrow)'
                />
                <text x={ x + 20 } y={ firstLabelY + 4 } className={ styles.firstLabel }>rdf:first</text>

                <g className={ styles.blankNode } { ...selectStep(index, `List node ${index + 1}, rdf:first ${member}`) }>
                  <circle cx={ x } cy={ y } r='54' className={ styles.nodeHalo } />
                  <circle cx={ x } cy={ y } r='38' className={ styles.blankShape } />
                  <text x={ x } y={ y - 4 } textAnchor='middle' className={ styles.nodeNumber }>{index + 1}</text>
                  <text x={ x } y={ y + 18 } textAnchor='middle' className={ styles.nodeKind }>BLANK</text>
                </g>

                <g className={ styles.valueNode } data-active={ active }>
                  <rect x={ x - 110 } y={ valueY - 34 } width='220' height='68' rx='34' />
                  <text x={ x } y={ valueY - 6 } textAnchor='middle' className={ styles.valueKind }>IRI MEMBER</text>
                  <text x={ x } y={ valueY + 18 } textAnchor='middle' className={ styles.valueText }>https://assaf.website/{member}</text>
                </g>
              </g>
            );
          })}

          <g className={ styles.nilNode } { ...selectStep(members.length, 'Inspect rdf:nil, the end of the collection') }>
            <circle cx={ nilPosition.x } cy={ nilPosition.y } r='50' className={ styles.nilHalo } />
            <circle cx={ nilPosition.x } cy={ nilPosition.y } r='38' className={ styles.nilShape } />
            <line x1={ nilPosition.x - 17 } y1={ nilPosition.y - 17 } x2={ nilPosition.x + 17 } y2={ nilPosition.y + 17 } />
            <line x1={ nilPosition.x + 17 } y1={ nilPosition.y - 17 } x2={ nilPosition.x - 17 } y2={ nilPosition.y + 17 } />
            <text x={ nilPosition.x } y={ nilPosition.y + 70 } textAnchor='middle' className={ styles.nilLabel }>rdf:nil</text>
          </g>
        </svg>
      </div>

      <div className={ styles.inspector }>
        <div className={ styles.inspectionState }>
          <span className={ styles.readoutIndex }>{terminal ? 'END' : `NODE ${activeStep + 1} / 3`}</span>
          <div className={ styles.inspectionCopy }>
            <strong>
              {terminal ? 'rdf:nil closes the collection' : `rdf:first → https://assaf.website/${activeMember}`}
            </strong>
            <span>
              {terminal ? 'No next node exists; membership is complete.' : `rdf:rest → ${activeStep === 2 ? 'rdf:nil' : `blank node ${activeStep + 2}`} · the list structure and stored value remain separate edges.`}
            </span>
          </div>
        </div>

        <div className={ styles.walkthrough }>
          <button type='button' disabled={ activeStep === 0 } onClick={ () => setActiveStep((step) => Math.max(0, step - 1)) }>
            <span aria-hidden='true'>←</span> Previous
          </button>
          <button type='button' disabled={ terminal } onClick={ () => setActiveStep((step) => Math.min(members.length, step + 1)) }>
            Next <span aria-hidden='true'>→</span>
          </button>
        </div>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {terminal ? 'rdf:nil closes the collection. There is no next node, so membership is complete.' : `Blank node ${activeStep + 1}. rdf:first points to ${activeMember}. rdf:rest points to ${activeStep === 2 ? 'rdf:nil' : `blank node ${activeStep + 2}`}.`}
      </p>
    </figure>
  );
};

export default RdfCollectionExplorer;
