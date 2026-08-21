'use client';

/**
 * Linked Data Quality Framework
 *
 * @description Renders Roomba's Linked Data quality assessment as an
 * interactive block architecture. Subsystems, their internal modules, and
 * the direction of data movement remain visible at the same time.
 */

import { useId, useState } from 'react';
import Icon from '@gaudi/design-system/core/Icon';

import styles from './LinkedDataQualityFramework.module.css';

const systems = [
  {
    'description': 'Recognizes the catalogue implementation and selects the adapter that knows how to enter it.',
    'groups': [{ 'items': [ 'CKAN', 'DKAN', 'Other portals' ], 'label': 'Portal adapters' }],
    'icon': 'Grid',
    'id': 'portal',
    'label': 'Data portal identifier',
    'result': 'Portal contract selected',
    'type': 'Source boundary'
  },
  {
    'description': 'Retrieves, normalizes, and caches the descriptive metadata exposed by the selected portal.',
    'groups': [{ 'items': [ 'Fetch', 'Normalize', 'Cache' ], 'label': 'Metadata lifecycle' }],
    'icon': 'FileText',
    'id': 'metadata',
    'label': 'Metadata extractor',
    'result': 'Dataset metadata prepared',
    'type': 'Ingestion subsystem'
  },
  {
    'description': 'Samples attached resources and sends representative data through format-specific validation.',
    'groups': [
      { 'items': [ 'Random sampling', 'Weighted sampling' ], 'label': 'Sampler' },
      { 'items': [ 'CSV validator', 'RDF validator' ], 'label': 'Validator' }
    ],
    'icon': 'Cubes',
    'id': 'resources',
    'label': 'Instance and resource extractor',
    'result': 'Representative resources inspected',
    'type': 'Processing subsystem'
  },
  {
    'description': 'Combines topical, statistical, and metadata profilers to turn extracted evidence into quality indicators.',
    'groups': [
      { 'items': [ 'Topical profiler' ], 'label': 'Content' },
      { 'items': [ 'Statistical profiler' ], 'label': 'Statistics' },
      { 'items': [ 'General', 'Ownership', 'Access', 'Provenance' ], 'label': 'Metadata profiler', 'wide': true }
    ],
    'icon': 'Check',
    'id': 'profile',
    'label': 'Profile validator',
    'result': 'Quality indicators scored',
    'type': 'Assessment subsystem'
  },
  {
    'description': 'Packages the validated evidence and scores into durable profiles and a readable assessment report.',
    'groups': [{ 'items': [ 'Dataset profile', 'Indicator scores', 'Quality report' ], 'label': 'Published outputs' }],
    'icon': 'ChartArea',
    'id': 'report',
    'label': 'Profile and report generator',
    'result': 'Assessment ready to use',
    'type': 'Output boundary'
  }
];

const systemById = Object.fromEntries(systems.map((system) => [ system.id, system ]));

const accessibleSystem = (system) => {
  const modules = system.groups
    .map((group) => `${group.label}: ${group.items.join(', ')}`)
    .join('. ');

  return `${system.label}. ${system.description} ${modules}. Result: ${system.result}.`;
};

const ArchitectureBlock = ({ active, system, readoutId, onSelect }) => (
  <div className={ styles.systemBlock } data-active={ active } data-system={ system.id } role='listitem'>
    <button
      type='button'
      className={ styles.systemButton }
      aria-controls={ readoutId }
      aria-pressed={ active }
      aria-label={ `${system.label}. ${system.description}` }
      onClick={ onSelect }
      onFocus={ onSelect }
      onMouseEnter={ onSelect }
    >
      <span className={ styles.systemHeading }>
        <span className={ styles.systemIcon } aria-hidden='true'>
          <Icon name={ system.icon } decorative />
        </span>
        <span className={ styles.systemTitle }>
          <strong>{system.label}</strong>
          <span>{system.type}</span>
        </span>
      </span>

      <span className={ styles.moduleGroups }>
        {system.groups.map((group) => (
          <span className={ styles.moduleGroup } data-wide={ group.wide || undefined } key={ group.label }>
            <strong>{group.label}</strong>
            <span className={ styles.modules }>
              {group.items.map((item) => <span className={ styles.module } key={ item }>{item}</span>)}
            </span>
          </span>
        ))}
      </span>
    </button>
  </div>
);

const Connector = ({ active, direction, name }) => (
  <span
    className={ `${styles.connector} ${styles[`connector${direction}`]}` }
    data-active={ active }
    data-connector={ name }
    aria-hidden='true'
  />
);

/**
 * @param {Object} props
 * @param {string} [props.title] - Visible diagram title.
 * @param {string} [props.description] - Concise explanation of the framework.
 * @param {string} [props.className] - Additional root figure class.
 * @returns {JSX.Element}
 */
const LinkedDataQualityFramework = ({
  title = 'Roomba’s Linked Data quality architecture',
  description = 'A modular path from a public data portal to a validated quality profile and report.',
  className = ''
}) => {
  const readoutId = useId();
  const [ activeSystemId, setActiveSystemId ] = useState('resources');
  const activeSystem = systemById[activeSystemId];
  const isConnected = (first, second) => activeSystemId === first || activeSystemId === second;

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <ol className={ styles.accessibleArchitecture }>
        {systems.map((system) => <li key={ system.id }>{accessibleSystem(system)}</li>)}
      </ol>

      <div className={ styles.architectureShell }>
        <div className={ styles.architectureGrid } role='list' aria-label='Roomba quality assessment subsystems'>
          <ArchitectureBlock
            active={ activeSystemId === 'portal' }
            system={ systemById.portal }
            readoutId={ readoutId }
            onSelect={ () => setActiveSystemId('portal') }
          />
          <Connector active={ isConnected('portal', 'metadata') } direction='Right' name='portal-metadata' />

          <ArchitectureBlock
            active={ activeSystemId === 'metadata' }
            system={ systemById.metadata }
            readoutId={ readoutId }
            onSelect={ () => setActiveSystemId('metadata') }
          />
          <Connector active={ isConnected('metadata', 'resources') } direction='Right' name='metadata-resources' />

          <ArchitectureBlock
            active={ activeSystemId === 'resources' }
            system={ systemById.resources }
            readoutId={ readoutId }
            onSelect={ () => setActiveSystemId('resources') }
          />
          <Connector active={ isConnected('resources', 'profile') } direction='Down' name='resources-profile' />

          <ArchitectureBlock
            active={ activeSystemId === 'profile' }
            system={ systemById.profile }
            readoutId={ readoutId }
            onSelect={ () => setActiveSystemId('profile') }
          />
          <Connector active={ isConnected('profile', 'report') } direction='Left' name='profile-report' />

          <ArchitectureBlock
            active={ activeSystemId === 'report' }
            system={ systemById.report }
            readoutId={ readoutId }
            onSelect={ () => setActiveSystemId('report') }
          />
        </div>

        <div id={ readoutId } className={ styles.readout } aria-live='polite'>
          <span className={ styles.readoutIcon } aria-hidden='true'>
            <Icon name={ activeSystem.icon } decorative />
          </span>
          <span className={ styles.readoutCopy }>
            <strong>{activeSystem.label}</strong>
            <span>{activeSystem.description}</span>
          </span>
          <span className={ styles.result }>
            <Icon name='Check' decorative />
            {activeSystem.result}
          </span>
        </div>
      </div>
    </figure>
  );
};

export default LinkedDataQualityFramework;
