'use client';

/**
 * THESIS: Every classic agile chart is useful, and every one of them can lie; reading them is a learnable skill.
 * OWN-WORLD: Five small dashboards, each drawn in three moods, annotated at the exact spots where the story hides.
 * STORY: Each figure plots one classic chart under selectable scenarios; numbered markers read each feature aloud.
 * FIRST VIEWPORT: The healthy scenario with its first marker active and the readout explaining what it means.
 * FORM: A responsive SVG per chart with scenario tabs and selectable annotation markers driving a shared readout.
 */

import { useState } from 'react';

import styles from './AgileChartsExplorer.module.css';

/* Shared plot geometry: x 90..950, y 40..340 */
const round = (value) => Math.round(value * 10) / 10;

/* Sprint burndown: days 0..10, points 0..50 */
const bx = (day) => round(90 + day * 86);
const by = (points) => round(340 - points * 6);
const burndownLine = (values) => values.map((points, day) => `${bx(day)},${by(points)}`).join(' ');

/* Release burndown: sprints 0..7, points 0..200 */
const ex = (sprint) => round(90 + sprint * (860 / 7));
const ey = (points) => round(340 - points * 1.5);
const epicLine = (values) => values.map((points, sprint) => `${ex(sprint)},${ey(points)}`).join(' ');

/* Velocity: points 0..40 */
const VELOCITY_XS = [ 144, 251, 359, 466, 574, 681, 789, 896 ];
const vy = (points) => round(340 - points * 7.5);

/* Control chart: cycle time 0..20 days */
const cy = (days) => round(340 - days * 15);

/* Cumulative flow: item counts 0..90 stacked over 8 samples */
const FLOW_XS = [ 90, 213, 336, 459, 581, 704, 827, 950 ];
const flowY = (count) => round(340 - count * (300 / 90));
const bandPolygon = (topYs, bottomYs) => {
  const forward = FLOW_XS.map((x, index) => `${x},${topYs[index]}`).join(' ');
  const backward = FLOW_XS.map((x, index) => `${x},${bottomYs[index]}`).reverse().join(' ');

  return `${forward} ${backward}`;
};
const flowBands = (states) => {
  const order = [ 'done', 'progress', 'todo', 'backlog' ];
  const bands = {};
  let running = FLOW_XS.map(() => 0);
  let bottomYs = FLOW_XS.map(() => 340);

  for (const state of order) {
    running = running.map((count, index) => count + states[state][index]);
    const topYs = running.map((count) => flowY(count));

    bands[state] = bandPolygon(topYs, bottomYs);
    bottomYs = topYs;
  }

  return bands;
};

