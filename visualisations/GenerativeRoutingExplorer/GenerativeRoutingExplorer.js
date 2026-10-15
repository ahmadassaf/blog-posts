'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './GenerativeRoutingExplorer.module.css';

const paths = { currency: 'Check exchange rate', definition: 'Inspect adjustments', sources: 'Compare documents', period: 'Check reporting period' };
const evidence = {
 currency: 'The acquisition record uses GBP; the new report uses EUR. Currency conversion is a useful first check.',
 definition: 'One observation is reported EBITDA; the other is adjusted EBITDA. Inspect the add-backs before comparing.',
 sources: 'Two documents give different values for the same measure and period. Review their provenance.',
 period: 'The original record covers FY2024. The latest observation covers FY2025. A remaining difference may be a period change.'
};
const money = n => `${n < 0 ? "−" : ""}£${Math.abs(n).toFixed(2)}m`;
export default function GenerativeRoutingExplorer({ id }) {
 const uid = useId();
 const company = 'Northstar';
 const heading = useRef(null);
 const [navigation, setNavigation] = useState(0);
 useEffect(() => { if (navigation) heading.current?.focus({preventScroll:false}); }, [navigation]);
 const [period, setPeriod] = useState('FY2025');
 const [started, setStarted] = useState(false);
 const [step, setStep] = useState('evidence');
 const [rate, setRate] = useState(1.2);
 const [adjustment, setAdjustment] = useState(true);
 const [source, setSource] = useState('signed');
 const [notes, setNotes] = useState({});
 const [findings, setFindings] = useState({});
 const [trail, setTrail] = useState([]);
 const alternative = ['definition','sources'].includes(step);
 const latest = period === 'FY2025' ? 14.4 : 12;
 const normalized = latest / rate;
 function open(key) { setStep(key); setNavigation(n => n + 1); setTrail(old => key === 'evidence' || old.includes(key) ? old : [...old, key]); }
 function result(key) {
  if (key === 'currency') return `${money(normalized)} after conversion at €${rate.toFixed(2)} per £1; a ${money(normalized - 10)} difference from the £10m acquisition record. ${period === 'FY2025' ? 'The reporting years differ; this alone does not explain performance.' : 'The reporting year matches; any remaining gap depends on the conversion assumption.'}`;
  if (key === 'definition') return adjustment ? '£12m adjusted − £2m restructuring add-back = £10m reported EBITDA. Definitions explain this illustrative gap.' : '£12m still includes the £2m add-back. This is not yet comparable with £10m reported EBITDA.';
  if (key === 'sources') return `${source === 'signed' ? '£10m from the signed report' : '£12m from the draft'} selected for review. ${source === 'draft' ? 'Unresolved: the later signed report supersedes this draft.' : 'The 9 June signed report supersedes the 2 June draft.'}`;
  return period === 'FY2025' ? `${money(normalized)} for FY2025 versus £10m for FY2024. The normalized difference is ${money(normalized - 10)} (${((normalized / 10 - 1) * 100).toFixed(1)}%). This comparison alone does not explain the cause.` : `${money(normalized)} versus £10m, both for FY2024. At this rate the remaining difference is ${money(normalized - 10)}.`;
 }
 function record() {setFindings(old => ({...old, [step]: {text: result(step), period, rate, adjustment, source}}));}
 function stale(key, item) {return (['currency','period'].includes(key) && (item.rate !== rate || item.period !== period)) || (key === 'definition' && item.adjustment !== adjustment) || (key === 'sources' && item.source !== source);}
 return <section id={id || uid} className={styles.root} aria-label="Generative routing interactive example">
  <header className={styles.header}><h3>Follow the question, then the evidence.</h3><p>Try it: save a currency finding, then change the exchange rate. Watch which conclusion needs another look.</p></header>
  <p className={styles.disclosure}>Simulation · Fictional data and predefined routes; no live AI. Notes and findings last until reload.</p>
  <div className={styles.intent}>
   <p><strong>“Why has EBITDA changed?”</strong></p>
   <div className={styles.fields}><div><strong>Company</strong><p>Northstar</p></div><label>Latest reporting period<select value={period} onChange={e => setPeriod(e.target.value)}><option>FY2025</option><option>FY2024</option></select></label></div>
   <p className={styles.hint}>Compare reported EBITDA with the FY2024 acquisition record. Changing the period updates the comparison immediately.</p>
   {!started && <button className={styles.primary} onClick={() => {setStarted(true);open('evidence');}}>Start the investigation</button>}
  </div>
  {started && <>
   <nav className={styles.trail} aria-label="Visited investigation steps"><span>Revisit a step:</span><button onClick={() => open('evidence')} aria-current={step === 'evidence' ? 'step' : undefined}>Compare observations</button>{trail.map(key => <button key={key} onClick={() => open(key)} aria-current={step === key ? 'step' : undefined}>{paths[key]}</button>)}</nav>
   <div className={styles.workspace}>
   <div className={styles.main}><div className={styles.reveal} key={step}>
    {step === 'evidence' ? <><h4 ref={heading} tabIndex={-1}>The currencies differ. Start there?</h4><p>{evidence.currency} {period === 'FY2025' && 'The periods also differ; keep that as the next check.'}</p><button className={styles.primary} onClick={() => open('currency')}>Inspect currency conversion</button><div className={styles.choices}><button onClick={() => open('period')}>Check the period first</button></div><details className={styles.alternatives}><summary>Explore different evidence instead</summary><p>These standalone what-if cases show how another finding would call for a different tool.</p><button onClick={() => open('definition')}>What if the definitions differ?</button><button onClick={() => open('sources')}>What if the sources disagree?</button></details></> : <>
     <h4 ref={heading} tabIndex={-1}>{paths[step]}</h4><p>{step === 'period' ? (period === 'FY2025' ? evidence.period : 'Both observations cover FY2024. The reporting periods match; inspect any remaining currency-normalized difference.') : evidence[step]}</p>
     {step === 'currency' && <><label className={styles.notes}>Conversion assumption: €{rate.toFixed(2)} per £1<input aria-label="Euros per pound" type="range" min="1" max="1.5" step="0.01" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label><div className={styles.metric}><span>€{latest}m ÷ {rate.toFixed(2)}</span><strong>{money(normalized)}</strong><span>Latest EBITDA in GBP</span></div></>}
     {step === 'definition' && <><p className={styles.hint}>Separate example · Same period, GBP throughout.</p><div className={styles.bridge}><span>Adjusted EBITDA <b>£12m</b></span><label><input type="checkbox" checked={adjustment} onChange={e=>setAdjustment(e.target.checked)}/> Remove restructuring add-back <b>−£2m</b></label><span>{adjustment ? 'Reported basis' : 'Still adjusted — not comparable'} <b>£{adjustment ? 10 : 12}m</b></span></div></>}
     {step === 'sources' && <><p className={styles.hint}>Separate example · Same period and reported EBITDA definition, GBP throughout.</p><div className={styles.documents}>{[['draft','Draft report','2 June','£12m','Preliminary, pending final adjustments.'],['signed','Signed report','9 June','£10m','Final version; supersedes the 2 June draft.']].map(([key,title,date,value,detail])=><label key={key}><input type="radio" name={`${uid}-source`} checked={source===key} onChange={()=>setSource(key)}/><strong>{title}</strong><span>{date} · {value}</span><p>{detail}</p></label>)}</div></>}
     {step === 'period' && <div className={styles.bridge}><span>Acquisition record · FY2024 <b>£10m</b></span><span>Latest · {period}, converted at {rate.toFixed(2)} <b>{money(normalized)}</b></span><p>Inspect the reporting period above or revisit currency conversion. A change in either updates this comparison.</p></div>}
     <p className={styles.evidence} aria-live="polite">{result(step)}</p><button className={styles.primary} onClick={record}>{findings[step] ? 'Update saved finding' : 'Save finding'}</button>
     {findings[step] && !stale(step,findings[step]) && <p role="status">Finding saved.</p>}
     <label className={styles.notes}>Your notes for this step<textarea value={notes[step] || ''} onChange={e=>setNotes({...notes,[step]:e.target.value})} placeholder="What would you check next?" /></label>
     {step === 'currency' && <div className={styles.followup}><h4>{period === 'FY2025' ? 'Next: the periods differ too.' : 'Next: compare on the same-period basis.'}</h4><p>{period === 'FY2025' ? 'The latest report covers FY2025, but the acquisition record covers FY2024. Keep those dates visible when interpreting the difference.' : 'Both records cover FY2024. Carry the converted value into a comparison with the acquisition record.'}</p><button onClick={()=>open('period')}>Continue to reporting periods →</button></div>}
     {step === 'period' && <div className={styles.followup}><h4>{Math.abs(normalized - 10) < 0.005 ? (period === 'FY2024' ? 'The figures now reconcile.' : 'Equal amounts, different years.') : 'What would explain the remaining difference?'}</h4><p>{Math.abs(normalized - 10) < 0.005 ? (period === 'FY2024' ? 'For the same period at this sample rate, currency explains the apparent gap. Save the finding or change an assumption to explore further.' : 'The converted amounts are equal at this sample rate, but they cover different years. Equal totals do not establish unchanged operating performance.') : (period === 'FY2024' ? 'Both records cover the same year. Check the conversion assumption first: the sample reconciles at €1.20 per £1. A different assumed rate creates a difference; it is not evidence of a business change.' : 'We would need a revenue and cost bridge, along with the appropriate currency basis for both years, to explain the difference. That evidence is missing from this sample; the next step would be to request it, rather than guess a cause.')}</p><button onClick={() => open('currency')}>Revisit exchange-rate assumption</button></div>}
     <button onClick={()=>open('evidence')}>Back to observations</button>
    </>}
   </div></div><aside className={styles.sidebar}><h4>{alternative ? 'Separate what-if example · FY2024' : `${company} · Reported EBITDA`}</h4>{alternative ? <><dl><div><dt>{step === 'definition' ? 'Reported EBITDA' : 'Signed report'}</dt><dd>£10m</dd></div><div><dt>{step === 'definition' ? 'Adjusted EBITDA' : 'Draft report'}</dt><dd>£12m</dd></div></dl><p>GBP throughout. This example has its own evidence; it does not change the main investigation.</p></> : <><dl><div><dt>Acquisition · FY2024</dt><dd>£10m</dd></div><div><dt>Latest · {period}</dt><dd>€{latest}m</dd></div></dl><p>Same metric definition. Different currencies{period === 'FY2025' ? ' and reporting periods' : ''}.</p></>}<div className={styles.history}><h4>Saved findings</h4>{Object.keys(findings).length === 0 && <p>Your findings will appear here.</p>}{Object.entries(findings).map(([key,item]) => <div className={styles.saved} key={key}><button onClick={() => open(key)}>{paths[key]}</button><p>{['definition','sources'].includes(key) ? 'What-if example · ' : `${item.period} · €${item.rate.toFixed(2)} per £1 · `}{item.text}</p>{stale(key,item) && <strong role="status">Assumptions changed · review and update this finding</strong>}</div>)}</div></aside></div>
  </>}
 </section>;
}
