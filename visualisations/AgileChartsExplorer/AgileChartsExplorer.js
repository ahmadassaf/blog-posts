'use client';

/**
 * THESIS: Every classic agile chart is useful, and every one of them can lie; reading them is a learnable skill.
 * OWN-WORLD: Five small dashboards, each annotated at the exact spots where the story hides.
 * STORY: Each figure plots one classic chart with numbered markers; selecting a marker reads that feature aloud.
 * FIRST VIEWPORT: The chart with its first marker active and the readout explaining what it means.
 * FORM: A responsive SVG per chart with selectable annotation markers driving a shared readout.
 */

import { useState } from 'react';

import styles from './AgileChartsExplorer.module.css';

const charts = {
  'burndown': {
    'annotations': [
      { 'blurb': 'A straight guide from the sprint commitment to zero. No real sprint follows it, and that is fine: the question is whether the actual line keeps converging on it or drifts away.', 'id': 'ideal', 'label': 'The ideal line', 'x': 520, 'y': 190 },
      { 'blurb': 'Fourteen points landed in one day. Steep drops mean work was not broken down small enough, so progress stayed invisible until one big item finally closed.', 'id': 'cliff', 'label': 'A cliff, not a slope', 'x': 348, 'y': 136 },
      { 'blurb': 'Remaining work rose mid-sprint: scope was added after the commitment. Inside a sprint this is the product owner changing the deal after it was struck.', 'id': 'bump', 'label': 'The line goes up', 'x': 520, 'y': 100 },
      { 'blurb': 'Eight points left on the last day. Once is bad luck; sprint after sprint means the team is over-committing, and the next forecast needs shrinking.', 'id': 'gap', 'label': 'Finishing above zero', 'x': 950, 'y': 292 }
    ],
    'description': 'Ten days of a sprint that nearly made it. Select a numbered marker to read the story behind each feature.',
    'meta': 'remaining work per day · the sprint forecast made visible',
    'title': 'How to read a sprint burndown'
  },
  'control': {
    'annotations': [
      { 'blurb': 'Most items ship in five to seven days regardless of type. That consistency, not the absolute number, is what makes delivery predictable.', 'id': 'band', 'label': 'The tight band', 'x': 230, 'y': 298 },
      { 'blurb': 'Seventeen days for one item. Ask about it in the retro, but do not redesign the process around a single outlier: chase trends, not dots.', 'id': 'spike', 'label': 'One spike is noise', 'x': 420, 'y': 52 },
      { 'blurb': 'The rolling average has climbed for weeks. A trend like this saps agility and deserves a retro, unless the definition of done just got wider, in which case it is honesty, not regression.', 'id': 'drift', 'label': 'The average is drifting', 'x': 795, 'y': 162 },
      { 'blurb': 'A five-point story and a one-pointer live on the same chart. When similar items scatter wildly, filter by estimate and read each band alone before blaming the process.', 'id': 'bands', 'label': 'Same size, different story', 'x': 320, 'y': 127 }
    ],
    'description': 'Every dot is one shipped item; the line is the rolling average. Select a numbered marker to read the signals.',
    'meta': 'cycle time per shipped item · consistency beats speed',
    'title': 'How to read a control chart'
  },
  'epic': {
    'annotations': [
      { 'blurb': 'Scope arrived as the team learned. At epic scale this is healthy: the chart exists to make the ebb and flow visible to everyone, not to forbid it.', 'id': 'rise1', 'label': 'The line went up', 'x': 336, 'y': 78 },
      { 'blurb': 'Another jump. Occasional growth is learning; chronic unexamined growth usually means the product owner does not yet understand the problem the epic solves.', 'id': 'rise2', 'label': 'Learning or churn?', 'x': 581, 'y': 93 },
      { 'blurb': 'The later sprints burn steadily. Update the forecast with every scope change along the way, or stakeholders stay anchored to a date that stopped being true.', 'id': 'burn', 'label': 'Converging at last', 'x': 827, 'y': 228 },
      { 'blurb': 'Thirty-five points remain. That distance is the honest state of the release: either the date moves, the scope does, or the conversation happens anyway, just later and angrier.', 'id': 'left', 'label': 'Still not zero', 'x': 950, 'y': 288 }
    ],
    'description': 'Remaining work rarely falls in a straight line: every rise is scope arriving. Select a numbered marker to read each event.',
    'meta': 'remaining work per sprint · rises are scope, falls are delivery',
    'title': 'How to read a release burndown'
  },
  'flow': {
    'annotations': [
      { 'blurb': 'Early on, every state grows in step: work enters, moves, and leaves at the same rate. Smooth, roughly parallel bands are what healthy flow looks like.', 'id': 'parallel', 'label': 'Parallel bands are health', 'x': 250, 'y': 295 },
      { 'blurb': 'In Progress swelled to twice its healthy width: the team is starting faster than it finishes. This is exactly the shape a WIP limit exists to prevent.', 'id': 'bulge', 'label': 'The bulge', 'x': 581, 'y': 260 },
      { 'blurb': 'While the bulge grew, the Done band nearly stopped rising. Bottlenecks upstream always show up here last, as a delivery line that quietly flatlines.', 'id': 'starve', 'label': 'Done goes flat', 'x': 650, 'y': 310 },
      { 'blurb': 'The top band widens forever because obsolete items never get closed. That is not demand, that is hoarding, and it buries the signal the board exists to show.', 'id': 'hoard', 'label': 'The backlog that never shrinks', 'x': 827, 'y': 143 }
    ],
    'description': 'Each band is a workflow state stacked over time. Select a numbered marker to read the health signals.',
    'meta': 'items per workflow state · band shape is the signal',
    'title': 'How to read a cumulative flow diagram'
  },
  'velocity': {
    'annotations': [
      { 'blurb': 'Committed against completed. The gap between them is the estimation error, and a gap that shrinks over the sprints is a team learning its own capacity.', 'id': 'pair', 'label': 'The two bars', 'x': 144, 'y': 96 },
      { 'blurb': 'Velocity rising over the first sprints is a team gelling, not a trend to extrapolate. Forecast from the recent average, never from the best sprint on the wall.', 'id': 'climb', 'label': 'A new team climbs', 'x': 359, 'y': 55 },
      { 'blurb': 'Sprint six missed badly. A single dip is a retrospective topic, not a crisis. A slide across several sprints is the signal that something structural changed.', 'id': 'dip', 'label': 'One bad sprint', 'x': 681, 'y': 118 },
      { 'blurb': 'A mature team holds a steady beat, and that stability is the entire forecasting value. And remember: this number only compares to itself, never to another team.', 'id': 'steady', 'label': 'Stable is the goal', 'x': 896, 'y': 55 }
    ],
    'description': 'Committed against completed for eight sprints. Select a numbered marker to read what the bars admit.',
    'meta': 'story points per sprint · only comparable to itself',
    'title': 'How to read a velocity chart'
  }
};

