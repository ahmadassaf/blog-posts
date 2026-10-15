'use client';

import { useId, useState } from 'react';

import { burndownRows, charts, cumulativeBoundaries, mean, remainingWork, rollingMean } from './AgileChartsExplorer.data';

import styles from './AgileChartsExplorer.module.css';

const X0 = 90;
const X1 = 950;
const Y0 = 40;
const Y1 = 340;
const xAt = (index, last) => X0 + index * (X1 - X0) / last;
const yAt = (value, max) => Y1 - value * (Y1 - Y0) / max;
const line = (values, max) => values.map((value, index) => `${xAt(index, values.length - 1)},${yAt(value, max)}`).join(' ');
const format = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

const Axes = ({ max, first = '1', middle, last = '8' }) => (
  <g>
    {[ 0, max / 2, max ].map((value) => (
      <g key={ value }>
        <line x1={ X0 } x2={ X1 } y1={ yAt(value, max) } y2={ yAt(value, max) } className={ value === 0 ? styles.axis : styles.gridline } />
        <text x={ X0 - 12 } y={ yAt(value, max) + 4 } textAnchor='end' className={ styles.tickLabel }>{value}</text>
      </g>
    ))}
    <line x1={ X0 } x2={ X0 } y1={ Y0 } y2={ Y1 } className={ styles.axis } />
    <text x={ X0 } y='366' textAnchor='middle' className={ styles.tickLabel }>{first}</text>
    {middle && <text x='520' y='366' textAnchor='middle' className={ styles.tickLabel }>{middle}</text>}
    <text x={ X1 } y='366' textAnchor='end' className={ styles.tickLabel }>{last}</text>
  </g>
);

const Plot = ({ chart, scenario, releaseView }) => {
  if (chart === 'burndown') return (
    <g>
      <Axes max={ 50 } first='Day 0' middle='Day 5' last='Day 10' />
      <line x1={ X0 } y1={ Y0 } x2={ X1 } y2={ Y1 } className={ styles.referenceLine } />
      <polyline points={ line(scenario.values, 50) } className={ styles.actualLine } />
    </g>
  );

  if (chart === 'epic') return (
    <g>
      <Axes max={ 240 } first='Snapshot 1' last='Snapshot 8' />
      {releaseView === 'burnup' ? (
        <>
          <polyline points={ line(scenario.scope, 240) } className={ styles.scopeLine } />
          <polyline points={ line(scenario.completed, 240) } className={ styles.actualLine } />
        </>
      ) : <polyline points={ line(remainingWork(scenario.scope, scenario.completed), 240) } className={ styles.actualLine } />}
    </g>
  );

  if (chart === 'velocity') return (
    <g>
      <Axes max={ 40 } first='' last='' />
      {scenario.bars.map((bar, index) => {
        const x = xAt(index + 0.5, 8);

        return (
          <g key={ bar.sprint }>
            <rect x={ x - 35 } y={ yAt(bar.planned, 40) } width='32' rx='3' height={ Y1 - yAt(bar.planned, 40) } className={ styles.barPlanned } />
            <rect x={ x + 3 } y={ yAt(bar.completed, 40) } width='32' rx='3' height={ Y1 - yAt(bar.completed, 40) } className={ styles.barCompleted } />
            <text x={ x } y='366' textAnchor='middle' className={ styles.tickLabel }>{`S${bar.sprint}`}</text>
          </g>
        );
      })}
    </g>
  );

  if (chart === 'control') {
    const average = rollingMean(scenario.dots.map((dot) => dot.days));
    const points = scenario.dots.flatMap((dot, index) => (average[index] === null ? [] : [ `${xAt(dot.completedOn - 1, 23)},${yAt(average[index], 20)}` ])).join(' ');

    return (
      <g>
        <Axes max={ 20 } first='Day 1' middle='Day 12.5' last='Day 24' />
        {scenario.dots.map((dot) => <circle key={ dot.completedOn } cx={ xAt(dot.completedOn - 1, 23) } cy={ yAt(dot.days, 20) } r='5' className={ styles.dot } />)}
        <polyline points={ points } className={ styles.averageLine } />
      </g>
    );
  }

  const boundaries = cumulativeBoundaries(scenario.states);
  const band = (top, bottom) => `${line(top, 70)} ${bottom.map((value, index) => `${xAt(index, bottom.length - 1)},${yAt(value, 70)}`).reverse().join(' ')}`;

  return (
    <g>
      <Axes max={ 70 } first='Week 1' last='Week 8' />
      <polygon points={ band(boundaries.queued, boundaries.active) } className={ styles.bandQueued } />
      <polygon points={ band(boundaries.active, boundaries.done) } className={ styles.bandActive } />
      <polygon points={ band(boundaries.done, boundaries.done.map(() => 0)) } className={ styles.bandDone } />
      <polyline points={ line(boundaries.active, 70) } className={ styles.flowBoundary } />
      <polyline points={ line(boundaries.done, 70) } className={ styles.flowBoundary } />
    </g>
  );
};

