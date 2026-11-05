'use client';

/**
 * Linked Data Quality Framework (static figure)
 *
 * @description Draws Roomba's Linked Data quality assessment as a block
 * architecture figure: five subsystems, their internal modules, and the flow
 * between them, all visible at once. Nothing is selectable; the legend under
 * the figure is the full text alternative.
 */

import { Fragment, useId } from 'react';
import Icon from '@gaudi/design-system/core/Icon';

import { architectureLabel, flow, summarise, systems } from './LinkedDataQualityFrameworkV2.data';

import styles from './LinkedDataQualityFrameworkV2.module.css';

const ArchitectureBlock = ({ system }) => (
  <div className={ styles.systemBlock } data-system={ system.id }>
    <div className={ styles.systemHeading }>
      <span className={ styles.systemIcon }>
        <Icon name={ system.icon } decorative />
      </span>
      <span className={ styles.systemTitle }>
        <strong>{system.label}</strong>
        <span>{system.type}</span>
      </span>
    </div>

    <p className={ styles.systemSummary }>{system.summary}</p>

    <div className={ styles.moduleGroups }>
      {system.groups.map((group) => (
        <div className={ styles.moduleGroup } data-wide={ group.wide || undefined } key={ group.label }>
          <strong>{group.label}</strong>
          <span className={ styles.modules }>
            {group.items.map((item) => <span className={ styles.module } key={ item }>{item}</span>)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Connector = ({ edge }) => (
  <span className={ styles.connector } data-direction={ edge.direction } data-connector={ `${edge.from}-${edge.to}` } />
);

/**
 * @param {Object} props
 * @param {string} [props.title] - Visible diagram title.
 * @param {string} [props.description] - Concise explanation of the framework.
 * @param {string} [props.className] - Additional root figure class.
 * @returns {JSX.Element}
 */
const LinkedDataQualityFrameworkV2 = ({
  title = 'Roomba’s Linked Data quality architecture',
  description = 'A modular path from a public data portal to a validated quality profile and report.',
  className = ''
}) => {
  const captionId = useId();

  return (
    <figure className={ `${styles.root} ${className}`.trim() } aria-labelledby={ captionId }>
      <figcaption id={ captionId } className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <div className={ styles.architectureShell }>
        <div className={ styles.architectureGrid } role='img' aria-label={ architectureLabel() }>
          {systems.map((system, index) => (
            <Fragment key={ system.id }>
              <ArchitectureBlock system={ system } />
              {flow[index] && <Connector edge={ flow[index] } />}
            </Fragment>
          ))}
        </div>
      </div>

      <dl className={ styles.legend }>
        {systems.map((system, index) => (
          <div key={ system.id }>
            <dt>
              <span className={ styles.legendStep }>{index + 1}</span>
              {system.label}
              <span className={ styles.legendType }>{system.type}</span>
            </dt>
            <dd>
              {system.description}
              <span className={ styles.legendModules }>{summarise(system)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
};

export default LinkedDataQualityFrameworkV2;
