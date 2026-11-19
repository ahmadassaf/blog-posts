import { useId } from 'react';

import appointmentStyles from '../RdfAppointmentDiagram/RdfAppointmentDiagram.module.css';
import graphStyles from '../RdfTripleExplorer/RdfTripleExplorer.module.css';
import styles from './BlogModelingDiagram.module.css';

const terms = [
  { 'end': '2022-03-01', 'id': ':appointment1', 'start': '2020-09-01', 'x': 148 },
  { 'end': '2025-01-01', 'id': ':appointment2', 'start': '2023-06-01', 'x': 812 }
];

const connections = [
  { 'path': 'M 200 147 Q 268 76 379 76', 'predicate': 'aa:administrator', 'x': 288, 'y': 64 },
  { 'path': 'M 760 147 Q 692 76 581 76', 'predicate': 'aa:administrator', 'x': 672, 'y': 64 },
  { 'path': 'M 200 265 Q 268 329 379 329', 'predicate': 'aa:forBlog', 'x': 294, 'y': 351 },
  { 'path': 'M 760 265 Q 692 329 581 329', 'predicate': 'aa:forBlog', 'x': 666, 'y': 351 }
];

export default function BlogModelingDiagram() {
  const uid = useId();
  const arrow = `${uid}-arrow`;
  const title = `${uid}-title`;
  const description = `${uid}-description`;

  return (
    <figure className={ appointmentStyles.root }>
      <p className={ appointmentStyles.scrollHint }>Scroll horizontally to explore the graph</p>
      <div className={ graphStyles.scrollFrame } role='region' aria-label='Scrollable graph of two appointments for the same administrator and blog' tabIndex='0'>
        <svg className={ appointmentStyles.graph } viewBox='0 0 960 390' role='img' aria-labelledby={ `${title} ${description}` }>
          <title id={ title }>Two appointments for the same administrator and blog</title>
          <desc id={ description }>
            Each appointment points to Ahmad through aa:administrator and to the same blog through aa:forBlog.
            In this fictional example, :appointment1 runs from 1 September 2020 until 1 March 2022,
            and :appointment2 from 1 June 2023 until 1 January 2025. The end date is excluded in each term.
          </desc>
          <defs>
            <marker id={ arrow } viewBox='0 0 12 12' refX='10' refY='6' markerWidth='7' markerHeight='7' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ graphStyles.arrowHead } />
            </marker>
          </defs>

          {connections.map(({ path, x, y, predicate }) => (
            <g key={ path }>
              <path d={ path } className={ appointmentStyles.edge } markerEnd={ `url(#${arrow})` } />
              <text x={ x } y={ y } textAnchor='middle' className={ appointmentStyles.predicate }>{predicate}</text>
            </g>
          ))}

          {terms.map(({ x, id, start, end }) => (
            <g key={ id } transform={ `translate(${x} 0)` }>
              <rect x='-123' y='146' width='246' height='119' rx='42' className={ graphStyles.subjectShape } />
              <text x='0' y='169' textAnchor='middle' className={ appointmentStyles.inverseKind }>APPOINTMENT</text>
              <text x='0' y='195' textAnchor='middle' className={ appointmentStyles.inverseCode }>{id}</text>
              <text x='-90' y='223' className={ styles.dateLabel }>Start</text>
              <text x='90' y='223' textAnchor='end' className={ graphStyles.nodeCodeInverse }>{start}</text>
              <text x='-90' y='246' className={ styles.dateLabel }>End (exclusive)</text>
              <text x='90' y='246' textAnchor='end' className={ graphStyles.nodeCodeInverse }>{end}</text>
            </g>
          ))}

          <rect x='382' y='38' width='196' height='76' rx='38' className={ graphStyles.objectShape } />
          <text x='480' y='65' textAnchor='middle' className={ appointmentStyles.kind }>PERSON</text>
          <text x='480' y='94' textAnchor='middle' className={ graphStyles.nodeTitle }>Ahmad</text>

          <rect x='382' y='291' width='196' height='76' rx='38' className={ graphStyles.objectShape } />
          <text x='480' y='318' textAnchor='middle' className={ appointmentStyles.kind }>BLOG</text>
          <text x='480' y='347' textAnchor='middle' className={ graphStyles.nodeTitle }>Ahmad’s blog</text>
        </svg>
      </div>
    </figure>
  );
}