const Values = ({ chart, scenario }) => {
  let headings;
  let rows;

  if (chart === 'burndown') {
    headings = [ 'Day', 'Remaining points', 'Completed points (cumulative)', 'Removed points (cumulative)' ];
    rows = burndownRows(scenario).map((row) => [ row.day, row.remaining, row.completed, row.removed ]);
  } else if (chart === 'epic') {
    headings = [ 'Snapshot', 'Scope (points)', 'Completed points (cumulative)', 'Remaining points' ];
    rows = scenario.scope.map((scope, index) => [ index + 1, scope, scenario.completed[index], scope - scenario.completed[index] ]);
  } else if (chart === 'velocity') {
    headings = [ 'Sprint', 'Initially planned points', 'Completed points' ];
    rows = scenario.bars.map((bar) => [ bar.sprint, bar.planned, bar.completed ]);
  } else if (chart === 'control') {
    const averages = rollingMean(scenario.dots.map((dot) => dot.days));

    headings = [ 'Completion day', 'Cycle time (days)', 'Mean of last 5 completions (days)' ];
    rows = scenario.dots.map((dot, index) => [ dot.completedOn, dot.days, averages[index] === null ? 'Not enough items' : format(averages[index]) ]);
  } else {
    headings = [ 'Week', 'Queued items', 'Active items', 'Done (cumulative)' ];
    rows = scenario.states.done.map((done, index) => [ index + 1, scenario.states.queued[index], scenario.states.active[index], done ]);
  }

  return (
    <div className={ styles.tableScroll } tabIndex='0' role='region' aria-label='Chart values table'>
      <table>
        <caption>{`Fictional values: ${scenario.label}`}</caption>
        <thead><tr>{headings.map((heading) => <th scope='col' key={ heading }>{heading}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={ row[0] }>{row.map((value, index) => (index === 0 ? <th scope='row' key={ index }>{value}</th> : <td key={ index }>{value}</td>))}</tr>)}</tbody>
      </table>
    </div>
  );
};

const legends = {
  'burndown': [[ 'actual', 'Remaining points' ], [ 'reference', 'Even-reduction reference' ]],
  'control': [[ 'actual', 'Completed item' ], [ 'average', 'Trailing mean of 5 items' ]],
  'flow': [[ 'done', 'Done: cumulative' ], [ 'active', 'Active: started, unfinished' ], [ 'queued', 'Queued: not started' ]],
  'velocity': [[ 'planned', 'Initially planned points' ], [ 'actual', 'Completed points' ]]
};