const velocityBars = [
  { 'committed': 115, 'completed': 175, 'label': 'S1', 'x': 144 },
  { 'committed': 100, 'completed': 115, 'label': 'S2', 'x': 251 },
  { 'committed': 78, 'completed': 85, 'label': 'S3', 'x': 359 },
  { 'committed': 85, 'completed': 93, 'label': 'S4', 'x': 466 },
  { 'committed': 70, 'completed': 78, 'label': 'S5', 'x': 574 },
  { 'committed': 78, 'completed': 145, 'label': 'S6', 'x': 681 },
  { 'committed': 70, 'completed': 78, 'label': 'S7', 'x': 789 },
  { 'committed': 78, 'completed': 85, 'label': 'S8', 'x': 896 }
];

const controlDots = [
  [ 110, 265 ],
  [ 145, 250 ],
  [ 180, 280 ],
  [ 215, 235 ],
  [ 250, 265 ],
  [ 285, 250 ],
  [ 320, 160 ],
  [ 355, 265 ],
  [ 390, 250 ],
  [ 420, 85 ],
  [ 455, 235 ],
  [ 490, 265 ],
  [ 525, 250 ],
  [ 560, 235 ],
  [ 595, 250 ],
  [ 630, 220 ],
  [ 665, 235 ],
  [ 700, 205 ],
  [ 735, 220 ],
  [ 770, 190 ],
  [ 805, 205 ],
  [ 840, 175 ],
  [ 875, 190 ],
  [ 910, 175 ]
];

