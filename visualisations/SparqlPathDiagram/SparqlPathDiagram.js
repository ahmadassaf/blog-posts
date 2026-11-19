import { useId } from 'react';

import diagram from '../RdfAppointmentDiagram/RdfAppointmentDiagram.module.css';
import graph from '../RdfTripleExplorer/RdfTripleExplorer.module.css';
import styles from './SparqlPathDiagram.module.css';

export default function SparqlPathDiagram() {
  const id = useId();
  const title = `${id}-title`;
  const description = `${id}-description`;
  const arrow = `${id}-arrow`;

  return (
    <figure className={ diagram.root }>
      <p className={ diagram.scrollHint }>Scroll horizontally to explore the graph</p>
      <div className={ graph.scrollFrame } role='region' aria-label='Scrollable graph of links between posts on Ahmad’s blog' tabIndex='0'>
        <svg className={ diagram.graph } viewBox='0 0 960 238' role='img' aria-labelledby={ `${title} ${description}` }>
          <title id={ title }>Two hyperlinks between three posts on Ahmad’s blog</title>
          <desc id={ description }>
            The modeling post links directly to the RDF post, which links directly to the SPARQL post.
            A two-step property path reaches the SPARQL post. The data has no direct link from the modeling post to the SPARQL post.
          </desc>
          <defs>
            <marker id={ arrow } viewBox='0 0 12 12' refX='10' refY='6' markerWidth='7' markerHeight='7' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ graph.arrowHead } />
            </marker>
          </defs>

          <path d='M 254 94 H 367' className={ diagram.edge } markerEnd={ `url(#${arrow})` } />
          <text x='311' y='72' textAnchor='middle' className={ diagram.predicate }>aa:linksTo</text>
          <path d='M 589 94 H 702' className={ diagram.edge } markerEnd={ `url(#${arrow})` } />
          <text x='646' y='72' textAnchor='middle' className={ diagram.predicate }>aa:linksTo</text>

          <rect x='34' y='51' width='220' height='86' rx='43' className={ graph.subjectShape } />
          <text x='144' y='79' textAnchor='middle' className={ diagram.inverseKind }>MODELING POST</text>
          <text x='144' y='108' textAnchor='middle' className={ diagram.inverseCode }>:modelingPost</text>

          <g className={ styles.objectNodes }>
            <rect x='371' y='51' width='218' height='86' rx='43' className={ graph.objectShape } />
            <text x='480' y='79' textAnchor='middle' className={ diagram.kind }>RDF POST</text>
            <text x='480' y='108' textAnchor='middle' className={ graph.nodeCode }>:rdfPost</text>
            <rect x='706' y='51' width='220' height='86' rx='43' className={ graph.objectShape } />
            <text x='816' y='79' textAnchor='middle' className={ diagram.kind }>SPARQL POST</text>
            <text x='816' y='108' textAnchor='middle' className={ graph.nodeCode }>:sparqlPost</text>
          </g>

          <path d='M 144 159 V 180 H 816 V 159' className={ styles.bracket } />
          <text x='480' y='207' textAnchor='middle' className={ diagram.predicate }>aa:linksTo/aa:linksTo</text>
          <text x='480' y='230' textAnchor='middle' className={ styles.annotation }>Two steps through the recorded links</text>
        </svg>
      </div>
    </figure>
  );
}