const charts = {
  'burndown': {
    'description': 'The same ten-day sprint in three moods. Switch scenarios, then select a numbered marker to read each signal.',
    'meta': 'remaining work per day · the sprint forecast made visible',
    'scenarios': [
      {
        'annotations': [
          { 'blurb': 'A straight guide from the sprint commitment to zero. No real sprint follows it, and that is fine: the question is whether the actual line keeps converging on it or drifts away.', 'id': 'ideal', 'label': 'The ideal line', 'x': 520, 'y': 190 },
          { 'blurb': 'Something lands almost every day because the work was sliced small. Smooth slopes are a planning artifact, not a heroics artifact.', 'id': 'slope', 'label': 'Small, steady drops', 'x': bx(3), 'y': by(37) },
          { 'blurb': 'The commitment matched capacity. A team that does this sprint after sprint is the best internal advertisement for agile there is.', 'id': 'zero', 'label': 'Zero, on the day', 'x': 918, 'y': 300 }
        ],
        'id': 'healthy',
        'label': 'Healthy',
        'meaning': 'on forecast',
        'values': [ 50, 47, 43, 37, 33, 27, 22, 17, 12, 6, 0 ]
      },
      {
        'annotations': [
          { 'blurb': 'Two days in and the sprint is already beating the ideal line. It feels great, and it usually means the plan was padded rather than sharp.', 'id': 'below', 'label': 'Below the line, early', 'x': bx(2), 'y': by(36) },
          { 'blurb': 'Finishing early once is a gift. Finishing early every sprint is under-committing, and the slack quietly becomes invisible work nobody planned.', 'id': 'early', 'label': 'Done with days to spare', 'x': bx(8), 'y': 316 },
          { 'blurb': 'The honest fix is pulling the next backlog item in now and committing to more next planning, so the sprint data keeps meaning something.', 'id': 'pull', 'label': 'Pull, do not pad', 'x': bx(5), 'y': by(15) }
        ],
        'id': 'ahead',
        'label': 'Ahead',
        'meaning': 'under-committed',
        'values': [ 50, 44, 36, 29, 22, 15, 8, 2, 0, 0, 0 ]
      },
      {
        'annotations': [
          { 'blurb': 'Nothing closed while the sprint spun up. Late starts do not show up as risk here; they show up as a cliff later in the week.', 'id': 'silent', 'label': 'Two silent days', 'x': bx(1), 'y': 64 },
          { 'blurb': 'Fourteen points landed in one day. Steep drops mean work was not broken down small enough, so progress stayed invisible until one big item finally closed.', 'id': 'cliff', 'label': 'A cliff, not a slope', 'x': bx(3), 'y': by(34) },
          { 'blurb': 'Remaining work rose mid-sprint: scope was added after the commitment. Inside a sprint this is the product owner changing the deal after it was struck.', 'id': 'bump', 'label': 'The line goes up', 'x': bx(5), 'y': by(40) },
          { 'blurb': 'Eight points left on the last day. Once is bad luck; sprint after sprint means the team is over-committing, and the next forecast needs shrinking.', 'id': 'gap', 'label': 'Finishing above zero', 'x': bx(10), 'y': by(8) }
        ],
        'id': 'struggling',
        'label': 'Struggling',
        'meaning': 'scope and cliffs',
        'values': [ 50, 50, 48, 34, 34, 40, 36, 28, 26, 18, 8 ]
      }
    ],
    'title': 'How to read a sprint burndown'
  },
  'control': {
    'description': 'Every dot is one shipped item; the line is the rolling average. Switch scenarios, then select a marker to read the signals.',
    'meta': 'cycle time per shipped item · consistency beats speed',
    'scenarios': [
      {
        'annotations': [
          { 'blurb': 'Whatever enters, it ships in five to seven days. This chart is a promise you can safely make to stakeholders.', 'id': 'band', 'label': 'A band you can bank on', 'x': 520, 'y': 290 },
          { 'blurb': 'The empty space up here is the feature. No item is silently rotting in review or waiting on a hero to come back from vacation.', 'id': 'ceiling', 'label': 'Nothing above ten days', 'x': 300, 'y': 150 },
          { 'blurb': 'The remaining job is maintenance: watch the rolling average, not individual dots, and treat any sustained rise as a retro topic.', 'id': 'keep', 'label': 'Keep it this way', 'x': 820, 'y': 150 }
        ],
        'avg': [[ 110, 5.5 ], [ 400, 5.9 ], [ 700, 6.1 ], [ 910, 6 ]],
        'dots': [
          [ 110, 6 ],
          [ 145, 5 ],
          [ 180, 7 ],
          [ 215, 6 ],
          [ 250, 5 ],
          [ 285, 6 ],
          [ 320, 7 ],
          [ 355, 5 ],
          [ 390, 6 ],
          [ 425, 7 ],
          [ 460, 5 ],
          [ 495, 6 ],
          [ 530, 7 ],
          [ 565, 6 ],
          [ 600, 5 ],
          [ 635, 6 ],
          [ 670, 7 ],
          [ 705, 5 ],
          [ 740, 6 ],
          [ 775, 7 ],
          [ 810, 6 ],
          [ 845, 5 ],
          [ 880, 6 ],
          [ 910, 7 ]
        ],
        'id': 'predictable',
        'label': 'Predictable',
        'meaning': 'a tight band'
      },
      {
        'annotations': [
          { 'blurb': 'Most items ship in five to seven days regardless of type. That consistency, not the absolute number, is what makes delivery predictable.', 'id': 'band', 'label': 'The tight band', 'x': 230, 'y': 298 },
          { 'blurb': 'Seventeen days for one item. Ask about it in the retro, but do not redesign the process around a single outlier: chase trends, not dots.', 'id': 'spike', 'label': 'One spike is noise', 'x': 420, 'y': 52 },
          { 'blurb': 'The rolling average has climbed for weeks. A trend like this saps agility and deserves a retro, unless the definition of done just got wider, in which case it is honesty, not regression.', 'id': 'drift', 'label': 'The average is drifting', 'x': 795, 'y': 162 },
          { 'blurb': 'A five-point story and a one-pointer live on the same chart. When similar items scatter wildly, filter by estimate and read each band alone before blaming the process.', 'id': 'bands', 'label': 'Same size, different story', 'x': 320, 'y': 127 }
        ],
        'avg': [[ 110, 5.5 ], [ 250, 5.9 ], [ 390, 6.1 ], [ 525, 6.3 ], [ 630, 7 ], [ 735, 8 ], [ 840, 8.9 ], [ 910, 9.6 ]],
        'dots': [
          [ 110, 5 ],
          [ 145, 6 ],
          [ 180, 4 ],
          [ 215, 7 ],
          [ 250, 5 ],
          [ 285, 6 ],
          [ 320, 12 ],
          [ 355, 5 ],
          [ 390, 6 ],
          [ 420, 17 ],
          [ 455, 7 ],
          [ 490, 5 ],
          [ 525, 6 ],
          [ 560, 7 ],
          [ 595, 6 ],
          [ 630, 8 ],
          [ 665, 7 ],
          [ 700, 9 ],
          [ 735, 8 ],
          [ 770, 10 ],
          [ 805, 9 ],
          [ 840, 11 ],
          [ 875, 10 ],
          [ 910, 11 ]
        ],
        'id': 'drifting',
        'label': 'Drifting',
        'meaning': 'slowly rising'
      },
      {
        'annotations': [
          { 'blurb': 'When one day and three weeks are both normal, cycle time predicts nothing. Fix the flow first; quote dates later.', 'id': 'scatter', 'label': 'No band, no forecast', 'x': 495, 'y': 60 },
          { 'blurb': 'A rolling average over chaos is numerology. Nobody actually ships in the average time here, so stop quoting it.', 'id': 'fiction', 'label': 'The average is a fiction', 'x': 630, 'y': 300 },
          { 'blurb': 'Scatter like this usually means too much parallel work and invisible waiting. Cap work in progress, then reread this chart in a month.', 'id': 'wip', 'label': 'Start with WIP', 'x': 815, 'y': 100 }
        ],
        'avg': [[ 110, 7 ], [ 250, 8 ], [ 390, 7 ], [ 525, 9 ], [ 630, 7 ], [ 735, 8 ], [ 840, 7 ], [ 910, 8 ]],
        'dots': [
          [ 110, 2 ],
          [ 145, 14 ],
          [ 180, 5 ],
          [ 215, 18 ],
          [ 250, 8 ],
          [ 285, 1 ],
          [ 320, 16 ],
          [ 355, 6 ],
          [ 390, 12 ],
          [ 425, 3 ],
          [ 460, 19 ],
          [ 495, 7 ],
          [ 530, 10 ],
          [ 565, 2 ],
          [ 600, 17 ],
          [ 635, 5 ],
          [ 670, 13 ],
          [ 705, 8 ],
          [ 740, 1 ],
          [ 775, 15 ],
          [ 810, 6 ],
          [ 845, 11 ],
          [ 880, 18 ],
          [ 910, 4 ]
        ],
        'id': 'chaotic',
        'label': 'Chaotic',
        'meaning': 'no pattern'
      }
    ],
    'title': 'How to read a control chart'
  },
  'epic': {
    'description': 'The same epic under three scope stories. Switch scenarios, then select a numbered marker to read each event.',
    'meta': 'remaining work per sprint · rises are scope, falls are delivery',
    'scenarios': [
      {
        'annotations': [
          { 'blurb': 'Scope held still and the team burned it evenly. Enjoy it and say so in the review: this shape is rarer than any framework admits.', 'id': 'straight', 'label': 'A straight burn', 'x': ex(3), 'y': ey(128) },
          { 'blurb': 'Extend this line with a ruler and you can name the finish sprint out loud. Steady slopes are the whole reason burndowns earn wall space.', 'id': 'ruler', 'label': 'Forecast by ruler', 'x': ex(6), 'y': ey(52) },
          { 'blurb': 'An epic that never changes shape can also mean nobody is re-scoping as they learn. Steady is good; frozen means the feedback loop is off.', 'id': 'smooth', 'label': 'Suspiciously smooth?', 'x': ex(1), 'y': ey(178) }
        ],
        'id': 'steady',
        'label': 'Steady',
        'meaning': 'fixed scope',
        'values': [ 200, 178, 150, 128, 105, 78, 52, 25 ]
      },
      {
        'annotations': [
          { 'blurb': 'Scope arrived as the team learned. At epic scale this is healthy: the chart exists to make the ebb and flow visible to everyone, not to forbid it.', 'id': 'rise1', 'label': 'The line went up', 'x': ex(2), 'y': ey(175) },
          { 'blurb': 'Another jump. Occasional growth is learning; chronic unexamined growth usually means the product owner does not yet understand the problem the epic solves.', 'id': 'rise2', 'label': 'Learning or churn?', 'x': ex(4), 'y': ey(165) },
          { 'blurb': 'The later sprints burn steadily. Update the forecast with every scope change along the way, or stakeholders stay anchored to a date that stopped being true.', 'id': 'burn', 'label': 'Converging at last', 'x': ex(6), 'y': ey(75) },
          { 'blurb': 'Thirty-five points remain. That distance is the honest state of the release: either the date moves, the scope does, or the conversation happens anyway, just later and angrier.', 'id': 'left', 'label': 'Still not zero', 'x': ex(7), 'y': ey(35) }
        ],
        'id': 'learning',
        'label': 'Learning',
        'meaning': 'scope arrives',
        'values': [ 200, 170, 175, 145, 165, 120, 75, 35 ]
      },
      {
        'annotations': [
          { 'blurb': 'Each rise looked reasonable in isolation. Their sum is a treadmill: scope arrives faster than the team can burn it.', 'id': 'treadmill', 'label': 'Up more than down', 'x': ex(2), 'y': ey(185) },
          { 'blurb': 'Seven sprints in, more work remains than the epic started with. The chart is not lying; the plan is.', 'id': 'higher', 'label': 'Higher than day one', 'x': ex(6), 'y': ey(200) },
          { 'blurb': 'No date computed from this line means anything. The useful conversation here is about scope, not schedule.', 'id': 'cut', 'label': 'Stop forecasting, start cutting', 'x': 920, 'y': 90 }
        ],
        'id': 'runaway',
        'label': 'Runaway',
        'meaning': 'scope outruns the team',
        'values': [ 180, 170, 185, 175, 190, 185, 200, 195 ]
      }
    ],
    'title': 'How to read a release burndown'
  },
  'flow': {
    'description': 'Each band is a workflow state stacked over time. Switch scenarios, then select a marker to read the health signals.',
    'meta': 'items per workflow state · band shape is the signal',
    'scenarios': [
      {
        'annotations': [
          { 'blurb': 'In Progress holds the same width for months: the team finishes at the pace it starts. This is what a WIP limit looks like from above.', 'id': 'heartbeat', 'label': 'A steady heartbeat', 'x': 581, 'y': 253 },
          { 'blurb': 'The Done band climbing at a constant slope is throughput made visible. That slope is the only velocity that cannot be inflated.', 'id': 'slope', 'label': 'Delivery you can see', 'x': 750, 'y': 292 },
          { 'blurb': 'The backlog grows and shrinks as items get added and closed. A healthy backlog is a queue, not an archive.', 'id': 'breathe', 'label': 'A backlog that breathes', 'x': 336, 'y': 243 }
        ],
        'id': 'healthy',
        'label': 'Healthy',
        'meaning': 'parallel bands',
        'states': {
          'backlog': [ 12, 13, 12, 13, 12, 13, 12, 12 ],
          'done': [ 0, 5, 11, 17, 23, 29, 35, 41 ],
          'progress': [ 5, 5, 6, 5, 6, 5, 6, 5 ],
          'todo': [ 6, 6, 6, 7, 6, 7, 6, 6 ]
        }
      },
      {
        'annotations': [
          { 'blurb': 'Early on, every state grows in step: work enters, moves, and leaves at the same rate. Smooth, roughly parallel bands are what healthy flow looks like.', 'id': 'parallel', 'label': 'Parallel bands are health', 'x': 250, 'y': 295 },
          { 'blurb': 'In Progress swelled to twice its healthy width: the team is starting faster than it finishes. This is exactly the shape a WIP limit exists to prevent.', 'id': 'bulge', 'label': 'The bulge', 'x': 581, 'y': 260 },
          { 'blurb': 'While the bulge grew, the Done band nearly stopped rising. Bottlenecks upstream always show up here last, as a delivery line that quietly flatlines.', 'id': 'starve', 'label': 'Done goes flat', 'x': 650, 'y': 310 },
          { 'blurb': 'The top band widens forever because obsolete items never get closed. That is not demand, that is hoarding, and it buries the signal the board exists to show.', 'id': 'hoard', 'label': 'The backlog that never shrinks', 'x': 827, 'y': 143 }
        ],
        'id': 'bottleneck',
        'label': 'Bottlenecked',
        'meaning': 'the bulge',
        'states': {
          'backlog': [ 10, 12, 15, 19, 24, 30, 36, 42 ],
          'done': [ 0, 4, 9, 14, 16, 18, 26, 32 ],
          'progress': [ 4, 5, 6, 10, 16, 18, 8, 6 ],
          'todo': [ 6, 6, 7, 7, 7, 7, 7, 6 ]
        }
      },
      {
        'annotations': [
          { 'blurb': 'To Do and Backlog pinched to nothing: the board ahead of the team is empty. The bottleneck moved upstream, into discovery and product work.', 'id': 'dry', 'label': 'The well ran dry', 'x': 704, 'y': 205 },
          { 'blurb': 'With no queue ahead, In Progress thins toward zero. The team is about to sit idle or invent busywork, whichever is more visible.', 'id': 'thin', 'label': 'Nothing to pull', 'x': 827, 'y': 218 },
          { 'blurb': 'Done keeps climbing while the system dies upstream. Feed the backlog before celebrating the slope.', 'id': 'success', 'label': 'Starvation looks like success', 'x': 900, 'y': 278 }
        ],
        'id': 'starved',
        'label': 'Starved',
        'meaning': 'empty upstream',
        'states': {
          'backlog': [ 8, 6, 4, 2, 1, 0, 0, 0 ],
          'done': [ 0, 6, 13, 20, 26, 31, 35, 37 ],
          'progress': [ 6, 6, 5, 4, 3, 2, 1, 1 ],
          'todo': [ 5, 4, 3, 2, 1, 1, 0, 0 ]
        }
      }
    ],
    'title': 'How to read a cumulative flow diagram'
  },
  'velocity': {
    'description': 'Eight sprints of committed against completed, three teams apart. Switch scenarios, then select a marker to read what the bars admit.',
    'meta': 'story points per sprint · only comparable to itself',
    'scenarios': [
      {
        'annotations': [
          { 'blurb': 'Committed against completed. The gap between them is the estimation error, and a gap that shrinks over the sprints is a team learning its own capacity.', 'id': 'pair', 'label': 'The two bars', 'x': 144, 'y': 96 },
          { 'blurb': 'Velocity rising over the first sprints is a team gelling, not a trend to extrapolate. Forecast from the recent average, never from the best sprint on the wall.', 'id': 'climb', 'label': 'A new team climbs', 'x': 359, 'y': 55 },
          { 'blurb': 'Sprint six missed badly. A single dip is a retrospective topic, not a crisis. A slide across several sprints is the signal that something structural changed.', 'id': 'dip', 'label': 'One bad sprint', 'x': 681, 'y': 118 },
          { 'blurb': 'A mature team holds a steady beat, and that stability is the entire forecasting value. And remember: this number only compares to itself, never to another team.', 'id': 'steady', 'label': 'Stable is the goal', 'x': 896, 'y': 55 }
        ],
        'bars': [
          { 'committed': 30, 'completed': 22, 'label': 'S1' },
          { 'committed': 32, 'completed': 30, 'label': 'S2' },
          { 'committed': 35, 'completed': 34, 'label': 'S3' },
          { 'committed': 34, 'completed': 33, 'label': 'S4' },
          { 'committed': 36, 'completed': 35, 'label': 'S5' },
          { 'committed': 35, 'completed': 26, 'label': 'S6' },
          { 'committed': 36, 'completed': 35, 'label': 'S7' },
          { 'committed': 35, 'completed': 34, 'label': 'S8' }
        ],
        'id': 'finding',
        'label': 'New team',
        'meaning': 'finding its pace'
      },
      {
        'annotations': [
          { 'blurb': 'The bars barely move, and that is the achievement. Predictability is the thing velocity exists to buy; excitement here is a cost.', 'id': 'boring', 'label': 'Boring, on purpose', 'x': 251, 'y': 60 },
          { 'blurb': 'The two bars agree almost every sprint. Planning here is a statement of fact about capacity, not a negotiation tactic.', 'id': 'match', 'label': 'Commitment equals delivery', 'x': 520, 'y': 200 },
          { 'blurb': 'Forecast next quarter from this number with a straight face. It still compares only to itself, never to the team next door.', 'id': 'average', 'label': 'Trust the average', 'x': 896, 'y': 55 }
        ],
        'bars': [
          { 'committed': 34, 'completed': 33, 'label': 'S1' },
          { 'committed': 35, 'completed': 35, 'label': 'S2' },
          { 'committed': 34, 'completed': 34, 'label': 'S3' },
          { 'committed': 35, 'completed': 34, 'label': 'S4' },
          { 'committed': 34, 'completed': 33, 'label': 'S5' },
          { 'committed': 35, 'completed': 35, 'label': 'S6' },
          { 'committed': 34, 'completed': 34, 'label': 'S7' },
          { 'committed': 35, 'completed': 34, 'label': 'S8' }
        ],
        'id': 'mature',
        'label': 'Mature team',
        'meaning': 'steady beat'
      },
      {
        'annotations': [
          { 'blurb': 'The moment velocity became a target, it stopped being a measurement. The points inflated one padded estimate at a time.', 'id': 'target', 'label': 'Up and to the right, always', 'x': 251, 'y': 95 },
          { 'blurb': 'Check cycle time and release counts next to this chart. If they are flat while the points climb, the estimates grew, not the throughput.', 'id': 'ship', 'label': 'Did anything ship faster?', 'x': 520, 'y': 200 },
          { 'blurb': 'Every sprint now lands on a suspiciously tidy number. Numbers this smooth are managed, not measured.', 'id': 'ceiling', 'label': 'Hitting the ceiling', 'x': 841, 'y': 72 }
        ],
        'bars': [
          { 'committed': 26, 'completed': 24, 'label': 'S1' },
          { 'committed': 29, 'completed': 28, 'label': 'S2' },
          { 'committed': 32, 'completed': 31, 'label': 'S3' },
          { 'committed': 35, 'completed': 34, 'label': 'S4' },
          { 'committed': 37, 'completed': 36, 'label': 'S5' },
          { 'committed': 38, 'completed': 38, 'label': 'S6' },
          { 'committed': 40, 'completed': 39, 'label': 'S7' },
          { 'committed': 40, 'completed': 40, 'label': 'S8' }
        ],
        'id': 'inflated',
        'label': 'Weaponized',
        'meaning': 'points as targets'
      }
    ],
    'title': 'How to read a velocity chart'
  }
};

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

