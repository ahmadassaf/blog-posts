/**
 * Pipeline Diagram V2
 *
 * @description A static figure of the Travis CI run described in the post:
 * three stages left to right, the script each one runs, and the one place the
 * run stops on failure. Real text in a CSS grid, so it is selectable, wraps,
 * and reads in DOM order. No state, no hover, no live region.
 */

import { buildFigure } from './PipelineDiagramV2.model';

import styles from './PipelineDiagramV2.module.css';

const Arrow = ({ className }) => (
  <svg className={ className } viewBox='0 0 24 12' aria-hidden='true' focusable='false'>
    <path d='M1 6h20m-5-5 5 5-5 5' />
  </svg>
);

const Stage = ({ stage }) => (
  <div className={ styles.stage }>
    <span className={ styles.stageNumber }>{stage.number}</span>
    <strong className={ styles.stageLabel }>{stage.label}</strong>
    {stage.script && <code className={ styles.stageScript }>{stage.script}</code>}
    <p className={ styles.stageDetail }>{stage.detail}</p>
  </div>
);

const Connector = ({ stop }) => (
  <div className={ stop ? `${styles.connector} ${styles.connectorStop}` : styles.connector }>
    <Arrow className={ styles.arrow } />
    {stop && (
      <p className={ styles.stop }>
        <strong>{stop.title}</strong>
        <span>{stop.note}</span>
      </p>
    )}
  </div>
);

/**
 * Accepts the same props as PipelineDiagram so the post can pass the same data.
 *
 * @param {Object} props
 * @param {string} props.title - Visible figure title.
 * @param {string} props.description - One-line caption under the title.
 * @param {{ label: string, action?: string }} props.source - Where the change starts.
 * @param {{ label: string, detail?: string, success?: string, feedback?: string }} props.platform - Repository host.
 * @param {{ label: string, trigger?: string, stages: Array<{ id?: string, label: string, detail?: string, script?: string, failure?: string, output?: string, action?: string }> }} props.pipeline - Ordered stages; `detail` is printed as written.
 * @param {{ label: string }} [props.destination] - Where a successful run ends.
 * @param {string} [props.className] - Additional root class.
 * @returns {JSX.Element}
 */
const PipelineDiagramV2 = ({
  title,
  description,
  source,
  platform,
  pipeline,
  destination,
  className = ''
}) => {
  const figure = buildFigure({ destination, pipeline, platform, source });

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>

      {figure.route.length > 1 && (
        <p className={ styles.route }>
          {figure.route.map((label, index) => (
            <span key={ label } className={ styles.routeNode }>
              {index > 0 && <span className={ styles.routeArrow } aria-hidden='true'>→</span>}
              {label}
            </span>
          ))}
        </p>
      )}

      <div className={ styles.flow } style={{ '--connector-count': figure.stages.length - 1 }}>
        {figure.stages.map((stage, index) => (
          <div key={ stage.id } className={ styles.slot }>
            <Stage stage={ stage } />
            {index < figure.stages.length - 1 && (
              <Connector stop={ figure.stop?.afterIndex === index ? figure.stop : null } />
            )}
          </div>
        ))}
      </div>
    </figure>
  );
};

export default PipelineDiagramV2;
