'use client';

/**
 * THESIS: Explain gaudiBar as a nested desktop compositor, not a diagram of coloured boxes.
 * OWN-WORLD: A dark macOS desktop field, translucent edge bars, and a precise region inspector.
 * STORY: Select a region, see its widgets share space, and understand the four-level layout hierarchy;
 *        the line in `lib/configs.js` that fills that region lights up beneath the scene.
 * FIRST VIEWPORT: Top and bottom primary bars frame a selected-region inspector inside one desktop canvas.
 * FORM: Interactive desktop anatomy; an extension of Gaudi's editorial diagram catalogue.
 */

import { useId, useMemo, useState } from 'react';
import { Sparkline } from '@gaudi/design-system/charts/Sparkline';
import Button from '@gaudi/design-system/core/Button';
import { CodeBlock, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle, toPlainLines } from '@gaudi/design-system/core/CodeBlock';
import Icon from '@gaudi/design-system/core/Icon';

import { configRegionsById, configSource, pluginNotes, regionLineNumbers } from './GaudiBarLayout.config';
import { gaudiBarRegions, gaudiBarRegionsById } from './GaudiBarLayout.data';

import styles from './GaudiBarLayout.module.css';

/*
 * The code block receives prepared lines instead of a `highlightedLines` spec. A spec change makes the design
 * system re-tokenise the source asynchronously and show plain text until the new tokens arrive, so every
 * selection would flash. Plain lines with a `highlighted` state render synchronously and keep shiki out of this chunk.
 */
const codeLines = toPlainLines(configSource);
const lineNumbersByRegion = regionLineNumbers();

const accessibleRegion = (region) => {
  const widgets = region.widgets.map((widget) => `${widget.label}: ${widget.value}`).join(', ');

  return `${region.bar} primary bar, ${region.label}. ${region.description} ${widgets ? `Widgets: ${widgets}.` : 'No widgets assigned.'}`;
};

const WidgetPreview = ({ widget }) => (
  <span className={ styles.widget } data-tone={ widget.tone || 'neutral' }>
    <span className={ styles.widgetIcon } aria-hidden='true'>
      <Icon name={ widget.icon } decorative />
    </span>
    <span className={ styles.widgetCopy }>
      <span>{widget.label}</span>
      <strong>{widget.value}</strong>
    </span>

    {widget.apps && (
      <span className={ styles.appStack } aria-hidden='true'>
        {widget.apps.map((icon, index) => <Icon name={ icon } decorative key={ `${icon}-${index}` } />)}
      </span>
    )}

    {widget.status && <span className={ styles.statusDot } aria-hidden='true' />}

    {Number.isFinite(widget.meter) && (
      <span className={ styles.meter } aria-hidden='true'>
        <span style={{ '--meter-value': `${widget.meter}%` }} />
      </span>
    )}

    {widget.trend && (

      // The value beside it carries the meaning, so the trend stays a decorative glyph outside the tab order.
      <span className={ styles.sparkline } aria-hidden='true' inert>
        <Sparkline data={ widget.trend } color='currentColor' height={ 16 } showEndpoint={ false } />
      </span>
    )}
  </span>
);

const RegionButton = ({ active, readoutId, region, onSelect }) => {
  const empty = region.widgets.length === 0;

  return (
    <Button
      variant='ghost'
      tone='neutral'
      radius='lg'
      className={ styles.region }
      data-active={ active }
      data-empty={ empty }
      aria-controls={ readoutId }
      aria-pressed={ active }
      aria-label={ empty ? `${region.bar} bar, ${region.label}. Empty region.` : `${region.bar} bar, ${region.label}. ${region.widgets.length} widgets.` }
      onClick={ onSelect }
      onFocus={ onSelect }
      onMouseEnter={ onSelect }
    >
      <span className={ styles.regionLabel }>{region.label.replace(' region', '')}</span>
      <span className={ styles.regionPreview } aria-hidden='true'>
        {region.widgets.map((widget) => (
          <span className={ styles.previewWidget } key={ widget.label }>
            <Icon name={ widget.icon } decorative />
          </span>
        ))}
      </span>
    </Button>
  );
};

const PrimaryBar = ({ activeRegionId, bar, readoutId, onSelect }) => {
  const regions = gaudiBarRegions.filter((region) => region.bar === bar);

  return (
    <section className={ styles.primaryBar } data-bar={ bar } aria-label={ `${bar} primary bar` }>
      <span className={ styles.primaryLabel }>{bar} primary bar</span>
      <div className={ styles.regionGrid }>
        {regions.map((region) => (
          <RegionButton
            active={ activeRegionId === region.id }
            key={ region.id }
            readoutId={ readoutId }
            region={ region }
            onSelect={ () => onSelect(region.id) }
          />
        ))}
      </div>
    </section>
  );
};

