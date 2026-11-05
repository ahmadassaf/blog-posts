'use client';

/**
 * THESIS: Scope describes responsibility; growth also means deepening contribution at that scope.
 * FORM: A scope ladder of six toggles; selecting one shows its examples, evidence, support and a
 *       development experiment side by side, with nothing collapsed.
 * SOURCE: A local adaptation of Elliot Graebert's impact-based level system; examples are illustrative.
 */

import { useId, useState } from 'react';
import { ToggleGroupItem, ToggleGroupRoot } from '@gaudi/design-system/core/ToggleGroup';

import { defaultLevelId, findLevel, levelLabel, levels } from './GrowthLevelsExplorerV2.data';

import styles from './GrowthLevelsExplorerV2.module.css';

const GrowthLevelsExplorerV2 = ({
  title = 'Contribution at six scopes',
  description = 'Choose a scope to see example contributions, the evidence to discuss, the support to make available, and a small development experiment.',
  id,
  className = ''
}) => {
  const generatedId = useId();
  const uid = id || generatedId;
  const [ activeLevelId, setActiveLevelId ] = useState(defaultLevelId);
  const [ status, setStatus ] = useState('');
  const activeLevel = findLevel(activeLevelId);
  const readoutId = `${uid}-readout`;
  const headingId = `${uid}-heading`;

  const choose = (value) => {
    if (!value) return;
    setActiveLevelId(value);
    setStatus(levelLabel(findLevel(value)));
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>

      <ToggleGroupRoot
        type='single'
        variant='outline'
        spacing={ 2 }
        className={ styles.ladder }
        aria-label='Contribution scope'
        value={ activeLevelId }
        onValueChange={ choose }
      >
        {levels.map((level) => (
          <ToggleGroupItem
            key={ level.id }
            value={ level.id }
            className={ styles.rung }
            aria-controls={ readoutId }
          >
            <span className={ styles.rungName }>{level.name}</span>
            <span className={ styles.rungKind }>{level.kind}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroupRoot>

      <section className={ styles.readout } id={ readoutId } aria-labelledby={ headingId } key={ activeLevel.id }>
        <h3 className={ styles.heading } id={ headingId }>{levelLabel(activeLevel)}</h3>
        <p className={ styles.scope }>{activeLevel.description}</p>

        <div className={ styles.panels }>
          <section className={ styles.panel } aria-label='Example contributions'>
            <h4>Example contributions</h4>
            <dl className={ styles.examples }>
              <div>
                <dt className={ styles.technical }>Technical</dt>
                <dd>{activeLevel.technical}</dd>
              </div>
              <div>
                <dt className={ styles.leadership }>People and delivery leadership</dt>
                <dd>{activeLevel.leadership}</dd>
              </div>
            </dl>
          </section>
          <section className={ styles.panel } aria-label='Evidence to discuss'>
            <h4>Evidence to discuss</h4>
            <p>{activeLevel.evidence}</p>
          </section>
          <section className={ styles.panel } aria-label='Support to make available'>
            <h4>Support to make available</h4>
            <p>{activeLevel.support}</p>
          </section>
          <section className={ styles.panel } aria-label='A development experiment'>
            <h4>A development experiment</h4>
            <p>{activeLevel.experiment}</p>
          </section>
        </div>
      </section>

      <p className={ styles.source }>
        Adapted from <a href='https://medium.com/@elliotgraebert/an-impact-based-level-system-for-engineering-organizations-2e0f9bee20e6'>Elliot Graebert’s level system</a>.
        {' '}This local model uses illustrative examples, not universal job titles or promotion requirements.
      </p>
      <p className={ styles.status } role='status' aria-live='polite' aria-atomic='true'>{status}</p>
    </figure>
  );
};

export default GrowthLevelsExplorerV2;
