'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { createKanbanState,
  createScrumState,
  getKanbanCounts,
  getKanbanMove,
  getScrumStatus,
  KANBAN_LIMITS,
  moveKanbanItem,
  moveScrumDay,
  releaseScrumIncrement,
  SCRUM_READY_DAY,
  SCRUM_REVIEW_DAY } from './cadence-model.mjs';

import styles from './AgileCadenceExplorer.module.css';

const columns = [
  { 'action': 'Start work', 'empty': 'Nothing waiting to start.', 'id': 'ready', 'label': 'Ready' },
  { 'action': 'Send to review', 'empty': 'Space to start an item.', 'id': 'progress', 'label': 'In Progress' },
  { 'action': 'Finish review', 'empty': 'No reviews waiting.', 'id': 'review', 'label': 'Review' },
  { 'empty': 'Finished items will appear here.', 'id': 'done', 'label': 'Done' }
];

const events = [
  { 'name': 'Sprint Planning', 'purpose': 'Agree the goal and make a plan.', 'timing': 'Start of the Sprint' },
  { 'name': 'Daily Scrum', 'purpose': 'Inspect goal progress and adapt the plan.', 'timing': 'Every working day' },
  { 'name': 'Sprint Review', 'purpose': 'Inspect results with stakeholders.', 'timing': 'Near the end' },
  { 'name': 'Retrospective', 'purpose': 'Decide how to improve the way we work.', 'timing': 'Concludes the Sprint' }
];

