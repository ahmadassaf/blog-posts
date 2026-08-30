'use client';

/**
 * THESIS: The Improvement Kata is a picture: a rehearsed loop of experiments walking from where you are toward a target you chose.
 * OWN-WORLD: One horizontal journey: the current condition on the left, the direction on the far right, and unknown territory in between.
 * STORY: Select any element of the kata (direction, current condition, target, experiments, obstacles) to read what it is for.
 * FIRST VIEWPORT: The full journey with the direction selected and the readout explaining the north star.
 * FORM: A responsive SVG with selectable stages driving a shared readout.
 */

import { useState } from 'react';

import styles from './ImprovementKataExplorer.module.css';

const stages = [
  {
    'blurb': 'The north star: where the team is trying to go on a one-to-three-year horizon. It is too far away to plan toward directly, and that is fine. Its job is to make every smaller choice comparable: does this move us toward the direction or away from it?',
    'id': 'direction',
    'name': 'Direction'
  },
  {
    'blurb': 'Where you actually are, established honestly: the process as it runs today, the numbers as they really read. A flattering baseline poisons every step after it, because targets get set relative to a place you never actually stood.',
    'id': 'current',
    'name': 'Current Condition'
  },
  {
    'blurb': 'Not the destination, just the next milestone: a single tangible change achievable in a few weeks that moves toward the direction. Small enough to hit, big enough to matter. When you reach it, you stand in a new current condition and pick the next one.',
    'id': 'target',
    'name': 'Next Target Condition'
  },
  {
    'blurb': 'The loop you actually live in: form a hypothesis, run the cheapest test of it, compare what happened against what you expected, adjust. Each turn of the loop is a step through the grey zone, and speed matters more than elegance while you are learning.',
    'id': 'experiments',
    'name': 'Experiments'
  },
  {
    'blurb': 'The things you discover standing between you and the target. They are not exceptions to the plan; finding and clearing them, one at a time, IS the plan. An obstacle you can name is progress.',
    'id': 'obstacles',
    'name': 'Obstacles'
  }
];

const experimentLoops = [ 370, 455, 540 ];

const ImprovementKataExplorer = ({
  title = 'The Improvement Kata, as a journey',
  description = 'You cannot plan a route through territory you have not seen. The kata walks it instead: experiment by experiment, target by target, always oriented by the direction. Select any element to read what it is for.',
  className = ''
}) => {
  const [ activeStageId, setActiveStageId ] = useState('direction');
  const activeStage = stages.find((stage) => stage.id === activeStageId) || stages[0];

  const selectStage = (stageId) => {
    return {
      'aria-label': `Read about ${stages.find((stage) => stage.id === stageId).name}`,
      'aria-pressed': activeStageId === stageId,
      'data-active': activeStageId === stageId,
      'onClick': () => setActiveStageId(stageId),
      'onFocus': () => setActiveStageId(stageId),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveStageId(stageId);
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

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable Improvement Kata diagram' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 420' role='group' aria-label='The Improvement Kata journey'>
          {/* The grey zone: unknown territory between current condition and target */}
          <g className={ styles.greyZone } { ...selectStage('obstacles') }>
            <rect x='300' y='120' width='310' height='190' rx='20' />
            <text x='455' y='148' textAnchor='middle' className={ styles.zoneLabel }>UNKNOWN TERRITORY</text>
            {/* Obstacles inside the zone */}
            <g className={ styles.obstacle }>
              <path d='M 400 168 L 416 184 L 400 200 L 384 184 Z' />
            </g>
            <g className={ styles.obstacle }>
              <path d='M 505 250 L 521 266 L 505 282 L 489 266 Z' />
            </g>
            <text x='455' y='296' textAnchor='middle' className={ styles.zoneHint }>obstacles emerge as you walk</text>
          </g>

          {/* Path: current -> target (dashed, through the zone), target -> direction (fainter) */}
          <path d='M 258 215 C 300 215, 320 215, 342 215' className={ styles.path } />
          <path d='M 398 215 C 415 215, 420 215, 427 215' className={ styles.path } />
          <path d='M 483 215 C 500 215, 505 215, 512 215' className={ styles.path } />
          <path d='M 568 215 C 590 215, 600 215, 622 215' className={ styles.path } />
          <path d='M 790 215 C 815 215, 825 215, 848 215' className={ styles.futurePath } />

          {/* Experiment loops: little PDCA circles along the path */}
          <g { ...selectStage('experiments') } className={ styles.experiments }>
            {experimentLoops.map((x) => (
              <g key={ x } className={ styles.loop }>
                <circle cx={ x } cy='215' r='26' />
                <path d={ `M ${x} 191 A 24 24 0 1 1 ${x - 17} 198` } className={ styles.loopArrow } />
                <path d={ `M ${x - 17} 198 L ${x - 25} 190 L ${x - 27} 202 Z` } className={ styles.loopHead } />
              </g>
            ))}
            <text x='455' y='330' textAnchor='middle' className={ styles.loopLabel }>experiment · learn · adjust</text>
          </g>

          {/* Current condition */}
          <g className={ styles.stageNode } { ...selectStage('current') }>
            <rect x='84' y='188' width='174' height='54' rx='27' />
            <text x='171' y='210' textAnchor='middle' className={ styles.stageKind }>YOU ARE HERE</text>
            <text x='171' y='228' textAnchor='middle' className={ styles.stageName }>Current Condition</text>
          </g>

          {/* Next target condition */}
          <g className={ styles.stageNode } { ...selectStage('target') }>
            <rect x='626' y='188' width='164' height='54' rx='27' />
            <text x='708' y='210' textAnchor='middle' className={ styles.stageKind }>WEEKS AWAY</text>
            <text x='708' y='228' textAnchor='middle' className={ styles.stageName }>Next Target</text>
          </g>

          {/* Direction: the north star */}
          <g className={ styles.directionNode } { ...selectStage('direction') }>
            <circle cx='905' cy='215' r='52' />
            <path d='M 905 185 L 911 205 L 932 205 L 915 218 L 921 239 L 905 226 L 889 239 L 895 218 L 878 205 L 899 205 Z' className={ styles.star } />
            <text x='905' y='292' textAnchor='middle' className={ styles.directionLabel }>Direction</text>
          </g>
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeStage.name}</span>
          <span className={ styles.readoutText }>{activeStage.blurb}</span>
        </div>
        <span className={ styles.readoutMeta }>reach the target · stand in a new current condition · pick the next target</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeStage.name}: {activeStage.blurb}
      </p>
    </figure>
  );
};

export default ImprovementKataExplorer;