const chartRenderers = {
  'burndown': (scenario) => (
    <g>
      <Axes
        xTicks={ [{ 'label': 'day 0', 'x': 90 }, { 'label': 'day 5', 'x': 520 }, { 'label': 'day 10', 'x': 950 }] }
        yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '25', 'y': 190 }, { 'label': '50', 'y': 40 }] }
      />
      <line x1='90' y1='40' x2='950' y2='340' className={ styles.idealLine } />
      <text x='750' y='296' textAnchor='middle' className={ styles.lineLabel }>ideal</text>
      <polyline points={ burndownLine(scenario.values) } className={ styles.actualLine } />
    </g>
  ),
  'control': (scenario) => (
    <g>
      <Axes
        xTicks={ [{ 'label': 'time', 'x': 520 }] }
        yTicks={ [{ 'label': '0d', 'y': 340 }, { 'label': '10d', 'y': 190 }, { 'label': '20d', 'y': 40 }] }
      />
      <circle cx='98' cy='22' r='5' className={ styles.dot } />
      <text x='110' y='26' className={ styles.legendLabel }>one shipped item</text>
      <line x1='300' y1='22' x2='330' y2='22' className={ styles.avgLine } />
      <text x='338' y='26' className={ styles.legendLabel }>rolling average</text>
      {scenario.dots.map(([ x, days ]) => (
        <circle cx={ x } cy={ cy(days) } r='5' key={ `${x}-${days}` } className={ styles.dot } />
      ))}
      <polyline
        points={ scenario.avg.map(([ x, days ]) => `${x},${cy(days)}`).join(' ') }
        className={ styles.avgLine }
      />
    </g>
  ),
  'epic': (scenario) => (
    <g>
      <Axes
        xTicks={ [{ 'label': 'sprint 1', 'x': 90 }, { 'label': 'sprint 8', 'x': 950 }] }
        yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '100', 'y': 190 }, { 'label': '200', 'y': 40 }] }
      />
      <polyline points={ epicLine(scenario.values) } className={ styles.actualLine } />
    </g>
  ),
  'flow': (scenario) => {
    const bands = flowBands(scenario.states);

    return (
      <g>
        <Axes
          xTicks={ [{ 'label': 'time', 'x': 520 }] }
          yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '45', 'y': 190 }, { 'label': '90', 'y': 40 }] }
        />
        <polygon points={ bands.done } className={ styles.bandDone } />
        <polygon points={ bands.progress } className={ styles.bandProgress } />
        <polygon points={ bands.todo } className={ styles.bandTodo } />
        <polygon points={ bands.backlog } className={ styles.bandBacklog } />
        <rect x='90' y='14' width='14' height='14' rx='3' className={ styles.bandDone } />
        <text x='110' y='26' className={ styles.legendLabel }>Done</text>
        <rect x='210' y='14' width='14' height='14' rx='3' className={ styles.bandProgress } />
        <text x='230' y='26' className={ styles.legendLabel }>In Progress</text>
        <rect x='390' y='14' width='14' height='14' rx='3' className={ styles.bandTodo } />
        <text x='410' y='26' className={ styles.legendLabel }>To Do</text>
        <rect x='520' y='14' width='14' height='14' rx='3' className={ styles.bandBacklog } />
        <text x='540' y='26' className={ styles.legendLabel }>Backlog</text>
      </g>
    );
  },
  'velocity': (scenario) => (
    <g>
      <Axes yTicks={ [{ 'label': '0', 'y': 340 }, { 'label': '20', 'y': 190 }, { 'label': '40', 'y': 40 }] } />
      <rect x='90' y='16' width='14' height='14' rx='3' className={ styles.barCommitted } />
      <text x='110' y='27' className={ styles.legendLabel }>committed</text>
      <rect x='240' y='16' width='14' height='14' rx='3' className={ styles.barCompleted } />
      <text x='260' y='27' className={ styles.legendLabel }>completed</text>
      {scenario.bars.map((bar, index) => {
        const x = VELOCITY_XS[index];

        return (
          <g key={ bar.label }>
            <rect x={ x - 35 } y={ vy(bar.committed) } width='32' height={ 340 - vy(bar.committed) } rx='3' className={ styles.barCommitted } />
            <rect x={ x + 3 } y={ vy(bar.completed) } width='32' height={ 340 - vy(bar.completed) } rx='3' className={ styles.barCompleted } />
            <text x={ x } y='366' textAnchor='middle' className={ styles.tickLabel }>{bar.label}</text>
          </g>
        );
      })}
    </g>
  )
};

