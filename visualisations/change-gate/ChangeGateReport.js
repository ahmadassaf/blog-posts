'use client';

import { useId, useRef, useState } from 'react';
import Icon from '@gaudi/design-system/core/Icon';

import { reportCases } from './ChangeGateReport.data';
import styles from './ChangeGateReport.module.css';

const criterionLabels = { passed: 'Passed', missing: 'Missing', failed: 'Failed', 'not-required': 'Not required' };
const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function CriteriaTable({ criteria }) {
  return (
    <div className={ styles.criteria } role="table" aria-label="Change gate criteria and evidence">
      <div className={ styles.criteriaHeading } role="row">
        <span role="columnheader">Criterion</span>
        <span role="columnheader">Evidence on this commit</span>
      </div>
      {criteria.map((criterion) => (
        <div className={ styles.criterion } data-status={ criterion.status } role="row" key={ criterion.title }>
          <div className={ styles.criterionName } role="cell">
            <Icon name={ ['missing', 'failed'].includes(criterion.status) ? 'CircleAlert' : 'CircleCheck' } decorative />
            <span><strong>{criterion.title}</strong><small>{criterionLabels[criterion.status]}</small></span>
          </div>
          <p role="cell">{criterion.evidence}</p>
        </div>
      ))}
    </div>
  );
}

function ReviewDetails({ report }) {
  return (
    <div className={ styles.reviewers }>
      <h5>Model reviewers</h5>
      <p className={ styles.muted }>{report.reviewerIntro}</p>
      {report.reviewers.map((reviewer) => (
        <details className={ styles.reviewer } key={ reviewer.reviewer }>
          <summary>
            <span>{reviewer.title}</span>
            <span className={ styles.reviewerResult } data-risk={ reviewer.suggestedGrade.toLowerCase() }>{capitalise(reviewer.suggestedGrade)} risk · {reviewer.findings.length} {reviewer.findings.length === 1 ? 'finding' : 'findings'}</span>
            <Icon name="ChevronDown" decorative />
          </summary>
          <div className={ styles.reviewerBody }>
            <p>{reviewer.summary}</p>
            <dl>
              <div><dt>Provider</dt><dd>{reviewer.provider}</dd></div>
              <div><dt>Model</dt><dd><code>{reviewer.model}</code></dd></div>
              <div><dt>Input</dt><dd>PR metadata, description, filenames and diff</dd></div>
            </dl>
          </div>
        </details>
      ))}
    </div>
  );
}

