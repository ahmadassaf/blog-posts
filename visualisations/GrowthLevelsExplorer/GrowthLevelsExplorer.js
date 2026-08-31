'use client';

/**
 * THESIS: One ladder for ICs and leads, six levels, and the only thing being measured is impact.
 * OWN-WORLD: The Mav9 engineering ladder as a journey across three maturity bands: dependent, independent, interdependent.
 * STORY: Select a level to read what it means, what moves someone up, and what slipping looks like.
 * FIRST VIEWPORT: All six levels under their maturity bands with M3, where most careers live, selected.
 * FORM: A responsive SVG with selectable level stops driving a three-part readout.
 */

import { useState } from 'react';

import styles from './GrowthLevelsExplorer.module.css';

const levels = [
  {
    'description': 'Executes well-defined tasks that someone senior has already scoped, with a hands-on M3 mentor keeping them unblocked. Expected to graduate within 90 days.',
    'down': 'Staying here is only acceptable for under three months. Not graduating in the first 90 days is a significant problem.',
    'id': 'm1',
    'name': 'M1 · Scoped Tasks',
    'outcomes': 'no',
    'role': 'interns, new hires',
    'up': 'They can unblock themselves technically, find their own way from A to B, and have lived a full project lifecycle from creation to support.'
  },
  {
    'description': 'Executes scoped projects while someone with more business context makes the final call on tradeoffs, prioritization, and the quality bar. Trusted on the support queue, and not responsible when the plan itself was flawed.',
    'down': 'Work lands late and blockers go uncommunicated. Most M2s should be on a one-to-two-year path toward M3.',
    'id': 'm2',
    'name': 'M2 · Scoped Projects',
    'outcomes': 'no',
    'role': 'engineer',
    'up': 'They start owning projects end to end, including inter-team communication and technical decisions. Trial them on a small unscoped project and watch whether it lands on time, on budget, and delights the customer.'
  },
  {
    'description': 'The key phrase is trust: they deliver unscoped projects with light direction, pull in an M4/M5 and pivot when needed. Most engineers (more than half) remain M3 for their whole careers, and a team of all M3s is a force to be reckoned with. Can be an IC or a team lead.',
    'down': 'You lose faith in their ability to execute and start second-guessing their output. Every failed project comes with an excuse that it was not their responsibility.',
    'id': 'm3',
    'name': 'M3 · Unscoped Projects',
    'outcomes': 'situational',
    'role': 'senior engineer, team lead',
    'up': 'They push beyond their lane to shape the team itself: proposing architecture, owning technical debt, becoming the center of technical guidance (ICs), or engaging deeply in planning and career growth (leads).'
  },
  {
    'description': 'A team force multiplier: raises the impact of the whole team, with 3x as the mental model. A good code reviewer is an M3; an M4 runs reading groups on reviewing, installs quality analyzers, and writes the team review guides. IC M4s exist but are rare; it implies their code alone is worth 3x.',
    'down': 'When an M4 slips, the entire team drops in quality and delivery: bad judgment, weak follow-through, or practices that stopped scaling with the team.',
    'id': 'm4',
    'name': 'M4 · Team Force Multiplier',
    'outcomes': 'yes',
    'role': 'lead engineer, architect, EM',
    'up': 'They think beyond their own team at the macro level, helping other teams with feedback, structure, and direction. M4s who want M5 need no encouragement.'
  },
  {
    'description': 'A force multiplier for the force multipliers, operating almost entirely at the meta-engineering level: leads of leads, or the rarer technical M5 who mentors staff engineers and makes architectural calls that shape whole groups.',
    'down': 'Judge the whole product as a reflection of their leadership. They control hiring, team makeup, and objectives; if the combination yields a bad product, look to replace them.',
    'id': 'm5',
    'name': 'M5 · Group Force Multiplier',
    'outcomes': 'yes',
    'role': 'principal engineer, director',
    'up': 'The band here is wide and context-dependent; even the step from director to VP is a significant change in the skills required.'
  },
  {
    'description': 'Heavy systems thinkers whose job is aligning people toward worthy outcomes: the layer between the C-suite and the company, absorbing scale and day-to-day operations so leadership stays free for upside. The archetype greeting to the CEO: "I hope this is the last time we meet."',
    'down': 'Failing when the business outgrows them and the C-suite gets dragged back into operational minutiae.',
    'id': 'm6',
    'name': 'M6 · Senior Leader',
    'outcomes': 'yes',
    'role': 'head of, VP',
    'up': 'The next layer up is the C-suite itself.'
  }
];

/* Six stops across the plot; maturity bands group them */
const STOP_XS = [ 115, 270, 425, 580, 735, 890 ];
const STOP_Y = 218;

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
        <svg className={ styles.graph } viewBox='0 0 1000 380' role='group' aria-label='The Mav9 engineering ladder'>
          {/* Maturity bands behind the stops */}
          {bands.map((band) => {
            const x = STOP_XS[band.from] - 72;
            const width = STOP_XS[band.to] + 72 - x;

            return (
              <g key={ band.label } className={ styles.band }>
                <rect x={ x } y='128' width={ width } height='180' rx='18' />
                <text x={ x + width / 2 } y='156' textAnchor='middle' className={ styles.bandLabel }>{band.label}</text>
              </g>
            );
          })}

          {/* The climb */}
          {STOP_XS.slice(0, -1).map((x, index) => (
            <path key={ x } d={ `M ${x + 68} ${STOP_Y} L ${STOP_XS[index + 1] - 68} ${STOP_Y}` } className={ styles.path } />
          ))}

          {/* Level stops */}
          {levels.map((level, index) => {
            const x = STOP_XS[index];

            return (
              <g className={ styles.stop } key={ level.id } { ...selectLevel(level.id) }>
                <rect x={ x - 66 } y={ STOP_Y - 27 } width='132' height='54' rx='27' />
                <text x={ x } y={ STOP_Y - 4 } textAnchor='middle' className={ styles.stopName }>{level.name.split(' · ')[0]}</text>
                <text x={ x } y={ STOP_Y + 15 } textAnchor='middle' className={ styles.stopKind }>{level.name.split(' · ')[1]}</text>
                <text x={ x } y={ STOP_Y + 50 } textAnchor='middle' className={ styles.roleLabel }>{level.role}</text>
                <text x={ x } y={ STOP_Y + 74 } textAnchor='middle' className={ styles.outcomeLabel } data-outcome={ level.outcomes }>
                  {level.outcomes === 'situational' ? 'outcomes: situational' : `outcomes: ${level.outcomes}`}
                </text>
              </g>
            );
          })}

          <text x='500' y='348' textAnchor='middle' className={ styles.footerLabel }>impact widens left to right · ICs and leads share every rung</text>
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeLevel.name}</span>
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
        {activeLevel.name}, {activeLevel.role}. {activeLevel.description} Moves up when: {activeLevel.up} Slipping looks like: {activeLevel.down}
      </p>
    </figure>
  );
};

export default GrowthLevelsExplorer;
