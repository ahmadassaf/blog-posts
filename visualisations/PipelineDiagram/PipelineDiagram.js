'use client';

/**
 * Pipeline Diagram
 *
 * @description Renders an interactive, responsive delivery pipeline for MDX
 * articles. Readers can inspect every stage and its alternate outcomes
 * directly, without autoplay or time-based state changes.
 */

import { useId, useState } from 'react';
import Icon from '@gaudi/design-system/core/Icon';

import styles from './PipelineDiagram.module.css';

const accessibleSteps = ({ source, platform, pipeline, destination }) => {
  const steps = [ `${source.label}. ${source.action} to ${platform.label}.` ];

  steps.push(`${platform.label} starts ${pipeline.label}: ${pipeline.trigger}.`);

  pipeline.stages.forEach((stage) => {
    const outcomes = [];

    if (stage.failure) outcomes.push(`Failure stops the pipeline with ${stage.failure}.`);
    if (stage.output) outcomes.push(`${stage.action || 'Output'} goes to ${stage.output}.`);

    steps.push(`${stage.label}. ${outcomes.join(' ')}`.trim());
  });

  if (destination && platform.feedback)
    steps.push(`${destination.label} returns ${platform.feedback.toLowerCase()} to ${platform.label}.`);

  if (platform.success)
    steps.push(`${platform.label} records ${platform.success.toLowerCase()}.`);

  return steps;
};

const getStageOutcome = (stage) => {
  if (stage.failure) return { 'label': 'Failure path', 'tone': 'danger', 'value': stage.failure };
  if (stage.output) return { 'label': stage.action || 'Output', 'tone': 'info', 'value': stage.output };

  return null;
};

const getStepState = (index, activeStepIndex) => {
  if (index < activeStepIndex) return 'complete';
  if (index === activeStepIndex) return 'current';

  return 'upcoming';
};

const createFlowSteps = ({ destination, pipeline, platform, source }) => {
  const steps = [
    {
      'detail': `${source.action} starts the delivery sequence.`,
      'id': 'source',
      'label': source.label,
      'meta': source.action,
      'type': 'Workspace'
    },
    {
      'detail': `${platform.detail || `${source.action} reaches ${platform.label}`}. ${pipeline.trigger}.`,
      'icon': 'Github',
      'id': 'platform',
      'label': platform.label,
      'meta': pipeline.trigger,
      'outcome': platform.success ? { 'label': 'Success signal', 'tone': 'success', 'value': platform.success } : null,
      'type': 'Repository'
    },
    ...pipeline.stages.map((stage, index) => {
      return {
        'detail': `${stage.label} is stage ${index + 1} of ${pipeline.stages.length} in ${pipeline.label}.`,
        'failure': stage.failure,
        'id': stage.id || `stage-${index}`,
        'label': stage.label,
        'meta': stage.failure ? 'Can stop the run' : (stage.action || 'Runs next'),
        'outcome': getStageOutcome(stage),
        'type': pipeline.label
      };
    })
  ];

  if (destination) {
    const deploymentStage = pipeline.stages.find((stage) => stage.output === destination.label) ||
      pipeline.stages[pipeline.stages.length - 1];

    steps.push({
      'detail': `${deploymentStage?.action || 'Output'} from ${deploymentStage?.label || pipeline.label} reaches ${destination.label}.`,
      'icon': 'Server',
      'id': 'destination',
      'label': destination.label,
      'meta': 'Release is live',
      'outcome': platform.feedback ? { 'label': `Returns to ${platform.label}`, 'tone': 'info', 'value': platform.feedback } : null,
      'type': 'Destination'
    });
  }

  return steps;
};

const FeedbackLoop = ({ active, destination, platform }) => {
  if (!destination || !platform.feedback) return null;

  return (
    <div className={ styles.feedbackLoop } data-active={ active }>
      <div className={ styles.feedbackRoute }>
        <span className={ styles.feedbackEndpoint }>
          <Icon name='Github' className={ styles.feedbackIcon } decorative />
          <span>{platform.label}</span>
        </span>
        <span className={ styles.feedbackLine } aria-hidden='true'>
          <svg viewBox='0 0 12 12' focusable='false'>
            <path d='m10 1-5 5 5 5' />
          </svg>
        </span>
        <span className={ styles.feedbackEndpoint }>
          <Icon name='Server' className={ styles.feedbackIcon } decorative />
          <span>{destination.label}</span>
        </span>
      </div>
      <span className={ styles.feedbackCaption }>{platform.feedback} returns</span>
    </div>
  );
};

