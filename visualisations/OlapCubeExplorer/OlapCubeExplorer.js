'use client';

/**
 * THESIS: The multidimensional model is a picture: facts live at the intersections of dimensions, and analysis is a handful of verbs that move through the cube.
 * OWN-WORLD: One isometric cube (Time x Product x Region) that the four classic OLAP operations carve, shrink, flatten, and expand.
 * STORY: Switch between slice, dice, roll-up, and drill-down; the affected cells light up and the readout explains the verb.
 * FIRST VIEWPORT: The cube with a Q2 slice highlighted and the readout explaining what a slice is.
 * FORM: A responsive SVG with operation tabs; face cells are computed from a shared isometric projection.
 */

import { useState } from 'react';

import styles from './OlapCubeExplorer.module.css';

/* Isometric projection: i (Time) runs right-down, j (Product) left-down, k (Region) up */
const U = 52;
const V = 26;
const H = 46;
const CX = 500;
const CY = 196;

const px = (i, j, k) => [ CX + (i - j) * U, CY + (i + j) * V - k * H ];

const quad = (corners) => corners.map(([ x, y ]) => `${x},${y}`).join(' ');

/* Visible faces of a 3x3x3 cube: top (k=3 plane), right (i=3 plane), left (j=3 plane) */
const topCell = (i, j) => quad([ px(i, j, 3), px(i + 1, j, 3), px(i + 1, j + 1, 3), px(i, j + 1, 3) ]);
const rightCell = (j, k) => quad([ px(3, j, k), px(3, j + 1, k), px(3, j + 1, k + 1), px(3, j, k + 1) ]);
const leftCell = (i, k) => quad([ px(i, 3, k), px(i + 1, 3, k), px(i + 1, 3, k + 1), px(i, 3, k + 1) ]);

const CELLS = [ 0, 1, 2 ];

const operations = [
  {
    'blurb': 'Slice fixes one dimension to a single member, here Time = Q2. What remains is a flat Product x Region sheet, one quarter of the cube. Every report that says "for Q2 only" is a slice.',
    'id': 'slice',
    'label': 'Slice',
    'left': [ '1,0', '1,1', '1,2' ],
    'meaning': 'fix one member',
    'right': [],
    'top': [ '1,0', '1,1', '1,2' ]
  },
  {
    'blurb': 'Dice fixes ranges instead of single members and keeps a smaller cube: here Q2 to Q3, products B to C, regions US to APAC. The result is still three-dimensional, just carved down to the corner you care about.',
    'id': 'dice',
    'label': 'Dice',
    'left': [ '1,1', '1,2', '2,1', '2,2' ],
    'meaning': 'fix ranges',
    'right': [ '1,1', '1,2', '2,1', '2,2' ],
    'top': [ '1,1', '1,2', '2,1', '2,2' ]
  },
  {
    'blurb': 'Roll-up aggregates a dimension away by climbing its hierarchy: summing over Region leaves the flat Time x Product face, exactly the way months roll up into quarters. Every totals row you have ever read is a roll-up.',
    'dimSides': true,
    'id': 'rollup',
    'label': 'Roll up',
    'left': [],
    'meaning': 'aggregate an axis away',
    'right': [],
    'top': [ '0,0', '0,1', '0,2', '1,0', '1,1', '1,2', '2,0', '2,1', '2,2' ]
  },
  {
    'blurb': 'Drill-down is the inverse of roll-up: pick an aggregated cell and expand it into the members that built it. Here the Q3 x C total opens up into every region that contributed to it.',
    'id': 'drilldown',
    'label': 'Drill down',
    'left': [ '2,0', '2,1', '2,2' ],
    'meaning': 'expand a total',
    'right': [ '2,0', '2,1', '2,2' ],
    'top': [ '2,2' ]
  }
];

const TIME_LABELS = [ 'Q1', 'Q2', 'Q3' ];
const PRODUCT_LABELS = [ 'A', 'B', 'C' ];
const REGION_LABELS = [ 'EU', 'US', 'APAC' ];

