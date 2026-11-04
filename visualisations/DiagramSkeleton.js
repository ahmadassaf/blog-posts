'use client';

/**
 * DiagramSkeleton
 *
 * The Suspense fallback for lazily loaded visualisations: a caption pair and a
 * body block that reserve roughly the space the diagram will take, so a
 * client-side navigation does not show a gap that later jumps. Explorers with
 * a distinctive layout pass their own fallback to `diagram()` instead.
 */

import { Skeleton } from '@gaudi/design-system';

import styles from './DiagramSkeleton.module.css';

const DiagramSkeleton = ({ height = '18rem', label = 'Loading diagram' }) => (
  <figure className={ styles.root } role='status' aria-label={ label } aria-busy='true'>
    <Skeleton className={ styles.title } />
    <Skeleton className={ styles.text } />
    <Skeleton className={ styles.textShort } />
    <Skeleton className={ styles.body } style={{ height }} />
  </figure>
);

export default DiagramSkeleton;
