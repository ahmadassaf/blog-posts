'use client';

/**
 * THESIS: Scope describes responsibility; growth also means deepening contribution at that scope.
 * FORM: Illustrated terraces join two contribution paths; native controls reveal examples at each scope.
 * SOURCE: A local adaptation of Elliot Graebert's impact-based level system; examples are illustrative.
 */

import { useId, useState } from 'react';

import styles from './GrowthLevelsExplorer.module.css';

const levels = [
  {
    'description': 'Deliver a well-defined task with a clear purpose, quality bar, and someone available to help.',
    'evidence': 'Discuss the finished work, the checks performed, and how questions or blockers were raised. Look at the clarity of the brief as well as the execution.',
    'experiment': 'For the next task, explain the acceptance checks before starting, then review with a mentor whether those checks caught the important issues.',
    'id': 'l1',
    'kind': 'Defined task',
    'leadership': 'At this scope, management is a supporting responsibility: explain the task, make help available, and give specific feedback. This is not a proposed entry-level management role.',
    'name': 'L1',
    'support': 'An accessible mentor, a usable development environment, and a shared example of what finished work looks like.',
    'technical': 'Implement a scoped change, check it against the agreed behavior, and explain any uncertainty before handing it over.'
  },
  {
    'description': 'Deliver a bounded project while more experienced colleagues help with unfamiliar trade-offs and business context.',
    'evidence': 'Review how dependencies, risks, and handoffs were handled. Distinguish gaps in execution from gaps in the plan someone else supplied.',
    'experiment': 'Map the next project’s dependencies and review them with a colleague. After delivery, compare the predicted handoffs with the ones that caused delays.',
    'id': 'l2',
    'kind': 'Bounded project',
    'leadership': 'Coordinate a small piece of delivery: clarify ownership, surface dependencies, and arrange help. This responsibility does not require a people-management title.',
    'name': 'L2',
    'support': 'A clear decision owner, timely product context, and help with trade-offs outside the person’s experience.',
    'technical': 'Deliver the project through implementation, testing, and support, making risks visible as the work develops.'
  },
  {
    'description': 'Turn an ambiguous goal into a workable project, and change the approach when new evidence calls for it.',
    'evidence': 'Discuss the framing of the problem, decisions made, collaboration, and the resulting work. Include constraints and contributions from other people.',
    'experiment': 'For the next proposal, ask a colleague to identify the decision, alternatives, and owner from the first page. Use any gaps to improve the proposal.',
    'id': 'l3',
    'kind': 'Open project',
    'leadership': 'Help a project group agree priorities, resolve dependencies, and keep the decisions visible to the people doing the work.',
    'name': 'L3',
    'support': 'Access to stakeholders, clear authority to make decisions, and a sounding board for unfamiliar choices.',
    'technical': 'Frame the problem, compare approaches, and bring the right people into technical decisions before committing to a solution.'
  },
  {
    'description': 'Improve how a team works, so the contribution continues through other people’s decisions and practice.',
    'evidence': 'Look for changes in the team’s work: clearer decisions, useful shared practices, or recurring problems reduced. Ask teammates what actually helped.',
    'experiment': 'Try a shared review guide on the next few changes. Ask reviewers where it helped, where it added friction, and what should change.',
    'id': 'l4',
    'kind': 'Team',
    'leadership': 'Clarify priorities and responsibilities, create development opportunities, and address constraints that the team cannot remove alone.',
    'name': 'L4',
    'support': 'Time for mentoring and improvement work, agreement on team priorities, and authority that matches the responsibility.',
    'technical': 'Guide architecture, mentor colleagues, and improve engineering practices that the team can use without depending on one person.'
  },
  {
    'description': 'Help several teams make coherent decisions across a shared problem or product area.',
    'evidence': 'Review the decisions and coordination across teams, including what was stopped or simplified. Consider which constraints the person could influence.',
    'experiment': 'Choose one recurring dependency between teams, agree a decision owner and escalation path, then review whether the next decision was easier to make.',
    'id': 'l5',
    'kind': 'Several teams',
    'leadership': 'Develop team leaders, align responsibilities across teams, and negotiate priorities and resources for the shared area.',
    'name': 'L5',
    'support': 'Sponsorship across team boundaries, access to strategy and resource decisions, and colleagues who can challenge the proposed direction.',
    'technical': 'Shape a technical direction across teams, guide shared architecture, and develop other technical leaders.'
  },
  {
    'description': 'Shape decisions whose consequences extend across the company, with accountability for their wider effects.',
    'evidence': 'Examine the quality of strategic choices, how assumptions were tested, and effects over time. Include uncertainty and decisions owned by others.',
    'experiment': 'Before a major commitment, make a critical assumption explicit and run a bounded test. Review the evidence with the people accountable for the decision.',
    'id': 'l6',
    'kind': 'Company',
    'leadership': 'Shape the organization, develop its leaders, and align resources and responsibilities with the company’s direction.',
    'name': 'L6',
    'support': 'Shared business context, explicit decision rights, access to dissenting views, and enough time to observe longer-term consequences.',
    'technical': 'Guide company-wide technical strategy and help teams make consequential choices about capabilities, architecture, or technical risk.'
  }
];

