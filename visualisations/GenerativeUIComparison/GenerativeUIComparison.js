'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import Button from '@gaudi/design-system/core/Button';
import Field, { FieldError, FieldLabel } from '@gaudi/design-system/core/Field';
import Icon from '@gaudi/design-system/core/Icon';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import Textarea from '@gaudi/design-system/core/Textarea';
import { Toggle, ToggleGroupItem, ToggleGroupRoot } from '@gaudi/design-system/core/ToggleGroup';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';
import { TableBodyPrimitive, TableCaption, TableCellPrimitive, TableHeadPrimitive, TableHeader, TableRoot, TableRowPrimitive } from '@gaudi/design-system/mdx/Table';

import {
  createResponse,
  describeScope,
  formatGap,
  formatMetric,
  getTextAnswer,
  metricLabels,
  months,
  parsePrompt,
  presets,
  regions,
  salesRecords,
  sortRows,
  viewLabels
} from './GenerativeUIComparison.data';
import { getRichItemCount, getStreamProgress, streamAnswer } from './GenerativeUIComparison.stream';
import { createWorkspace, submitQuery, toggleReview, updateScope } from './GenerativeUIComparison.workspace';

import styles from './GenerativeUIComparison.module.css';

const defaultQuery = parsePrompt(presets[0].prompt).query;

const StreamCursor = () => <span className={ styles.streamCursor } aria-hidden='true' />;

const TextResponse = ({ answer, wordCount, streaming }) => {
  const visible = streamAnswer(answer, wordCount);

  return (
    <section className={ styles.response } aria-label='Conventional chat response' aria-busy={ streaming }>
      <header className={ styles.responseHeader }>
        <strong>Conventional chat</strong>
        <span className={ streaming ? styles.streamStatus : undefined }>{streaming ? 'Writing the answer…' : 'A written answer'}</span>
      </header>
      <div className={ styles.textAnswer }>
        {!visible.introduction && <p className={ styles.streamPending }>Reading the question…</p>}
        {visible.introduction && <p>{visible.introduction}{visible.activePart === 0 && <StreamCursor />}</p>}
        {visible.lines.some(Boolean) && <ul>{visible.lines.map((line, index) => line && <li key={ index }>{line}{visible.activePart === index + 1 && <StreamCursor />}</li>)}</ul>}
        {visible.conclusion && <p>{visible.conclusion}{visible.activePart === answer.lines.length + 1 && <StreamCursor />}</p>}
      </div>
      {!streaming && <p className={ styles.textFooter }>To ask for a different cut, edit the question above and compare again.</p>}
    </section>
  );
};

const DataBars = ({ rows, metric, comparison = false, showTargets = false, highlightBelowTarget = false, visibleCount = rows.length, animate = false }) => {
  const maximum = Math.max(1, ...rows.flatMap((row) => showTargets ? [ row[metric], row.target ] : [ row[metric] ]));

  return (
    <div className={ styles.chart }>
      <ul className={ styles.bars } aria-label={ `${metricLabels[metric]} ${comparison ? 'by month' : 'by region'}` }>
        {rows.slice(0, visibleCount).map((row) => (
          <li className={ `${styles.barRow} ${animate ? styles.streamItem : ''}` } key={ row.id || row.month }>
            <div className={ styles.barLabel }>
              <strong>{comparison ? row.month : row.region}</strong>
              <span>{formatMetric(row[metric], metric)}</span>
            </div>
            <div className={ styles.barTrack } aria-hidden='true'>
              <span className={ styles.barFill } data-below={ highlightBelowTarget && showTargets && row.gap < 0 } style={{ width: `${row[metric] / maximum * 100}%` }} />
              {showTargets && <span className={ styles.targetLine } style={{ left: `${row.target / maximum * 100}%` }} />}
            </div>
            {showTargets && <span className={ styles.barContext }>Target {formatMetric(row.target)}; {formatGap(row.gap)}.</span>}
          </li>
        ))}
      </ul>
      <p className={ styles.chartNote }>{showTargets ? 'The vertical mark is the revenue target. All bars share one scale.' : 'All bars share one scale.'}</p>
    </div>
  );
};

const SortMark = ({ direction }) => <Icon name={ direction === 'ascending' ? 'ArrowUp' : 'ArrowDown' } size='xs' decorative />;

