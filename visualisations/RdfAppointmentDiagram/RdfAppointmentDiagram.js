import { useId } from 'react';

import graphStyles from '../RdfTripleExplorer/RdfTripleExplorer.module.css';
import styles from './RdfAppointmentDiagram.module.css';

const RdfAppointmentDiagram = () => {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descriptionId = `${uid}-description`;
  const arrowId = `${uid}-arrow`;

  return (
    <figure className={ styles.root }>
      <p className={ styles.scrollHint }>Scroll horizontally to explore the graph</p>
      <div className={ graphStyles.scrollFrame } role='region' aria-label='Scrollable statement and appointment diagram' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1060 485' role='img' aria-labelledby={ `${titleId} ${descriptionId}` }>
          <title id={ titleId }>Who reported it, and when did the appointment start?</title>
          <desc id={ descriptionId }>
            The statement :triple12345 describes Ahmad administering the blog. Its dc:creator is the source identified by http://assaf.website/85740.
            The separate :appointment1 has aa:administrator Ahmad, aa:forBlog Ahmad's blog, and aa:startDate 1 September 2020, a hypothetical date.
          </desc>
          <defs>
            <marker id={ arrowId } viewBox='0 0 12 12' refX='10' refY='6' markerWidth='7' markerHeight='7' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ graphStyles.arrowHead } />
            </marker>
          </defs>

          <text x='55' y='35' className={ styles.heading }>Who reported it?</text>
          <text x='480' y='35' className={ styles.heading }>When did the appointment start?</text>

          <path d='M 190 266 V 359' className={ styles.edge } markerEnd={ `url(#${arrowId})` } />
          <rect x='115' y='295' width='150' height='38' rx='19' className={ graphStyles.predicatePlate } />
          <text x='190' y='319' textAnchor='middle' className={ styles.predicate }>dc:creator</text>

          <circle cx='190' cy='170' r='94' className={ graphStyles.subjectShape } />
          <text x='190' y='129' textAnchor='middle' className={ styles.inverseKind }>STATEMENT</text>
          <text x='190' y='160' textAnchor='middle' className={ styles.inverseCode }>:triple12345</text>
          <text x='190' y='191' textAnchor='middle' className={ graphStyles.nodeTitleInverse }>Ahmad administers</text>
          <text x='190' y='216' textAnchor='middle' className={ graphStyles.nodeTitleInverse }>the blog</text>

          <rect x='75' y='362' width='230' height='88' rx='44' className={ graphStyles.objectShape } />
          <text x='190' y='386' textAnchor='middle' className={ styles.kind }>IRI</text>
          <text x='190' y='410' textAnchor='middle' className={ graphStyles.nodeTitle }>Source</text>
          <text x='190' y='432' textAnchor='middle' className={ graphStyles.nodeCode }>…/85740</text>

          <path d='M 662 212 C 709 161, 735 135, 786 135' className={ styles.edge } markerEnd={ `url(#${arrowId})` } />
          <path d='M 684 270 H 786' className={ styles.edge } markerEnd={ `url(#${arrowId})` } />
          <path d='M 662 328 C 709 379, 735 408, 786 408' className={ styles.edge } markerEnd={ `url(#${arrowId})` } />
          <text x='715' y='115' textAnchor='middle' className={ styles.predicate }>aa:administrator</text>
          <text x='734' y='253' textAnchor='middle' className={ styles.predicate }>aa:forBlog</text>
          <text x='738' y='353' textAnchor='middle' className={ styles.predicate }>aa:startDate</text>

          <circle cx='595' cy='270' r='87' className={ graphStyles.subjectShape } />
          <text x='595' y='241' textAnchor='middle' className={ styles.inverseKind }>APPOINTMENT</text>
          <text x='595' y='272' textAnchor='middle' className={ styles.inverseCode }>:appointment1</text>
          <text x='595' y='299' textAnchor='middle' className={ styles.inverseDetail }>One term as administrator</text>

          <rect x='790' y='99' width='230' height='72' rx='36' className={ graphStyles.objectShape } />
          <text x='905' y='125' textAnchor='middle' className={ styles.kind }>IRI</text>
          <text x='905' y='150' textAnchor='middle' className={ graphStyles.nodeTitle }>Ahmad</text>

          <rect x='790' y='234' width='230' height='72' rx='36' className={ graphStyles.objectShape } />
          <text x='905' y='260' textAnchor='middle' className={ styles.kind }>IRI</text>
          <text x='905' y='285' textAnchor='middle' className={ graphStyles.nodeTitle }>Ahmad's blog</text>

          <rect x='790' y='362' width='230' height='92' rx='46' className={ styles.literal } />
          <text x='905' y='386' textAnchor='middle' className={ styles.kind }>LITERAL · xsd:date</text>
          <text x='905' y='411' textAnchor='middle' className={ graphStyles.nodeTitle }>1 September 2020</text>
          <text x='905' y='433' textAnchor='middle' className={ graphStyles.nodeCode }>Hypothetical date</text>
        </svg>
      </div>
    </figure>
  );
};

export default RdfAppointmentDiagram;
