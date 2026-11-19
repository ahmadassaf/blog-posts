import { useId } from 'react';

import diagram from '../RdfAppointmentDiagram/RdfAppointmentDiagram.module.css';
import graph from '../RdfTripleExplorer/RdfTripleExplorer.module.css';
import styles from './RdfProjectionDiagram.module.css';

export default function RdfProjectionDiagram() {
  const id = useId();
  const arrow = `url(#${id}-arrow)`;

  return (
    <figure className={ diagram.root }>
      <p className={ diagram.scrollHint }>Scroll horizontally to explore the exports</p>
      <div className={ graph.scrollFrame } role='region' aria-label='Two exports from the same directory snapshot' tabIndex='0'>
        <svg className={ diagram.graph } viewBox='0 0 960 250' role='img' aria-labelledby={ `${id}-title ${id}-desc` }>
          <title id={ `${id}-title` }>Two exports from the same snapshot</title>
          <desc id={ `${id}-desc` }>
            The full TriG export includes the default graph and both named report graphs.
            A SPARQL CONSTRUCT query reads the default graph and produces three triples about Ahmad's blog
            for the listing. The recipient uses the BlogListingV1 shape to check the result.
          </desc>
          <defs>
            <marker id={ `${id}-arrow` } viewBox='0 0 12 12' refX='10' refY='6' markerWidth='7' markerHeight='7' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ graph.arrowHead } />
            </marker>
          </defs>

          <path d='M 288 110 C 344 110 373 62 430 62 H 602' className={ diagram.edge } markerEnd={ arrow } />
          <path d='M 288 140 C 344 140 373 188 430 188 H 602' className={ diagram.edge } markerEnd={ arrow } />
          <text x='480' y='50' textAnchor='middle' className={ diagram.predicate }>TriG</text>
          <text x='480' y='176' textAnchor='middle' className={ diagram.predicate }>CONSTRUCT</text>

          <rect x='36' y='76' width='252' height='98' rx='35' className={ graph.subjectShape } />
          <g textAnchor='middle'>
            <text x='162' y='112' className={ graph.nodeTitleInverse }>Saved snapshot</text>
            <text x='162' y='140' className={ diagram.inverseDetail }>Directory + two source reports</text>
          </g>

          <g textAnchor='middle' className={ styles.outputs }>
            <rect x='607' y='13' width='316' height='99' rx='32' className={ graph.objectShape } />
            <text x='765' y='45' className={ graph.nodeTitle }>Full dataset</text>
            <text x='765' y='70' className={ styles.detail }>Default graph + two named graphs</text>
            <text x='765' y='90' className={ styles.detail }>Both reported dates retained</text>

            <rect x='607' y='138' width='316' height='99' rx='32' className={ graph.objectShape } />
            <text x='765' y='170' className={ graph.nodeTitle }>Blog listing</text>
            <text x='765' y='195' className={ styles.detail }>Type, title and owner · 3 triples</text>
            <text x='765' y='215' className={ graph.nodeCode }>aa:BlogListingV1</text>
          </g>
        </svg>
      </div>
    </figure>
  );
}