const Disclosure = ({ id, label, className, children }) => (
  <Collapsible id={ id } className={ className }>
    <CollapsibleTrigger asChild>
      <Button variant='ghost' tone='neutral' size='sm' className={ styles.disclosureTrigger }>
        <Icon name='ChevronRight' size='sm' decorative />
        {label}
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent>{children}</CollapsibleContent>
  </Collapsible>
);

const SortHeader = ({ column, label, sort, streaming, onSort }) => (
  <TableHeadPrimitive scope='col' variant='plain' aria-sort={ sort.key === column ? sort.direction : 'none' }>
    <Button variant='ghost' tone='neutral' size='xs' className={ styles.sortButton } disabled={ streaming } onClick={ () => onSort(column) }>
      {label}{sort.key === column && <SortMark direction={ sort.direction } />}
    </Button>
  </TableHeadPrimitive>
);

const DetailTable = ({ rows, metric, selectedId, onInspect, visibleCount = rows.length, streaming = false, animate = false }) => {
  const [ sort, setSort ] = useState({ key: metric, direction: 'descending' });
  const visible = sortRows(rows, sort.key, sort.direction);
  const changeSort = (key) => setSort({ key, direction: sort.key === key && sort.direction === 'descending' ? 'ascending' : 'descending' });

  return (
    <TableRoot density='compact' className={ styles.table } containerProps={{ 'aria-label': 'Regional data; select a region to inspect the source figures', 'className': styles.tableScroll }}>
      <TableCaption>Regional detail. Sort a column or inspect a region.</TableCaption>
      <TableHeader>
        <TableRowPrimitive>
          <SortHeader column='region' label='Region' sort={ sort } streaming={ streaming } onSort={ changeSort } />
          <SortHeader column={ metric } label={ metricLabels[metric] } sort={ sort } streaming={ streaming } onSort={ changeSort } />
          {metric === 'revenue' && <SortHeader column='gap' label='Gap' sort={ sort } streaming={ streaming } onSort={ changeSort } />}
        </TableRowPrimitive>
      </TableHeader>
      <TableBodyPrimitive>
        {visible.slice(0, visibleCount).map((row) => (
          <TableRowPrimitive key={ row.id } className={ animate ? styles.streamItem : undefined } data-selected={ selectedId === row.id }>
            <TableCellPrimitive as='th' scope='row'><Button variant='subtle' size='sm' className={ styles.textButton } disabled={ streaming } aria-expanded={ selectedId === row.id } onClick={ () => onInspect(selectedId === row.id ? null : row.id) }>{row.region}</Button></TableCellPrimitive>
            <TableCellPrimitive>{formatMetric(row[metric], metric)}</TableCellPrimitive>
            {metric === 'revenue' && <TableCellPrimitive data-negative={ row.gap < 0 }>{formatGap(row.gap)}</TableCellPrimitive>}
          </TableRowPrimitive>
        ))}
      </TableBodyPrimitive>
    </TableRoot>
  );
};

const MonthTable = ({ rows, metric, region, visibleCount, animate }) => (
  <TableRoot density='compact' className={ styles.table } containerProps={{ 'aria-label': 'April and May comparison figures', 'className': styles.tableScroll }}>
    <TableCaption>Both months / {region}. Same metric and region as the chart.</TableCaption>
    <TableHeader>
      <TableRowPrimitive>
        <TableHeadPrimitive scope='col' variant='plain'>Month</TableHeadPrimitive>
        <TableHeadPrimitive scope='col' variant='plain'>{metricLabels[metric]}</TableHeadPrimitive>
        {metric === 'revenue' && <TableHeadPrimitive scope='col' variant='plain'>Gap to target</TableHeadPrimitive>}
      </TableRowPrimitive>
    </TableHeader>
    <TableBodyPrimitive>
      {rows.slice(0, visibleCount).map((row) => (
        <TableRowPrimitive key={ row.month } className={ animate ? styles.streamItem : undefined }>
          <TableCellPrimitive as='th' scope='row'>{row.month}</TableCellPrimitive>
          <TableCellPrimitive>{formatMetric(row[metric], metric)}</TableCellPrimitive>
          {metric === 'revenue' && <TableCellPrimitive data-negative={ row.gap < 0 }>{formatGap(row.gap)}</TableCellPrimitive>}
        </TableRowPrimitive>
      ))}
    </TableBodyPrimitive>
  </TableRoot>
);

