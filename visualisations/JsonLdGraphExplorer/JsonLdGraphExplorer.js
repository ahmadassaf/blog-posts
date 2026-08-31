'use client';

/**
 * THESIS: The blog's JSON-LD is one small graph: static identity entities reused everywhere, and a generated BlogPosting that embeds them per article.
 * OWN-WORLD: Five Schema.org entities as pill nodes, wired by the exact property names the generator emits, read left to right from the generated post toward the static identity.
 * STORY: Select any entity to read its Schema.org type, its place in the layering, and a real fragment of the JSON it contributes.
 * FIRST VIEWPORT: The full entity graph with the Person selected and the readout explaining the identity layer.
 * FORM: A responsive SVG entity graph with selectable pill nodes driving a shared readout.
 */

import { useState } from 'react';

import styles from './JsonLdGraphExplorer.module.css';

const entities = [
  {
    'fragment': '{ "@type": "BlogPosting", "headline": post.title, "datePublished": post.date, "isPartOf": blog }',
    'id': 'blogPosting',
    'kind': 'BLOGPOSTING',
    'name': 'Every article',
    'role': 'The per-article layer that linkedDataGenerator builds from frontmatter at build time, embedding the static Person and Blog entities instead of repeating their facts.',
    'type': 'schema:BlogPosting',
    'x': 150,
    'y': 230
  },
  {
    'fragment': '{ "@type": "Blog", "mainEntityOfPage": { "@type": "WebSite" }, "url": "https://assaf.website/blog" }',
    'id': 'blog',
    'kind': 'BLOG',
    'name': 'assaf.website/blog',
    'role': 'A derived layer created by spreading the WebSite constant and overriding what differs; its mainEntityOfPage points back at the WebSite it belongs to.',
    'type': 'schema:Blog',
    'x': 410,
    'y': 110
  },
  {
    'fragment': '{ "@id": "https://assaf.website/blog/tags/json-ld", "@type": "Thing", "name": "JSON-LD" }',
    'id': 'tags',
    'kind': 'THING[]',
    'name': 'Post tags',
    'role': 'Each frontmatter tag becomes a Thing whose @id is the tag page URL, so a post links to browsable topic entities instead of bare strings.',
    'type': 'schema:Thing (array)',
    'x': 410,
    'y': 350
  },
  {
    'fragment': '{ "@type": "WebSite", "name": "Ahmad Assaf\'s Personal Space", "url": "https://assaf.website" }',
    'id': 'website',
    'kind': 'WEBSITE',
    'name': 'assaf.website',
    'role': 'The site-wide layer the root layout injects on every page; it embeds the Person under its author property so identity ships with every URL.',
    'type': 'schema:WebSite',
    'x': 760,
    'y': 110
  },
  {
    'fragment': '{ "@type": "Person", "name": "Ahmad Assaf", "jobTitle": "CTO at Mav9", "url": "https://assaf.website" }',
    'id': 'person',
    'kind': 'PERSON',
    'name': 'Ahmad Assaf',
    'role': 'The static identity layer: a single exported constant that every other entity embeds, pulling its name, email and profiles from the shared metadata module.',
    'type': 'schema:Person',
    'x': 870,
    'y': 230
  }
];

const edges = [
  {
    'id': 'posting-ispartof-blog',
    'label': 'isPartOf',
    'labelAnchor': 'middle',
    'labelX': 247,
    'labelY': 138,
    'path': 'M 225 203 C 262 168, 292 140, 322 120'
  },
  {
    'id': 'posting-about-tags',
    'label': 'about',
    'labelAnchor': 'middle',
    'labelX': 247,
    'labelY': 332,
    'path': 'M 225 257 C 262 292, 292 320, 322 340'
  },
  {
    'id': 'posting-author-person',
    'label': 'author',
    'labelAnchor': 'middle',
    'labelX': 510,
    'labelY': 214,
    'path': 'M 240 230 L 780 230'
  },
  {
    'id': 'blog-mainentity-website',
    'label': 'mainEntityOfPage',
    'labelAnchor': 'middle',
    'labelX': 585,
    'labelY': 92,
    'path': 'M 500 110 L 670 110'
  },
  {
    'id': 'website-author-person',
    'label': 'author',
    'labelAnchor': 'end',
    'labelX': 778,
    'labelY': 180,
    'path': 'M 770 139 C 792 170, 838 184, 864 200'
  }
];

const nodeWidth = 170;
const nodeHeight = 54;

const JsonLdGraphExplorer = ({
  title = 'The layered JSON-LD entity graph',
  description = 'Every fact lives in exactly one entity, and the entities reference each other through plain Schema.org properties. Select a node to read its type, its layer, and a real fragment of the JSON it contributes.',
  className = ''
}) => {
  const [ activeEntityId, setActiveEntityId ] = useState('person');
  const activeEntity = entities.find((entity) => entity.id === activeEntityId) || entities[0];

  const selectEntity = (entityId) => {
    return {
      'aria-label': `Read about the ${entities.find((entity) => entity.id === entityId).name} entity`,
      'aria-pressed': activeEntityId === entityId,
      'data-active': activeEntityId === entityId,
      'onClick': () => setActiveEntityId(entityId),
      'onFocus': () => setActiveEntityId(entityId),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveEntityId(entityId);
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

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable JSON-LD entity graph' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 460' role='group' aria-label='The blog JSON-LD entity graph'>
          {/* Property edges, quiet beaded lines without arrowheads */}
          {edges.map((edge) => (
            <g key={ edge.id }>
              <path d={ edge.path } className={ styles.edge } />
              <text x={ edge.labelX } y={ edge.labelY } textAnchor={ edge.labelAnchor } className={ styles.edgeLabel }>{edge.label}</text>
            </g>
          ))}

          {/* Entity pills */}
          {entities.map((entity) => {
            const rectX = entity.x - (nodeWidth / 2);
            const rectY = entity.y - (nodeHeight / 2);

            return (
              <g className={ styles.entityNode } key={ entity.id } { ...selectEntity(entity.id) }>
                <rect x={ rectX } y={ rectY } width={ nodeWidth } height={ nodeHeight } rx={ nodeHeight / 2 } />
                <text x={ entity.x } y={ rectY + 22 } textAnchor='middle' className={ styles.entityKind }>{entity.kind}</text>
                <text x={ entity.x } y={ rectY + 40 } textAnchor='middle' className={ styles.entityName }>{entity.name}</text>
              </g>
            );
          })}

          <text x='500' y='432' textAnchor='middle' className={ styles.layerHint }>static: Person, WebSite · derived: Blog · generated per article: BlogPosting, Thing[]</text>
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeEntity.type}</span>
          <span className={ styles.readoutText }>{activeEntity.role}</span>
        </div>
        <code className={ styles.readoutFragment }>{activeEntity.fragment}</code>
        <span className={ styles.readoutMeta }>metadata.js → JSON-LD constants → linkedDataGenerator(post)</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeEntity.name} ({activeEntity.type}): {activeEntity.role}
      </p>
    </figure>
  );
};

export default JsonLdGraphExplorer;
