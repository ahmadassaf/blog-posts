'use client';

/**
 * THESIS: Explain gaudiBar as a nested desktop compositor, not a diagram of coloured boxes.
 * OWN-WORLD: A dark macOS desktop field, translucent edge bars, and a precise region inspector.
 * STORY: Select a region, see its widgets share space, and understand the four-level layout hierarchy.
 * FIRST VIEWPORT: Top and bottom primary bars frame a selected-region inspector inside one desktop canvas.
 * FORM: Interactive desktop anatomy; an extension of Gaudi's editorial diagram catalogue.
 */

import { useId, useState } from 'react';
import Icon from '@gaudi/design-system/core/Icon';

import { gaudiBarRegions, gaudiBarRegionsById } from './GaudiBarLayout.data';

import styles from './GaudiBarLayout.module.css';

const sparklinePoints = (values) => {
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const range = maximum - minimum || 1;

  return values.map((value, index) => {
    const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 48;
    const y = 15 - ((value - minimum) / range) * 13;

    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
};

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
      <svg className={ styles.sparkline } viewBox='0 0 48 17' aria-hidden='true' focusable='false'>
        <polyline points={ sparklinePoints(widget.trend) } />
      </svg>
    )}
  </span>
);

const RegionButton = ({ active, readoutId, region, onSelect }) => {
  const empty = region.widgets.length === 0;

  return (
    <button
      type='button'
      className={ styles.region }
      data-active={ active }
      data-empty={ empty }
      aria-controls={ empty ? undefined : readoutId }
      aria-pressed={ active }
      aria-label={ empty ? `${region.bar} bar, ${region.label}. Empty region.` : `${region.bar} bar, ${region.label}. ${region.widgets.length} widgets.` }
      disabled={ empty }
      onClick={ empty ? undefined : onSelect }
      onFocus={ empty ? undefined : onSelect }
      onMouseEnter={ empty ? undefined : onSelect }
    >
      <span className={ styles.regionLabel }>{region.label.replace(' region', '')}</span>
      <span className={ styles.regionPreview } aria-hidden='true'>
        {region.widgets.map((widget) => (
          <span className={ styles.previewWidget } key={ widget.label }>
            <Icon name={ widget.icon } decorative />
          </span>
        ))}
      </span>
    </button>
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
    </figure>
  );
};

export default GaudiBarLayout;
