'use client';

import { useState } from 'react';

import { graphSelectionProps } from '../graphSelectionProps';

import styles from './RdfVsPropertyGraphExplorer.module.css';

const blogIri = 'http://assaf.website/blog';
const blogTitle = "Ahmad Assaf's Blog";

const models = {
  'property': {
    'elements': [
      { 'blurb': 'Person is the label on Ahmad’s node. Its iri property stores http://assaf.website/Administrators#AhmadAssaf so we can match Ahmad to his RDF identifier.', 'id': 'ahmad', 'name': 'Ahmad' },
      { 'blurb': 'Follow HAS_BLOG from Ahmad to his blog. If Ahmad renames the blog, the relationship still points to the same node.', 'id': 'hasBlog', 'name': 'HAS_BLOG' },
      { 'blurb': 'Blog is the node label. The iri and name are properties on this node. To rename the blog, update its name property.', 'id': 'blog', 'name': 'Blog node' }
    ],
    'label': 'Property graph',
    'meaning': 'nodes and relationships'
  },
  'rdf': {
    'elements': [
      { 'blurb': 'This is the short form of http://assaf.website/Administrators#AhmadAssaf. The two arrows leaving Ahmad tell us his type and which blog he has.', 'id': 'ahmad', 'name': ':AhmadAssaf' },
      { 'blurb': 'The triple “:AhmadAssaf a foaf:Person” describes Ahmad as a person. In Turtle, a is shorthand for rdf:type.', 'id': 'personType', 'name': 'foaf:Person' },
      { 'blurb': 'Read the arrow from subject to object. Ahmad is the subject, aa:hasBlog is the predicate, and the blog’s IRI is the object.', 'id': 'hasBlog', 'name': 'aa:hasBlog' },
      { 'blurb': 'The same blog IRI is the object of aa:hasBlog and the subject of two more triples. Follow those arrows to find the blog’s type and title.', 'id': 'blog', 'name': 'Blog IRI' },
      { 'blurb': 'The rdf:type arrow says that the resource identified by http://assaf.website/blog belongs to the class aa:Blog.', 'id': 'blogType', 'name': 'aa:Blog' },
      { 'blurb': 'The quoted title is a string literal. Renaming the blog changes the object of this triple. The blog’s IRI and Ahmad’s link to it stay the same.', 'id': 'name', 'name': 'aa:hasName' }
    ],
    'label': 'RDF',
    'meaning': 'triples'
  }
};