const GrowthLevelsExplorer = ({
  title = 'Explore contribution at different scopes',
  description = 'Select a scope to compare technical and people-leadership contributions, then explore the evidence, support, and practice that could help.',
  id,
  className = ''
}) => {
  const generatedId = useId();
  const instanceId = id || generatedId;
  const [ activeLevelId, setActiveLevelId ] = useState('l3');
  const activeLevel = levels.find((level) => level.id === activeLevelId) || levels[0];
  const readoutId = `${instanceId}-readout`;
  const headingId = `${instanceId}-heading`;

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong className={ styles.title }>{title}</strong>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <div className={ styles.legend } aria-label='Two ways to contribute'>
        <span><i className={ styles.technicalLine } aria-hidden='true' />Technical contribution</span>
        <span><i className={ styles.leadershipLine } aria-hidden='true' />People and delivery leadership</span>
      </div>

      <div className={ styles.landscape }>
        <div className={ styles.readingKey }>
          <strong>Scope widens</strong>
          <span>Depth matters at every level.</span>
        </div>
        <svg className={ styles.desktopTerrain } viewBox='0 0 1000 420' preserveAspectRatio='none' aria-hidden='true' focusable='false'>
          <g className={ styles.terraces }>
            <path d='M 12 404 V 280 Q 12 264 28 264 H 164 V 228 Q 164 212 180 212 H 316 Q 332 212 332 228 V 404 Z' />
            <path d='M 340 352 V 176 Q 340 160 356 160 H 492 V 124 Q 492 108 508 108 H 644 Q 660 108 660 124 V 352 Z' />
            <path d='M 668 248 V 72 Q 668 56 684 56 H 820 V 20 Q 820 4 836 4 H 972 Q 988 4 988 20 V 248 Z' />
          </g>
          <path className={ styles.technicalPath } d='M 90 354 H 172 V 302 H 254 H 336 V 250 H 418 H 500 V 198 H 582 H 664 V 146 H 746 H 828 V 94 H 910' />
          <path className={ styles.leadershipPath } d='M 90 364 H 182 V 312 H 254 H 346 V 260 H 418 H 510 V 208 H 582 H 674 V 156 H 746 H 838 V 104 H 910' />
        </svg>
        <svg className={ styles.mobileTerrain } viewBox='0 0 400 420' preserveAspectRatio='none' aria-hidden='true' focusable='false'>
          <g className={ styles.terraces }>
            <path d='M 8 122 V 52 Q 8 36 24 36 H 188 V 26 Q 188 10 204 10 H 376 Q 392 10 392 26 V 122 Z' />
            <path d='M 8 252 V 182 Q 8 166 24 166 H 188 V 156 Q 188 140 204 140 H 376 Q 392 140 392 156 V 252 Z' />
            <path d='M 8 382 V 312 Q 8 296 24 296 H 188 V 286 Q 188 270 204 270 H 376 Q 392 270 392 286 V 382 Z' />
          </g>
          <path className={ styles.technicalPath } d='M 96 84 H 304 V 136 H 96 V 214 H 304 V 266 H 96 V 344 H 304' />
          <path className={ styles.leadershipPath } d='M 96 94 H 314 V 146 H 106 V 224 H 314 V 276 H 106 V 354 H 304' />
        </svg>

        <div className={ styles.scopeControls } role='group' aria-label='Contribution scope'>
          {levels.map((level, index) => (
            <button
              key={ level.id }
              type='button'
              className={ styles.scopeButton }
              style={{
                '--scope-mobile-x': `${index % 2 === 0 ? 24 : 76}%`,
                '--scope-mobile-y': `${(74 + Math.floor(index / 2) * 130) / 4.2}%`,
                '--scope-x': `${(90 + index * 164) / 10}%`,
                '--scope-y': `${(326 - index * 52) / 4.2}%`
              }}
              aria-controls={ readoutId }
              aria-pressed={ activeLevelId === level.id }
              onClick={ () => setActiveLevelId(level.id) }
            >
              <span className={ styles.levelName }>{level.name}</span>
              <span>{level.kind}</span>
            </button>
          ))}
        </div>
        <p className={ styles.landscapeNote }>Select any scope.<br />There is more than one way to grow.</p>
      </div>

      <section className={ styles.readout } id={ readoutId } aria-labelledby={ headingId }>
        <h3 className={ styles.scopeHeading } id={ headingId }>{`${activeLevel.name}: ${activeLevel.kind}`}</h3>
        <p className={ styles.scopeDescription }>{activeLevel.description}</p>

        <dl className={ styles.contributions }>
          <div>
            <dt>Technical contribution</dt>
            <dd>{activeLevel.technical}</dd>
          </div>
          <div>
            <dt>People and delivery leadership</dt>
            <dd>{activeLevel.leadership}</dd>
          </div>
        </dl>

        <dl className={ styles.evidence }>
          <div>
            <dt>Evidence to discuss</dt>
            <dd>{activeLevel.evidence}</dd>
          </div>
        </dl>
        <details className={ styles.practice }>
          <summary>Explore support and a possible experiment</summary>
          <dl className={ styles.learning }>
            <div>
              <dt>Support to make available</dt>
              <dd>{activeLevel.support}</dd>
            </div>
            <div>
              <dt>A possible experiment</dt>
              <dd>{activeLevel.experiment}</dd>
            </div>
          </dl>
        </details>
      </section>

      <p className={ styles.note }>
        Deepening your contribution at a suitable scope is a valid path. Broader scope depends on opportunity,
        {' '}interest, and the organization’s needs; it is not a mandatory next step.
      </p>
      <p className={ styles.source }>
        Adapted from <a href='https://medium.com/@elliotgraebert/an-impact-based-level-system-for-engineering-organizations-2e0f9bee20e6'>Elliot Graebert’s level system</a>.
        {' '}This local model uses illustrative examples, not universal job titles or promotion requirements.
      </p>
      <p className={ styles.liveRegion } aria-live='polite' aria-atomic='true'>
        {`${activeLevel.name}, ${activeLevel.kind} selected. ${activeLevel.description} The examples and development prompts below have updated.`}
      </p>
    </figure>
  );
};

export default GrowthLevelsExplorer;
