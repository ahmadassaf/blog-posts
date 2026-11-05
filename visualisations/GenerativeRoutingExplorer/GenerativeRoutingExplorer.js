'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import Button from '@gaudi/design-system/core/Button';
import { CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardRoot, CardTitle } from '@gaudi/design-system/core/Card';
import Checkbox from '@gaudi/design-system/core/Checkbox';
import { Field, FieldLabel } from '@gaudi/design-system/core/Field';
import Icon from '@gaudi/design-system/core/Icon';
import { RadioGroupItem, RadioGroupRoot } from '@gaudi/design-system/core/RadioGroup';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import { Slider } from '@gaudi/design-system/core/Slider';
import Textarea from '@gaudi/design-system/core/Textarea';

import { acquisitionRecord, assumptionLabels, company, computeFinding, countStale, defaultAssumptions, definitionExample, describeAssumption, followUp, formatDelta, formatMoney, formatRate, latestEurByPeriod, rateRange, reviewFinding, routes, sourceDocuments } from './GenerativeRoutingExplorer.data';

import styles from './GenerativeRoutingExplorer.module.css';

const saveLabel = (saved, review) => {
  if (!saved) return 'Save finding';
  if (review.stale) return 'Recompute and save';

  return 'Update saved finding';
};

const staleSentence = (count) => {
  if (count === 0) return 'All saved findings are current again.';

  return `${count} saved ${count === 1 ? 'finding needs' : 'findings need'} review.`;
};

