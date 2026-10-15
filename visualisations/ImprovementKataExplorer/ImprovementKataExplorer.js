'use client';

import { useId, useRef, useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import Button from '@gaudi/design-system/core/Button';
import { Field, FieldLabel } from '@gaudi/design-system/core/Field';
import Icon from '@gaudi/design-system/core/Icon';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import Textarea from '@gaudi/design-system/core/Textarea';
import { ToggleGroupItem, ToggleGroupRoot } from '@gaudi/design-system/core/ToggleGroup';
import { TableBodyPrimitive, TableCaption, TableCellPrimitive, TableHeadPrimitive, TableHeader, TableRoot, TableRowPrimitive } from '@gaudi/design-system/mdx/Table';

import { baselineHours, comparePrediction, predictionSnapshot, trials, withinWorkingDay } from './ImprovementKataExplorer.data';

import styles from './ImprovementKataExplorer.module.css';

const stageNotes = {
  'current': { 'name': 'Current condition', 'text': 'Start with what you can observe. Here, four of ten routine requests received substantive first feedback within one working day. The baseline is a sample to investigate, not an explanation of why work waited.' },
  'direction': { 'name': 'Direction', 'text': 'Small changes should reach users predictably, with the review checks intact. That larger purpose gives the local experiment context: faster first feedback is useful only if quality holds and waiting does not simply move downstream.' },
  'experiments': { 'name': 'Experiment, learn, adjust', 'text': 'Choose one obstacle, predict what a small test will show, and compare that prediction with the observation. The next step follows what you learned. Try the review-queue example below to keep a record of that loop.' },
  'obstacles': { 'name': 'Obstacles emerge', 'text': 'You do not need to know the entire route. In the worked example, a protected review window exposes an interruption problem. Coverage becomes something to test, instead of assuming more reminders will solve the waiting.' },
  'target': { 'name': 'Next target condition', 'text': 'Describe how the work should operate by a date. Here: at least eight of ten routine requests get first feedback within one working day in each of two consecutive weeks, with existing checks intact. A review bot or a protected window is an intervention toward it.' }
};

const ImprovementKataExplorer = ({
  id,
  title = 'The Improvement Kata, as a journey',
  description = 'From the current condition toward a target, one experiment at a time. Select a part of the diagram, then try the worked example below.',
  className = ''
}) => {
  const generatedId = useId();
  const uid = id || generatedId;
  const experimentHeading = useRef(null);
  const [ active, setActive ] = useState('window');
  const [ selectedStage, setSelectedStage ] = useState('direction');
  const stage = stageNotes[selectedStage];
  const stageProps = (name) => {
    return { 'aria-controls': `${uid}-diagram-readout`, 'value': name };
  };
  const [ drafts, setDrafts ] = useState({});
  const [ records, setRecords ] = useState({});
  const [ notice, setNotice ] = useState('');
  const trial = trials[active];
  const draft = drafts[active] || { 'expected': 4, 'note': '' };
  const record = records[active];
  const result = comparePrediction(trial.hours, record?.expected ?? draft.expected);

  const updateDraft = (patch) => setDrafts((current) => {
    return { ...current, [active]: { ...draft, ...patch } };
  });

  const choose = (trialId) => {
    setActive(trialId);
    setNotice(`${trials[trialId].title} selected. ${records[trialId]?.revealed ? 'Your previous prediction and observations are kept.' : 'Record a prediction before revealing the sample.'}`);
    experimentHeading.current?.focus();
  };

  const save = () => {
    setRecords((current) => {
      return {
        ...current,
        [active]: { ...predictionSnapshot(draft.expected, draft.note), 'revealed': false }
      };
    });
    setNotice('Prediction recorded. Now reveal the observations.');
  };

  const reveal = () => {
    setRecords((current) => {
      return { ...current, [active]: { ...current[active], 'revealed': true } };
    });
    setNotice(`${result.actual} of 5 within one working day. ${result.comparison}`);
  };

  const editPrediction = () => {
    setRecords((current) => {
      const next = { ...current };

      delete next[active];

      return next;
    });
    setNotice('Prediction unlocked. The observations have not been revealed.');
  };

  const reset = () => {
    setActive('window');
    setDrafts({});
    setRecords({});
    setNotice('Example reset. Start with a new prediction.');
    experimentHeading.current?.focus();
  };

  return (
    <figure className={ `${styles.root} ${className}` } aria-label='Improvement Kata worked example'>
      <figcaption className={ styles.caption }>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
      <ToggleGroupRoot
        type='single'
        spacing={ 0 }
        className={ styles.journey }
        aria-label='Explore the Improvement Kata diagram'
        value={ selectedStage }
        onValueChange={ (value) => value && setSelectedStage(value) }
      >
        <svg className={ styles.journeyLines } viewBox='0 0 1000 360' aria-hidden='true'>
          <rect className={ styles.unknownZone } x='288' y='65' width='324' height='230' rx='20' />
          <text className={ styles.zoneLabel } x='450' y='93' textAnchor='middle'>UNKNOWN TERRITORY</text>
          <path className={ styles.path } d='M 258 175 H 334 M 386 175 H 425 M 477 175 H 516 M 568 175 H 645' />
          <path className={ styles.futurePath } d='M 810 175 H 852' />
        </svg>
        <ToggleGroupItem className={ `${styles.stageNode} ${styles.diagramNode} ${styles.currentNode}` } { ...stageProps('current') }>
          <span>Current condition</span><strong>4 of 10 within a day</strong>
        </ToggleGroupItem>
        <ToggleGroupItem className={ `${styles.stageNode} ${styles.experimentNode}` } { ...stageProps('experiments') } aria-label='Explore experiments'>
          <span className={ styles.loopStrip } aria-hidden='true'>{[ 0, 1, 2 ].map((loop) => <svg key={ loop } viewBox='0 0 64 64'><circle cx='32' cy='32' r='28' /><path d='M 32 11 A 21 21 0 1 1 17 17' /><path d='M 17 17 L 8 15 L 13 7' /></svg>)}</span>
          <span>experiment · learn · adjust</span>
        </ToggleGroupItem>
        <ToggleGroupItem className={ `${styles.stageNode} ${styles.obstacleNode}` } { ...stageProps('obstacles') }><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 2 22 12 12 22 2 12Z' /></svg><span>Obstacles emerge</span></ToggleGroupItem>
        <ToggleGroupItem className={ `${styles.stageNode} ${styles.diagramNode} ${styles.targetNode}` } { ...stageProps('target') }><span>Next target condition</span><strong>8 of 10, sustained</strong></ToggleGroupItem>
        <ToggleGroupItem className={ `${styles.stageNode} ${styles.directionNode}` } { ...stageProps('direction') }><svg viewBox='0 0 100 100' aria-hidden='true'><circle cx='50' cy='50' r='46'/><path d='M50 23 56 43 77 43 60 56 66 77 50 64 34 77 40 56 23 43 44 43Z'/></svg><span>Direction</span></ToggleGroupItem>
      </ToggleGroupRoot>
      <div className={ styles.diagramReadout } id={ `${uid}-diagram-readout` } aria-live='polite' aria-atomic='true'><strong>{stage.name}</strong><p>{stage.text}</p></div>
      <Collapsible className={ styles.practice }>
        <CollapsibleTrigger asChild>
          <Button variant='ghost' tone='neutral' size='lg' className={ styles.practiceTrigger }>
            <Icon name='ChevronRight' decorative />
            Try a review-queue experiment <span>Predict · observe · adjust</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className={ styles.disclosure }>Fictional case with predefined observations. Routine requests are small, non-emergency changes requiring one reviewer. Time runs from ready for review to substantive feedback, counting working hours only. One working day = eight working hours.</p>
          <ol className={ styles.pattern } aria-label='The four steps of Improvement Kata'>
            <li>Understand the direction</li>
            <li>Observe the current condition</li>
            <li>Set a target condition</li>
            <li>Experiment and learn</li>
          </ol>
          <dl className={ styles.context }>
            <div>
              <dt>Direction</dt>
              <dd>Small changes reach users predictably, with the existing review checks intact.</dd>
            </div>
            <div>
              <dt>Current condition</dt>
              <dd>
                {withinWorkingDay(baselineHours)} of the last {baselineHours.length} routine requests received substantive first feedback within one working day.
                <Collapsible className={ styles.inspect }>
                  <CollapsibleTrigger asChild>
                    <Button variant='ghost' tone='neutral' size='sm' className={ styles.inspectTrigger }>
                      <Icon name='ChevronRight' decorative />
                      Inspect the baseline
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p>Working hours to first review: {baselineHours.join(', ')}. These ten completed requests describe the starting sample, not the age of unfinished work.</p>
                  </CollapsibleContent>
                </Collapsible>
              </dd>
            </div>
            <div>
              <dt>Next target condition</dt>
              <dd>By the end of the fortnight: at least 8 of 10 routine requests within one working day in each of two consecutive working weeks. Keep the existing review checks.</dd>
            </div>
          </dl>

          <section className={ styles.experiment } aria-label='Current experiment'>
            <h3 ref={ experimentHeading } tabIndex={ -1 }>{trial.title}</h3>
            <p>{trial.step}. {trial.change}</p>
            {active !== 'window' && (
              <p className={ styles.small }>This branch starts from the first experiment. The two alternatives use separate fictional samples.</p>
            )}
            <div className={ styles.prediction }>
              <Field>
                <FieldLabel htmlFor={ `${uid}-expected` }>How many of the next five requests will receive a first review within one working day?</FieldLabel>
                <NativeSelect
                  id={ `${uid}-expected` }
                  className={ styles.expected }
                  value={ record?.expected ?? draft.expected }
                  disabled={ Boolean(record) }
                  onChange={ (event) => updateDraft({ 'expected': Number(event.target.value) }) }
                >
                  {[ 0, 1, 2, 3, 4, 5 ].map((value) => (
                    <NativeSelectOption key={ value } value={ value }>{value} of 5</NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor={ `${uid}-reason` }>Why do you expect that? <span className={ styles.small }>(optional)</span></FieldLabel>
                <Textarea
                  id={ `${uid}-reason` }
                  value={ record?.note ?? draft.note }
                  disabled={ Boolean(record) }
                  onChange={ (event) => updateDraft({ 'note': event.target.value }) }
                  placeholder='Write the assumption you want this test to check.'
                  rows={ 2 }
                />
              </Field>
            </div>

            {!record && (
              <Button onClick={ save }>Record prediction</Button>
            )}
            {record && !record.revealed && (
              <div className={ styles.actions }>
                <Button onClick={ reveal }>Reveal observations</Button>
                <Button variant='outline' tone='neutral' onClick={ editPrediction }>Edit prediction</Button>
              </div>
            )}
            {record?.revealed && (
              <div className={ styles.result }>
                <h4>{result.actual} of 5 received a first review within one working day</h4>
                <p>You predicted {record.expected} of 5. {result.comparison}</p>
                <Collapsible className={ styles.inspect }>
                  <CollapsibleTrigger asChild>
                    <Button variant='ghost' tone='neutral' size='sm' className={ styles.inspectTrigger }>
                      <Icon name='ChevronRight' decorative />
                      Inspect the five observations
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <TableRoot className={ styles.table } containerProps={{ 'aria-label': 'Observations in this experiment' }}>
                      <TableCaption className={ styles.tableCaption }>Fictional requests in this experiment. Elapsed time counts working hours only.</TableCaption>
                      <TableHeader>
                        <TableRowPrimitive>
                          <TableHeadPrimitive scope='col'>Request</TableHeadPrimitive>
                          <TableHeadPrimitive scope='col'>Hours</TableHeadPrimitive>
                          <TableHeadPrimitive scope='col'>What happened</TableHeadPrimitive>
                        </TableRowPrimitive>
                      </TableHeader>
                      <TableBodyPrimitive>
                        {trial.hours.map((hours, index) => (
                          <TableRowPrimitive key={ index }>
                            <TableCellPrimitive as='th' scope='row'>PR {index + 1}</TableCellPrimitive>
                            <TableCellPrimitive>{hours}{hours <= 8 ? ' · within a day' : ' · over a day'}</TableCellPrimitive>
                            <TableCellPrimitive className={ styles.wrap }>{trial.observations[index]}</TableCellPrimitive>
                          </TableRowPrimitive>
                        ))}
                      </TableBodyPrimitive>
                    </TableRoot>
                  </CollapsibleContent>
                </Collapsible>
                <h4>What does this change about the next step?</h4>
                <p>{trial.learning}</p>
                <p className={ styles.limit }>The target is not established: this is five requests, not ten in each of two consecutive weeks. Keep checking review quality and downstream waiting too.</p>
              </div>
            )}
          </section>

          {records.window?.revealed && (
            <section className={ styles.next } aria-label='Choose a next experiment'>
              <h3>Which obstacle would you test next?</h3>
              <p>The first trial exposed interruptions. Compare two possible responses, keeping each prediction and result in the record.</p>
              <ToggleGroupRoot
                type='single'
                variant='outline'
                spacing={ 3 }
                className={ styles.actions }
                aria-label='Next experiment'
                value={ active === 'window' ? '' : active }
                onValueChange={ (value) => value && choose(value) }
              >
                <ToggleGroupItem value='backup'>Try backup coverage</ToggleGroupItem>
                <ToggleGroupItem value='reminder'>Try reminders</ToggleGroupItem>
              </ToggleGroupRoot>
            </section>
          )}
          {Object.values(records).some((item) => item.revealed) && (
            <section className={ styles.history } aria-label='Experiment record'>
              <h3>Your experiment record</h3>
              <ul>
                {Object.entries(records).filter(([ , item ]) => item.revealed).map(([ trialId, item ]) => (
                  <li key={ trialId }>
                    <Button
                      variant='outline'
                      tone={ active === trialId ? 'accent' : 'neutral' }
                      aria-current={ active === trialId ? 'step' : undefined }
                      onClick={ () => choose(trialId) }
                    >
                      {trials[trialId].title}
                    </Button>
                    <p>Predicted {item.expected} of 5; observed {withinWorkingDay(trials[trialId].hours)} of 5.</p>
                    {item.note && <p>Your assumption: {item.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className={ styles.status } role='status'>{notice}</p>
          <footer>
            <span>Practice inspired by Mike Rother’s Improvement and Coaching Kata.</span>
            <Button variant='ghost' tone='neutral' size='sm' onClick={ reset }>
              <Icon name='RotateCcw' decorative />
              Reset example
            </Button>
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </figure>
  );
};

export default ImprovementKataExplorer;
