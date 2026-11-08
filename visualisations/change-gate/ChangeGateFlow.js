'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';

import styles from './ChangeGateFlow.module.css';

const stages = [
  {
    id: 'webhook',
    label: 'Verify event',
    icon: 'Webhook',
    title: 'Start with a trusted delivery',
    description: 'A pull request, check or review event reaches the App. The service verifies the webhook signature against the original request bytes and checks the repository allowlist.',
    input: 'GitHub event + original request bytes',
    output: 'An allowed event, ready to schedule',
    guard: 'An empty allowlist evaluates nothing. Events from the gate’s own checks and reviews are ignored.',
    example: 'A new commit on the example pull request schedules another evaluation.'
  },
  {
    id: 'queue',
    label: 'Queue PR',
    icon: 'List',
    title: 'Give each pull request its own turn',
    description: 'The webhook schedules the work without waiting for model calls. Evaluations of the same pull request run in order; other pull requests can progress independently.',
    input: 'Repository + pull-request number',
    output: 'One evaluation of this PR at a time',
    guard: 'This queue lives in one process. A restart loses it, and replicas do not share coordination.',
    example: 'A check finishing on this PR queues a fresh evaluation of the check state.'
  },
  {
    id: 'snapshot',
    label: 'Read state',
    icon: 'GitBranch',
    title: 'Read the change and the rules it inherits',
    description: 'Capture the head commit, diff, checks, reviews and unresolved discussions. Combine organisation defaults with the repository policy read from the base branch.',
    input: 'PR state + base-branch policy',
    output: 'Captured head, review context and policy',
    guard: 'These are several API reads, not one atomic snapshot. The current service does not recheck the head after a long model run.',
    example: 'Head 0123456 changes src/auth/session.ts. A proposed policy edit does not judge itself.'
  },
  {
    id: 'reviews',
    label: 'Ask reviewers',
    icon: 'MessageSquare',
    title: 'Ask focused questions about the same diff',
    description: 'Applicable reviewers inspect correctness, security, tests and other concerns. Each returns structured findings and a suggested risk grade. Cached findings can be reused for the same head.',
    input: 'Metadata, description, filenames and diff',
    output: 'Findings + grades + reviewer availability',
    guard: 'Models do not check out the repository or execute tests. Opting out of external review routes the change to a person.',
    example: 'Both synthetic reviewers report low risk and no findings. The protected path still matters.'
  },
  {
    id: 'evaluate',
    label: 'Apply policy',
    icon: 'ShieldCheck',
    title: 'Make the decision in ordinary code',
    description: 'Evaluate checks, required scanners, discussions, human approval and model findings together. The highest risk wins; a model cannot lower a protected-path restriction.',
    input: 'Repository policy + state + findings',
    output: 'Change class, risk, criteria and action',
    guard: 'High or critical findings at confidence 0.7 or above block by default. A Normal change still needs an independent current-head approval.',
    example: 'Authentication path → Normal / high risk. Another engineer must approve this head; the gate withholds its own approval even after that review.'
  },
  {
    id: 'publish',
    label: 'Publish result',
    icon: 'GitPullRequest',
    title: 'Separate the verdict from its permissions',
    description: 'Update a GitHub Check and the existing PR comment for the captured head. The mode determines whether the calculated action can also become a review.',
    input: 'Calculated action + operating mode',
    output: 'Commit-linked check and review report',
    guard: 'Neither mode merges or deploys. Repository rules and independent human release approval remain separate controls.',
    example: 'For this protected-path example, the calculated action is withhold in either mode.'
  },
  {
    id: 'evidence',
    label: 'Record evidence',
    icon: 'FileText',
    title: 'Keep the reasons with the result',
    description: 'Append the commit, mode, criteria, risk reasons, findings, reviewer identities, elapsed time, estimated cost and GitHub result links to the evidence log.',
    input: 'Evaluation + published result links',
    output: 'An inspectable JSON Lines record',
    guard: 'The append happens after GitHub actions. A storage failure can leave an action without its intended evidence record.',
    example: 'This record counts as one evaluation. Re-evaluating the same PR produces another record.'
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

          <p className={styles.example}><strong>Synthetic example</strong><span>{active.example}</span></p>
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
