'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';

import styles from './ChangeGateFlow.module.css';

const stages = [
  {
    id: 'webhook',
    label: 'Accept event',
    icon: 'Webhook',
    title: 'Acknowledge only persisted work',
    description: 'Verify the webhook signature, check the allowlist and commit its receipt and routed jobs to PostgreSQL before returning HTTP 202.',
    input: 'GitHub event + original request bytes',
    output: 'Verified receipt + durable jobs',
    guard: 'The receipt stores routing metadata and a fingerprint, not the raw payload or signature. A failed commit is not an accepted delivery.',
    example: 'A new commit creates work for this pull request. Ignored events retain a reason without starting a review.'
  },
  {
    id: 'queue',
    label: 'Claim work',
    icon: 'List',
    title: 'Coordinate workers through the database',
    description: 'A worker claims a durable job and obtains ownership for the pull request. A lease and session advisory lock coordinate workers across replicas.',
    input: 'Durable job + pull-request identity',
    output: 'Recorded attempt + guarded ownership',
    guard: 'Lost ownership stops new mutations. An already in-flight GitHub request still needs reconciliation. Later deliveries remain separate jobs.',
    example: 'A pod restart leaves accepted work in PostgreSQL for a worker to recover.'
  },
  {
    id: 'snapshot',
    label: 'Read state',
    icon: 'GitBranch',
    title: 'Read the change and the rules it inherits',
    description: 'Capture the head commit, diff, checks, reviews and unresolved discussions. Read repository policy at the captured base commit and verify reviewer permissions.',
    input: 'PR state + policy at the base commit',
    output: 'Captured head, review context and policy',
    guard: 'Decision inputs are fetched again before acting. Changed inputs trigger a retry. These API reads are not an atomic merge lock.',
    example: 'Head 0123456 changes src/auth/session.ts. A proposed policy edit does not judge itself.'
  },
  {
    id: 'reviews',
    label: 'Ask reviewers',
    icon: 'MessageSquare',
    title: 'Ask focused questions about the same diff',
    description: 'Applicable reviewers inspect correctness, security, tests and other concerns. Each returns structured findings and a suggested risk grade. Cached findings are reused only while the review inputs still match.',
    input: 'Metadata, description, filenames and reviewable diff',
    output: 'Findings + grades + review coverage',
    guard: 'Models do not execute tests or search the repository. Missing review coverage requires a person. Invalid policy prevents external calls.',
    example: 'Both reviewers report low risk and no findings. The protected path still matters.'
  },
  {
    id: 'evaluate',
    label: 'Apply policy',
    icon: 'ShieldCheck',
    title: 'Make the decision in ordinary code',
    description: 'Evaluate required checks, discussions, human approval and model findings together. A model cannot waive a protected-path rule. A serious finding can require a person even without agreement from another reviewer.',
    input: 'Repository policy + state + findings',
    output: 'Change class, risk, criteria and action',
    guard: 'A high finding blocks when two matching reports each meet the severity and confidence thresholds. One confident critical finding can block. Other serious findings require human review. These are provisional policy rules, not calibrated probabilities.',
    example: 'Authentication path → Normal / high risk. Another engineer must approve this head; the gate withholds its own approval even after that review.'
  },
  {
    id: 'intent',
    label: 'Record decision',
    icon: 'FileText',
    title: 'Record the decision before acting',
    description: 'Append the decision, review coverage and input versions to the evidence ledger. Link this evaluation to its delivery, job and worker attempt.',
    input: 'Evaluation + calculated action',
    output: 'Decision evidence + action intent',
    guard: 'An intent is not proof of success. The runtime role cannot rewrite history; retention and backups require separate operator configuration.',
    example: 'The authentication change records why another engineer must approve this commit.'
  },
  {
    id: 'publish',
    label: 'Publish outcome',
    icon: 'GitPullRequest',
    title: 'Apply only the authority the mode allows',
    description: 'Recheck inputs and ownership, publish only the permitted action, then record the observed GitHub result. Link the report and outcome to the same evaluation.',
    input: 'Persisted intent + operating mode',
    output: 'Commit-linked report + recorded outcome',
    guard: 'A timeout can leave an uncertain outcome. Recovery inspects current state; PostgreSQL cannot make a GitHub call exactly once. Native protections still apply.',
    example: 'This protected-path example withholds bot approval in either mode. A completed shadow evaluation publishes a neutral check.'
  }
];

