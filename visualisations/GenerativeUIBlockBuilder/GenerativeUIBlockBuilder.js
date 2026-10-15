'use client';

import { useId, useRef, useState } from 'react';

import {
  blockCatalog,
  composeView,
  formatMoney,
  getRevenueTotals,
  initialComposition,
  initialNotes,
  moveBlock,
  promptExamples,
  revenueRows,
  toggleBlock
} from './GenerativeUIBlockBuilder.data';

import styles from './GenerativeUIBlockBuilder.module.css';

const ArrowIcon = ({ down = false }) => (
  <svg viewBox='0 0 20 20' aria-hidden='true' focusable='false'>
    <path d={ down ? 'M10 4v12m-5-5 5 5 5-5' : 'M10 16V4m-5 5 5-5 5 5' } />
  </svg>
);

const RevenueChart = () => {
  const maximum = Math.max(...revenueRows.flatMap((row) => [ row.revenue, row.target ]));

  return (
    <div>
      <ul className={ styles.bars } aria-label='May revenue compared with target, in pounds'>
        {revenueRows.map((row) => (
          <li key={ row.id }>
            <div className={ styles.barLabel }><strong>{row.market}</strong><span>{formatMoney(row.revenue)} <span className={ styles.targetText }>/ {formatMoney(row.target)} target</span></span></div>
            <div className={ styles.track } aria-hidden='true'>
              <span className={ styles.fill } style={{ width: `${row.revenue / maximum * 100}%` }} />
              <span className={ styles.target } style={{ left: `${row.target / maximum * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className={ styles.chartKey }>Filled bar: revenue. Vertical line: target.</p>
    </div>
  );
};

const RevenueTable = () => (
  <table className={ styles.table }>
    <caption className={ styles.visuallyHidden }>Fictional May 2026 revenue and targets, in pounds</caption>
    <thead><tr><th scope='col'>Market</th><th scope='col'>Revenue</th><th scope='col'>Target</th></tr></thead>
    <tbody>
      {revenueRows.map((row) => <tr key={ row.id }><th scope='row'>{row.market}</th><td>{formatMoney(row.revenue)}</td><td>{formatMoney(row.target)}</td></tr>)}
    </tbody>
  </table>
);

const GenerativeUIBlockBuilder = ({
  id,
  title = 'The blocks stay. The effort changes.',
  className = ''
}) => {
  const generatedId = useId();
  const instanceId = id || generatedId;
  const [ mode, setMode ] = useState('manual');
  const [ composition, setComposition ] = useState(() => [ ...initialComposition ]);
  const [ notes, setNotes ] = useState(initialNotes);
  const [ prompt, setPrompt ] = useState(promptExamples[0]);
  const [ feedback, setFeedback ] = useState('');
  const [ error, setError ] = useState('');
  const paletteButtons = useRef({});
  const totals = getRevenueTotals();
  const viewId = `${instanceId}-view`;
  const helperId = `${instanceId}-help`;
  const errorId = `${instanceId}-error`;
  const notesId = `${instanceId}-notes`;

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setFeedback('');
  };

  const changeBlock = (block) => {
    const removing = composition.includes(block.id);
    setComposition((current) => toggleBlock(current, block.id));
    if (removing) paletteButtons.current[block.id]?.focus();
    setFeedback(`${block.name} ${removing ? 'removed from' : 'added to'} the view. Notes are kept.`);
  };

  const reorderBlock = (block, direction) => {
    setComposition((current) => moveBlock(current, block.id, direction));
    setFeedback(`${block.name} moved ${direction === -1 ? 'up' : 'down'}.`);
  };

  const compose = (event) => {
    event.preventDefault();
    const result = composeView(prompt, composition);
    if (!result.ok) {
      setError(result.message);
      setFeedback('');
      return;
    }
    setComposition(result.composition);
    setError('');
    setFeedback(result.message);
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span>Try it: edit the note, then move Notes above Summary. Your words stay with the block.</span>
      </figcaption>

      <div className={ styles.modes } role='group' aria-label='Choose how to compose the report'>
        <button type='button' aria-pressed={ mode === 'manual' } aria-controls={ viewId } onClick={ () => changeMode('manual') }>Arrange it myself</button>
        <button type='button' aria-pressed={ mode === 'describe' } aria-controls={ viewId } onClick={ () => changeMode('describe') }>Describe what I need</button>
      </div>

      <div className={ styles.controls }>
        {mode === 'manual' ? (
          <div>
            <p className={ styles.instruction }>Use “Move Notes up” to change the layout. Add other blocks when you want to explore further.</p>
            <div className={ styles.palette } role='group' aria-label='Available report blocks'>
              {blockCatalog.map((block) => (
                <button type='button' key={ block.id } ref={ (element) => { paletteButtons.current[block.id] = element; } } aria-pressed={ composition.includes(block.id) } onClick={ () => changeBlock(block) }>
                  <svg viewBox='0 0 16 16' aria-hidden='true' focusable='false'><path d={ composition.includes(block.id) ? 'm3 8 3 3 7-7' : 'M8 3v10M3 8h10' } /></svg>
                  {block.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={ compose } noValidate>
            <label className={ styles.label } htmlFor={ `${instanceId}-example` }>Start with an example</label>
            <select id={ `${instanceId}-example` } value={ promptExamples.includes(prompt) ? prompt : '' } onChange={ (event) => { setPrompt(event.target.value); setError(''); setFeedback(''); } }>
              <option value='' disabled>Custom arrangement</option>
              {promptExamples.map((example) => <option value={ example } key={ example }>{example}</option>)}
            </select>
            <label className={ styles.promptLabel } htmlFor={ `${instanceId}-prompt` }>Describe your view</label>
            <textarea
              id={ `${instanceId}-prompt` }
              rows={ 2 }
              maxLength={ 240 }
              value={ prompt }
              aria-describedby={ `${helperId}${error ? ` ${errorId}` : ''}` }
              aria-invalid={ !!error }
              onChange={ (event) => { setPrompt(event.target.value); setError(''); setFeedback(''); } }
            />
            <p id={ helperId } className={ styles.helper }>Use Summary, Chart, Table and Notes. Names are read left to right; repeats appear once. Join them with “and” or “then”, as in the examples.</p>
            <button className={ styles.composeButton } type='submit'>Compose my view</button>
            {error && <p id={ errorId } className={ styles.error } role='alert'>{error}</p>}
          </form>
        )}
      </div>

      <section id={ viewId } className={ styles.report } aria-labelledby={ `${instanceId}-report-title` }>
        <div className={ styles.reportHeader }>
          <h4 id={ `${instanceId}-report-title` }>May 2026 sales report</h4>
          <span>{composition.length} {composition.length === 1 ? 'block' : 'blocks'}</span>
        </div>

        {!composition.length && <p className={ styles.empty }>Your report is empty. Add a block above, or describe a new arrangement. Your notes are still here when you add Notes again.</p>}

        {composition.map((blockId, index) => {
          const block = blockCatalog.find((item) => item.id === blockId);

          return (
            <section className={ styles.block } key={ block.id } aria-labelledby={ `${instanceId}-${block.id}-title` }>
              <div className={ styles.blockHeader }>
                <h5 id={ `${instanceId}-${block.id}-title` }><span className={ styles.position }>{index + 1}</span>{block.name}</h5>
                {mode === 'manual' && (
                  <div className={ styles.blockActions } role='group' aria-label={ `Arrange ${block.name}` }>
                    <button type='button' aria-label={ `Move ${block.name} up` } title={ `Move ${block.name} up` } disabled={ index === 0 } onClick={ () => reorderBlock(block, -1) }><ArrowIcon /></button>
                    <button type='button' aria-label={ `Move ${block.name} down` } title={ `Move ${block.name} down` } disabled={ index === composition.length - 1 } onClick={ () => reorderBlock(block, 1) }><ArrowIcon down /></button>
                    <button type='button' aria-label={ `Remove ${block.name}` } title={ `Remove ${block.name}` } onClick={ () => changeBlock(block) }>
                      <svg viewBox='0 0 20 20' aria-hidden='true' focusable='false'><path d='m5 5 10 10M15 5 5 15' /></svg>
                    </button>
                  </div>
                )}
              </div>
              {block.name === 'Summary' && <p className={ styles.summary }><strong>{formatMoney(totals.revenue)} in revenue</strong> across three markets. That is {formatMoney(totals.target - totals.revenue)} below the {formatMoney(totals.target)} May target. Germany has the largest shortfall.</p>}
              {block.name === 'Chart' && <RevenueChart />}
              {block.name === 'Table' && <RevenueTable />}
              {block.name === 'Notes' && <div className={ styles.notes }><label htmlFor={ notesId }>Your sales review notes</label><textarea id={ notesId } rows={ 3 } value={ notes } onChange={ (event) => setNotes(event.target.value) } /><p>Kept when you rearrange, remove or re-add this block.</p></div>}
            </section>
          );
        })}
      </section>

      <p className={ styles.feedback } role='status' aria-live='polite'>{feedback || (mode === 'manual' ? 'You choose each piece and its position.' : 'One description arranges the same pieces. You can still switch back and adjust them.')}</p>
      <p className={ styles.simulation }>Local simulation with fictional GBP figures. A small text parser arranges the blocks; no AI or network is connected. Changes last while this page stays open.</p>
    </figure>
  );
};

export default GenerativeUIBlockBuilder;
