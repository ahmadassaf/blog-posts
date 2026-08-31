'use client';

/**
 * THESIS: A property graph hangs attributes anywhere; RDF must turn every attribute into a triple, even attributes of edges.
 * OWN-WORLD: One tiny dataset drawn twice: two property-rich cards joined by a decorated edge, and a constellation of triples.
 * STORY: Switch models, then select nodes, edges, and the RDF-star annotation to see where since: 2015 lives in each world.
 * FIRST VIEWPORT: The property graph: Ahmad and Alice as rounded cards, the knows edge carrying its own since: 2015 box.
 * FORM: A responsive SVG with semantic tab switching and selectable graph elements.
 */

import { useState } from 'react';

import styles from './RdfVsPropertyGraphExplorer.module.css';

const models = {
  'property': {
    'elements': [
      { 'blurb': 'A node with an identity and its own key-value properties. age: 30 lives inside the node record itself. Property graphs let any node carry an arbitrary bag of attributes without touching the rest of the graph.', 'id': 'ahmad', 'name': 'Ahmad' },
      { 'blurb': 'A node with an empty property bag, which is perfectly legal. No shared schema forces every node to carry the same attributes; a property simply exists wherever someone set it.', 'id': 'alice', 'name': 'Alice' },
      { 'blurb': 'Relationships are first-class citizens here: the knows edge has a direction, a type, and its own property, since: 2015. Hanging data directly on an edge is the property graph model at its most ergonomic; no extra nodes, no extra statements.', 'id': 'knows', 'name': 'knows edge' }
    ],
    'label': 'Property graph',
    'meaning': 'attributes live anywhere',
    'meta': 'edge properties are native · no standard model or serialisation · node and edge IDs are internal to one database'
  },
  'rdf': {
    'elements': [
      { 'blurb': ':Ahmad is an IRI, a global identifier. Any dataset that uses the same IRI is talking about the same resource, which is why independently published RDF graphs can merge automatically. A property graph node ID, by contrast, only means something inside its own database.', 'id': 'ahmad', 'name': ':Ahmad' },
      { 'blurb': ':Alice is another IRI node. RDF nodes have no internal property bag; anything you want to say about :Alice must become another triple with :Alice as its subject.', 'id': 'alice', 'name': ':Alice' },
      { 'blurb': 'One triple: :Ahmad :knows :Alice. The predicate :knows is itself an IRI, so even the relationship type has a global identity. But a plain triple has no slot for attributes of its own; since: 2015 cannot live here.', 'id': 'knows', 'name': ':knows triple' },
      { 'blurb': 'Attributes are triples too. What the property graph stores inside the Ahmad node, RDF states as its own edge to a literal: :Ahmad :age "30"^^xsd:integer. Uniformity is the point: data and its descriptions share one shape.', 'id': 'age', 'name': ':age triple' },
      { 'blurb': 'The cost of that uniformity, made visible: to say when the knows relationship began, you need a statement about a statement. RDF-star (part of the RDF 1.2 work) quotes the whole triple so it can be annotated: << :Ahmad :knows :Alice >> :since "2015". Classic RDF reification would spend four extra triples to say the same thing.', 'id': 'star', 'name': 'RDF-star annotation' }
    ],
    'label': 'RDF',
    'meaning': 'everything is a triple',
    'meta': 'W3C standard · global IRIs let graphs merge automatically · edge attributes need RDF-star or reification'
  }
};