/**
 * @param {Object} props
 * @param {string} props.title - Visible diagram title.
 * @param {string} props.description - Short explanation of the workflow.
 * @param {{ label: string, action: string }} props.source - Workflow origin.
 * @param {{ label: string, detail?: string, success?: string, feedback?: string }} props.platform - Shared repository or system of record.
 * @param {{ label: string, trigger: string, stages: Array<{ id?: string, label: string, failure?: string, output?: string, action?: string }> }} props.pipeline - Ordered automation stages.
 * @param {{ label: string }} [props.destination] - Optional external destination.
 * @param {string} [props.className] - Additional root class.
 * @returns {JSX.Element}
 */
const PipelineDiagram = ({
  title,
  description,
  source,
  platform,
  pipeline,
  destination,
  className = ''
}) => {
  const readoutId = useId();
  const flowSteps = createFlowSteps({ destination, pipeline, platform, source });
  const steps = accessibleSteps({ destination, pipeline, platform, source });
  const lastStepIndex = flowSteps.length - 1;
  const [ activeStepIndex, setActiveStepIndex ] = useState(0);
  const activeStep = flowSteps[activeStepIndex];
  const progress = lastStepIndex > 0 ? activeStepIndex / lastStepIndex : 1;

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <ol className={ styles.accessibleFlow }>
        {steps.map((step, index) => <li key={ `${index}-${step}` }>{step}</li>)}
      </ol>

      <div className={ styles.canvas }>
        <div className={ styles.flowField }>
          <ol
            className={ styles.flow }
            aria-label='Deployment flow'
            style={{ '--progress': progress, '--step-count': flowSteps.length }}
          >
            <span className={ styles.track } aria-hidden='true'>
              <span className={ styles.trackFill } />
            </span>

            {flowSteps.map((step, index) => {
              const state = getStepState(index, activeStepIndex);

              return (
                <li className={ styles.step } data-state={ state } key={ step.id }>
                  <button
                    className={ styles.stepButton }
                    type='button'
                    aria-current={ state === 'current' ? 'step' : undefined }
                    aria-controls={ readoutId }
                    aria-label={ `${step.label}. ${step.detail}` }
                    onClick={ () => setActiveStepIndex(index) }
                    onFocus={ () => setActiveStepIndex(index) }
                    onMouseEnter={ () => setActiveStepIndex(index) }
                  >
                    <span className={ styles.marker } aria-hidden='true'>
                      {step.icon ? <Icon name={ step.icon } className={ styles.markerIcon } decorative /> : <span />}
                    </span>
                    <strong className={ styles.stepLabel }>{step.label}</strong>
                    <span className={ styles.stepMeta }>{step.meta}</span>
                  </button>

                  {step.failure && (
                    <span className={ styles.failureBranch } data-active={ state === 'current' }>
                      <svg viewBox='0 0 14 14' aria-hidden='true' focusable='false'>
                        <path d='M2 1.5v3.75a4 4 0 0 0 4 4h6m-3-3 3 3-3 3' />
                      </svg>
                      <span>{step.failure}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <FeedbackLoop active={ activeStepIndex === lastStepIndex } destination={ destination } platform={ platform } />
        </div>

        <div id={ readoutId } className={ styles.readout } data-tone={ activeStep.outcome?.tone || 'neutral' }>
          <span className={ styles.readoutType }>{activeStep.type}</span>
          <div className={ styles.readoutCopy }>
            <strong>{activeStep.label}</strong>
            <p>{activeStep.detail}</p>
          </div>
          {activeStep.outcome && (
            <div className={ styles.outcome }>
              <span>{activeStep.outcome.label}</span>
              <strong>{activeStep.outcome.value}</strong>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
};

export default PipelineDiagram;
