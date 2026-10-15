'use client';

import { useId, useRef, useState } from 'react';

import Button from '@gaudi/design-system/core/Button';
import Field, { FieldDescription, FieldError, FieldLabel } from '@gaudi/design-system/core/Field';
import Icon from '@gaudi/design-system/core/Icon';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import Textarea from '@gaudi/design-system/core/Textarea';
import { Toggle, ToggleGroupItem, ToggleGroupRoot } from '@gaudi/design-system/core/ToggleGroup';
import { TableBodyPrimitive, TableCaption, TableCellPrimitive, TableHeadPrimitive, TableHeader, TableRoot, TableRowPrimitive } from '@gaudi/design-system/mdx/Table';

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
  <TableRoot density='compact' className={ styles.table } containerProps={{ 'aria-label': 'Revenue table' }}>
    <TableCaption className={ styles.visuallyHidden }>Fictional May 2026 revenue and targets, in pounds</TableCaption>
    <TableHeader>
      <TableRowPrimitive>
        <TableHeadPrimitive scope='col' variant='plain'>Market</TableHeadPrimitive>
        <TableHeadPrimitive scope='col' variant='plain' className={ styles.numeric }>Revenue</TableHeadPrimitive>
        <TableHeadPrimitive scope='col' variant='plain' className={ styles.numeric }>Target</TableHeadPrimitive>
      </TableRowPrimitive>
    </TableHeader>
    <TableBodyPrimitive>
      {revenueRows.map((row) => (
        <TableRowPrimitive key={ row.id }>
          <TableCellPrimitive as='th' scope='row' className={ styles.rowHeader }>{row.market}</TableCellPrimitive>
          <TableCellPrimitive className={ styles.numeric }>{formatMoney(row.revenue)}</TableCellPrimitive>
          <TableCellPrimitive className={ styles.numeric }>{formatMoney(row.target)}</TableCellPrimitive>
        </TableRowPrimitive>
      ))}
    </TableBodyPrimitive>
  </TableRoot>
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

      <ToggleGroupRoot
        type='single'
        variant='outline'
        spacing={ 2 }
        className={ styles.modes }
        aria-label='Choose how to compose the report'
        value={ mode }
        onValueChange={ (value) => value && changeMode(value) }
      >
        <ToggleGroupItem value='manual' aria-controls={ viewId }>Arrange it myself</ToggleGroupItem>
        <ToggleGroupItem value='describe' aria-controls={ viewId }>Describe what I need</ToggleGroupItem>
      </ToggleGroupRoot>

      <div className={ styles.controls }>
        {mode === 'manual' ? (
          <div>
            <p className={ styles.instruction }>Use “Move Notes up” to change the layout. Add other blocks when you want to explore further.</p>
            <div className={ styles.palette } role='group' aria-label='Available report blocks'>
              {blockCatalog.map((block) => (
                <Toggle
                  variant='outline'
                  key={ block.id }
                  ref={ (element) => { paletteButtons.current[block.id] = element; } }
                  pressed={ composition.includes(block.id) }
                  onPressedChange={ () => changeBlock(block) }
                >
                  <Icon name={ composition.includes(block.id) ? 'Check' : 'Plus' } size='sm' decorative />
                  {block.name}
                </Toggle>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={ compose } noValidate>
            <Field className={ styles.field }>
              <FieldLabel htmlFor={ `${instanceId}-example` }>Start with an example</FieldLabel>
              <NativeSelect id={ `${instanceId}-example` } className={ styles.select } value={ promptExamples.includes(prompt) ? prompt : '' } onChange={ (event) => { setPrompt(event.target.value); setError(''); setFeedback(''); } }>
                <NativeSelectOption value='' disabled>Custom arrangement</NativeSelectOption>
                {promptExamples.map((example) => <NativeSelectOption value={ example } key={ example }>{example}</NativeSelectOption>)}
              </NativeSelect>
            </Field>
            <Field className={ styles.field }>
              <FieldLabel>Describe your view</FieldLabel>
              <Textarea
                rows={ 2 }
                maxLength={ 240 }
                value={ prompt }
                onChange={ (event) => { setPrompt(event.target.value); setError(''); setFeedback(''); } }
              />
              <FieldDescription id={ helperId }>Use Summary, Chart, Table and Notes. Names are read left to right; repeats appear once. Join them with “and” or “then”, as in the examples.</FieldDescription>
              <FieldError id={ errorId }>{error}</FieldError>
            </Field>
            <Button className={ styles.composeButton } type='submit'>Compose my view</Button>
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
                    <Button variant='ghost' tone='neutral' size='icon' aria-label={ `Move ${block.name} up` } title={ `Move ${block.name} up` } disabled={ index === 0 } onClick={ () => reorderBlock(block, -1) }><Icon name='ArrowUp' size='sm' decorative /></Button>
                    <Button variant='ghost' tone='neutral' size='icon' aria-label={ `Move ${block.name} down` } title={ `Move ${block.name} down` } disabled={ index === composition.length - 1 } onClick={ () => reorderBlock(block, 1) }><Icon name='ArrowDown' size='sm' decorative /></Button>
                    <Button variant='ghost' tone='neutral' size='icon' aria-label={ `Remove ${block.name}` } title={ `Remove ${block.name}` } onClick={ () => changeBlock(block) }><Icon name='X' size='sm' decorative /></Button>
                  </div>
                )}
              </div>
              {block.name === 'Summary' && <p className={ styles.summary }><strong>{formatMoney(totals.revenue)} in revenue</strong> across three markets. That is {formatMoney(totals.target - totals.revenue)} below the {formatMoney(totals.target)} May target. Germany has the largest shortfall.</p>}
              {block.name === 'Chart' && <RevenueChart />}
              {block.name === 'Table' && <RevenueTable />}
              {block.name === 'Notes' && (
                <Field className={ styles.notes }>
                  <FieldLabel>Your sales review notes</FieldLabel>
                  <Textarea rows={ 3 } value={ notes } onChange={ (event) => setNotes(event.target.value) } />
                  <FieldDescription>Kept when you rearrange, remove or re-add this block.</FieldDescription>
                </Field>
              )}
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
