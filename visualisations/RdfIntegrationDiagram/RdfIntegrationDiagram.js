import { useId } from 'react';

import diagram from '../RdfAppointmentDiagram/RdfAppointmentDiagram.module.css';
import graph from '../RdfTripleExplorer/RdfTripleExplorer.module.css';
import styles from './RdfIntegrationDiagram.module.css';

const reports = [
  { 'claim': ':claim1', 'date': '2020-09-01', 'source': '85740', 'y': 24 },
  { 'claim': ':claim2', 'date': '2020-09-04', 'source': '85741', 'y': 214 }
];

export default function RdfIntegrationDiagram() {
  const id = useId();
  const title = `${id}-title`;
  const description = `${id}-description`;
  const arrow = `${id}-arrow`;
  const marker = `url(#${arrow})`;

  return (
    <figure className={ diagram.root }>
      <p className={ diagram.scrollHint }>Scroll horizontally to explore the graph</p>
      <div className={ graph.scrollFrame } role='region' aria-label='Scrollable graph of source reports and a reviewed appointment' tabIndex='0'>
        <svg className={ diagram.graph } viewBox='0 0 960 386' role='img' aria-labelledby={ `${title} ${description}` }>
          <title id={ title }>Two source reports about Ahmad's first appointment</title>
          <desc id={ description }>
            Claim 1 from source 85740 reports 1 September 2020. Claim 2 from source 85741 reports 4 September 2020.
            Both refer to appointment 1 for Ahmad and his blog. A reviewer keeps 1 September 2020 as the accepted
            start date. The dashed arrow marks the review decision. The solid arrows are RDF relationships.
          </desc>
          <defs>
            <marker id={ arrow } viewBox='0 0 12 12' refX='10' refY='6' markerWidth='7' markerHeight='7' orient='auto'>
              <path d='M 1 1 L 11 6 L 1 11 Z' className={ graph.arrowHead } />
            </marker>
          </defs>

          <path d='M 247 91 C 308 91 332 142 405 157' className={ diagram.edge } markerEnd={ marker } />
          <path d='M 247 268 C 306 268 341 210 405 191' className={ diagram.edge } markerEnd={ marker } />
          <text x='322' y='178' textAnchor='middle' className={ diagram.predicate }>aa:aboutAppointment</text>

          <path d='M 609 150 C 666 125 678 71 752 71' className={ diagram.edge } markerEnd={ marker } />
          <text x='664' y='62' textAnchor='middle' className={ diagram.predicate }>aa:administrator</text>
          <path d='M 609 190 C 669 210 681 256 752 256' className={ diagram.edge } markerEnd={ marker } />
          <text x='686' y='196' textAnchor='middle' className={ diagram.predicate }>aa:forBlog</text>
          <path d='M 510 214 V 302' className={ diagram.edge } markerEnd={ marker } />
          <text x='524' y='267' className={ diagram.predicate }>aa:startDate</text>

          {reports.map(({ claim, source, date, y }) => (
            <g key={ claim } transform={ `translate(0 ${y})` }>
              <rect x='24' width='224' height='117' rx='33' className={ graph.subjectShape } />
              <text x='136' y='25' textAnchor='middle' className={ diagram.inverseCode }>{claim}</text>
              <text x='136' y='47' textAnchor='middle' className={ diagram.inverseDetail }>Source {source}</text>
              <g className={ styles.tinted }>
                <rect x='45' y='57' width='182' height='49' rx='20' className={ diagram.literal } />
                <text x='136' y='76' textAnchor='middle' className={ diagram.kind }>REPORTED START</text>
                <text x='136' y='96' textAnchor='middle' className={ graph.nodeCode }>{date}</text>
              </g>
            </g>
          ))}

          <rect x='407' y='134' width='206' height='80' rx='40' className={ graph.subjectShape } />
          <text x='510' y='161' textAnchor='middle' className={ diagram.inverseKind }>APPOINTMENT</text>
          <text x='510' y='188' textAnchor='middle' className={ diagram.inverseCode }>:appointment1</text>

          <g className={ styles.tinted }>
            <rect x='756' y='36' width='180' height='70' rx='35' className={ graph.objectShape } />
            <text x='846' y='63' textAnchor='middle' className={ diagram.kind }>PERSON</text>
            <text x='846' y='88' textAnchor='middle' className={ graph.nodeTitle }>Ahmad</text>
            <rect x='756' y='221' width='180' height='70' rx='35' className={ graph.objectShape } />
            <text x='846' y='248' textAnchor='middle' className={ diagram.kind }>BLOG</text>
            <text x='846' y='273' textAnchor='middle' className={ graph.nodeTitle }>Ahmad's blog</text>
            <rect x='408' y='307' width='204' height='67' rx='29' className={ diagram.literal } />
            <text x='510' y='333' textAnchor='middle' className={ diagram.kind }>ACCEPTED START</text>
            <text x='510' y='357' textAnchor='middle' className={ graph.nodeCode }>2020-09-01</text>
          </g>
          <text x='327' y='328' textAnchor='middle' className={ styles.reviewText }>Human review</text>
          <path d='M 263 343 H 403' className={ `${diagram.edge} ${styles.reviewArrow}` } markerEnd={ marker } />
        </svg>
      </div>
    </figure>
  );
}