const AgileCadenceExplorer = ({
  id,
  title = 'A shared rhythm, a visible flow',
  description = 'Try an early release in Scrum, then unblock a Kanban queue. Both examples use a fictional search team; the days, cards, and limits are illustrative.',
  className = ''
}) => {
  const generatedId = useId();
  const instanceId = id || generatedId;
  const [ mode, setMode ] = useState('scrum');
  const [ selectedEvent, setSelectedEvent ] = useState(1);
  const [ scrum, setScrum ] = useState(createScrumState);
  const [ kanban, setKanban ] = useState(createKanbanState);
  const cardRefs = useRef({});
  const pendingFocus = useRef(null);
  const scrumStatus = getScrumStatus(scrum);
  const counts = getKanbanCounts(kanban.items);
  const dayId = `${instanceId}-day`;
  const policyId = `${instanceId}-policy`;
  const statusId = `${instanceId}-status`;
  const eventId = `${instanceId}-event`;
  let incrementLabel = 'Building and verifying';
  let ariaState = 'increment still in progress';
  let defaultMessage = `Work is still being built and verified. It reaches Done on day ${SCRUM_READY_DAY} in this example.`;

  if (scrumStatus.released) {
    incrementLabel = `Released on day ${scrum.releasedDay}`;
    ariaState = 'increment released';
    defaultMessage = `The increment was released on day ${scrum.releasedDay}. The Review still takes place on day ${SCRUM_REVIEW_DAY}.`;
  } else if (scrumStatus.ready) {
    incrementLabel = 'Usable and verified';
    ariaState = 'increment ready to release';
    defaultMessage = `The increment meets the Definition of Done. ${scrum.day < SCRUM_REVIEW_DAY ? 'You can release it before the Review.' : 'You could have released it from day 5.'}`;
  }

  const scrumMessage = scrum.feedback || defaultMessage;

  useEffect(() => {
    const card = cardRefs.current[pendingFocus.current];

    if (card) (card.querySelector('button') || card).focus();
    pendingFocus.current = null;
  }, [ kanban.items ]);

  const advanceCard = (itemId) => {
    pendingFocus.current = getKanbanMove(kanban, itemId).blocked ? null : itemId;
    setKanban((current) => moveKanbanItem(current, itemId));
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <div className={ styles.toolbar }>
        <div className={ styles.modeControls } role='group' aria-label='Explore a work approach'>
          <button type='button' aria-pressed={ mode === 'scrum' } onClick={ () => setMode('scrum') }>Scrum</button>
          <button type='button' aria-pressed={ mode === 'kanban' } onClick={ () => setMode('kanban') }>Kanban</button>
        </div>
        <button
          type='button'
          className={ styles.reset }
          onClick={ () => {
            if (mode === 'scrum') {
              setScrum(createScrumState());
              setSelectedEvent(1);
            } else {
              setKanban(createKanbanState());
            }
          } }
        >Reset example</button>
      </div>

      {mode === 'scrum' ? (
        <div className={ styles.scrum }>
          <p className={ styles.instruction }>Release on day 5, then move to day 10. Select an event to explore its purpose.</p>

          <section className={ styles.sprintBoundary } aria-label='One fictional Sprint containing all Scrum events'>
            <p className={ styles.goal }><strong>Sprint Goal:</strong> help people find their saved documents.</p>
            <div className={ styles.sprintScene }>
              <div className={ styles.sprintHeading }>
                <strong>One Sprint</strong>
                <span>Day {scrum.day} of {SCRUM_REVIEW_DAY}</span>
              </div>
              <div className={ styles.inlet }><span>From</span><strong>Product Backlog</strong></div>
              <ul className={ styles.events }>
                {events.map((event, index) => (
                  <li key={ event.name } data-position={ index }>
                    <button
                      type='button'
                      aria-pressed={ selectedEvent === index }
                      aria-describedby={ selectedEvent === index ? eventId : undefined }
                      onClick={ () => setSelectedEvent(index) }
                    >
                      <strong>{event.name}</strong>
                      <span>{event.timing}</span>
                      {index === 1 && (
                        <span className={ styles.dayRail } aria-hidden='true'>
                          {Array.from({ 'length': SCRUM_REVIEW_DAY }, (_, dayIndex) => (
                            <span
                              className={ styles.dayTick }
                              key={ dayIndex }
                              data-current={ scrum.day === dayIndex + 1 }
                              data-past={ scrum.day > dayIndex + 1 }
                            ><span>{dayIndex + 1}</span></span>
                          ))}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className={ styles.incrementNode } data-ready={ scrumStatus.ready } data-released={ scrumStatus.released }>
                <strong>Increment</strong>
                <span>{incrementLabel}</span>
              </div>
            </div>
            <p className={ styles.eventReadout } id={ eventId }><strong>{events[selectedEvent].name}</strong><span>{events[selectedEvent].purpose} All four events take place within the Sprint.</span></p>

            <div className={ styles.dayControl }>
              <label htmlFor={ dayId }>Explore a working day</label>
              <output htmlFor={ dayId }>Day {scrum.day} of {SCRUM_REVIEW_DAY}</output>
              <input
                id={ dayId }
                type='range'
                min='1'
                max={ SCRUM_REVIEW_DAY }
                step='1'
                value={ scrum.day }
                aria-valuetext={ `Day ${scrum.day}: ${ariaState}` }
                onChange={ (event) => {
                  const day = Number(event.target.value);

                  setScrum((current) => moveScrumDay(current, day));
                  if (day === 1) setSelectedEvent(0);
                  else if (day === SCRUM_REVIEW_DAY) setSelectedEvent(2);
                  else setSelectedEvent(1);
                } }
              />
              <div className={ styles.dayLabels } aria-hidden='true'>
                <span>Day 1 · Planning</span>
                <span>Day 5 · Increment Done</span>
                <span>Day 10 · Review & retro</span>
              </div>
            </div>

            <div className={ styles.release }>
              <div>
                <strong>Search increment</strong>
                <span>{incrementLabel}</span>
              </div>
              <button
                type='button'
                disabled={ scrumStatus.released }
                aria-describedby={ statusId }
                onClick={ () => setScrum(releaseScrumIncrement) }
              >{scrumStatus.released ? 'Increment released' : 'Release increment'}</button>
            </div>
            <p className={ styles.reviewNote }>{scrum.day === SCRUM_REVIEW_DAY ? 'Today: inspect the outcome with stakeholders, then hold the retrospective.' : `Review and retrospective remain scheduled for day ${SCRUM_REVIEW_DAY}.`}</p>
          </section>

          <p className={ styles.feedback } id={ statusId } role='status' aria-live='polite' aria-atomic='true'>{scrumMessage}</p>
          <p className={ styles.takeaway }>Scrum fixes the inspection rhythm. Product readiness and release policy determine when value reaches users.</p>
        </div>
      ) : (
        <div className={ styles.kanban }>
          <p className={ styles.instruction }>Try sending “Saved searches” into full Review, then finish a review and try again.</p>
          <details className={ styles.policy }>
            <summary>Workflow policy · two items per active stage</summary>
            <p id={ policyId }><strong>This fictional workflow:</strong> at most two items in In Progress and two in Review. Pull only when the destination has capacity. Ready and Done are outside WIP. Here, Done means verified and ready for release; deployment is a separate decision.</p>
          </details>

          <div className={ styles.boardFrame } role='region' aria-label='Scrollable fictional Kanban board' tabIndex='0'>
            <div className={ styles.board } aria-label='Fictional search team Kanban board'>
              {columns.map((column) => {
                const items = kanban.items.filter((item) => item.stage === column.id);
                const limit = KANBAN_LIMITS[column.id];
                const full = Boolean(limit && counts[column.id] >= limit);

                return (
                  <section className={ styles.column } key={ column.id } data-full={ full } aria-label={ `${column.label}: ${counts[column.id]} items${limit ? `, limit ${limit}` : ''}` }>
                    <div className={ styles.columnHeading }>
                      <h3>{column.label}</h3>
                      <span className={ styles.count } data-full={ full }>{limit ? `${counts[column.id]} / ${limit}${full ? ' · full' : ''}` : counts[column.id]}</span>
                    </div>
                    {items.length > 0 ? (
                      <ul className={ styles.cards }>
                        {items.map((item) => {
                          const { blocked } = getKanbanMove(kanban, item.id);

                          return (
                            <li className={ styles.card } key={ item.id } tabIndex={ -1 } ref={ (element) => {
                              cardRefs.current[item.id] = element;
                            } }>
                              <strong>{item.title}</strong>
                              {column.action ? (
                                <button
                                  type='button'
                                  data-blocked={ blocked }
                                  aria-label={ `${column.action}: ${item.title}` }
                                  aria-describedby={ `${policyId} ${statusId}` }
                                  onClick={ () => advanceCard(item.id) }
                                >{column.action}{blocked ? ' (full)' : ''}</button>
                              ) : <span className={ styles.done }>Ready for release</span>}
                            </li>
                          );
                        })}
                      </ul>
                    ) : <p className={ styles.empty }>{column.empty}</p>}
                  </section>
                );
              })}
            </div>
            <svg className={ styles.flowConnector } viewBox='0 0 1000 38' aria-hidden='true'>
              <path d='M 25 19 H 975' className={ styles.loopTrack } />
              <path d='M 975 19 L 962 12 L 962 26 Z' className={ styles.loopArrow } />
            </svg>
          </div>
          <p className={ styles.scrollHint }>Scroll the board horizontally to follow the work.</p>

          <p className={ styles.feedback } id={ statusId } role='status' aria-live='polite' aria-atomic='true'>
            {kanban.feedback || 'Review is full at 2/2. In Progress still has one open slot. Try an action to see which limit applies.'}
          </p>
          <p className={ styles.takeaway }>WIP: {counts.progress + counts.review} unfinished items. Finishing a review opens that stage; its limit does not automatically stop the whole board.</p>
        </div>
      )}
    </figure>
  );
};

export default AgileCadenceExplorer;
