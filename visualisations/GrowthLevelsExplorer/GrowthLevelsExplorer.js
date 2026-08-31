'use client';

/**
 * THESIS: One ladder for ICs and leads, six levels, and the only thing being measured is impact.
 * OWN-WORLD: An engineering ladder drawn as a staircase climbing across three maturity bands: dependent, independent, interdependent.
 * STORY: Select a level to read what it means, what moves someone up, and what slipping looks like.
 * FIRST VIEWPORT: All six steps of the staircase with M3, where most careers live, selected.
 * FORM: A responsive SVG with selectable level steps driving a three-part readout.
 */

import { useState } from 'react';

import styles from './GrowthLevelsExplorer.module.css';

const levels = [
  {
    'description': 'Executes well-defined tasks that someone senior has already scoped, with a hands-on M3 mentor keeping them unblocked. Expected to graduate within 90 days.',
    'down': 'Staying here is only acceptable for under three months. Not graduating in the first 90 days is a significant problem.',
    'id': 'm1',
    'kind': 'Scoped Tasks',
    'name': 'M1',
    'outcomes': 'no',
    'role': 'interns · new hires',
    'up': 'They can unblock themselves technically, find their own way from A to B, and have lived a full project lifecycle from creation to support.'
  },
  {
    'description': 'Executes scoped projects while someone with more business context makes the final call on tradeoffs, prioritization, and the quality bar. Trusted on the support queue, and not responsible when the plan itself was flawed.',
    'down': 'Work lands late and blockers go uncommunicated. Most M2s should be on a one-to-two-year path toward M3.',
    'id': 'm2',
    'kind': 'Scoped Projects',
    'name': 'M2',
    'outcomes': 'no',
    'role': 'engineer',
    'up': 'They start owning projects end to end, including inter-team communication and technical decisions. Trial them on a small unscoped project and watch whether it lands on time, on budget, and delights the customer.'
  },
  {
    'description': 'The key phrase is trust: they deliver unscoped projects with light direction, pull in an M4/M5 and pivot when needed. Most engineers (more than half) remain M3 for their whole careers, and a team of all M3s is a force to be reckoned with. Can be an IC or a team lead.',
    'down': 'You lose faith in their ability to execute and start second-guessing their output. Every failed project comes with an excuse that it was not their responsibility.',
    'id': 'm3',
    'kind': 'Unscoped Projects',
    'name': 'M3',
    'outcomes': 'situational',
    'role': 'sr eng · team lead',
    'up': 'They push beyond their lane to shape the team itself: proposing architecture, owning technical debt, becoming the center of technical guidance (ICs), or engaging deeply in planning and career growth (leads).'
  },
  {
    'description': 'A team force multiplier: raises the impact of the whole team, with 3x as the mental model. A good code reviewer is an M3; an M4 runs reading groups on reviewing, installs quality analyzers, and writes the team review guides. IC M4s exist but are rare; it implies their code alone is worth 3x.',
    'down': 'When an M4 slips, the entire team drops in quality and delivery: bad judgment, weak follow-through, or practices that stopped scaling with the team.',
    'id': 'm4',
    'kind': 'Team Force Multiplier',
    'name': 'M4',
    'outcomes': 'yes',
    'role': 'lead · architect · EM',
    'up': 'They think beyond their own team at the macro level, helping other teams with feedback, structure, and direction. M4s who want M5 need no encouragement.'
  },
  {
    'description': 'A force multiplier for the force multipliers, operating almost entirely at the meta-engineering level: leads of leads, or the rarer technical M5 who mentors staff engineers and makes architectural calls that shape whole groups.',
    'down': 'Judge the whole product as a reflection of their leadership. They control hiring, team makeup, and objectives; if the combination yields a bad product, look to replace them.',
    'id': 'm5',
    'kind': 'Group Force Multiplier',
    'name': 'M5',
    'outcomes': 'yes',
    'role': 'principal · director',
    'up': 'The band here is wide and context-dependent; even the step from director to VP is a significant change in the skills required.'
  },
  {
    'description': 'Heavy systems thinkers whose job is aligning people toward worthy outcomes: the layer between the C-suite and the company, absorbing scale and day-to-day operations so leadership stays free for upside. The archetype greeting to the CEO: "I hope this is the last time we meet."',
    'down': 'Failing when the business outgrows them and the C-suite gets dragged back into operational minutiae.',
    'id': 'm6',
    'kind': 'Senior Leader',
    'name': 'M6',
    'outcomes': 'yes',
    'role': 'head of · VP',
    'up': 'The next layer up is the C-suite itself.'
  }
];

/* The staircase: each level sits one step higher than the last */
const STEP_XS = [ 100, 260, 420, 580, 740, 900 ];
const STEP_CYS = [ 388, 330, 272, 214, 156, 98 ];
const CARD_W = 140;
const CARD_H = 76;