// Anchor the reading to the relevant point, gap, or band without changing its data.
const markerPositions = (chart, scenario, releaseView) => {
  if (chart === 'burndown') return {
    'reference': [ xAt(5, 10), yAt(25, 50) ],
    'scope': [ xAt(3, 10), yAt(scenario.values[3], 50) ],
    'zero': [ xAt(8, 10), Y1 - 24 ]
  };

  if (chart === 'epic') {
    const values = releaseView === 'burnup' ? scenario.completed : remainingWork(scenario.scope, scenario.completed);
    const scopeValue = (index) => (releaseView === 'burnup' ? scenario.scope[index] : values[index]);

    return {
      'forecast': [ xAt(6, 7), yAt(values[6], 240) ],
      'gap': [ X1, yAt(releaseView === 'burnup' ? (scenario.scope[7] + scenario.completed[7]) / 2 : values[7], 240) ],
      'scope': [ xAt(4, 7), yAt(scopeValue(4), 240) ],
      'trim': [ xAt(4, 7), yAt(scopeValue(4), 240) ],
      'zero': [ X1, Math.min(Y1 - 20, yAt(values[7], 240)) ]
    };
  }

  if (chart === 'velocity') {
    const barPoint = (index) => [ xAt(index + 0.5, 8), yAt(scenario.bars[index].completed, 40) ];

    return {
      'gap': [ xAt(5.5, 8), yAt((scenario.bars[5].planned + scenario.bars[5].completed) / 2, 40) ],
      'outcome': [ xAt(4, 8), 230 ],
      'pressure': barPoint(3),
      'range': barPoint(0),
      'rise': barPoint(6),
      'similar': barPoint(2)
    };
  }

  if (chart === 'control') {
    const long = scenario.dots.reduce((largest, dot) => (dot.days > largest.days ? dot : largest));
    const last = scenario.dots[scenario.dots.length - 1];
    const averages = rollingMean(scenario.dots.map((dot) => dot.days));

    return {
      'lag': [ xAt(12, 23), 270 ],
      'long': [ xAt(long.completedOn - 1, 23), yAt(long.days, 20) ],
      'mean': [ xAt(last.completedOn - 1, 23), yAt(averages[averages.length - 1], 20) ],
      'rise': [ xAt(last.completedOn - 1, 23), yAt(last.days, 20) ],
      'sample': [ xAt(10, 23), yAt(6, 20) ],
      'spread': [ xAt(12, 23), 85 ]
    };
  }

  const { active, done, queued } = scenario.states;
  const bandMidpoint = (index) => done[index] + active[index] / 2;
  const queueIndex = scenario.id === 'draining' ? 2 : 6;

  return {
    'band': [ xAt(3, 7), yAt(bandMidpoint(3), 70) ],
    'done': [ xAt(5, 7), yAt(done[5], 70) ],
    'end': [ X1, yAt(done[7], 70) ],
    'queue': [ xAt(queueIndex, 7), yAt(done[queueIndex] + active[queueIndex] + queued[queueIndex] / 2, 70) ],
    'wider': [ xAt(5, 7), yAt(bandMidpoint(5), 70) ]
  };
};

