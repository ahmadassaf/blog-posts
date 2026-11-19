import { useId } from 'react';

import diagram from '../RdfAppointmentDiagram/RdfAppointmentDiagram.module.css';
import graph from '../RdfTripleExplorer/RdfTripleExplorer.module.css';
import styles from './RdfToolsTogetherDiagram.module.css';

export default function RdfToolsTogetherDiagram() {
  const id = useId();
  const title = `${id}-title`;
  const description = `${id}-description`;
  const arrow = `${id}-arrow`;
  const marker = `url(#${arrow})`;
  const inferred = `${diagram.edge} ${styles.inferredEdge}`;

  return (
    <figure className={ diagram.root }>
      <p className={ diagram.scrollHint }>Scroll horizontally to explore the graph</p>
      <div className={ graph.scrollFrame } role='region' aria-label='Scrollable graph showing RDFS, OWL and SHACL' tabIndex='0'>
        <svg className={ diagram.graph } viewBox='0 0 960 404' role='img' aria-labelledby={ `${title} ${description}` }>
          <title id={ title }>RDFS, OWL and SHACL applied to one blog</title>
          <desc id={ description }>
            The recorded facts give the blog type aa:Blog, owner :ahmadassaf and the name "Ahmad Assaf's Blog".
            RDFS infers that the blog also has type schema:WebSite. OWL infers the inverse link from Ahmad to the blog through aa:ownsBlog.
            SHACL checks that the blog has exactly one name of datatype xsd:string. This name check passes.
          </desc>
          <defs>
            <marker id={ arrow } viewBox='0 0 12 12' refX='10' refY='6' markerWidth='7' markerHeight='7' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ graph.arrowHead } />
            </marker>
          </defs>

          <path d='M 317 132 H 654' className={ diagram.edge } markerEnd={ marker } />
          <text x='486' y='119' textAnchor='middle' className={ diagram.predicate }>aa:owner</text>

          <path d='M 738 93 C 660 55 577 62 486 62 S 316 55 246 89' className={ inferred } markerEnd={ marker } />
          <text x='486' y='25' textAnchor='middle' className={ styles.annotation }>OWL infers</text>
          <text x='486' y='46' textAnchor='middle' className={ diagram.predicate }>aa:ownsBlog</text>

          <path d='M 192 179 V 269' className={ inferred } markerEnd={ marker } />
          <text x='171' y='216' textAnchor='end' className={ styles.annotation }>RDFS infers</text>
          <text x='171' y='237' textAnchor='end' className={ diagram.predicate }>rdf:type</text>

          <path d='M 265 179 C 374 202 519 310 660 310' className={ diagram.edge } markerEnd={ marker } />
          <text x='483' y='231' textAnchor='middle' className={ diagram.predicate }>aa:hasName</text>

          <rect x='67' y='93' width='250' height='86' rx='43' className={ graph.subjectShape } />
          <text x='192' y='116' textAnchor='middle' className={ diagram.inverseKind }>BLOG</text>
          <text x='192' y='141' textAnchor='middle' className={ graph.nodeCodeInverse }>http://assaf.website/blog</text>
          <text x='192' y='164' textAnchor='middle' className={ graph.nodeCodeInverse }>rdf:type aa:Blog</text>

          <g className={ styles.objectNodes }>
            <rect x='658' y='93' width='236' height='86' rx='43' className={ graph.objectShape } />
            <text x='776' y='116' textAnchor='middle' className={ diagram.kind }>IRI</text>
            <text x='776' y='141' textAnchor='middle' className={ graph.nodeTitle }>Ahmad</text>
            <text x='776' y='164' textAnchor='middle' className={ graph.nodeCode }>:ahmadassaf</text>

            <rect x='67' y='273' width='250' height='74' rx='37' className={ graph.objectShape } />
            <text x='192' y='301' textAnchor='middle' className={ diagram.kind }>CLASS</text>
            <text x='192' y='328' textAnchor='middle' className={ graph.nodeCode }>schema:WebSite</text>

            <rect x='664' y='273' width='260' height='74' rx='37' className={ diagram.literal } />
            <text x='794' y='301' textAnchor='middle' className={ diagram.kind }>LITERAL · xsd:string</text>
            <text x='794' y='328' textAnchor='middle' className={ graph.nodeCode }>"Ahmad Assaf's Blog"</text>
          </g>
          <text x='794' y='372' textAnchor='middle' className={ styles.annotation }>SHACL checks one xsd:string name</text>
          <text x='794' y='393' textAnchor='middle' className={ styles.result }>Name check passes</text>
        </svg>
      </div>
    </figure>
  );
}
