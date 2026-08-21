'use client';

/**
 * THESIS: Make syntax-tree processing feel like a reversible workbench, not a static boxes-and-arrows chart.
 * OWN-WORLD: Document sheets, branching tree stations, and two directional package rails.
 * STORY: Reverse the route, inspect any station or tool layer, and understand where every Unified package acts.
 * FIRST VIEWPORT: A compact direction switch sits above one complete processor route and a live technical readout.
 * FORM: Interactive syntax-tree workbench extending the established article diagram catalogue.
 */

import { Fragment, useId, useState } from 'react';

import { getProcessorView } from './UnifiedProcessorExplorer.data';

import styles from './UnifiedProcessorExplorer.module.css';

const inspectHandlers = (onInspect) => {
  return {
    'onClick': onInspect,
    'onFocus': onInspect,
    'onMouseEnter': onInspect
  };
};

const TreeGlyph = () => (
  <svg className={ styles.treeGlyph } viewBox='0 0 54 34' aria-hidden='true' focusable='false'>
    <path d='M27 7v7M12 27v-6h30v6M27 14H12v7M27 14h15v7' />
    <circle cx='27' cy='5' r='3' />
    <circle cx='12' cy='29' r='3' />
    <circle cx='27' cy='29' r='3' />
    <circle cx='42' cy='29' r='3' />
  </svg>
);

const Satellite = ({ item, activeId, position, readoutId, onInspect }) => {
  if (!item) return <span className={ styles.satellitePlaceholder } aria-hidden='true' />;

  const active = activeId === item.id;

  return (
    <button
      type='button'
      className={ styles.satellite }
      data-active={ active }
      data-position={ position }
      aria-controls={ readoutId }
      aria-pressed={ active }
      { ...inspectHandlers(() => onInspect(item.id)) }
    >
      <span>{item.label}</span>
      <code>{item.code}</code>
    </button>
  );
};

const Station = ({ activeId, item, readoutId, onInspect }) => {
  const active = activeId === item.id;

  return (
    <div className={ styles.station } role='group' aria-label={ `${item.label} processor station` }>
      <Satellite
        activeId={ activeId }
        item={ item.plugin }
        position='plugin'
        readoutId={ readoutId }
        onInspect={ onInspect }
      />
      <span
        className={ styles.branch }
        data-position='plugin'
        data-visible={ Boolean(item.plugin) }
        aria-hidden='true'
      />

      <button
        type='button'
        className={ styles.node }
        data-active={ active }
        data-kind={ item.kind }
        aria-controls={ readoutId }
        aria-pressed={ active }
        { ...inspectHandlers(() => onInspect(item.id)) }
      >
        <span className={ styles.nodeGlyph } aria-hidden='true'>
          {item.kind === 'tree' ? <TreeGlyph /> : <span className={ styles.documentGlyph } />}
        </span>
        <span className={ styles.nodeCopy }>
          <strong>{item.label}</strong>
          <code>{item.code}</code>
        </span>
      </button>

      <span
        className={ styles.branch }
        data-position='utility'
        data-visible={ Boolean(item.utility) }
        aria-hidden='true'
      />
      <Satellite
        activeId={ activeId }
        item={ item.utility }
        position='utility'
        readoutId={ readoutId }
        onInspect={ onInspect }
      />
    </div>
  );
};

const RouteConnection = ({ activeId, edge, readoutId, onInspect }) => {
  const active = activeId === edge.id;

  return (
    <button
      type='button'
      className={ styles.route }
      data-active={ active }
      aria-controls={ readoutId }
      aria-pressed={ active }
      { ...inspectHandlers(() => onInspect(edge.id)) }
    >
      <code className={ styles.routeLabel }>{edge.label}</code>
      <svg className={ styles.routeHorizontal } viewBox='0 0 100 24' preserveAspectRatio='none' aria-hidden='true' focusable='false'>
        <path d='M2 12h94M88 4l8 8-8 8' />
      </svg>
      <svg className={ styles.routeVertical } viewBox='0 0 24 64' preserveAspectRatio='none' aria-hidden='true' focusable='false'>
        <path d='M12 2v58M4 52l8 8 8-8' />
      </svg>
    </button>
  );
};

const collectItems = (config) => {
  const items = [];

  Object.values(config.nodes).forEach((node) => {
    items.push(node);
    if (node.plugin) items.push(node.plugin);
    if (node.utility) items.push(node.utility);
  });

  Object.values(config.routes).forEach((route) => items.push(...route.edges));

  return Object.fromEntries(items.map((item) => [ item.id, item ]));
};

/**
 * @param {Object} props
 * @param {'remark'|'rehype'|'unified'} [props.view] - Contextual processor view.
 * @param {string} [props.title] - Optional visible title override.
 * @param {string} [props.description] - Optional description override.
 * @param {string} [props.className] - Additional root figure class.
 * @returns {JSX.Element}
 */
const UnifiedProcessorExplorer = ({
  view = 'unified',
  title,
  description,
  className = ''
}) => {
  const config = getProcessorView(view);
  const readoutId = useId();
  const [ direction, setDirection ] = useState('forward');
  const [ activeId, setActiveId ] = useState(config.routes.forward.edges[0].id);
  const route = config.routes[direction];
  const allItems = collectItems(config);
  const activeItem = allItems[activeId] || allItems[route.edges[0].id] || config.nodes[route.order[0]];

  const chooseDirection = (nextDirection) => {
    setDirection(nextDirection);
    setActiveId(config.routes[nextDirection].edges[0].id);
  };

  return (
    <figure
      className={ `${styles.root} ${className}`.trim() }
      data-direction={ direction }
      data-stage-count={ route.order.length }
    >
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title || config.title}</strong>
        <span className={ styles.description }>{description || config.description}</span>
      </figcaption>

      <div className={ styles.toolbar } role='group' aria-label='Transformation direction'>
        {Object.entries(config.routes).map(([ routeDirection, routeConfig ]) => (
          <button
            type='button'
            className={ styles.direction }
            data-active={ direction === routeDirection }
            aria-pressed={ direction === routeDirection }
            key={ routeDirection }
            onClick={ () => chooseDirection(routeDirection) }
          >
            {routeConfig.label}
          </button>
        ))}
      </div>

      <ol className={ styles.accessibleFlow }>
        {route.order.map((nodeId, index) => (
          <li key={ nodeId }>
            {config.nodes[nodeId].label}
            {route.edges[index] ? ` through ${route.edges[index].label}` : ''}
          </li>
        ))}
      </ol>

      <div className={ styles.flow } aria-label={ route.label }>
        {route.order.map((nodeId, index) => (
          <Fragment key={ nodeId }>
            <Station
              activeId={ activeId }
              item={ config.nodes[nodeId] }
              readoutId={ readoutId }
              onInspect={ setActiveId }
            />
            {route.edges[index] && (
              <RouteConnection
                activeId={ activeId }
                edge={ route.edges[index] }
                readoutId={ readoutId }
                onInspect={ setActiveId }
              />
            )}
          </Fragment>
        ))}
      </div>

      <div id={ readoutId } className={ styles.readout } aria-live='polite'>
        <div className={ styles.readoutHeading }>
          <span className={ styles.readoutType }>{activeItem.type}</span>
          <strong>{activeItem.label}</strong>
        </div>
        <p className={ styles.readoutDescription }>{activeItem.description}</p>
        <code className={ styles.readoutCode }>{activeItem.code || activeItem.label}</code>
      </div>

      {config.credit && <small className={ styles.credit }>{config.credit}</small>}
    </figure>
  );
};

export default UnifiedProcessorExplorer;
