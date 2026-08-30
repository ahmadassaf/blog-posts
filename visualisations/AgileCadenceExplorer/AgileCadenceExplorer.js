'use client';

/**
 * THESIS: Scrum and Kanban answer the same question, "when do we ship?", with two different clocks.
 * OWN-WORLD: One canvas, two rhythms: a fixed loop that beats every two weeks, and a lane that never stops flowing.
 * STORY: Switch between the Scrum loop and the Kanban board, then select any stage to read what it is for.
 * FIRST VIEWPORT: The Scrum cycle with its backlog inlet and increment outlet, cadence badge at the center.
 * FORM: A responsive SVG with semantic tab switching and selectable stages.
 */

import { useState } from 'react';

import styles from './AgileCadenceExplorer.module.css';

const modes = {
  'kanban': {
    'defaultStage': 'progress',
    'label': 'Kanban',
    'meaning': 'continuous flow',
    'stages': [
      { 'blurb': 'Priorities live here in strict order. The product owner can reshuffle it at any time without disturbing anyone, because nothing here is being worked on yet.', 'cards': 5, 'id': 'backlog', 'name': 'Backlog' },
      { 'blurb': 'The short runway of agreed next work. When someone frees up, they pull from the top. Nobody assigns work downward.', 'cards': 3, 'id': 'todo', 'name': 'To Do' },
      { 'blurb': 'The heart of Kanban: capped work in progress. The limit is what turns a to-do list into a system, because a full column forces the team to finish before starting.', 'cards': 3, 'id': 'progress', 'name': 'In Progress', 'wip': 3 },
      { 'blurb': 'A deliberately low limit. Reviews rot when they queue, so a full review column sends developers to review before they write more code.', 'cards': 2, 'id': 'review', 'name': 'Review', 'wip': 2 },
      { 'blurb': 'Cards ship one at a time, whenever they land. There is no release ceremony to wait for, which is why Kanban pairs so naturally with continuous delivery.', 'cards': 4, 'id': 'done', 'name': 'Done' }
    ],
    'term': 'Flow'
  },
  'scrum': {
    'defaultStage': 'sprint',
    'label': 'Scrum',
    'meaning': 'fixed sprints',
    'stages': [
      { 'blurb': 'The team pulls what fits from the backlog and commits to a single sprint goal. The goal is the contract; the stories are just the current plan for reaching it.', 'id': 'plan', 'name': 'Sprint Planning' },
      { 'blurb': 'A fixed time box, most commonly two weeks. The daily scrum keeps the plan honest: fifteen minutes to surface blockers, not to read out calendars.', 'id': 'sprint', 'name': 'The Sprint', 'sub': 'daily scrum inside' },
      { 'blurb': 'The team demos the increment to stakeholders. What everyone learns here reshuffles the product backlog before the next planning session.', 'id': 'review', 'name': 'Sprint Review' },
      { 'blurb': 'The team inspects itself rather than the product: what to keep, what to drop, what to try next sprint. Skipping this is how process debt accumulates.', 'id': 'retro', 'name': 'Retrospective' }
    ],
    'term': 'Cadence'
  }
};

const scrumPositions = {
  'plan': [ 320, 118 ],
  'retro': [ 320, 342 ],
  'review': [ 680, 342 ],
  'sprint': [ 680, 118 ]
};

const kanbanColumns = [ 120, 310, 500, 690, 880 ];