const Axes = ({ xTicks = [], yTicks = [] }) => (
  <g>
    <line x1='90' y1='340' x2='950' y2='340' className={ styles.axis } />
    <line x1='90' y1='40' x2='90' y2='340' className={ styles.axis } />
    {yTicks.map((tick) => (
      <g key={ tick.label }>
        {tick.y !== 340 && <line x1='90' y1={ tick.y } x2='950' y2={ tick.y } className={ styles.gridline } />}
        <text x='78' y={ tick.y + 4 } textAnchor='end' className={ styles.tickLabel }>{tick.label}</text>
      </g>
    ))}
    {xTicks.map((tick) => (
      <text key={ tick.label } x={ tick.x } y='366' textAnchor='middle' className={ styles.tickLabel }>{tick.label}</text>
    ))}
  </g>
);

const chartBodies = {
  'burndown': (
    <g>
      <Axes
        xTicks={ [{ 'label': 'day 0', 'x': 90 }, { 'label': 'day 5', 'x': 520 }, { 'label': 'day 10', 'x': 950 }] }
        yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '25', 'y': 190 }, { 'label': '50', 'y': 40 }] }
      />
      <line x1='90' y1='40' x2='950' y2='340' className={ styles.idealLine } />
      <polyline
        points='90,40 176,40 262,52 348,136 434,136 520,100 606,124 692,172 778,184 864,232 950,292'
        className={ styles.actualLine }
      />
      <text x='750' y='292' textAnchor='middle' className={ styles.lineLabel }>ideal</text>
      <text x='640' y='112' textAnchor='middle' className={ styles.lineLabel }>actual</text>
    </g>
  ),
  'control': (
    <g>
      <Axes
        xTicks={ [{ 'label': 'time', 'x': 520 }] }
        yTicks={ [{ 'label': '0d', 'y': 340 }, { 'label': '10d', 'y': 190 }, { 'label': '20d', 'y': 40 }] }
      />
      <circle cx='98' cy='22' r='5' className={ styles.dot } />
      <text x='110' y='26' className={ styles.legendLabel }>one shipped item</text>
      <line x1='300' y1='22' x2='330' y2='22' className={ styles.avgLine } />
      <text x='338' y='26' className={ styles.legendLabel }>rolling average</text>
      {controlDots.map(([ x, y ]) => (
        <circle cx={ x } cy={ y } r='5' key={ `${x}-${y}` } className={ styles.dot } />
      ))}
      <polyline
        points='110,258 250,252 390,248 525,246 630,235 735,220 840,206 910,196'
        className={ styles.avgLine }
      />
    </g>
  ),
  'epic': (
    <g>
      <Axes
        xTicks={ [{ 'label': 'sprint 1', 'x': 90 }, { 'label': 'sprint 8', 'x': 950 }] }
        yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '100', 'y': 190 }, { 'label': '200', 'y': 40 }] }
      />
      <polyline
        points='90,40 213,85 336,78 459,122 581,93 704,160 827,228 950,288'
        className={ styles.actualLine }
      />
    </g>
  ),
  'flow': (
    <g>
      <Axes
        xTicks={ [{ 'label': 'time', 'x': 520 }] }
        yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '45', 'y': 190 }, { 'label': '90', 'y': 40 }] }
      />
      <polygon points='90,340 213,327 336,310 459,293 581,287 704,280 827,253 950,233 950,340 90,340' className={ styles.bandDone } />
      <polygon points='90,327 213,310 336,290 459,260 581,233 704,220 827,227 950,213 950,233 827,253 704,280 581,287 459,293 336,310 213,327 90,340' className={ styles.bandProgress } />
      <polygon points='90,307 213,290 336,267 459,237 581,210 704,197 827,203 950,193 950,213 827,227 704,220 581,233 459,260 336,290 213,310 90,327' className={ styles.bandTodo } />
      <polygon points='90,273 213,250 336,217 459,173 581,130 704,97 827,83 950,53 950,193 827,203 704,197 581,210 459,237 336,267 213,290 90,307' className={ styles.bandBacklog } />
      <rect x='90' y='14' width='14' height='14' rx='3' className={ styles.bandDone } />
      <text x='110' y='26' className={ styles.legendLabel }>Done</text>
      <rect x='210' y='14' width='14' height='14' rx='3' className={ styles.bandProgress } />
      <text x='230' y='26' className={ styles.legendLabel }>In Progress</text>
      <rect x='390' y='14' width='14' height='14' rx='3' className={ styles.bandTodo } />
      <text x='410' y='26' className={ styles.legendLabel }>To Do</text>
      <rect x='520' y='14' width='14' height='14' rx='3' className={ styles.bandBacklog } />
      <text x='540' y='26' className={ styles.legendLabel }>Backlog</text>
    </g>
  ),
  'velocity': (
    <g>
      <Axes
        yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '20', 'y': 190 }, { 'label': '40', 'y': 40 }] }
      />
      <rect x='90' y='16' width='14' height='14' rx='3' className={ styles.barCommitted } />
      <text x='110' y='27' className={ styles.legendLabel }>committed</text>
      <rect x='240' y='16' width='14' height='14' rx='3' className={ styles.barCompleted } />
      <text x='260' y='27' className={ styles.legendLabel }>completed</text>
      {velocityBars.map((bar) => (
        <g key={ bar.label }>
          <rect x={ bar.x - 35 } y={ bar.committed } width='32' height={ 340 - bar.committed } rx='3' className={ styles.barCommitted } />
          <rect x={ bar.x + 3 } y={ bar.completed } width='32' height={ 340 - bar.completed } rx='3' className={ styles.barCompleted } />
          <text x={ bar.x } y='366' textAnchor='middle' className={ styles.tickLabel }>{bar.label}</text>
        </g>
      ))}
    </g>
  )
};

