'use client';

/**
 * THESIS: A blank node is visible through its connections, not through a public identity card.
 * OWN-WORLD: A dark constellation map where anonymous junctions flare only when their local facts are traced.
 * STORY: Select either dashed junction and follow its two outgoing facts to a literal and an IRI.
 * FIRST VIEWPORT: One named resource forks into two anonymous subgraphs against a deep graph canvas.
 * FORM: An interactive RDF constellation built as one continuous network.
 */

import { useState } from 'react';

import styles from './RdfBlankNodeExplorer.module.css';

const branches = [
  {
    'id': 'blog-a',
    'link': 'https://bloga.com',
    'name': 'Blog A',
    'node': '_:influence1',
    'y': 130
  },
  {
    'id': 'blog-b',
    'link': 'https://blogb.com',
    'name': 'Blog B',
    'node': '_:influence2',
    'y': 330
  }
];

const labelOffset = 24;
const influenceLabelProgress = 0.38;
const outgoingLabelProgress = 0.68;

const RdfBlankNodeExplorer = ({
  title = 'Anonymous nodes reveal themselves through their edges',
  description = 'Choose either dashed junction to trace the local facts it holds together without assigning it a public IRI.',
  className = ''
}) => {
  const [ activeBranchId, setActiveBranchId ] = useState('blog-a');
  const activeBranch = branches.find((branch) => branch.id === activeBranchId);

  const selectBranch = (branchId) => {
    return {
      'aria-label': `Trace the blank node for ${branches.find((branch) => branch.id === branchId).name}`,
      'aria-pressed': activeBranchId === branchId,
      'data-active': activeBranchId === branchId,
      'onClick': () => setActiveBranchId(branchId),
      'onFocus': () => setActiveBranchId(branchId),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveBranchId(branchId);
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

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable RDF blank-node graph' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 20 1000 475' role='group' aria-labelledby='rdf-blank-title rdf-blank-description'>
          <title id='rdf-blank-title'>RDF blank-node constellation</title>
          <desc id='rdf-blank-description'>Ahmad Assaf’s Blog connects to two anonymous nodes. Each anonymous node groups a blog name and a blog link.</desc>

          {branches.map((branch) => {
            const active = activeBranchId === branch.id;
            const leafDirection = branch.y < 300 ? -1 : 1;
            const nameY = branch.y + (leafDirection * -55);
            const linkY = branch.y + (leafDirection * 68);
            const influenceLabelY = 225 + ((branch.y - 225) * influenceLabelProgress) - labelOffset;
            const nameLabelY = branch.y + ((nameY - branch.y) * outgoingLabelProgress) - labelOffset;
            const linkLabelY = branch.y + ((linkY - branch.y) * outgoingLabelProgress) - labelOffset;

            return (
              <g className={ styles.branch } data-active={ active } key={ branch.id }>
                <path d={ `M 289 225 C 360 225, 355 ${branch.y}, 444 ${branch.y}` } className={ styles.influenceEdge } />
                <g
                  className={ `${styles.edgeLabel} ${styles.influenceLabel}` }
                  transform={ `translate(340 ${influenceLabelY})` }
                >
                  <text textAnchor='middle'>ex:isInfluencedBy</text>
                </g>

                <path d={ `M 496 ${branch.y} C 585 ${branch.y}, 600 ${nameY}, 704 ${nameY}` } className={ styles.nameEdge } />
                <path d={ `M 496 ${branch.y} C 585 ${branch.y}, 600 ${linkY}, 704 ${linkY}` } className={ styles.linkEdge } />
                <g className={ `${styles.edgeLabel} ${styles.nameLabel}` } transform={ `translate(620 ${nameLabelY})` }>
                  <text textAnchor='middle'>ex:name</text>
                </g>
                <g className={ `${styles.edgeLabel} ${styles.linkLabel}` } transform={ `translate(620 ${linkLabelY})` }>
                  <text textAnchor='middle'>ex:link</text>
                </g>

                <g className={ styles.blankNode } { ...selectBranch(branch.id) }>
                  <circle cx='470' cy={ branch.y } r='34' className={ styles.blankHalo } />
                  <circle cx='470' cy={ branch.y } r='21' className={ styles.blankShape } />
                  <text x='470' y={ branch.y + 58 } textAnchor='middle' className={ styles.blankLabel }>{branch.node}</text>
                </g>

                <g className={ styles.literalNode }>
                  <rect x='704' y={ nameY - 31 } width='180' height='62' rx='31' />
                  <text x='794' y={ nameY - 4 } textAnchor='middle' className={ styles.leafKind }>LITERAL</text>
                  <text x='794' y={ nameY + 18 } textAnchor='middle' className={ styles.leafValue }>{branch.name}</text>
                </g>

                <g className={ styles.iriNode }>
                  <rect x='704' y={ linkY - 31 } width='226' height='62' rx='31' />
                  <text x='817' y={ linkY - 4 } textAnchor='middle' className={ styles.leafKind }>IRI</text>
                  <text x='817' y={ linkY + 18 } textAnchor='middle' className={ styles.leafValue }>{branch.link}</text>
                </g>
              </g>
            );
          })}

          <g className={ styles.sourceNode }>
            <rect x='95' y='191' width='190' height='68' rx='34' />
            <text x='190' y='179' textAnchor='middle' className={ styles.sourceKind }>NAMED RESOURCE</text>
            <text x='190' y='220' textAnchor='middle' className={ styles.sourceTitle }>Ahmad Assaf’s Blog</text>
            <text x='190' y='242' textAnchor='middle' className={ styles.sourceCode }>ex:Blog</text>
          </g>

          <text x='68' y='471' className={ styles.readoutNode }>{activeBranch.node}</text>
          <text x='932' y='466' textAnchor='end' className={ styles.readoutText }>Groups “{activeBranch.name}” and {activeBranch.link}</text>
          <text x='932' y='488' textAnchor='end' className={ styles.readoutMeta }>local identity · no public IRI</text>
        </svg>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeBranch.node} groups the literal {activeBranch.name} with the IRI {activeBranch.link}. It has local identity and no public IRI.
      </p>
    </figure>
  );
};

export default RdfBlankNodeExplorer;