/**
 * @param {Object} props
 * @param {string} [props.title] - Visible diagram title.
 * @param {string} [props.description] - Concise explanation of the layout system.
 * @param {string} [props.className] - Additional root figure class.
 * @returns {JSX.Element}
 */
const GaudiBarLayout = ({
  title = 'How gaudiBar composes the desktop',
  description = 'Choose any region to inspect how primary bars, secondary regions, and flexible widgets nest together.',
  className = ''
}) => {
  const readoutId = useId();
  const [ activeRegionId, setActiveRegionId ] = useState('top-left');
  const activeRegion = gaudiBarRegionsById[activeRegionId];

  // Scene ids (`top-left`, ...) are the config helper's region keys, so the selection drives the highlight directly.
  const configRegion = configRegionsById[activeRegionId];
  const highlighted = lineNumbersByRegion[activeRegionId];

  const lines = useMemo(() => codeLines.map((line) => {
    return { ...line, 'state': { 'highlighted': highlighted.includes(line.number) } };
  }), [ highlighted ]);

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <ol className={ styles.accessibleLayout }>
        {gaudiBarRegions.map((region) => <li key={ region.id }>{accessibleRegion(region)}</li>)}
      </ol>

      <div className={ styles.scrollFrame } role='group' aria-label='gaudiBar layout diagram'>
        <div className={ styles.canvas }>
          <div className={ styles.desktop }>
            <div className={ styles.desktopChrome } aria-hidden='true'>
              <span />
              <span />
              <span />
              <strong>gaudiBar · desktop overlay</strong>
            </div>

            <div className={ styles.desktopBody }>
              <PrimaryBar
                activeRegionId={ activeRegionId }
                bar='top'
                readoutId={ readoutId }
                onSelect={ setActiveRegionId }
              />

              <div className={ styles.desktopCenter }>
                <div className={ styles.wallpaperCopy } aria-hidden='true'>
                  <strong>Desktop canvas</strong>
                  <span>One responsive overlay. No absolute widget positioning.</span>
                </div>

                <div id={ readoutId } className={ styles.inspector } aria-live='polite'>
                  <div className={ styles.inspectorContent }>
                    <div className={ styles.inspectorHeader }>
                      <span className={ styles.location }>
                        <Icon name='Panels' decorative />
                        <strong>{activeRegion.bar} bar · {activeRegion.label}</strong>
                      </span>
                      <span className={ styles.slotCount }>{activeRegion.widgets.length} modules · flex</span>
                    </div>

                    <div
                      className={ styles.widgetRack }
                      data-layout={ activeRegion.layout || 'metrics' }
                      aria-label={ `Widgets in the ${activeRegion.bar} ${activeRegion.label.toLowerCase()}` }
                    >
                      {activeRegion.widgets.map((widget) => <WidgetPreview key={ widget.label } widget={ widget } />)}
                    </div>

                    <p className={ styles.inspectorDescription }>{activeRegion.description}</p>
                  </div>
                </div>
              </div>

              <PrimaryBar
                activeRegionId={ activeRegionId }
                bar='bottom'
                readoutId={ readoutId }
                onSelect={ setActiveRegionId }
              />
            </div>
          </div>

          <div className={ styles.hierarchy } aria-label='Selected layout hierarchy' aria-live='polite'>
            <span>Desktop</span>
            <Icon name='ChevronRight' decorative />
            <span>{activeRegion.bar} primary bar</span>
            <Icon name='ChevronRight' decorative />
            <span>{activeRegion.label}</span>
            <Icon name='ChevronRight' decorative />
            <strong>{activeRegion.widgets.length} flexible widgets</strong>
          </div>
        </div>
      </div>

      <div className={ styles.config }>
        <p id={ `${readoutId}-config` } className={ styles.configLabel }>
          The line in <code>lib/configs.js</code> that fills the selected region
        </p>

        <CodeBlock
          code={ configSource }
          lines={ lines }
          language='javascript'
          label='The layout object in lib/configs.js'
          className={ styles.code }
          showLineNumbers
        >
          <CodeBlockHeader className={ styles.codeHeader }>
            <CodeBlockTitle>lib/configs.js</CodeBlockTitle>
            <CodeBlockLanguage>js</CodeBlockLanguage>
            <CodeBlockCopyButton className={ styles.copy } alwaysVisible />
          </CodeBlockHeader>
        </CodeBlock>

        <p className={ styles.pluginLine } aria-live='polite'>
          <span className={ styles.lineRef }>Line {highlighted.join(', ')} · {activeRegion.bar} bar · {activeRegion.label}</span>
          {configRegion.plugins.length > 0 && (
            <span className={ styles.plugins }>
              {configRegion.plugins.map((plugin) => <code key={ plugin } title={ pluginNotes[plugin] }>{plugin}</code>)}
            </span>
          )}
          {configRegion.plugins.length === 0 && (
            <span className={ styles.empty }>empty array · renders nothing, costs no space</span>
          )}
        </p>
      </div>
    </figure>
  );
};

export default GaudiBarLayout;
