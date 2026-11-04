'use client';

/** Suspense fallback shaped like the explorer: caption, the three progress cards, the example trigger. */

import { Skeleton } from '@gaudi/design-system';

import styles from './ImprovementKataExplorer.skeleton.module.css';

const ImprovementKataExplorerSkeleton = () => (
  <figure className={ styles.root } role='status' aria-label='Loading the Improvement Kata example' aria-busy='true'>
    <Skeleton className={ styles.title } />
    <Skeleton className={ styles.text } />
    <Skeleton className={ styles.textShort } />
    <div className={ styles.cards }>
      <Skeleton className={ styles.card } />
      <Skeleton className={ styles.card } />
      <Skeleton className={ styles.card } />
    </div>
    <Skeleton className={ styles.trigger } />
    <Skeleton className={ styles.body } />
  </figure>
);

export default ImprovementKataExplorerSkeleton;
