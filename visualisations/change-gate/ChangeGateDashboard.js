'use client';

import { useId, useState } from 'react';
import Icon from '@gaudi/design-system/core/Icon';

import { actionLabel, evaluations, money, outcomes } from './ChangeGateDashboard.data';
import styles from './ChangeGateDashboard.module.css';

export default function ChangeGateDashboard() {
  const uid = useId();
  const [mode, setMode] = useState('all');
  const [outcome, setOutcome] = useState('all');
  const [view, setView] = useState('evaluations');
  const [selectedId, setSelectedId] = useState(evaluations[0].id);
  const inMode = evaluations.filter(record => mode === 'all' || record.mode === mode);
  const visible = inMode.filter(record => outcome === 'all' || record.action === outcome);
  const selected = visible.find(record => record.id === selectedId) || visible[0];
  const uniquePrs = new Set(visible.map(record => record.pr)).size;
  const totalCost = visible.reduce((total, record) => total + record.cost, 0);
  const reset = () => { setMode('all'); setOutcome('all'); setView('evaluations'); setSelectedId(evaluations[0].id); };

  return (
    <figure className={styles.root} data-testid='change-gate-dashboard' aria-labelledby={`${uid}-caption`}>
      <figcaption className={styles.caption} id={`${uid}-caption`}>
        <strong>From a decision to its evidence</strong>
        <span>Select an evaluation to inspect its policy, reviewer results and actual side effects.</span>
      </figcaption>
      <div className={styles.window}>
        <header className={styles.header}>
          <div className={styles.brand}><Icon name='ShieldCheck' decorative /><strong>Change gate</strong><span>Evidence explorer</span></div>
          <span className={styles.sample}>Synthetic data</span>
        </header>
        <div className={styles.navigation}>
          <div className={styles.views} aria-label='Dashboard view'>
            <button type='button' aria-pressed={view === 'evaluations'} onClick={() => setView('evaluations')}><Icon name='List' decorative />Evaluation log</button>
            <button type='button' aria-pressed={view === 'reviewers'} onClick={() => setView('reviewers')}><Icon name='Users' decorative />Reviewer activity</button>
          </div>
          <label className={styles.filter} htmlFor={`${uid}-mode`}>
            Mode
            <select id={`${uid}-mode`} value={mode} onChange={event => { setMode(event.target.value); setOutcome('all'); }}>
              <option value='all'>All modes</option>
              <option value='shadow'>Shadow only</option>
              <option value='enforce'>Enforce only</option>
            </select>
          </label>
        </div>

        <section className={styles.overview} aria-label='Calculated outcome distribution'>
          <div className={styles.overviewHeading}><h3>Calculated outcomes</h3><span>{inMode.length} evaluations · 1 Jan 2026</span></div>
          <div className={styles.distribution} aria-hidden='true'>
            {outcomes.map(item => <span key={item.id} data-outcome={item.id} style={{ flex: inMode.filter(record => record.action === item.id).length }} />)}
          </div>
          <div className={styles.outcomes} aria-label='Filter by calculated outcome'>
            <button type='button' aria-pressed={outcome === 'all'} onClick={() => setOutcome('all')}>All <b>{inMode.length}</b></button>
            {outcomes.map(item => <button key={item.id} type='button' data-outcome={item.id} aria-pressed={outcome === item.id} onClick={() => setOutcome(item.id)}><Icon name={item.icon} decorative />{item.label}<b>{inMode.filter(record => record.action === item.id).length}</b></button>)}
          </div>
          <p>These are calculated decisions. Only an enforce-mode record can contain an issued review.</p>
        </section>

        <div className={styles.workspace}>
          <section className={styles.log} aria-label={view === 'evaluations' ? 'Evaluation log' : 'Reviewer activity'}>
            <div className={styles.logHeading}><h3>{view === 'evaluations' ? 'Evaluation log' : 'Reviewer activity'}</h3><span aria-live='polite'>{visible.length} {visible.length === 1 ? 'record' : 'records'}</span></div>
            {visible.length === 0 ? <div className={styles.empty}><Icon name='Search' decorative /><strong>No evaluations match</strong><p>There are no {outcomes.find(item => item.id === outcome)?.label.toLowerCase()} records in this mode.</p><button type='button' onClick={() => setOutcome('all')}>Show all outcomes</button></div> : (
              <ul className={styles.records}>
                {visible.map(record => (
                  <li key={record.id}>
                    <button type='button' className={styles.record} aria-pressed={selected?.id === record.id} aria-controls={`${uid}-detail`} onClick={() => setSelectedId(record.id)}>
                      <span className={styles.recordTop}><span><b>#{record.pr}</b><code>{record.head}</code></span><time>{record.time}</time></span>
                      <strong className={styles.recordTitle}>{record.title}</strong>
                      {view === 'evaluations' ? <span className={styles.recordBottom}><span className={styles.outcome} data-outcome={record.action}><Icon name={outcomes.find(item => item.id === record.action).icon} decorative />{actionLabel(record)}</span><span className={styles.mode}>{record.mode}</span></span>
                        : <span className={styles.reviewerPreview}><span>{record.reviewers.length} reviewers · {record.cached ? 'Cached findings' : 'Complete'}</span><span>{record.findings.length} findings · {money(record.cost)}</span></span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.detail} id={`${uid}-detail`} aria-label='Selected evaluation details' aria-live='polite'>
            {selected ? <>
              <div className={styles.detailHeading}><span>Evaluation detail</span><code>{selected.id}</code></div>
              <h3>{selected.title}</h3>
              <div className={styles.detailStatus}><span className={styles.outcome} data-outcome={selected.action}>{actionLabel(selected)}</span><span>{selected.changeClass} · {selected.risk} risk</span></div>
              <p className={styles.reason}>{selected.reason}</p>
              <dl className={styles.facts}>
                <div><dt>Head commit</dt><dd><code>{selected.head}</code></dd></div>
                <div><dt>Trigger</dt><dd>{selected.trigger}</dd></div>
                <div><dt>GitHub check</dt><dd>{selected.check}</dd></div>
                <div><dt>Review action</dt><dd>{selected.issued}</dd></div>
                <div><dt>Elapsed / est. cost</dt><dd>{selected.seconds}s / {money(selected.cost)}</dd></div>
              </dl>
              {view === 'evaluations' ? <div className={styles.criteria}>
                <h4>Policy criteria <span>{selected.criteria.filter(item => item.pass).length}/{selected.criteria.length} satisfied</span></h4>
                <ul>{selected.criteria.map(item => <li key={item.label} data-pass={item.pass}><Icon name={item.pass ? 'CircleCheck' : 'Clock'} decorative /><span>{item.label}{item.label === 'Current-head human approval' && selected.changeClass === 'Standard' ? ' · not required' : ''}</span><span className={styles.srOnly}>{item.pass ? 'Satisfied' : 'Not satisfied'}</span></li>)}</ul>
              </div> : <div className={styles.reviewers}>
                <h4>Reviewer breakdown</h4>
                {selected.reviewers.map(reviewer => <div className={styles.reviewer} key={reviewer.name}><div><strong>{reviewer.name}</strong><span>{selected.cached ? 'Cached' : reviewer.state}</span></div><p>{reviewer.grade} suggested risk · {reviewer.findings} findings</p><code>{reviewer.model}</code></div>)}
                <p className={styles.reviewerNote}>A reviewer’s suggested grade cannot lower a protected-path restriction.</p>
              </div>}
              <details className={styles.evidence} key={selected.id}>
                <summary>File and finding evidence</summary>
                <code>{selected.path}</code>
                {selected.findings.length ? selected.findings.map(finding => <p key={finding}>{finding}</p>) : <p>No model findings in this evaluation.</p>}
              </details>
              <div className={styles.next}><Icon name='ArrowRight' decorative /><p>{selected.next}</p></div>
            </> : <p className={styles.noSelection}>Choose a matching evaluation to inspect its evidence.</p>}
          </section>
        </div>
        <footer className={styles.footer}><span>{visible.length} {visible.length === 1 ? 'evaluation' : 'evaluations'} · {uniquePrs} unique {uniquePrs === 1 ? 'PR' : 'PRs'} · {money(totalCost)} estimated</span><button type='button' onClick={reset}><Icon name='RotateCcw' decorative />Reset view</button></footer>
      </div>
      <p className={styles.disclosure}>Illustrative dashboard · synthetic evaluations. A concept for exploring the recorded evidence, not a production dashboard. Counts include repeat evaluations of the same PR; costs and timings are invented examples.</p>
    </figure>
  );
}