const AgileChartsExplorer = ({ chart, 'id': suppliedId, className = '' }) => {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const [ selectedScenarios, setSelectedScenarios ] = useState({});
  const [ selectedAnnotations, setSelectedAnnotations ] = useState({});
  const [ releaseView, setReleaseView ] = useState('burnup');
  const [ showAges, setShowAges ] = useState(false);
  const config = charts[chart];

  if (!config) return null;

  const scenario = config.scenarios.find((item) => item.id === selectedScenarios[chart]) || config.scenarios[0];
  const selectionKey = `${chart}:${scenario.id}`;
  const annotation = scenario.annotations.find((item) => item.id === selectedAnnotations[selectionKey]) || scenario.annotations[0];
  const annotationIndex = scenario.annotations.indexOf(annotation);
  const positions = markerPositions(chart, scenario, releaseView);
  let legend = legends[chart];

  if (chart === 'epic')
    legend = releaseView === 'burnup' ? [[ 'actual', 'Completed points' ], [ 'scope', 'Total scope (points)' ]] : [[ 'actual', 'Remaining points' ]];

  const selectAnnotation = (annotationId) => setSelectedAnnotations((current) => {
    return { ...current, [selectionKey]: annotationId };
  });

  return (
    <figure className={ `${styles.root} ${className}`.trim() } aria-labelledby={ `${id}-title` }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title } id={ `${id}-title` }>{config.title}</strong>
        <span className={ styles.description }>{config.description}</span>
      </figcaption>

      <div className={ styles.toolbar }>
        <div className={ styles.scenarios } role='group' aria-label={ `${config.title}: choose a history` }>
          {config.scenarios.map((item) => (
            <button
              type='button'
              key={ item.id }
              aria-label={ `${item.label}: ${item.meaning}` }
              aria-pressed={ scenario.id === item.id }
              title={ item.meaning }
              onClick={ () => setSelectedScenarios((current) => {
                return { ...current, [chart]: item.id };
              }) }
            >
              {item.label}
            </button>
          ))}
        </div>
        {chart === 'epic' && (
          <div className={ styles.viewSwitch } role='group' aria-label='Release chart view'>
            {[ 'burnup', 'burndown' ].map((view) => (
              <button
                type='button'
                key={ view }
                aria-label={ view === 'burnup' ? 'Burnup: scope and completed' : 'Burndown: remaining' }
                aria-pressed={ releaseView === view }
                onClick={ () => setReleaseView(view) }
              >
                {view === 'burnup' ? 'Burnup' : 'Burndown'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={ styles.plotHeader }>
        <ul className={ styles.legend } aria-label='Plot legend'>
          {legend.map(([ kind, label ]) => <li key={ kind }><span aria-hidden='true' data-kind={ kind } />{label}</li>)}
        </ul>
        <span className={ styles.sampleNote }>Fictional teaching data</span>
      </div>
      <p className={ styles.scrollHint }>Pan to explore. The reading and values below also describe the chart.</p>
      <div className={ styles.scrollFrame } tabIndex='0' role='region' aria-label={ `Plot: ${config.title}` }>
        <div className={ styles.plotFrame }>
          <svg className={ styles.graph } viewBox='0 0 1000 396' role='img' aria-label={ `${config.title}. ${scenario.summary}` } aria-describedby={ `${id}-units` }>
            <Plot chart={ chart } scenario={ scenario } releaseView={ releaseView } />
          </svg>
          <div className={ styles.markers } role='group' aria-label='Choose a numbered observation'>
            {scenario.annotations.map((item, index) => {
              const [ x, y ] = positions[item.id];

              return (
                <button
                  type='button'
                  className={ styles.marker }
                  style={{ 'left': `${x / 10}%`, 'top': `${y / 3.96}%` }}
                  key={ item.id }
                  aria-label={ `Marker ${index + 1}: ${item.label}` }
                  aria-pressed={ annotation.id === item.id }
                  aria-controls={ `${id}-reading` }
                  title={ item.label }
                  onClick={ () => selectAnnotation(item.id) }
                >
                  <span aria-hidden='true'>{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={ styles.readout } id={ `${id}-reading` } aria-live='polite' aria-atomic='true'>
        <div className={ styles.readoutPrimary }>
          <strong className={ styles.readoutType }><span>{annotationIndex + 1}</span>{annotation.label}</strong>
          <p className={ styles.readoutText }>{annotation.observation}</p>
        </div>
        <p className={ styles.readoutText }><strong>Possible explanations.</strong> {annotation.explanations}</p>
        <p className={ styles.readoutText }><strong>Next check.</strong> {annotation.check}</p>
      </div>

      <div className={ styles.context }>
        <p className={ styles.summary } aria-live='polite' aria-atomic='true'>{scenario.summary}</p>
        {chart === 'velocity' && (
          <p className={ styles.stat }>{`Mean of these 8 completed totals: ${format(mean(scenario.bars.map((bar) => bar.completed)))} points. Range: ${Math.min(...scenario.bars.map((bar) => bar.completed))}–${Math.max(...scenario.bars.map((bar) => bar.completed))}. This describes the sample, not the next sprint.`}</p>
        )}
        {chart === 'control' && (
          <div className={ styles.ageSection }>
            <button type='button' aria-expanded={ showAges } aria-controls={ `${id}-ages` } onClick={ () => setShowAges((current) => !current) }>
              {showAges ? 'Hide unfinished work' : 'Reveal unfinished work'}
            </button>
            {showAges && (
              <div id={ `${id}-ages` } className={ styles.ageReadout }>
                <strong>Still unfinished at the end of day 24</strong>
                <ul>{scenario.unfinished.map((item) => <li key={ item.id }>{`Item ${item.id}: ${item.age} elapsed days since starting`}</li>)}</ul>
                <p>These ages keep increasing until the items finish. They are not completed cycle times and are excluded from the plotted mean. Inspect waiting and blockers with the team.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <details className={ styles.values }>
        <summary>{chart === 'burndown' ? 'Inspect the values and work log' : 'Inspect the chart values'}</summary>
        {scenario.context && <p>{scenario.context}</p>}
        <Values chart={ chart } scenario={ scenario } />
        <p className={ styles.sampleNote }>These examples illustrate possible readings, not team benchmarks.</p>
      </details>
      <p className={ styles.units } id={ `${id}-units` }>{config.unit}</p>
    </figure>
  );
};

export default AgileChartsExplorer;