const GenerativeRoutingExplorer = ({
  id,
  title = 'Follow the question, then the evidence',
  description = 'A predefined investigation into one fictional EBITDA discrepancy. Each saved finding keeps the assumptions it was computed under; change an assumption upstream and the finding tells you it needs another look.',
  className = ''
}) => {
  const generatedId = useId();
  const uid = id || generatedId;
  const heading = useRef(null);
  const [ started, setStarted ] = useState(false);
  const [ step, setStep ] = useState('evidence');
  const [ trail, setTrail ] = useState([ 'evidence' ]);
  const [ assumptions, setAssumptions ] = useState(defaultAssumptions);
  const [ findings, setFindings ] = useState({});
  const [ notes, setNotes ] = useState({});
  const [ notice, setNotice ] = useState('');
  const [ navigation, setNavigation ] = useState(0);

  // The step heading only exists once the investigation has started, so focus runs after commit.
  useEffect(() => {
    if (navigation) heading.current?.focus();
  }, [ navigation ]);

  const live = step === 'evidence' ? null : computeFinding(step, assumptions);
  const savedFinding = findings[step];
  const savedReview = savedFinding ? reviewFinding(savedFinding, assumptions) : null;
  const next = followUp(step, assumptions);
  const savedList = Object.entries(findings);
  const staleCount = countStale(findings, assumptions);
  const latestEur = latestEurByPeriod[assumptions.period];
  const differentYears = assumptions.period !== acquisitionRecord.period;

  const open = (routeId) => {
    setStep(routeId);
    setTrail((current) => (current.includes(routeId) ? current : [ ...current, routeId ]));
    setNavigation((count) => count + 1);
  };

  const start = () => {
    setStarted(true);
    setNotice('Investigation started. Compare the observations, then choose a route.');
    open('evidence');
  };

  const updateAssumption = (key, value) => {
    const nextAssumptions = { ...assumptions, [key]: value };
    const before = countStale(findings, assumptions);
    const after = countStale(findings, nextAssumptions);

    setAssumptions(nextAssumptions);
    if (after !== before) setNotice(`${assumptionLabels[key]} set to ${describeAssumption(key, value)}. ${staleSentence(after)}`);
  };

  const save = () => {
    const finding = computeFinding(step, assumptions);
    const under = Object.entries(finding.assumptions).map(([ key, value ]) => describeAssumption(key, value)).join(', ');

    setFindings((current) => {
      return { ...current, [step]: finding };
    });
    setNotice(`${routes[step].title} ${savedFinding ? 'updated' : 'saved'}: ${formatMoney(finding.value)} under ${under}.`);
  };

  const recompute = (routeId) => {
    const review = reviewFinding(findings[routeId], assumptions);

    setFindings((current) => {
      return { ...current, [routeId]: review.current };
    });
    setNotice(`${routes[routeId].title} recomputed: ${formatMoney(findings[routeId].value)} → ${formatMoney(review.current.value)} (${formatDelta(review.delta)}).`);
  };

  const reset = () => {
    setStarted(false);
    setStep('evidence');
    setTrail([ 'evidence' ]);
    setAssumptions(defaultAssumptions);
    setFindings({});
    setNotes({});
    setNotice('Example reset.');
  };

  return (
    <figure className={ `${styles.root} ${className}` } aria-label='Generative routing worked example'>
      <figcaption className={ styles.caption }>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
      <p className={ styles.disclosure }>Fictional company and figures with predefined routes; no live model. Notes and findings last until reload.</p>

      <section className={ styles.question } aria-label='The question and the observations'>
        <p className={ styles.prompt }>“{company}’s EBITDA looks different from what we recorded at acquisition. Why?”</p>
        <dl className={ styles.observations }>
          <div>
            <dt>Acquisition record · FY2024</dt>
            <dd>£{acquisitionRecord.valueGbp}m</dd>
          </div>
          <div>
            <dt>Latest report · {assumptions.period}</dt>
            <dd>€{latestEur}m</dd>
          </div>
        </dl>
        <p className={ styles.small }>Same metric definition. Different currencies{differentYears ? ' and reporting periods' : ''}.</p>
        {!started && (
          <Button onClick={ start }>Start the investigation</Button>
        )}
      </section>

      {started && (
        <>
          <section className={ styles.assumptions } aria-label='Assumptions in force'>
            <div className={ styles.assumptionsIntro }>
              <h3>Assumptions in force</h3>
              <p className={ styles.small }>Every saved finding records the values it used. Changing one here marks the findings that depend on it.</p>
            </div>
            <Field className={ styles.period }>
              <FieldLabel htmlFor={ `${uid}-period` }>Latest reporting period</FieldLabel>
              <NativeSelect id={ `${uid}-period` } value={ assumptions.period } onChange={ (event) => updateAssumption('period', event.target.value) }>
                <NativeSelectOption value='FY2025'>FY2025</NativeSelectOption>
                <NativeSelectOption value='FY2024'>FY2024</NativeSelectOption>
              </NativeSelect>
            </Field>
            <div className={ styles.rate }>
              <span id={ `${uid}-rate-label` } className={ styles.rateLabel }>Exchange rate</span>
              <Slider
                aria-labelledby={ `${uid}-rate-label` }
                getValueText={ (value) => formatRate(value) }
                min={ rateRange.min }
                max={ rateRange.max }
                step={ rateRange.step }
                value={ [ assumptions.rate ] }
                onValueChange={ ([ value ]) => updateAssumption('rate', value) }
              />
              <output aria-hidden='true'>{formatRate(assumptions.rate)}</output>
            </div>
          </section>

          <ol className={ styles.trail } aria-label='Route taken so far'>
            {trail.map((routeId, index) => (
              <li key={ routeId }>
                <Button
                  variant={ step === routeId ? 'soft' : 'ghost' }
                  tone={ step === routeId ? 'accent' : 'neutral' }
                  size='sm'
                  aria-current={ step === routeId ? 'step' : undefined }
                  onClick={ () => open(routeId) }
                >
                  <span className={ styles.trailIndex }>{index + 1}</span>
                  {routes[routeId].title}
                </Button>
              </li>
            ))}
          </ol>

          <div className={ styles.workspace }>
            <section className={ styles.step } aria-label='Current step'>
              <div className={ styles.reveal } key={ step }>
                <h3 ref={ heading } tabIndex={ -1 }>{step === 'evidence' ? 'The currencies differ. Start there?' : routes[step].title}</h3>
                <p>{routes[step].evidence}{step === 'evidence' && differentYears ? ' The periods also differ; keep that as the next check.' : ''}</p>
                {routes[step].whatIf && (
                  <p className={ styles.small }>Separate what-if example: same period, GBP throughout. It has its own evidence and does not change the main investigation.</p>
                )}

                {step === 'evidence' && (
                  <>
                    <div className={ styles.actions }>
                      <Button onClick={ () => open('currency') }>Inspect currency conversion</Button>
                      <Button variant='outline' onClick={ () => open('period') }>Check the period first</Button>
                    </div>
                    <Collapsible className={ styles.alternatives }>
                      <CollapsibleTrigger asChild>
                        <Button variant='ghost' tone='neutral' size='sm' className={ styles.alternativesTrigger }>
                          <Icon name='ChevronRight' decorative />
                          Explore different evidence instead
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <p className={ styles.small }>Standalone what-if cases showing how another finding would call for a different tool.</p>
                        <div className={ styles.actions }>
                          <Button variant='outline' onClick={ () => open('definition') }>What if the definitions differ?</Button>
                          <Button variant='outline' onClick={ () => open('sources') }>What if the sources disagree?</Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}

                {step === 'currency' && (
                  <div className={ styles.metric }>
                    <span>€{latestEur}m ÷ {assumptions.rate.toFixed(2)}</span>
                    <strong>{formatMoney(live.value)}</strong>
                    <span>Latest EBITDA in GBP · {formatDelta(live.value - acquisitionRecord.valueGbp)} against the £10m record</span>
                  </div>
                )}

                {step === 'period' && (
                  <dl className={ styles.bridge }>
                    <div>
                      <dt>Acquisition record · FY2024</dt>
                      <dd>{formatMoney(acquisitionRecord.valueGbp)}</dd>
                    </div>
                    <div>
                      <dt>Latest · {assumptions.period}, converted at {formatRate(assumptions.rate)}</dt>
                      <dd>{formatMoney(live.value)}</dd>
                    </div>
                    <div>
                      <dt>Difference</dt>
                      <dd>{formatDelta(live.value - acquisitionRecord.valueGbp)}</dd>
                    </div>
                  </dl>
                )}

                {step === 'definition' && (
                  <dl className={ styles.bridge }>
                    <div>
                      <dt>Adjusted EBITDA</dt>
                      <dd>£{definitionExample.adjustedGbp}m</dd>
                    </div>
                    <div className={ styles.bridgeControl }>
                      <Checkbox
                        checked={ assumptions.adjustment }
                        onCheckedChange={ (value) => updateAssumption('adjustment', value === true) }
                        label={ `Remove the £${definitionExample.addBackGbp}m restructuring add-back` }
                      />
                    </div>
                    <div>
                      <dt>{assumptions.adjustment ? 'Reported basis' : 'Still adjusted, not comparable'}</dt>
                      <dd>£{live.value}m</dd>
                    </div>
                  </dl>
                )}

                {step === 'sources' && (
                  <RadioGroupRoot className={ styles.documents } aria-label='Source document' value={ assumptions.source } onValueChange={ (value) => updateAssumption('source', value) }>
                    {Object.entries(sourceDocuments).map(([ key, document ]) => (
                      <label key={ key } data-checked={ assumptions.source === key || undefined }>
                        <RadioGroupItem value={ key } aria-label={ document.title } />
                        <strong>{document.title}</strong>
                        <span>{document.date} · £{document.valueGbp}m</span>
                        <p>{document.detail}</p>
                      </label>
                    ))}
                  </RadioGroupRoot>
                )}

                {live && (
                  <>
                    <p className={ styles.result }>{live.summary}</p>
                    {next && (
                      <div className={ styles.followUp }>
                        <h4>{next.title}</h4>
                        <p>{next.body}</p>
                      </div>
                    )}
                    <div className={ styles.actions }>
                      <Button onClick={ save }>{saveLabel(savedFinding, savedReview)}</Button>
                      {next && (
                        <Button variant='outline' onClick={ () => open(next.target) }>
                          {next.action}
                          <Icon name='ArrowRight' decorative />
                        </Button>
                      )}
                    </div>
                    <Field className={ styles.notes }>
                      <FieldLabel htmlFor={ `${uid}-note-${step}` }>Your notes for this step <span className={ styles.small }>(optional)</span></FieldLabel>
                      <Textarea
                        id={ `${uid}-note-${step}` }
                        rows={ 2 }
                        value={ notes[step] || '' }
                        placeholder='What would you check next?'
                        onChange={ (event) => setNotes({ ...notes, [step]: event.target.value }) }
                      />
                    </Field>
                    <Button variant='ghost' tone='neutral' size='sm' className={ styles.back } onClick={ () => open('evidence') }>
                      <Icon name='ArrowLeft' decorative />
                      Back to observations
                    </Button>
                  </>
                )}
              </div>
            </section>

            <aside className={ styles.findings } aria-labelledby={ `${uid}-findings` }>
              <div className={ styles.findingsHeader }>
                <h3 id={ `${uid}-findings` }>Saved findings</h3>
                {staleCount > 0 && (
                  <span className={ styles.staleCount }>
                    <Icon name='TriangleAlert' decorative />
                    {staleCount} {staleCount === 1 ? 'needs' : 'need'} review
                  </span>
                )}
              </div>
              {savedList.length === 0 && (
                <p className={ styles.small }>Save a finding from a step. Each card keeps the assumptions it was computed under, so you can see the moment one goes stale.</p>
              )}
              <ul className={ styles.findingList }>
                {savedList.map(([ routeId, finding ]) => {
                  const review = reviewFinding(finding, assumptions);

                  return (
                    <li key={ routeId }>
                      <CardRoot variant='outline' padding='sections' radius='lg' className={ styles.finding } data-stale={ review.stale || undefined }>
                        <CardHeader>
                          <CardTitle as='h4'>{routes[routeId].title}</CardTitle>
                          <CardDescription as='p' className={ styles.findingState }>
                            <Icon name={ review.stale ? 'TriangleAlert' : 'CircleCheck' } decorative />
                            {review.stale ? 'Needs review: an assumption changed' : 'Current'}
                          </CardDescription>
                          <CardAction>
                            <Button variant='subtle' size='sm' aria-current={ step === routeId ? 'step' : undefined } onClick={ () => open(routeId) }>Open step</Button>
                          </CardAction>
                        </CardHeader>
                        <CardContent className={ styles.findingBody }>
                          <p className={ styles.findingValue }>
                            <strong>{formatMoney(finding.value)}</strong>
                            {routes[routeId].whatIf && <span>what-if example</span>}
                          </p>
                          <p>{finding.summary}</p>
                          <dl className={ styles.under }>
                            {Object.entries(finding.assumptions).map(([ key, value ]) => (
                              <div key={ key }>
                                <dt>{assumptionLabels[key]}</dt>
                                <dd>{describeAssumption(key, value)}</dd>
                              </div>
                            ))}
                          </dl>
                          {review.stale && (
                            <div className={ styles.changed }>
                              <h5>What changed</h5>
                              <dl>
                                {review.changes.map((change) => (
                                  <div key={ change.key }>
                                    <dt>{change.label}</dt>
                                    <dd>
                                      <s>{describeAssumption(change.key, change.from)}</s>
                                      <Icon name='ArrowRight' decorative />
                                      <b>{describeAssumption(change.key, change.to)}</b>
                                    </dd>
                                  </div>
                                ))}
                                <div>
                                  <dt>Finding</dt>
                                  <dd>
                                    <s>{formatMoney(finding.value)}</s>
                                    <Icon name='ArrowRight' decorative />
                                    <b>{formatMoney(review.current.value)}</b>
                                    <em>({formatDelta(review.delta)})</em>
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          )}
                        </CardContent>
                        {review.stale && (
                          <CardFooter className={ styles.findingFooter }>
                            <Button tone='warning' size='sm' onClick={ () => recompute(routeId) }>
                              <Icon name='RefreshCw' decorative />
                              Recompute with current assumptions
                            </Button>
                          </CardFooter>
                        )}
                      </CardRoot>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </>
      )}

      <p className={ styles.status } role='status'>{notice}</p>
      <footer>
        <span>Fictional company and figures; nothing leaves this page.</span>
        <Button variant='ghost' tone='neutral' size='sm' onClick={ reset }>
          <Icon name='RotateCcw' decorative />
          Reset example
        </Button>
      </footer>
    </figure>
  );
};

export default GenerativeRoutingExplorer;