export default function ChangeGateFlow() {
  const uid = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState('shadow');
  const rail = useRef(null);
  const active = stages[activeIndex];

  useEffect(() => {
    const container = rail.current;
    const button = container?.querySelector('[aria-current="step"]');
    if (!container || !button || container.scrollWidth <= container.clientWidth) return;
    const containerBox = container.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();
    if (buttonBox.left < containerBox.left || buttonBox.right > containerBox.right) {
      container.scrollTo({ left: container.scrollLeft + buttonBox.left - containerBox.left - (container.clientWidth - buttonBox.width) / 2, behavior: 'instant' });
    }
  }, [activeIndex]);

  return (
    <figure className={styles.root} data-testid='change-gate-flow' aria-labelledby={`${uid}-title`}>
      <figcaption className={styles.caption}>
        <strong id={`${uid}-title`}>From GitHub event to an inspectable decision</strong>
        <span>Select a stage to see what enters, what leaves and where the boundary sits.</span>
      </figcaption>

      <div className={styles.canvas}>
        <div ref={rail} className={styles.rail}>
          <ol className={styles.steps} aria-label='Change-gate evaluation stages'>
            {stages.map((stage, index) => (
              <li key={stage.id} className={styles.stage} data-selected={index === activeIndex}>
                <button
                  type='button'
                  className={styles.stageButton}
                  aria-label={`Step ${index + 1}: ${stage.label}`}
                  aria-current={index === activeIndex ? 'step' : undefined}
                  aria-controls={`${uid}-detail`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className={styles.node}><Icon name={stage.icon} decorative /></span>
                  <span className={styles.stageLabel}>{stage.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.detail} id={`${uid}-detail`}>
          <div className={styles.detailHeading}>
            <span className={styles.stepNumber} aria-hidden='true'>{activeIndex + 1}</span>
            <h3>{active.title}</h3>
          </div>
          <p className={styles.description}>{active.description}</p>
          <dl className={styles.handoff}>
            <div><dt>Receives</dt><dd>{active.input}</dd></div>
            <Icon name='ArrowRight' className={styles.handoffArrow} decorative />
            <div><dt>Produces</dt><dd>{active.output}</dd></div>
          </dl>

          {active.id === 'publish' && (
            <div className={styles.modePreview}>
              <div className={styles.modeButtons} role='group' aria-label='Preview operating mode'>
                {['shadow', 'enforce'].map(value => (
                  <Button key={value} size='sm' tone='neutral' variant={mode === value ? 'solid' : 'ghost'} aria-pressed={mode === value} onClick={() => setMode(value)}>
                    {value === 'shadow' ? 'Shadow' : 'Enforce'}
                  </Button>
                ))}
              </div>
              <p>{mode === 'shadow'
                ? 'Report and evidence only. A completed check is neutral; no approval or request for changes is issued.'
                : 'The check reflects the calculated result. Eligible Standard changes can receive approval; blocking findings can trigger a request for changes.'}</p>
            </div>
          )}

          <p className={styles.example}>{active.example}</p>
          <div className={styles.boundary}>
            <Icon name='Info' decorative />
            <p>{active.guard}</p>
          </div>
        </div>

        <div className={styles.navigation}>
          <Button size='sm' variant='ghost' tone='neutral' onClick={() => setActiveIndex(index => index - 1)} disabled={activeIndex === 0} aria-label='Previous evaluation stage'>
            <Icon name='ArrowLeft' decorative /><span>Previous</span>
          </Button>
          <span className={styles.position} role='status'>Step {activeIndex + 1} of {stages.length}</span>
          <Button size='sm' variant='ghost' tone='neutral' onClick={() => setActiveIndex(index => index + 1)} disabled={activeIndex === stages.length - 1} aria-label='Next evaluation stage'>
            <span>Next</span><Icon name='ArrowRight' decorative />
          </Button>
        </div>
      </div>
      <p className={styles.outside}><Icon name='Lock' decorative /><span>Merge and production approval remain outside this service.</span></p>
    </figure>
  );
}
