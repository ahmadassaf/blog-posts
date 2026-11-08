'use client';

import { useId, useRef, useState } from 'react';
import Icon from '@gaudi/design-system/core/Icon';

import fixture from './report-fixture.json';
import styles from './ChangeGateReport.module.css';

const criteria = [
  { title: 'Open and ready for review', evidence: 'The pull request is open and is not a draft.' },
  { title: 'Human organisation member', evidence: 'sample-engineer is a human member of example-org.' },
  { title: 'Change documentation', evidence: 'Closes #120. Declared Standard; testing is evidenced by the check runs.' },
  { title: 'Automated checks', evidence: '2 passed on this commit: Security scan and Tests.' },
  { title: 'Required security scan', evidence: 'Security scan passed and was produced by the required App, sample-scanner.' },
  { title: 'Review conversations', evidence: 'No unresolved conversations.' },
  { title: 'Independent review and risk grade', evidence: '2 of 2 reviewers completed. No findings. Protected authentication path sets the risk to high.' },
  { title: 'Current-head human approval', evidence: 'Another engineer must approve commit 0123456. No approving review is present.', missing: true }
];

function CriteriaTable() {
  return (
    <div className={ styles.criteria } role="table" aria-label="Change gate criteria and evidence">
      <div className={ styles.criteriaHeading } role="row">
        <span role="columnheader">Criterion</span>
        <span role="columnheader">Evidence on this commit</span>
      </div>
      {criteria.map((criterion) => (
        <div className={ styles.criterion } data-missing={ criterion.missing || undefined } role="row" key={ criterion.title }>
          <div className={ styles.criterionName } role="cell">
            <Icon name={ criterion.missing ? 'CircleAlert' : 'CircleCheck' } decorative />
            <span><strong>{criterion.title}</strong><small>{criterion.missing ? 'Missing' : 'Passed'}</small></span>
          </div>
          <p role="cell">{criterion.evidence}</p>
        </div>
      ))}
    </div>
  );
}

