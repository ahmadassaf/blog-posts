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
    return count === 4 ? [[ 172, 400 ], [ 391, 400 ], [ 609, 400 ], [ 828, 400 ]] : [[ 260, 400 ], [ 500, 400 ], [ 740, 400 ]];

  if (type === 'bag')
    return count === 4 ? [[ 172, 380 ], [ 391, 425 ], [ 609, 380 ], [ 828, 425 ]] : [[ 270, 380 ], [ 500, 420 ], [ 730, 380 ]];

  return count === 4 ? [[ 500, 342 ], [ 190, 410 ], [ 810, 410 ], [ 500, 436 ]] : [[ 500, 342 ], [ 240, 410 ], [ 760, 410 ]];
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
        <svg className={ styles.graph } viewBox='0 0 1000 500' role='img' aria-labelledby='rdf-container-title rdf-container-description'>
          <title id='rdf-container-title'>Interactive RDF container graph</title>
          <desc id='rdf-container-description'>Ahmad Assaf’s Blog points to an open RDF container. The selected container type changes how member nodes A, B, C, and optional D are arranged.</desc>

          <defs>
            <marker id='rdf-container-arrow' viewBox='0 0 12 12' refX='10' refY='6' markerWidth='8' markerHeight='8' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ styles.arrowHead } />
            </marker>
          </defs>

          <rect x='60' y='114' width='880' height='356' rx='64' className={ styles.openBoundary } />
          <text x='884' y='142' textAnchor='end' className={ styles.openLabel }>OPEN CONTAINER · {members.length} MEMBERS</text>

          <path d='M 500 82 C 500 102, 500 118, 500 138' className={ styles.subjectEdge } markerEnd='url(#rdf-container-arrow)' />
          <text x='484' y='108' textAnchor='end' className={ styles.subjectEdgeLabel }>ex:hasAdmins</text>

          {members.map((member, index) => {
            const [ x, y ] = positions[index];
            const preferred = activeTypeId === 'alt' && index === 0;
            const memberWidth = 180;
            const memberHeight = 56;
            const memberHalfWidth = memberWidth / 2;
            const memberTopY = y - (memberHeight / 2);

            /*
             * The fourth alternative sits below the preferred member, so its
             * edge routes around the preferred halo instead of through it.
             */
            const routedAlternative = activeTypeId === 'alt' && members.length === 4 && index === 3;

            /*
             * Edges leave the hub along its rim, spread toward their target so
             * the fan never braids, and land on the pill (or preferred halo).
             */
            const deltaX = x - 500;
            const startX = 500 + Math.max(-36, Math.min(36, deltaX * 0.12));
            const startY = 210 + Math.sqrt((64 ** 2) - ((startX - 500) ** 2));
            const landingY = preferred ? memberTopY - 12 : memberTopY - 2;

            // Tidy-tree curve: both controls at mid-height, so edges leave and land vertically
            const midY = (startY + landingY) / 2;
            const edgePath = routedAlternative ? `M 455 255 C 360 290, 345 380, ${x - memberHalfWidth - 6} ${y}` : `M ${startX} ${startY} C ${startX} ${midY}, ${x} ${midY}, ${x} ${landingY}`;

            // Labels hang beside the near-vertical tail of each edge, above the pill
            let labelX = x === 500 ? x - 40 : x + (x < 500 ? -40 : 40);
            let labelY = memberTopY - 18;

            if (routedAlternative) {
              labelX = 308;
              labelY = 370;
            } else if (activeTypeId === 'bag' && members.length === 4 && index === 2) {

              // Keep rdf:_3 on the inner side of its edge, clear of the sweep toward D
              labelX = x - 40;
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
                    x={ x - memberHalfWidth - 10 }
                    y={ y - (memberHeight / 2) - 10 }
                    width={ memberWidth + 20 }
                    height={ memberHeight + 20 }
                    rx={ (memberHeight + 20) / 2 }
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
                <text x={ x } y={ y - 4 } textAnchor='middle' className={ styles.memberName }>{member}</text>
                <text x={ x } y={ y + 16 } textAnchor='middle' className={ styles.memberIri }>https://assaf.website/{member}</text>
                {preferred && <text x={ x } y={ y + 54 } textAnchor='middle' className={ styles.preferredLabel }>PREFERRED</text>}
              </g>
            );
          })}

          <g className={ styles.subjectNode }>
            <rect x='415' y='24' width='170' height='54' rx='27' />
            <text x='500' y='14' textAnchor='middle' className={ styles.nodeKind }>SUBJECT</text>
            <text x='500' y='47' textAnchor='middle' className={ styles.subjectTitle }>Ahmad Assaf’s Blog</text>
            <text x='500' y='67' textAnchor='middle' className={ styles.nodeCode }>ex:Blog</text>
          </g>

          <g className={ styles.hub } data-type={ activeTypeId }>
            <circle cx='500' cy='210' r='62' className={ styles.hubHalo } />
            <circle cx='500' cy='210' r='50' className={ styles.hubNode } />
            <text x='500' y='196' textAnchor='middle' className={ styles.nodeKindInverse }>TYPE</text>
            <text x='500' y='216' textAnchor='middle' className={ styles.hubTitle }>{activeType.term}</text>
            <text x='500' y='236' textAnchor='middle' className={ styles.hubMeaning }>{activeType.meaning}</text>
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