const AgileChartsExplorer = ({ chart, className = '' }) => {
  const config = charts[chart];
  const [ activeId, setActiveId ] = useState(config ? config.annotations[0].id : null);

  if (!config) return null;

  const active = config.annotations.find((annotation) => annotation.id === activeId) || config.annotations[0];

  const selectMarker = (annotation, index) => {
    return {
      'aria-label': `Marker ${index + 1}: ${annotation.label}`,
      'aria-pressed': active.id === annotation.id,
      'data-active': active.id === annotation.id,
      'onClick': () => setActiveId(annotation.id),
      'onFocus': () => setActiveId(annotation.id),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveId(annotation.id);
        }
      },
      'role': 'button',
      'tabIndex': 0
    };
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{config.title}</strong>
        <span className={ styles.description }>{config.description}</span>
      </figcaption>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the chart</p>

      <div className={ styles.scrollFrame } role='region' aria-label={ `Scrollable chart: ${config.title}` } tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 396' role='group' aria-label={ config.title }>
          {chartBodies[chart]}
          {config.annotations.map((annotation, index) => (
            <g className={ styles.marker } key={ annotation.id } { ...selectMarker(annotation, index) }>
              <circle cx={ annotation.x } cy={ annotation.y } r='13' />
              <text x={ annotation.x } y={ annotation.y + 4 } textAnchor='middle'>{index + 1}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{active.label}</span>
          <span className={ styles.readoutText }>{active.blurb}</span>
        </div>
        <span className={ styles.readoutMeta }>{config.meta}</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {config.title}. {active.label}: {active.blurb}
      </p>
    </figure>
  );
};

export default AgileChartsExplorer;