const AgileCadenceExplorer = ({
  title = 'Two clocks for the same question',
  description = 'Scrum ships on a fixed beat; Kanban ships whenever a card reaches Done. Switch modes and select any stage to read what it is for.',
  className = ''
}) => {
  const [ activeModeId, setActiveModeId ] = useState('scrum');
  const [ activeStageIds, setActiveStageIds ] = useState({ 'kanban': 'progress', 'scrum': 'sprint' });
  const activeMode = modes[activeModeId];
  const activeStage = activeMode.stages.find((stage) => stage.id === activeStageIds[activeModeId]);

  const selectStage = (stageId) => {
    return {
      'aria-label': `Read about ${activeMode.stages.find((stage) => stage.id === stageId).name}`,
      'aria-pressed': activeStageIds[activeModeId] === stageId,
      'data-active': activeStageIds[activeModeId] === stageId,
      'onClick': () => setActiveStageIds((current) => {
        return { ...current, [activeModeId]: stageId };
      }),
      'onFocus': () => setActiveStageIds((current) => {
        return { ...current, [activeModeId]: stageId };
      }),
      'onKeyDown': (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActiveStageIds((current) => {
            return { ...current, [activeModeId]: stageId };
          });
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

      <div className={ styles.toolbar }>
        <div className={ styles.typeTabs } aria-label='Delivery cadence' role='group'>
          {[ 'scrum', 'kanban' ].map((id) => [ id, modes[id] ]).map(([ id, mode ]) => (
            <button
              type='button'
              aria-label={ `${mode.label} ${mode.meaning}` }
              aria-pressed={ activeModeId === id }
              data-active={ activeModeId === id }
              key={ id }
              onClick={ () => setActiveModeId(id) }
            >
              <strong>{mode.label}</strong>
              <span>{mode.meaning}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the diagram</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable delivery cadence diagram' tabIndex='0'>
        {activeModeId === 'scrum' ? (
          <svg className={ styles.graph } viewBox='0 0 1000 460' role='group' aria-label='The Scrum sprint loop'>
            {/* The loop: a rounded track the four ceremonies sit on */}
            <rect x='320' y='118' width='360' height='224' rx='112' className={ styles.loopTrack } />

            {/* Direction hints on the track */}
            <path d='M 505 118 L 495 112 L 495 124 Z' className={ styles.loopArrow } />
            <path d='M 495 342 L 505 336 L 505 348 Z' className={ styles.loopArrow } />

            <g className={ styles.cadenceBadge }>
              <rect x='428' y='204' width='144' height='52' rx='26' />
              <text x='500' y='226' textAnchor='middle' className={ styles.cadenceLabel }>FIXED CADENCE</text>
              <text x='500' y='244' textAnchor='middle' className={ styles.cadenceValue }>2-week sprint</text>
            </g>

            {/* Backlog feeds planning; the review emits the increment */}
            <g className={ styles.sideNode }>
              <rect x='40' y='91' width='150' height='54' rx='27' />
              <text x='115' y='113' textAnchor='middle' className={ styles.sideKind }>INPUT</text>
              <text x='115' y='131' textAnchor='middle' className={ styles.sideName }>Product Backlog</text>
            </g>
            <path d='M 192 118 C 214 118, 218 118, 233 118' className={ styles.sideEdge } />

            <g className={ styles.sideNode }>
              <rect x='810' y='315' width='150' height='54' rx='27' />
              <text x='885' y='337' textAnchor='middle' className={ styles.sideKind }>OUTPUT</text>
              <text x='885' y='355' textAnchor='middle' className={ styles.sideName }>Increment</text>
            </g>
            <path d='M 767 342 C 786 342, 792 342, 808 342' className={ styles.sideEdge } />

            {modes.scrum.stages.map((stage) => {
              const [ x, y ] = scrumPositions[stage.id];

              return (
                <g className={ styles.stageNode } key={ stage.id } { ...selectStage(stage.id) }>
                  <rect x={ x - 87 } y={ y - 27 } width='174' height='54' rx='27' />
                  <text x={ x } y={ stage.sub ? y - 1 : y + 5 } textAnchor='middle' className={ styles.stageName }>{stage.name}</text>
                  {stage.sub ? <text x={ x } y={ y + 17 } textAnchor='middle' className={ styles.stageSub }>{stage.sub}</text> : null}
                </g>
              );
            })}
          </svg>
        ) : (
          <svg className={ styles.graph } viewBox='0 0 1000 460' role='group' aria-label='The Kanban board flow'>
            {modes.kanban.stages.map((stage, index) => {
              const x = kanbanColumns[index];

              return (
                <g className={ styles.column } key={ stage.id } { ...selectStage(stage.id) }>
                  <rect x={ x - 80 } y='90' width='160' height='240' rx='18' />
                  <text x={ x } y='122' textAnchor='middle' className={ styles.columnTitle }>{stage.name}</text>
                  {typeof stage.wip === 'number' && (
                    <g className={ styles.wipBadge }>
                      <rect x={ x - 34 } y='58' width='68' height='24' rx='12' />
                      <text x={ x } y='74' textAnchor='middle'>WIP {stage.wip}</text>
                    </g>
                  )}
                  {Array.from({ 'length': stage.cards }, (_, cardIndex) => (
                    <rect
                      key={ cardIndex }
                      x={ x - 56 }
                      y={ 142 + (cardIndex * 36) }
                      width='112'
                      height='24'
                      rx='7'
                      className={ styles.card }
                    />
                  ))}
                </g>
              );
            })}

            <path d='M 40 388 L 952 388' className={ styles.flowLine } />
            <path d='M 952 388 L 938 381 L 938 395 Z' className={ styles.flowArrow } />
            <text x='500' y='424' textAnchor='middle' className={ styles.flowLabel }>continuous flow · release at any time</text>
          </svg>
        )}
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeStage.name}</span>
          <span className={ styles.readoutText }>{activeStage.blurb}</span>
        </div>
        <span className={ styles.readoutMeta }>
          {activeModeId === 'scrum' ? 'the loop repeats every sprint · velocity is the metric' : 'cards pull left to right · cycle time is the metric'}
        </span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeMode.label}, {activeMode.meaning}. {activeStage.name}: {activeStage.blurb}
      </p>
    </figure>
  );
};

export default AgileCadenceExplorer;