function ReviewDetails() {
  return (
    <div className={ styles.reviewers }>
      <h5>Model reviewers</h5>
      <p className={ styles.muted }>Both suggested low risk. The protected-path rule still takes precedence.</p>
      {fixture.reviewers.map((reviewer) => (
        <details className={ styles.reviewer } key={ reviewer.reviewer }>
          <summary>
            <span>{reviewer.title}</span>
            <span className={ styles.reviewerResult }>Low risk · 0 findings</span>
            <Icon name="ChevronDown" decorative />
          </summary>
          <div className={ styles.reviewerBody }>
            <p>{reviewer.summary}</p>
            <dl>
              <div><dt>Provider</dt><dd>{reviewer.provider}</dd></div>
              <div><dt>Model</dt><dd><code>{reviewer.model}</code></dd></div>
              <div><dt>Input</dt><dd>PR metadata, description, filenames and diff</dd></div>
            </dl>
            <p className={ styles.muted }>A synthetic response, not an independent verification of the code.</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** Interactive reconstruction using the same synthetic inputs as report-output.md. */
export default function ChangeGateReport() {
  const id = useId();
  const [view, setView] = useState('comment');
  const tabRefs = useRef([]);
  const tabs = [{ id: 'comment', label: 'PR comment', icon: 'MessageSquare' }, { id: 'check', label: 'Check run', icon: 'CircleCheck' }];

  const changeTab = (event, index) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setView(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <figure className={ styles.root } data-testid="change-gate-report" aria-labelledby={ `${id}-caption` }>
      <div className={ styles.window }>
        <div className={ styles.repository }>
          <span><Icon name="Github" decorative /><span>example-org <span className={ styles.slash }>/</span> <strong>sample-service</strong></span></span>
          <span className={ styles.example }>Interactive illustration</span>
        </div>

        <header className={ styles.prHeader }>
          <h3>{fixture.snapshot.title} <span>#123</span></h3>
          <div className={ styles.prMeta }>
            <span className={ styles.open }><Icon name="GitPullRequest" decorative />Open</span>
            <p><strong>sample-engineer</strong> wants to merge into <code>main</code> from <code>{fixture.snapshot.headRef}</code></p>
          </div>
          <div className={ styles.diffMeta }><span>2 files changed</span><span className={ styles.additions }>+18</span><span className={ styles.deletions }>−6</span></div>
        </header>

        <div className={ styles.tabs } role="tablist" aria-label="GitHub report views">
          {tabs.map((tab, index) => (
            <button key={ tab.id } type="button" role="tab" id={ `${id}-${tab.id}-tab` }
              aria-selected={ view === tab.id } aria-controls={ `${id}-${tab.id}-panel` }
              tabIndex={ view === tab.id ? 0 : -1 } ref={ (element) => { tabRefs.current[index] = element; } }
              onKeyDown={ (event) => changeTab(event, index) } onClick={ () => setView(tab.id) }>
              <Icon name={ tab.icon } decorative />{tab.label}
            </button>
          ))}
        </div>

        <div className={ styles.panel } role="tabpanel" id={ `${id}-${view}-panel` } aria-labelledby={ `${id}-${view}-tab` } tabIndex={ 0 }>
          {view === 'comment' ? (
            <article className={ styles.comment }>
              <header className={ styles.commentHeader }>
                <span className={ styles.botIcon }><Icon name="Bot" decorative /></span>
                <strong>change-gate</strong><span className={ styles.botLabel }>bot</span><span>commented on this commit</span>
              </header>
              <div className={ styles.commentBody }>
                <div className={ styles.reportTitle }><h4>Change gate</h4><span className={ styles.shadow }>Shadow mode</span></div>
                <div className={ styles.facts }>
                  <span>Class <strong>Normal</strong></span>
                  <span>Risk <strong className={ styles.high }>High</strong></span>
                  <span>Commit <code>0123456</code></span>
                </div>
                <div className={ styles.requirement }>
                  <Icon name="UserRound" decorative />
                  <div><strong>Needs a second engineer</strong><p>Another engineer must approve the current head commit.</p></div>
                </div>
                <p className={ styles.decision }>Would withhold approval. <span>Shadow mode publishes a report; it issues no review action.</span></p>

                <details className={ styles.fullReport }>
                  <summary><Icon name="ChevronDown" decorative /><strong>Full report</strong><span>7 criteria passed · 1 missing</span></summary>
                  <div className={ styles.fullReportBody }>
                    <div className={ styles.rule }><Icon name="Shield" decorative /><p><strong>Policy sets the route.</strong> <code>src/auth/session.ts</code> matches a protected authentication path. This is a Normal change, even though the author declared Standard.</p></div>
                    <CriteriaTable />
                    <ReviewDetails />
                    <div className={ styles.findings }><h5>Findings</h5><p>No findings in these illustrative model responses. The missing approval comes from policy.</p></div>
                    <details className={ styles.commit }>
                      <summary><Icon name="GitBranch" decorative />Commit and evaluation details<Icon name="ChevronDown" decorative /></summary>
                      <dl><div><dt>Head SHA</dt><dd><code>{fixture.snapshot.headSha}</code></dd></div><div><dt>Evaluated</dt><dd><time dateTime={ fixture.evaluatedAt }>1 Jan 2026, 12:00 UTC</time></dd></div><div><dt>Changed lines</dt><dd>24 additions + deletions</dd></div></dl>
                    </details>
                  </div>
                </details>
                <button type="button" className={ styles.textButton } onClick={ () => { setView('check'); tabRefs.current[1]?.focus(); } }>View check run<Icon name="ArrowRight" decorative /></button>
              </div>
            </article>
          ) : (
            <article className={ styles.check }>
              <div className={ styles.checkTitle }><Icon name="CircleMinus" decorative /><div><h4>change-gate</h4><p>Completed · neutral conclusion · commit <code>0123456</code></p></div></div>
              <div className={ styles.neutral }><strong>Neutral is the shadow-mode result.</strong><p>The calculated action is withhold. A neutral check does not mean that every criterion passed or that a review was approved.</p></div>
              <dl className={ styles.checkFacts }><div><dt>Calculated action</dt><dd>Withhold</dd></div><div><dt>Review issued</dt><dd>None</dd></div><div><dt>Open requirement</dt><dd>Current-head human approval</dd></div></dl>
              <h5>Evaluation summary</h5>
              <CriteriaTable />
              <p className={ styles.checkBoundary }>Repository rules and the release process decide whether the change can merge or deploy. This check does neither.</p>
              <button type="button" className={ styles.textButton } onClick={ () => { setView('comment'); tabRefs.current[0]?.focus(); } }><Icon name="ArrowLeft" decorative />Back to PR comment</button>
            </article>
          )}
        </div>
      </div>
      <figcaption className={ styles.caption } id={ `${id}-caption` }>
        Explore the full report, reviewer responses and check run. This interactive GitHub illustration uses synthetic data from the report fixture; it is not a live pull request.
      </figcaption>
    </figure>
  );
}
