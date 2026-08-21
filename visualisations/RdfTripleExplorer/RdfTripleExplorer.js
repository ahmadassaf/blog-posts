'use client';

/**
 * THESIS: RDF reads fastest as a directed graph, never as a row of interface cards.
 * OWN-WORLD: A crisp semantic map where node shape, edge direction, and color reveal each term's role.
 * STORY: Touch the subject, predicate, or object and the graph itself explains the selected term.
 * FIRST VIEWPORT: Two unmistakable resources are joined by one labelled, directional relationship.
 * FORM: A native SVG knowledge-graph fragment with direct node and edge inspection.
 */

import { useState } from 'react';

import styles from './RdfTripleExplorer.module.css';

const tripleParts = {
  'object': {
    'description': 'The resource reached by following the relationship.',
    'kind': 'IRI · object',
    'label': 'assaf.website/blog',
    'term': 'ex:Blog'
  },
  'predicate': {
    'description': 'The directed relationship between two resources.',
    'kind': 'IRI · predicate',
    'label': 'has blog',
    'term': 'ex:hasBlog'
  },
  'subject': {
    'description': 'The resource being described.',
    'kind': 'IRI · subject',
    'label': 'Ahmad Assaf',
    'term': 'ex:Ahmad'
  }
};

const RdfTripleExplorer = ({
  title = 'One statement becomes one directed graph',
  description = 'Select either node or the connecting edge to inspect the three terms inside an RDF triple.',
  className = ''
}) => {
  const [ activePartId, setActivePartId ] = useState('predicate');
  const activePart = tripleParts[activePartId];

  const interactionProps = (partId) => {
    return {
      'aria-label': `Inspect ${partId}: ${tripleParts[partId].label}`,
      'aria-pressed': activePartId === partId,
      'data-active': activePartId === partId,
      'onClick': () => setActivePartId(partId),
      'onFocus': () => setActivePartId(partId),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActivePartId(partId);
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

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable RDF triple graph' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 40 1000 390' role='group' aria-labelledby='rdf-triple-title rdf-triple-description'>
          <title id='rdf-triple-title'>RDF triple graph</title>
          <desc id='rdf-triple-description'>Ahmad Assaf has blog assaf.website/blog. Each part can be selected for an explanation.</desc>

          <defs>
            <marker id='rdf-triple-arrow' viewBox='0 0 12 12' refX='10' refY='6' markerWidth='10' markerHeight='10' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ styles.arrowHead } />
            </marker>
          </defs>

          <path
            d='M 286 208 C 402 138, 595 138, 706 208'
            className={ styles.edgeLine }
            data-active={ activePartId === 'predicate' }
            markerEnd='url(#rdf-triple-arrow)'
          />

          <g className={ styles.edgeTarget } { ...interactionProps('predicate') }>
            <path d='M 286 208 C 402 138, 595 138, 706 208' />
            <rect x='405' y='116' width='190' height='70' rx='35' className={ styles.predicatePlate } />
            <text x='500' y='143' textAnchor='middle' className={ styles.roleText }>PREDICATE</text>
            <text x='500' y='166' textAnchor='middle' className={ styles.predicateText }>ex:hasBlog</text>
          </g>

          <g className={ styles.subjectNode } { ...interactionProps('subject') }>
            <circle cx='190' cy='235' r='98' className={ styles.nodeHalo } />
            <circle cx='190' cy='235' r='80' className={ styles.subjectShape } />
            <text x='190' y='216' textAnchor='middle' className={ styles.roleTextInverse }>SUBJECT</text>
            <text x='190' y='246' textAnchor='middle' className={ styles.nodeTitleInverse }>Ahmad Assaf</text>
            <text x='190' y='270' textAnchor='middle' className={ styles.nodeCodeInverse }>ex:Ahmad</text>
          </g>

          <g className={ styles.objectNode } { ...interactionProps('object') }>
            <rect x='706' y='171' width='244' height='128' rx='64' className={ styles.nodeHalo } />
            <rect x='720' y='185' width='216' height='100' rx='50' className={ styles.objectShape } />
            <text x='828' y='218' textAnchor='middle' className={ styles.roleText }>OBJECT</text>
            <text x='828' y='247' textAnchor='middle' className={ styles.nodeTitle }>assaf.website/blog</text>
            <text x='828' y='270' textAnchor='middle' className={ styles.nodeCode }>ex:Blog</text>
          </g>

          <text x='72' y='402' className={ styles.readoutKind }>{activePart.kind}</text>
          <text x='930' y='397' textAnchor='end' className={ styles.readoutLabel }>{activePart.label}</text>
          <text x='930' y='423' textAnchor='end' className={ styles.readoutDescription }>{activePart.description}</text>
        </svg>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activePart.kind}. {activePart.label}. {activePart.description}
      </p>
    </figure>
  );
};

export default RdfTripleExplorer;