const RecordDetail = ({ row, onClose }) => (
  <section className={ styles.recordDetail } aria-label={ `${row.region} source figures` }>
    <div className={ styles.detailTitle }><strong>{row.region} / {row.month} 2026</strong><Button variant='subtle' size='sm' className={ styles.textButton } onClick={ onClose }>Close</Button></div>
    <dl className={ styles.facts }>
      <div><dt>Revenue</dt><dd>{formatMetric(row.revenue)}</dd></div>
      <div><dt>Revenue target</dt><dd>{formatMetric(row.target)}</dd></div>
      <div><dt>Orders</dt><dd>{formatMetric(row.orders, 'orders')}</dd></div>
      <div><dt>Visits</dt><dd>{formatMetric(row.visits, 'orders')}</dd></div>
      <div><dt>Conversion</dt><dd>{formatMetric(row.conversion, 'conversion')}</dd></div>
      <div><dt>Average order</dt><dd>{formatMetric(row.averageOrderValue)}</dd></div>
    </dl>
    <p className={ styles.small }>Conversion = orders / visits. Average order = revenue / orders. Source record: <code>{row.id}</code>.</p>
  </section>
);

const RichResponse = ({ workspace, onScopeChange, onInspect, onToggleReview, instanceId, visibleItems, streaming, animate }) => {
  const { query: initialQuery, scope: { month, region }, selectedId, agenda } = workspace;
  const [ actionMessage, setActionMessage ] = useState('');
  const query = { ...initialQuery, month, region };
  const response = createResponse(query);
  const selectedRow = response.rows.find((row) => row.id === selectedId);
  const changedLocally = month !== initialQuery.month || region !== initialQuery.region;
  const isReview = query.view === 'exceptions';
  const isComparison = query.view === 'comparison';
  const hasChart = [ 'overview', 'chart', 'comparison' ].includes(query.view);
  const chartRows = isComparison ? response.monthly : response.rows;
  const contentItems = Math.max(0, visibleItems - 2);
  const tableItems = Math.max(0, contentItems - (hasChart ? chartRows.length : 0));
  const itemClass = animate ? styles.streamItem : undefined;
  const toggleAgenda = (row) => {
    const exists = agenda.some((item) => item.id === row.id);
    onToggleReview(row);
    setActionMessage(`${row.region}, ${row.month}: ${exists ? 'removed from' : 'added to'} your local review agenda.`);
  };

  return (
    <section className={ styles.response } aria-label='Generative UI response' aria-busy={ streaming }>
      <header className={ `${styles.responseHeader} ${styles.richHeader}` }>
        <strong>Generative UI</strong>
        <span className={ streaming ? styles.streamStatus : undefined }>{streaming ? `Building ${viewLabels[query.view].toLowerCase()}…` : viewLabels[query.view]}</span>
      </header>
      <div className={ `${styles.richContent} ${styles.responseBody}` }>
        {visibleItems < 1 && <p className={ styles.streamPending }>Preparing the view…</p>}
        {visibleItems >= 1 && <div className={ itemClass }>
          <div className={ styles.filters }>
            {!isComparison && (
              <Field className={ styles.filter }>
                <FieldLabel htmlFor={ `${instanceId}-month` }>Month</FieldLabel>
                <NativeSelect id={ `${instanceId}-month` } className={ styles.select } disabled={ streaming } value={ month } onChange={ (event) => onScopeChange({ month: event.target.value }) }>
                  {months.map((item) => <NativeSelectOption key={ item }>{item}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            )}
            <Field className={ styles.filter }>
              <FieldLabel htmlFor={ `${instanceId}-region` }>Region</FieldLabel>
              <NativeSelect id={ `${instanceId}-region` } className={ styles.select } disabled={ streaming } value={ region } onChange={ (event) => onScopeChange({ region: event.target.value }) }>
                {[ 'All regions', ...regions ].map((item) => <NativeSelectOption key={ item }>{item}</NativeSelectOption>)}
              </NativeSelect>
            </Field>
          </div>
          <p className={ styles.localScope }>{streaming ? 'Controls become available as soon as the response is complete.' : changedLocally ? 'You changed this view. The chat answer keeps the original question’s scope.' : `Try choosing ${region === 'Germany' ? 'All regions' : 'Germany'}: the view updates without another message.`}</p>
        </div>}

        {visibleItems >= 2 && <div className={ itemClass }>
          <div className={ styles.viewHeading } aria-live={ streaming ? 'off' : 'polite' }>
            <strong>{isReview ? `${response.exceptions.length} ${response.exceptions.length === 1 ? 'exception' : 'exceptions'} to review` : isComparison ? `${metricLabels[query.metric]} across two months` : `${metricLabels[query.metric]}: ${formatMetric(response.totals[query.metric], query.metric)}`}</strong>
            <span>{isComparison ? 'April–May' : month} 2026 / {region}</span>
          </div>
          {isComparison && <p className={ styles.targetSummary }>{getTextAnswer(response).introduction}</p>}
          {query.metric === 'revenue' && !isReview && !isComparison && <p className={ styles.targetSummary }>{formatGap(response.totals.gap)} against the {formatMetric(response.totals.target)} revenue target.</p>}
        </div>}

        {hasChart && contentItems > 0 && <DataBars rows={ chartRows } metric={ query.metric } comparison={ isComparison } showTargets={ query.metric === 'revenue' } highlightBelowTarget={ query.highlightBelowTarget } visibleCount={ contentItems } animate={ animate } />}

        {isReview && contentItems > 0 && (
          <div className={ styles.review }>
            {response.exceptions.length ? response.exceptions.slice(0, contentItems).map((row) => (
              <div className={ `${styles.exception} ${itemClass || ''}` } key={ row.id }>
                <div className={ styles.exceptionHeading }><strong>{row.region}</strong><span>{formatMetric(-row.gap)} below target</span></div>
                <p>{formatMetric(row.revenue)} of {formatMetric(row.target)}. Shortfall: {Math.abs(row.gapPercent).toFixed(1)}%.</p>
                <div className={ styles.exceptionActions }>
                  <Button variant='subtle' size='sm' className={ styles.textButton } disabled={ streaming } aria-expanded={ selectedId === row.id } onClick={ () => onInspect(selectedId === row.id ? null : row.id) }>Inspect figures</Button>
                  <Toggle variant='outline' size='sm' disabled={ streaming } pressed={ agenda.some((item) => item.id === row.id) } onPressedChange={ () => toggleAgenda(row) }>{agenda.some((item) => item.id === row.id) ? 'Remove from review' : 'Add to review'}</Toggle>
                </div>
              </div>
            )) : <p className={ `${styles.empty} ${itemClass || ''}` }>No regions are below revenue target in this scope. Choose another month or region to explore.</p>}
            {!streaming && <p className={ styles.small }>Ranked by revenue shortfall. The figures identify what to review, not why it happened.</p>}
          </div>
        )}

        {query.view === 'summary' && contentItems > 0 && <div className={ `${styles.summary} ${itemClass || ''}` }><p>{getTextAnswer(response).conclusion}</p>{contentItems >= 2 && <Disclosure label='Inspect regional figures'><DetailTable rows={ response.rows } metric={ query.metric } selectedId={ selectedId } onInspect={ onInspect } streaming={ streaming } /></Disclosure>}</div>}
        {isComparison && tableItems > 0 && <MonthTable rows={ response.monthly } region={ region } metric={ query.metric } visibleCount={ tableItems } animate={ animate } />}
        {[ 'overview', 'table' ].includes(query.view) && tableItems > 0 && <DetailTable rows={ response.rows } metric={ query.metric } selectedId={ selectedId } onInspect={ onInspect } visibleCount={ tableItems } streaming={ streaming } animate={ animate } />}
        {selectedRow && <RecordDetail row={ selectedRow } onClose={ () => onInspect(null) } />}
        {agenda.length > 0 && <section className={ styles.agenda } aria-label='Saved review agenda'><strong>Saved for review</strong><p className={ styles.small }>Revenue exceptions you kept. These stay when you change the view or ask another question.</p><ul>{agenda.map((row) => <li key={ row.id }><span>{row.region} / {row.month} 2026 · {formatMetric(-row.gap)} below target</span><Button variant='subtle' size='sm' className={ styles.textButton } aria-label={ `Remove ${row.region}, ${row.month} from the review agenda` } onClick={ () => toggleAgenda(row) }>Remove</Button></li>)}</ul></section>}
        <p className={ styles.actionMessage } role='status'>{actionMessage}</p>
        {!streaming && <p className={ styles.richFooter }>Your next question keeps these filters unless you name a different month or region. Saved review items stay until you remove them or reset the demo; reloading clears them.</p>}
      </div>
    </section>
  );
};

const ResponsePair = ({ workspace, onScopeChange, onInspect, onToggleReview, instanceId, animate }) => {
  const { query } = workspace;
  const response = useMemo(() => createResponse(query), [ query ]);
  const answer = useMemo(() => getTextAnswer(response), [ response ]);
  const reduceMotion = usePrefersReducedMotion();
  const timer = useRef(null);
  const statusRef = useRef(null);
  const [ elapsed, setElapsed ] = useState(animate ? 0 : Infinity);
  const effectiveElapsed = reduceMotion ? Infinity : elapsed;
  const progress = getStreamProgress(effectiveElapsed, answer, getRichItemCount(response));
  const streaming = effectiveElapsed < progress.duration;

  useEffect(() => {
    if (!animate || reduceMotion) return undefined;
    const start = performance.now();
    timer.current = setInterval(() => {
      const next = performance.now() - start;
      if (next >= progress.duration) {
        clearInterval(timer.current);
        setElapsed(Infinity);
      } else setElapsed(next);
    }, 40);
    return () => clearInterval(timer.current);
  }, [ animate, reduceMotion, progress.duration ]);

  const finish = () => {
    clearInterval(timer.current);
    setElapsed(Infinity);
    statusRef.current?.focus();
  };

  return (
    <>
      <div className={ styles.streamActions }>
        <p ref={ statusRef } tabIndex={ -1 } role='status'>{streaming ? 'Responding to your question…' : 'Both responses are ready.'}</p>
        {streaming && <Button variant='subtle' size='sm' className={ styles.textButton } onClick={ finish }>Show full responses</Button>}
      </div>
      <div className={ styles.comparison } data-streaming={ streaming }>
        <TextResponse answer={ answer } wordCount={ progress.words } streaming={ streaming } />
        <RichResponse workspace={ workspace } onScopeChange={ onScopeChange } onInspect={ onInspect } onToggleReview={ onToggleReview } instanceId={ instanceId } visibleItems={ progress.items } streaming={ streaming } animate={ animate && !reduceMotion } />
      </div>
    </>
  );
};

const GenerativeUIComparison = ({
  id,
  title = 'One question. Two ways to work with the answer.',
  description = 'Try changing Region to Germany on the right. The view updates while the written answer stays put.',
  className = ''
}) => {
  const generatedId = useId();
  const instanceId = id || generatedId;
  const [ draft, setDraft ] = useState(presets[0].prompt);
  const [ workspace, setWorkspace ] = useState(() => createWorkspace(defaultQuery));
  const { query } = workspace;
  const [ submission, setSubmission ] = useState(0);
  const [ animateResponses, setAnimateResponses ] = useState(false);
  const [ error, setError ] = useState('');
  const [ announcement, setAnnouncement ] = useState('');
  const draftChanged = draft.trim() !== query.prompt;

  const compare = (event) => {
    event.preventDefault();
    const result = parsePrompt(draft, workspace.scope);

    if (!result.ok) {
      setError(result.message);
      setAnnouncement('');
      return;
    }

    setWorkspace((current) => submitQuery(current, result.query));
    setAnimateResponses(true);
    setSubmission((current) => current + 1);
    setError('');
    setAnnouncement(`Question submitted. ${describeScope(result.query)}.`);
  };

  const reset = () => {
    setDraft(presets[0].prompt);
    setWorkspace(createWorkspace(defaultQuery));
    setAnimateResponses(false);
    setSubmission((current) => current + 1);
    setError('');
    setAnnouncement('Both responses, filters, and saved review items reset to the original regional revenue example.');
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }><strong>{title}</strong><span>{description}</span></figcaption>
      <p className={ styles.disclosure }>Simulated streaming using six fictional sales records. Text and UI use the same calculations; no live model is connected.</p>

      <form className={ styles.promptForm } onSubmit={ compare }>
        <Field>
          <FieldLabel htmlFor={ `${instanceId}-prompt` }>What would you like to see?</FieldLabel>
          <Textarea id={ `${instanceId}-prompt` } className={ styles.prompt } rows={ 2 } maxLength={ 500 } value={ draft } aria-describedby={ `${instanceId}-help` } onChange={ (event) => { setDraft(event.target.value); setError(''); } } />
          <FieldError id={ `${instanceId}-error` } className={ styles.error }>{error && `${error} The current responses are unchanged.`}</FieldError>
        </Field>
        <ToggleGroupRoot
          type='single'
          variant='outline'
          size='sm'
          spacing={ 1.5 }
          className={ styles.presets }
          aria-label='Example questions; selecting one fills the prompt field'
          value={ presets.find((preset) => preset.prompt === draft)?.label || '' }
          onValueChange={ (value) => {
            const preset = value && presets.find((item) => item.label === value);
            if (!preset) return;
            setDraft(preset.prompt);
            setError('');
            setAnnouncement('Example loaded. Choose Compare responses to apply it.');
          } }
        >
          {presets.map((preset) => <ToggleGroupItem key={ preset.label } value={ preset.label }>{preset.label}</ToggleGroupItem>)}
        </ToggleGroupRoot>
        <div className={ styles.submitRow }><Button type='submit'>Compare responses</Button><span>{draftChanged ? 'Draft ready. Submit to update both sides.' : 'Both sides use the submitted question.'}</span></div>
        <Disclosure id={ `${instanceId}-help` } className={ styles.help } label='Supported questions and sample data'>
          <p>Ask about one metric: revenue, orders, or conversion. Use UK, Germany, France, or all regions; April or May 2026. Ask for a chart, table, summary, month comparison, or revenue exceptions. Your first view uses all regions in May. Later questions keep the current filters unless you name a different month or region. The submitted scope below shows what both responses use. This demo matches those words to predefined views.</p>
          <p>Examples: “Show orders by region in April”, “Give me a revenue table for France”, “Summarize conversion in May”. Revenue targets apply only to revenue; conversion is orders / visits. All amounts use GBP.</p>
          <TableRoot density='compact' className={ styles.table } containerProps={{ 'aria-label': 'Six fictional source records', 'className': styles.tableScroll }}>
            <TableCaption>Shared source data / 2026</TableCaption>
            <TableHeader>
              <TableRowPrimitive>{[ 'Region', 'Month', 'Revenue', 'Target', 'Orders', 'Visits' ].map((heading) => <TableHeadPrimitive scope='col' variant='plain' key={ heading }>{heading}</TableHeadPrimitive>)}</TableRowPrimitive>
            </TableHeader>
            <TableBodyPrimitive>
              {salesRecords.map((row) => (
                <TableRowPrimitive key={ row.id }>
                  <TableCellPrimitive as='th' scope='row'>{row.region}</TableCellPrimitive>
                  <TableCellPrimitive>{row.month}</TableCellPrimitive>
                  <TableCellPrimitive>{formatMetric(row.revenue)}</TableCellPrimitive>
                  <TableCellPrimitive>{formatMetric(row.target)}</TableCellPrimitive>
                  <TableCellPrimitive>{formatMetric(row.orders, 'orders')}</TableCellPrimitive>
                  <TableCellPrimitive>{formatMetric(row.visits, 'orders')}</TableCellPrimitive>
                </TableRowPrimitive>
              ))}
            </TableBodyPrimitive>
          </TableRoot>
        </Disclosure>
      </form>

      <p className={ styles.announcement } role='status'>{announcement}</p>
      <div className={ styles.submitted }><span>Submitted question</span><q>{query.prompt}</q><p>{describeScope(query)}</p></div>
      <ResponsePair key={ submission } workspace={ workspace } onScopeChange={ (change) => setWorkspace((current) => updateScope(current, change)) } onInspect={ (selectedId) => setWorkspace((current) => ({ ...current, selectedId })) } onToggleReview={ (row) => setWorkspace((current) => toggleReview(current, row)) } instanceId={ instanceId } animate={ animateResponses } />
      <div className={ styles.footer }><span>Same prompt and source figures. Different response formats.</span><Button variant='subtle' size='sm' className={ styles.textButton } onClick={ reset }>Reset comparison</Button></div>
    </figure>
  );
};

export default GenerativeUIComparison;
