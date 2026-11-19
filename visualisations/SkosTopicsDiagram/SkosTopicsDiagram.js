import { useId } from 'react';

import diagram from '../RdfAppointmentDiagram/RdfAppointmentDiagram.module.css';
import graph from '../RdfTripleExplorer/RdfTripleExplorer.module.css';
import styles from './SkosTopicsDiagram.module.css';

export default function SkosTopicsDiagram() {
  const id = useId();
  const title = `${id}-title`;
  const description = `${id}-description`;
  const arrow = `${id}-arrow`;
  const marker = `url(#${arrow})`;

  return (
    <figure className={ diagram.root }>
      <p className={ diagram.scrollHint }>Scroll horizontally to explore the graph</p>
      <div className={ graph.scrollFrame } role='region' aria-label='Scrollable graph of a blog post and its topic' tabIndex='0'>
        <svg className={ diagram.graph } viewBox='0 0 960 354' role='img' aria-labelledby={ `${title} ${description}` }>
          <title id={ title }>How one post connects to the RDF topic</title>
          <desc id={ description }>
            The subject of the post rdfPost is the concept topic:rdf. Its preferred English label is RDF.
            The Semantic Web is a broader topic. SPARQL is a related topic.
          </desc>
          <defs>
            <marker id={ arrow } viewBox='0 0 12 12' refX='10' refY='6' markerWidth='7' markerHeight='7' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ graph.arrowHead } />
            </marker>
          </defs>

          <path d='M 192 147 H 366' className={ diagram.edge } markerEnd={ marker } />
          <text x='279' y='130' textAnchor='middle' className={ diagram.predicate }>dcterms:subject</text>
          <path d='M 550 130 C 616 130 664 70 733 70' className={ diagram.edge } markerEnd={ marker } />
          <text x='631' y='66' textAnchor='middle' className={ diagram.predicate }>skos:broader</text>
          <path d='M 550 165 C 620 165 665 221 733 221' className={ diagram.edge } markerEnd={ marker } />
          <text x='630' y='228' textAnchor='middle' className={ diagram.predicate }>skos:related</text>
          <path d='M 462 192 V 263' className={ diagram.edge } markerEnd={ marker } />
          <text x='444' y='236' textAnchor='end' className={ diagram.predicate }>skos:prefLabel</text>

          <rect x='20' y='114' width='172' height='67' rx='33' className={ graph.subjectShape } />
          <text x='106' y='140' textAnchor='middle' className={ diagram.inverseKind }>BLOG POST</text>
          <text x='106' y='165' textAnchor='middle' className={ graph.nodeCodeInverse }>:rdfPost</text>
          <g className={ styles.tinted }>
            <rect x='371' y='102' width='182' height='90' rx='40' className={ graph.objectShape } />
            <text x='462' y='137' textAnchor='middle' className={ diagram.kind }>CONCEPT</text>
            <text x='462' y='164' textAnchor='middle' className={ graph.nodeTitle }>topic:rdf</text>
            <rect x='738' y='34' width='202' height='72' rx='36' className={ graph.objectShape } />
            <text x='839' y='62' textAnchor='middle' className={ diagram.kind }>CONCEPT</text>
            <text x='839' y='86' textAnchor='middle' className={ graph.nodeCode }>topic:semanticWeb</text>
            <rect x='738' y='185' width='202' height='72' rx='36' className={ graph.objectShape } />
            <text x='839' y='213' textAnchor='middle' className={ diagram.kind }>CONCEPT</text>
            <text x='839' y='237' textAnchor='middle' className={ graph.nodeCode }>topic:sparql</text>
            <rect x='371' y='268' width='182' height='67' rx='29' className={ diagram.literal } />
            <text x='462' y='294' textAnchor='middle' className={ diagram.kind }>ENGLISH LABEL</text>
            <text x='462' y='317' textAnchor='middle' className={ graph.nodeCode }>"RDF"@en</text>
          </g>
        </svg>
      </div>
    </figure>
  );
}
