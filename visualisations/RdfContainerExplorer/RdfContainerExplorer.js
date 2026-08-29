'use client';

/**
 * THESIS: RDF containers are graph hubs whose membership geometry changes meaning without changing the RDF edge model.
 * OWN-WORLD: A vivid topology lab—one open boundary, one typed hub, and live member nodes instead of UI panels.
 * STORY: Switch Seq, Bag, and Alt to see order, equivalence, and preference expressed spatially; add D to keep the graph open.
 * FIRST VIEWPORT: A subject enters a typed container hub which fans outward to its members as labelled RDF edges.
 * FORM: A responsive SVG hub-and-spoke graph with semantic layout switching.
 */

import { useState } from 'react';

import styles from './RdfContainerExplorer.module.css';

const containerTypes = {
  'alt': {
    'description': 'Alt places rdf:_1 on the primary path and keeps the other values as alternatives.',
    'label': 'Alt',
    'meaning': 'alternatives',
    'term': 'rdf:Alt'
  },
  'bag': {
    'description': 'Bag distributes equal peers around the hub; their visual position carries no order.',
    'label': 'Bag',
    'meaning': 'unordered',
    'term': 'rdf:Bag'
  },
  'seq': {
    'description': 'Sequence preserves a visible order from rdf:_1 through the final member.',
    'label': 'Seq',
    'meaning': 'ordered',
    'term': 'rdf:Seq'
  }
};

const baseMembers = [ 'A', 'B', 'C' ];

const getPositions = (type, count) => {
  if (type === 'seq')
    return count === 4 ? [[ 172, 460 ], [ 391, 460 ], [ 609, 460 ], [ 828, 460 ]] : [[ 260, 460 ], [ 500, 460 ], [ 740, 460 ]];

  if (type === 'bag')
    return count === 4 ? [[ 172, 435 ], [ 391, 485 ], [ 609, 435 ], [ 828, 485 ]] : [[ 270, 435 ], [ 500, 485 ], [ 730, 435 ]];

  return count === 4 ? [[ 500, 390 ], [ 190, 470 ], [ 810, 470 ], [ 500, 500 ]] : [[ 500, 390 ], [ 240, 470 ], [ 760, 470 ]];
};