const RdfVsPropertyGraphExplorer = ({
  title = 'One dataset, two graph models',
  description = 'Ahmad has a blog. Switch models to see where its title lives, and select a node or an arrow to read what it represents.',
  className = ''
}) => {
  const [ activeModelId, setActiveModelId ] = useState('property');
  const [ activeElementIds, setActiveElementIds ] = useState({ 'property': 'hasBlog', 'rdf': 'hasBlog' });
  const activeModel = models[activeModelId];
  const activeElement = activeModel.elements.find((element) => element.id === activeElementIds[activeModelId]);

  const selectElement = (elementId) => graphSelectionProps({
    'label': `Read about ${activeModel.elements.find((element) => element.id === elementId).name}`,
    'onSelect': () => setActiveElementIds((current) => {
      return { ...current, [activeModelId]: elementId };
    }),
    'selected': activeElementIds[activeModelId] === elementId
  });

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
          <svg className={ styles.graph } viewBox='0 0 1000 245' role='group' aria-label='Ahmad and his blog as a property graph'>
            <g className={ styles.nodeCard } { ...selectElement('ahmad') }>
              <rect x='20' y='45' width='340' height='140' rx='18' />
              <text x='190' y='73' textAnchor='middle' className={ styles.elementKind }>NODE LABEL · Person</text>
              <text x='190' y='100' textAnchor='middle' className={ styles.nodeName }>Ahmad</text>
              <path d='M 46 113 H 334' className={ styles.cardDivider } />
              <text x='190' y='140' textAnchor='middle' className={ styles.propText }>iri: http://assaf.website/</text>
              <text x='190' y='160' textAnchor='middle' className={ styles.propText }>Administrators#AhmadAssaf</text>
            </g>

            <g className={ styles.edgeGroup } { ...selectElement('hasBlog') }>
              <path d='M 360 115 H 638' className={ styles.edgeHit } />
              <path d='M 360 115 H 638' className={ styles.edgeLine } />
              <path d='M 638 115 l -12 -6 v 12 Z' className={ styles.edgeArrow } />
              <rect x='435' y='73' width='130' height='33' rx='8' className={ styles.edgeCard } />
              <text x='500' y='94' textAnchor='middle' className={ styles.edgeName }>HAS_BLOG</text>
            </g>

            <g className={ styles.nodeCard } { ...selectElement('blog') }>
              <rect x='640' y='45' width='340' height='140' rx='18' />
              <text x='810' y='73' textAnchor='middle' className={ styles.elementKind }>NODE LABEL · Blog</text>
              <text x='810' y='100' textAnchor='middle' className={ styles.nodeName }>Ahmad’s blog</text>
              <path d='M 666 113 H 954' className={ styles.cardDivider } />
              <text x='810' y='140' textAnchor='middle' className={ styles.propText }>iri: {blogIri}</text>
              <text x='810' y='160' textAnchor='middle' className={ styles.propText }>name: "{blogTitle}"</text>
            </g>
          </svg>
        ) : (
          <svg className={ styles.graph } viewBox='0 0 1000 335' role='group' aria-label='Four RDF triples describing Ahmad and his blog'>
            {[
              { 'id': 'personType', 'type': 'foaf:Person', 'x': 215 },
              { 'id': 'blogType', 'type': 'aa:Blog', 'x': 755 }
            ].map(({ id, x, type }) => (
              <g key={ id } className={ styles.tripleGroup } transform={ `translate(${x}, 0)` } { ...selectElement(id) }>
                <rect x='-88' y='18' width='176' height='42' rx='21' className={ styles.classNode } />
                <text x='0' y='44' textAnchor='middle' className={ styles.iriName }>{type}</text>
                <path d='M 0 132 V 62' className={ styles.edgeHit } />
                <path d='M 0 132 V 62' className={ styles.edgeLine } />
                <path d='M 0 62 l -6 12 h 12 Z' className={ styles.edgeArrow } />
                <text x='13' y='104' className={ styles.tripleLabel }>rdf:type</text>
              </g>
            ))}

            <g className={ styles.tripleGroup } { ...selectElement('hasBlog') }>
              <path d='M 325 160 H 606' className={ styles.edgeHit } />
              <path d='M 325 160 H 606' className={ styles.edgeLine } />
              <path d='M 606 160 l -12 -6 v 12 Z' className={ styles.edgeArrow } />
              <text x='465' y='149' textAnchor='middle' className={ styles.tripleLabel }>aa:hasBlog</text>
            </g>

            <g className={ styles.iriNode } { ...selectElement('ahmad') }>
              <rect x='105' y='132' width='220' height='56' rx='28' />
              <text x='215' y='154' textAnchor='middle' className={ styles.elementKind }>IRI</text>
              <text x='215' y='175' textAnchor='middle' className={ styles.iriName }>:AhmadAssaf</text>
            </g>

            <g className={ styles.iriNode } { ...selectElement('blog') }>
              <rect x='608' y='132' width='294' height='56' rx='28' />
              <text x='755' y='154' textAnchor='middle' className={ styles.elementKind }>IRI</text>
              <text x='755' y='175' textAnchor='middle' className={ styles.iriName }>{blogIri}</text>
            </g>

            <g className={ styles.tripleGroup } { ...selectElement('name') }>
              <path d='M 755 188 V 260' className={ styles.edgeHit } />
              <path d='M 755 188 V 260' className={ styles.edgeLine } />
              <path d='M 755 260 l -6 -12 h 12 Z' className={ styles.edgeArrow } />
              <text x='768' y='230' className={ styles.tripleLabel }>aa:hasName</text>
              <rect x='627' y='262' width='256' height='46' rx='6' className={ styles.literalCard } />
              <text x='755' y='290' textAnchor='middle' className={ styles.literalText }>"{blogTitle}"</text>
            </g>
          </svg>
        )}
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeElement.name}</span>
          <span className={ styles.readoutText }>{activeElement.blurb}</span>
        </div>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeModel.label}, {activeModel.meaning}. {activeElement.name}: {activeElement.blurb}
      </p>
    </figure>
  );
};

export default RdfVsPropertyGraphExplorer;