const OlapCubeExplorer = ({
  title = 'The cube, and the four verbs',
  description = 'Three dimensions (Time, Product, Region), and every small cell one fact. Switch operations to see what each verb does to the cube.',
  className = ''
}) => {
  const [ activeOpId, setActiveOpId ] = useState('slice');
  const activeOp = operations.find((operation) => operation.id === activeOpId) || operations[0];

  const faceCell = (face, key, points) => {
    const active = activeOp[face].includes(key);
    const dimmed = Boolean(activeOp.dimSides) && face !== 'top';

    return (
      <polygon
        key={ `${face}-${key}` }
        points={ points }
        className={ styles[`${face}Cell`] }
        data-active={ active }
        data-dimmed={ dimmed }
      />
    );
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <div className={ styles.toolbar }>
        <div className={ styles.typeTabs } aria-label='OLAP operation' role='group'>
          {operations.map((operation) => (
            <button
              type='button'
              aria-label={ `${operation.label}: ${operation.meaning}` }
              aria-pressed={ activeOp.id === operation.id }
              data-active={ activeOp.id === operation.id }
              key={ operation.id }
              onClick={ () => setActiveOpId(operation.id) }
            >
              <strong>{operation.label}</strong>
              <span>{operation.meaning}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={ styles.scrollHint }>Scroll horizontally to explore the diagram</p>

      <div className={ styles.scrollFrame } role='region' aria-label='Scrollable OLAP cube diagram' tabIndex='0'>
        <svg className={ styles.graph } viewBox='0 0 1000 440' role='group' aria-label={ `OLAP cube with the ${activeOp.label} operation highlighted` }>
          {/* Side faces first, then the top, so shared edges paint cleanly */}
          {CELLS.map((i) => CELLS.map((k) => faceCell('left', `${i},${k}`, leftCell(i, k))))}
          {CELLS.map((j) => CELLS.map((k) => faceCell('right', `${j},${k}`, rightCell(j, k))))}
          {CELLS.map((i) => CELLS.map((j) => faceCell('top', `${i},${j}`, topCell(i, j))))}

          {/* Silhouette */}
          <polygon
            points={ quad([ px(0, 0, 3), px(3, 0, 3), px(3, 0, 0), px(3, 3, 0), px(0, 3, 0), px(0, 3, 3) ]) }
            className={ styles.outline }
          />

          {/* Axis tick labels */}
          {TIME_LABELS.map((label, index) => {
            const [ x, y ] = px(index + 0.5, 3, 0);

            return <text key={ label } x={ x - 8 } y={ y + 20 } textAnchor='middle' className={ styles.tickLabel }>{label}</text>;
          })}
          {PRODUCT_LABELS.map((label, index) => {
            const [ x, y ] = px(3, index + 0.5, 0);

            return <text key={ label } x={ x + 8 } y={ y + 20 } textAnchor='middle' className={ styles.tickLabel }>{label}</text>;
          })}
          {REGION_LABELS.map((label, index) => {
            const [ x, y ] = px(0, 3, index + 0.5);

            return <text key={ label } x={ x - 14 } y={ y + 4 } textAnchor='end' className={ styles.tickLabel }>{label}</text>;
          })}

          {/* Axis names */}
          <text x={ px(1.5, 3, 0)[0] - 10 } y={ px(1.5, 3, 0)[1] + 48 } textAnchor='middle' className={ styles.axisLabel }>TIME</text>
          <text x={ px(3, 1.5, 0)[0] + 10 } y={ px(3, 1.5, 0)[1] + 48 } textAnchor='middle' className={ styles.axisLabel }>PRODUCT</text>
          <text x={ px(0, 3, 3)[0] - 14 } y={ px(0, 3, 3)[1] - 14 } textAnchor='end' className={ styles.axisLabel }>REGION</text>
        </svg>
      </div>

      <div className={ styles.readout }>
        <div className={ styles.readoutPrimary }>
          <span className={ styles.readoutType }>{activeOp.label}</span>
          <span className={ styles.readoutText }>{activeOp.blurb}</span>
        </div>
        <span className={ styles.readoutMeta }>facts live at intersections · the verbs move through them</span>
      </div>

      <p className={ styles.liveRegion } aria-live='polite'>
        {activeOp.label}: {activeOp.blurb}
      </p>
    </figure>
  );
};

export default OlapCubeExplorer;
