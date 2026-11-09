'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';

import styles from './ChangeGateFlow.module.css';

const stages = [
  {
    id: 'webhook',
    label: 'Start review',
    icon: 'Webhook',
    title: 'Notice when the evidence changes',
    description: 'A new commit, a finished test or a human review can change whether the pull request is ready. The gate reassesses it when that evidence changes.',
    input: 'An update to a pull request',
    output: 'A change awaiting review',
    guard: 'Only enrolled repositories are reviewed. Installing the App alone does not enrol every repository.',
    example: 'An engineer pushes a fix to session handling. The previous review may no longer apply.'
  },
  {
    id: 'snapshot',
    label: 'Read state',
    icon: 'GitBranch',
    title: 'Read the change and the rules it inherits',
    description: 'Gather the code change, checks, human reviews and unresolved discussions for this commit, using the policy already on the target branch.',
    input: 'Current pull request and repository policy',
    output: 'Evidence tied to a specific commit',
    guard: 'A pull request cannot change the rules used to judge itself. An approval on an older commit does not satisfy the human-review requirement.',
    example: 'The fix changes src/auth/session.ts, which the repository protects.'
  },
  {
    id: 'reviews',
    label: 'Ask reviewers',
    icon: 'MessageSquare',
    title: 'Ask focused questions about the same diff',
    description: 'Reviewers look for correctness, security, testing and other problems in the change. Each provides findings and reasoning; the report also shows what they could not inspect.',
    input: 'The change and its description',
    output: 'Findings, suggested risk and gaps in coverage',
    guard: 'The models do not run tests or search the repository. Missing context remains a reason for human review.',
    example: 'Both reviewers report low risk and no findings. The protected path still matters.'
  },
  {
    id: 'evaluate',
    label: 'Apply policy',
    icon: 'ShieldCheck',
    title: 'Apply the rules the team has chosen',
    description: 'Combine the checks, human reviews and model findings with repository policy. Serious findings can raise the review requirement; a favourable model opinion cannot waive a protected-path rule.',
    input: 'Policy, current evidence and findings',
    output: 'A decision with reasons',
    guard: 'Missing tests, review coverage or a required human approval cannot be replaced by a low model grade.',
    example: 'The authentication change needs another engineer to approve this commit, even though the models found no problem.'
  },
  {
    id: 'intent',
    label: 'Record decision',
    icon: 'FileText',
    title: 'Record the decision before acting',
    description: 'Keep the evidence needed to explain this decision later: the commit, policy, check results, human reviews, findings and any gaps in coverage.',
    input: 'The decision and its supporting evidence',
    output: 'A lasting record of what was decided and why',
    guard: 'An intended action is not proof that it happened. The record must also show the outcome.',
    example: 'The authentication change records why another engineer must approve this commit.'
  },
  {
    id: 'publish',
    label: 'Publish outcome',
    icon: 'GitPullRequest',
    title: 'Apply only the authority the mode allows',
    description: 'Confirm the evidence is still current, publish the report and take only the actions allowed by the operating mode. Record what GitHub actually accepted.',
    input: 'Recorded decision and operating mode',
    output: 'Report and confirmed outcome for this commit',
    guard: 'An unconfirmed action stays unresolved until recovery establishes what happened. GitHub’s own merge protections remain necessary.',
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
        <strong id={`${uid}-title`}>From a change to a review decision</strong>
        <span>Follow a session-handling change through the review and the decision it produces.</span>
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