const RdfVsPropertyGraphExplorer = ({
  title = 'One dataset, two graph models',
  description = 'The same three facts, Ahmad knows Alice since 2015 and Ahmad is 30, drawn as a property graph and as RDF triples. Switch models and select any element to read what it costs in each world.',
  className = ''
}) => {
  const [ activeModelId, setActiveModelId ] = useState('property');
  const [ activeElementIds, setActiveElementIds ] = useState({ 'property': 'knows', 'rdf': 'star' });
  const activeModel = models[activeModelId];
  const activeElement = activeModel.elements.find((element) => element.id === activeElementIds[activeModelId]);

  const selectElement = (elementId) => {
    return {
      'aria-label': `Read about ${activeModel.elements.find((element) => element.id === elementId).name}`,
      'aria-pressed': activeElementIds[activeModelId] === elementId,
      'data-active': activeElementIds[activeModelId] === elementId,
      'onClick': () => setActiveElementIds((current) => {
        return { ...current, [activeModelId]: elementId };
      }),
      'onFocus': () => setActiveElementIds((current) => {
        return { ...current, [activeModelId]: elementId };
      }),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveElementIds((current) => {
            return { ...current, [activeModelId]: elementId };
          });
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

      <div className={ styles.toolbar }>
        <div className={ styles.typeTabs } aria-label='Graph data model' role='group'>
          {[ 'property', 'rdf' ].map((id) => [ id, models[id] ]).map(([ id, model ]) => (
            <button
              type='button'
              aria-label={ `${model.label} ${model.meaning}` }
              aria-pressed={ activeModelId === id }
              data-active={ activeModelId === id }
              key={ id }
              onClick={ () => setActiveModelId(id) }
            >
              <strong>{model.label}</strong>
              <span>{model.meaning}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the diagram</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable graph data model diagram' tabIndex='0'>
        {activeModelId === 'property' ? (
          <svg className={ styles.graph } viewBox='0 0 1000 420' role='group' aria-label='The dataset as a property graph'>
            {/* The knows edge with its own property box */}
            <g className={ styles.edgeGroup } { ...selectElement('knows') }>
              <path d='M 340 215 L 660 215' className={ styles.edgeHit } />
              <path d='M 340 215 L 660 215' className={ styles.edgeLine } />
              <path d='M 526 215 L 514 209 L 514 221 Z' className={ styles.edgeArrow } />
              <path d='M 500 138 L 500 213' className={ styles.edgeConnector } />
              <rect x='405' y='48' width='190' height='90' rx='16' className={ styles.edgeCard } />
              <text x='500' y='72' textAnchor='middle' className={ styles.elementKind }>EDGE</text>
              <text x='500' y='94' textAnchor='middle' className={ styles.edgeName }>knows</text>
              <path d='M 429 106 L 571 106' className={ styles.cardDivider } />
              <text x='500' y='128' textAnchor='middle' className={ styles.propText }>since: 2015</text>
            </g>

            {/* Two nodes, each owning its properties */}
            <g className={ styles.nodeCard } { ...selectElement('ahmad') }>
              <rect x='100' y='150' width='240' height='130' rx='18' />
              <text x='220' y='182' textAnchor='middle' className={ styles.elementKind }>NODE</text>
              <text x='220' y='208' textAnchor='middle' className={ styles.nodeName }>Ahmad</text>
              <path d='M 130 224 L 310 224' className={ styles.cardDivider } />
              <text x='220' y='252' textAnchor='middle' className={ styles.propText }>age: 30</text>
            </g>

            <g className={ styles.nodeCard } { ...selectElement('alice') }>
              <rect x='660' y='150' width='240' height='130' rx='18' />
              <text x='780' y='182' textAnchor='middle' className={ styles.elementKind }>NODE</text>
              <text x='780' y='208' textAnchor='middle' className={ styles.nodeName }>Alice</text>
              <path d='M 690 224 L 870 224' className={ styles.cardDivider } />
              <text x='780' y='252' textAnchor='middle' className={ styles.propEmpty }>(no properties)</text>
            </g>

            <text x='500' y='366' textAnchor='middle' className={ styles.svgCaption }>since: 2015 hangs directly on the edge · no extra structure needed</text>
          </svg>
        ) : (
          <svg className={ styles.graph } viewBox='0 0 1000 420' role='group' aria-label='The dataset as RDF triples with an RDF-star annotation'>
            {/* Triple 1: :Ahmad :knows :Alice */}
            <g className={ styles.tripleGroup } { ...selectElement('knows') }>
              <path d='M 260 231 L 740 231' className={ styles.edgeHit } />
              <path d='M 260 231 L 740 231' className={ styles.edgeLine } />
              <path d='M 616 231 L 604 225 L 604 237 Z' className={ styles.edgeArrow } />
              <text x='400' y='218' textAnchor='middle' className={ styles.tripleLabel }>:knows</text>
            </g>

            {/* Triple 2: :Ahmad :age "30"^^xsd:integer */}
            <g className={ styles.tripleGroup } { ...selectElement('age') }>
              <path d='M 175 258 L 175 330' className={ styles.edgeHit } />
              <path d='M 175 258 L 175 330' className={ styles.edgeLine } />
              <path d='M 175 308 L 169 296 L 181 296 Z' className={ styles.edgeArrow } />
              <text x='192' y='300' className={ styles.tripleLabel }>:age</text>
              <rect x='85' y='330' width='180' height='48' rx='6' className={ styles.literalCard } />
              <text x='175' y='359' textAnchor='middle' className={ styles.literalText }>{'"30"^^xsd:integer'}</text>
            </g>

            {/* The RDF-star annotation: a quoted triple carrying :since */}
            <g className={ styles.starGroup } { ...selectElement('star') }>
              <text x='430' y='32' textAnchor='middle' className={ styles.elementKind }>RDF-STAR · QUOTED TRIPLE</text>
              <rect x='280' y='48' width='300' height='56' rx='28' className={ styles.starNode } />
              <text x='430' y='82' textAnchor='middle' className={ styles.starText }>{'<< :Ahmad :knows :Alice >>'}</text>
              <path d='M 438 104 C 462 148, 484 192, 498 226' className={ styles.starConnector } />
              <path d='M 580 76 L 720 76' className={ styles.edgeLine } />
              <path d='M 692 76 L 680 70 L 680 82 Z' className={ styles.edgeArrow } />
              <text x='650' y='62' textAnchor='middle' className={ styles.tripleLabel }>:since</text>
              <rect x='720' y='52' width='130' height='48' rx='6' className={ styles.literalCard } />
              <text x='785' y='81' textAnchor='middle' className={ styles.literalText }>{'"2015"'}</text>
            </g>

            {/* The two IRI nodes */}
            <g className={ styles.iriNode } { ...selectElement('ahmad') }>
              <rect x='90' y='204' width='170' height='54' rx='27' />
              <text x='175' y='226' textAnchor='middle' className={ styles.elementKind }>IRI</text>
              <text x='175' y='246' textAnchor='middle' className={ styles.iriName }>:Ahmad</text>
            </g>

            <g className={ styles.iriNode } { ...selectElement('alice') }>
              <rect x='740' y='204' width='170' height='54' rx='27' />
              <text x='825' y='226' textAnchor='middle' className={ styles.elementKind }>IRI</text>
              <text x='825' y='246' textAnchor='middle' className={ styles.iriName }>:Alice</text>
            </g>

            <text x='500' y='404' textAnchor='middle' className={ styles.svgCaption }>the edge attribute costs a statement about a statement · classic reification would cost four extra triples</text>
          </svg>
        )}
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeElement.name}</span>
          <span className={ styles.readoutText }>{activeElement.blurb}</span>
        </div>
        <span className={ styles.readoutMeta }>{activeModel.meta}</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeModel.label}, {activeModel.meaning}. {activeElement.name}: {activeElement.blurb}
      </p>
    </figure>
  );
};

export default RdfVsPropertyGraphExplorer;