const RdfContainerExplorer = ({
  title = 'The same membership edges create three different structures',
  description = 'Change the container type and watch the graph reorganize around order, equivalence, or preference.',
  className = ''
}) => {
  const [ activeTypeId, setActiveTypeId ] = useState('alt');
  const [ extended, setExtended ] = useState(false);
  const activeType = containerTypes[activeTypeId];
  const members = extended ? [ ...baseMembers, 'D' ] : baseMembers;
  const positions = getPositions(activeTypeId, members.length);

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <div className={ styles.toolbar }>
        <div className={ styles.typeTabs } aria-label='RDF container type' role='group'>
          {Object.entries(containerTypes).map(([ id, type ]) => (
            <button
              type='button'
              aria-label={ `${type.label} ${type.meaning}` }
              aria-pressed={ activeTypeId === id }
              data-active={ activeTypeId === id }
              key={ id }
              onClick={ () => setActiveTypeId(id) }
            >
              <strong>{type.label}</strong>
              <span>{type.meaning}</span>
            </button>
          ))}
        </div>

        <button
          type='button'
          aria-pressed={ extended }
          className={ styles.extendButton }
          onClick={ () => setExtended((current) => !current) }
        >
          <span aria-hidden='true'>{extended ? '−' : '+'}</span>
          {extended ? 'Remove D' : 'Add member D'}
        </button>
      </div>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the graph</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable RDF container graph' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 570' role='img' aria-labelledby='rdf-container-title rdf-container-description'>
          <title id='rdf-container-title'>Interactive RDF container graph</title>
          <desc id='rdf-container-description'>Ahmad Assaf’s Blog points to an open RDF container. The selected container type changes how member nodes A, B, C, and optional D are arranged.</desc>

          <defs>
            <marker id='rdf-container-arrow' viewBox='0 0 12 12' refX='10' refY='6' markerWidth='8' markerHeight='8' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ styles.arrowHead } />
            </marker>
          </defs>

          <rect x='60' y='136' width='880' height='404' rx='80' className={ styles.openBoundary } />
          <text x='884' y='166' textAnchor='end' className={ styles.openLabel }>OPEN CONTAINER · {members.length} MEMBERS</text>

          <path d='M 500 98 C 500 122, 500 140, 500 162' className={ styles.subjectEdge } markerEnd='url(#rdf-container-arrow)' />
          <text x='484' y='128' textAnchor='end' className={ styles.subjectEdgeLabel }>ex:hasAdmins</text>

          {members.map((member, index) => {
            const [ x, y ] = positions[index];
            const preferred = activeTypeId === 'alt' && index === 0;
            const memberWidth = 210;
            const memberHeight = 68;
            const memberHalfWidth = memberWidth / 2;
            const memberTopY = y - (memberHeight / 2);
            const edgeEndY = memberTopY - 6;

            /*
             * The fourth alternative sits below the preferred member, so its
             * edge routes around the preferred halo instead of through it.
             */
            const routedAlternative = activeTypeId === 'alt' && members.length === 4 && index === 3;
            const edgePath = routedAlternative
              ? `M 472 310 C 350 350, 330 445, ${x - memberHalfWidth - 6} ${y}`
              : `M 500 314 C 500 358, ${x} ${memberTopY - 52}, ${x} ${edgeEndY}`;

            // Labels hang beside the near-vertical tail of each edge, above the pill
            let labelX = x === 500 ? x - 46 : x + (x < 500 ? -46 : 46);
            let labelY = memberTopY - 20;

            if (routedAlternative) {
              labelX = 296;
              labelY = 428;
            } else if (activeTypeId === 'bag' && members.length === 4 && index === 2) {

              // Keep rdf:_3 on the inner side of its edge, clear of the sweep toward D
              labelX = x - 46;
            }

            return (
              <g className={ styles.memberBranch } data-preferred={ preferred } key={ member }>
                <path
                  d={ edgePath }
                  className={ styles.memberEdge }
                  markerEnd='url(#rdf-container-arrow)'
                />
                <text x={ labelX } y={ labelY } textAnchor='middle' className={ styles.memberEdgeLabel }>rdf:_{index + 1}</text>
                {preferred && (
                  <rect
                    x={ x - memberHalfWidth - 14 }
                    y={ y - (memberHeight / 2) - 14 }
                    width={ memberWidth + 28 }
                    height={ memberHeight + 28 }
                    rx={ (memberHeight + 28) / 2 }
                    className={ styles.preferredHalo }
                  />
                )}
                <rect
                  x={ x - memberHalfWidth }
                  y={ y - (memberHeight / 2) }
                  width={ memberWidth }
                  height={ memberHeight }
                  rx={ memberHeight / 2 }
                  className={ styles.memberNode }
                />
                <text x={ x } y={ y - 5 } textAnchor='middle' className={ styles.memberName }>{member}</text>
                <text x={ x } y={ y + 18 } textAnchor='middle' className={ styles.memberIri }>https://assaf.website/{member}</text>
                {preferred && <text x={ x } y={ y + 66 } textAnchor='middle' className={ styles.preferredLabel }>PREFERRED</text>}
              </g>
            );
          })}

          <g className={ styles.subjectNode }>
            <rect x='405' y='30' width='190' height='64' rx='32' />
            <text x='500' y='18' textAnchor='middle' className={ styles.nodeKind }>SUBJECT</text>
            <text x='500' y='57' textAnchor='middle' className={ styles.subjectTitle }>Ahmad Assaf’s Blog</text>
            <text x='500' y='79' textAnchor='middle' className={ styles.nodeCode }>ex:Blog</text>
          </g>

          <g className={ styles.hub } data-type={ activeTypeId }>
            <circle cx='500' cy='246' r='78' className={ styles.hubHalo } />
            <circle cx='500' cy='246' r='62' className={ styles.hubNode } />
            <text x='500' y='230' textAnchor='middle' className={ styles.nodeKindInverse }>TYPE</text>
            <text x='500' y='260' textAnchor='middle' className={ styles.hubTitle }>{activeType.term}</text>
            <text x='500' y='285' textAnchor='middle' className={ styles.hubMeaning }>{activeType.meaning}</text>
          </g>
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeType.term}</span>
          <span className={ styles.readoutText }>{activeType.description}</span>
        </div>
        <span className={ styles.readoutMeta }>
          {extended ? 'rdf:_4 joins without closing the container' : 'Add D to prove that this boundary remains open'}
        </span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeType.term}. {activeType.description} {extended ? 'Member D is included as rdf:_4.' : 'The graph contains members A, B, and C.'}
      </p>
    </figure>
  );
};

export default RdfContainerExplorer;