const bands = [
  { 'from': 0, 'label': 'DEPENDENT', 'to': 1 },
  { 'from': 2, 'label': 'INDEPENDENT', 'to': 2 },
  { 'from': 3, 'label': 'INTERDEPENDENT', 'to': 5 }
];

const GrowthLevelsExplorer = ({
  title = 'The ladder, M1 to M6',
  description = 'Six levels on one scale for ICs and leads, measured by impact rather than tenure or headcount. Select a level to read what it means, what moves someone up, and what slipping looks like.',
  className = ''
}) => {
  const [ activeLevelId, setActiveLevelId ] = useState('m3');
  const activeLevel = levels.find((level) => level.id === activeLevelId) || levels[0];

  const selectLevel = (levelId) => {
    return {
      'aria-label': `Read about level ${levels.find((level) => level.id === levelId).name}`,
      'aria-pressed': activeLevelId === levelId,
      'data-active': activeLevelId === levelId,
      'onClick': () => setActiveLevelId(levelId),
      'onFocus': () => setActiveLevelId(levelId),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveLevelId(levelId);
        }
      },
      'role': 'button',
      'tabIndex': 0
    };
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the diagram</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable engineering ladder diagram' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 470' role='group' aria-label='The engineering ladder, M1 to M6'>
          {/* Maturity bands wrap their steps */}
          {bands.map((band) => {
            const x = STEP_XS[band.from] - CARD_W / 2 - 6;
            const width = STEP_XS[band.to] + CARD_W / 2 + 6 - x;
            const top = STEP_CYS[band.to] - CARD_H / 2 - 44;
            const bottom = STEP_CYS[band.from] + CARD_H / 2 + 34;

            return (
              <g key={ band.label } className={ styles.band }>
                <rect x={ x } y={ top } width={ width } height={ bottom - top } rx='20' />
                <text x={ x + width / 2 } y={ top + 26 } textAnchor='middle' className={ styles.bandLabel }>{band.label}</text>
              </g>
            );
          })}

          {/* The climb: stair connectors between steps */}
          {STEP_XS.slice(0, -1).map((x, index) => (
            <path
              key={ x }
              d={ `M ${x + CARD_W / 2} ${STEP_CYS[index] - 10} L ${STEP_XS[index + 1] - CARD_W / 2} ${STEP_CYS[index + 1] + 10}` }
              className={ styles.path }
            />
          ))}

          {/* The empty upper-left corner carries the reading key */}
          <text x='40' y='96' className={ styles.cornerLabel }>impact widens</text>
          <text x='40' y='118' className={ styles.cornerLabel }>as you climb</text>
          <text x='40' y='152' className={ styles.cornerHint }>ICs and leads</text>
          <text x='40' y='170' className={ styles.cornerHint }>share every rung</text>

          {/* Level steps */}
          {levels.map((level, index) => {
            const x = STEP_XS[index];
            const cy = STEP_CYS[index];

            return (
              <g className={ styles.stop } key={ level.id } { ...selectLevel(level.id) }>
                <rect x={ x - CARD_W / 2 } y={ cy - CARD_H / 2 } width={ CARD_W } height={ CARD_H } rx='16' />
                <text x={ x } y={ cy - 12 } textAnchor='middle' className={ styles.stopName }>{level.name}</text>
                <text x={ x } y={ cy + 7 } textAnchor='middle' className={ styles.stopKind }>{level.kind}</text>
                <text x={ x } y={ cy + 26 } textAnchor='middle' className={ styles.roleLabel }>{level.role}</text>
                <text x={ x } y={ cy + CARD_H / 2 + 20 } textAnchor='middle' className={ styles.outcomeLabel } data-outcome={ level.outcomes }>
                  {`outcomes: ${level.outcomes}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{`${activeLevel.name} · ${activeLevel.kind}`}</span>
          <span className={ styles.readoutText }>{activeLevel.description}</span>
        </div>
        <div className={ styles.readoutRow }>
          <span className={ styles.rowLabel }>moves up when</span>
          <span className={ styles.rowText }>{activeLevel.up}</span>
        </div>
        <div className={ styles.readoutRow }>
          <span className={ styles.rowLabel }>slipping looks like</span>
          <span className={ styles.rowText }>{activeLevel.down}</span>
        </div>
        <span className={ styles.readoutMeta }>dependent · independent · interdependent, and responsibility shifts from the technical specifics to the business outcome</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeLevel.name} {activeLevel.kind}, {activeLevel.role}. {activeLevel.description} Moves up when: {activeLevel.up} Slipping looks like: {activeLevel.down}
      </p>
    </figure>
  );
};

export default GrowthLevelsExplorer;