const AgileChartsExplorer = ({ chart, className = '' }) => {
  const config = charts[chart];
  const [ activeScenarioId, setActiveScenarioId ] = useState(config ? config.scenarios[0].id : null);
  const [ activeAnnotationIds, setActiveAnnotationIds ] = useState({});

  if (!config) return null;

  const activeScenario = config.scenarios.find((scenario) => scenario.id === activeScenarioId) || config.scenarios[0];
  const activeAnnotation = activeScenario.annotations.find(
    (annotation) => annotation.id === activeAnnotationIds[activeScenario.id]
  ) || activeScenario.annotations[0];

  const selectMarker = (annotation, index) => {
    const select = () => {
      setActiveAnnotationIds((current) => {
        return { ...current, [activeScenario.id]: annotation.id };
      });
    };

    return {
      'aria-label': `Marker ${index + 1}: ${annotation.label}`,
      'aria-pressed': activeAnnotation.id === annotation.id,
      'data-active': activeAnnotation.id === annotation.id,
      'onClick': select,
      'onFocus': select,
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select();
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

      <div className={ styles.toolbar }>
        <div className={ styles.typeTabs } aria-label='Chart scenario' role='group'>
          {config.scenarios.map((scenario) => (
            <button
              type='button'
              aria-label={ `${scenario.label}: ${scenario.meaning}` }
              aria-pressed={ activeScenario.id === scenario.id }
              data-active={ activeScenario.id === scenario.id }
              key={ scenario.id }
              onClick={ () => setActiveScenarioId(scenario.id) }
            >
              <strong>{scenario.label}</strong>
              <span>{scenario.meaning}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the chart</p>

      <div className={ styles.scrollFrame } role='region' aria-label={ `Scrollable chart: ${config.title}` } tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 396' role='group' aria-label={ `${config.title}: ${activeScenario.label}` }>
          {chartRenderers[chart](activeScenario)}
          {activeScenario.annotations.map((annotation, index) => (
            <g className={ styles.marker } key={ annotation.id } { ...selectMarker(annotation, index) }>
              <circle cx={ annotation.x } cy={ annotation.y } r='13' />
              <text x={ annotation.x } y={ annotation.y + 4 } textAnchor='middle'>{index + 1}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeAnnotation.label}</span>
          <span className={ styles.readoutText }>{activeAnnotation.blurb}</span>
        </div>
        <span className={ styles.readoutMeta }>{config.meta}</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {config.title}, {activeScenario.label} scenario. {activeAnnotation.label}: {activeAnnotation.blurb}
      </p>
    </figure>
  );
};

export default AgileChartsExplorer;