/** Selectable synthetic cases, including the original report-output.md fixture. */
export default function ChangeGateReport() {
  const id = useId();
  const [view, setView] = useState('comment');
  const [caseId, setCaseId] = useState('waiting');
  const report = reportCases.find((item) => item.id === caseId);
  const shortSha = report.headSha.slice(0, 7);
  const satisfied = report.criteria.filter((criterion) => ['passed', 'not-required'].includes(criterion.status)).length;
  const open = report.criteria.length - satisfied;
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
      <div className={ styles.cases } role="group" aria-label="Example case">
        {reportCases.map((item) => (
          <button type="button" key={ item.id } aria-pressed={ caseId === item.id } aria-controls={ `${id}-example` } onClick={ () => setCaseId(item.id) }>
            <Icon name={ item.icon } decorative />{item.label}
          </button>
        ))}
      </div>
      <div className={ styles.window } id={ `${id}-example` }>
        <div className={ styles.repository }>
          <span><Icon name="Github" decorative /><span>example-org <span className={ styles.slash }>/</span> <strong>sample-service</strong></span></span>
        </div>

        <header className={ styles.prHeader }>
          <h3>{report.title} <span>#{report.number}</span></h3>
          <div className={ styles.prMeta }>
            <span className={ styles.open }><Icon name="GitPullRequest" decorative />Open</span>
            <p><strong>sample-engineer</strong> wants to merge into <code>main</code> from <code>{report.headRef}</code></p>
          </div>
          <div className={ styles.diffMeta }><span>{report.files.length} {report.files.length === 1 ? 'file' : 'files'} changed</span><span className={ styles.additions }>+{report.additions}</span><span className={ styles.deletions }>−{report.deletions}</span></div>
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
                <div className={ styles.reportTitle }><h4>Change gate</h4><span className={ styles.shadow }>{capitalise(report.mode)} mode</span></div>
                <div className={ styles.facts }>
                  <span>Class <strong>{report.changeClass}</strong></span>
                  <span>Risk <strong className={ styles.risk } data-risk={ report.risk.toLowerCase() }>{report.risk}</strong></span>
                  <span>Commit <code>{shortSha}</code></span>
                </div>
                <div className={ styles.requirement } data-tone={ report.tone } role="status">
                  <Icon name={ report.icon } decorative />
                  <div><strong>{report.headline}</strong><p>{report.description}</p></div>
                </div>
                <p className={ styles.decision }>{report.decision} <span>{report.decisionDetail}</span></p>

                <details className={ styles.fullReport }>
                  <summary><Icon name="ChevronDown" decorative /><strong>Full report</strong><span>{satisfied} criteria satisfied{open ? ` · ${open} open` : ''}</span></summary>
                  <div className={ styles.fullReportBody }>
                    <div className={ styles.rule }><Icon name="Shield" decorative /><p><strong>Policy sets the route.</strong> {report.policyText}</p></div>
                    <CriteriaTable criteria={ report.criteria } />
                    <ReviewDetails report={ report } />
                    <div className={ styles.findings }>
                      <h5>Findings</h5>
                      {report.findings.length ? report.findings.map((finding) => (
                        <div className={ styles.finding } key={ finding.title }>
                          <strong>{finding.title}</strong>
                          <p>{capitalise(finding.severity)} severity · {finding.confidence} confidence · <code>{finding.file}:{finding.line}</code>{finding.reviewers?.length ? ` · reported by ${finding.reviewers.join(', ')}` : ''}</p>
                          <p>{finding.detail}</p>
                        </div>
                      )) : <p>No findings.</p>}
                    </div>
                    <details className={ styles.commit }>
                      <summary><Icon name="GitBranch" decorative />Commit and evaluation details<Icon name="ChevronDown" decorative /></summary>
                      <dl><div><dt>Head SHA</dt><dd><code>{report.headSha}</code></dd></div><div><dt>Evaluated</dt><dd><time dateTime={ report.evaluatedAt }>{new Date(report.evaluatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC</time></dd></div><div><dt>Changed lines</dt><dd>{report.additions + report.deletions} additions + deletions</dd></div></dl>
                    </details>
                  </div>
                </details>
                <button type="button" className={ styles.textButton } onClick={ () => { setView('check'); tabRefs.current[1]?.focus(); } }>View check run<Icon name="ArrowRight" decorative /></button>
              </div>
            </article>
          ) : (
            <article className={ styles.check }>
              <div className={ styles.checkTitle } data-conclusion={ report.conclusion }><Icon name={ report.conclusion === 'success' ? 'CircleCheck' : report.conclusion === 'failure' ? 'CircleAlert' : 'CircleMinus' } decorative /><div><h4>change-gate</h4><p>Completed · {report.conclusion} conclusion · commit <code>{shortSha}</code></p></div></div>
              <div className={ styles.neutral } role="status"><strong>{report.mode === 'shadow' ? 'Neutral is the shadow-mode result.' : report.headline}</strong><p>{report.mode === 'shadow' ? `The calculated action is ${report.action}. A neutral check does not mean that every criterion passed or that a review was approved.` : report.decisionDetail}</p></div>
              <dl className={ styles.checkFacts }><div><dt>Calculated action</dt><dd>{capitalise(report.action.replaceAll('_', ' '))}</dd></div><div><dt>Review issued</dt><dd>{report.reviewIssued}</dd></div><div><dt>Open requirement</dt><dd>{report.openRequirement}</dd></div></dl>
              <h5>Evaluation summary</h5>
              <CriteriaTable criteria={ report.criteria } />
              <p className={ styles.checkBoundary }>Repository rules and the release process decide whether the change can merge or deploy. This check does neither.</p>
              <button type="button" className={ styles.textButton } onClick={ () => { setView('comment'); tabRefs.current[0]?.focus(); } }><Icon name="ArrowLeft" decorative />Back to PR comment</button>
            </article>
          )}
        </div>
      </div>
      <figcaption className={ styles.caption } id={ `${id}-caption` }>
        Choose a case, then explore the full report, reviewer responses and check run.
      </figcaption>
    </figure>
  );
}
