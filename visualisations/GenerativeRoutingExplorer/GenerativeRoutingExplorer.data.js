/*
 * Scenario, routes and the stale-finding logic for the generative routing example.
 * Everything here is pure so the contract test can exercise it without React.
 * All figures are fictional.
 */

export const company = 'Northstar';

export const acquisitionRecord = { 'period': 'FY2024', 'valueGbp': 10 };

// Latest reported EBITDA in EUR for each selectable period, in millions.
export const latestEurByPeriod = { 'FY2024': 12, 'FY2025': 14.4 };

export const definitionExample = { 'addBackGbp': 2, 'adjustedGbp': 12, 'reportedGbp': 10 };

export const sourceDocuments = {
  'draft': { 'date': '2 June', 'detail': 'Preliminary, pending final adjustments.', 'title': 'Draft report', 'valueGbp': 12 },
  'signed': { 'date': '9 June', 'detail': 'Final version; supersedes the 2 June draft.', 'title': 'Signed report', 'valueGbp': 10 }
};

export const defaultAssumptions = { 'adjustment': true, 'period': 'FY2025', 'rate': 1.2, 'source': 'signed' };

export const rateRange = { 'max': 1.5, 'min': 1, 'step': 0.01 };

export const assumptionLabels = {
  'adjustment': 'Definition',
  'period': 'Latest period',
  'rate': 'Exchange rate',
  'source': 'Source document'
};

/*
 * Each route lists the assumptions its finding is computed under. A saved finding is
 * stale when any of those assumptions no longer matches the live value.
 */
export const routes = {
  'currency': {
    'depends': [ 'rate', 'period' ],
    'evidence': 'The acquisition record uses GBP; the latest report uses EUR. Converting at an assumed rate is a useful first check.',
    'title': 'Check exchange rate',
    'whatIf': false
  },
  'definition': {
    'depends': [ 'adjustment' ],
    'evidence': 'One observation is reported EBITDA; the other is adjusted EBITDA. Inspect the add-backs before comparing.',
    'title': 'Inspect adjustments',
    'whatIf': true
  },
  'evidence': {
    'depends': [],
    'evidence': 'Compare the two observations, their currencies, periods and definitions before choosing a tool.',
    'title': 'Compare observations',
    'whatIf': false
  },
  'period': {
    'depends': [ 'rate', 'period' ],
    'evidence': 'The acquisition record covers FY2024. Put both figures on the same basis before reading the remaining difference.',
    'title': 'Compare reporting periods',
    'whatIf': false
  },
  'sources': {
    'depends': [ 'source' ],
    'evidence': 'Two documents give different values for the same measure and period. Review their provenance.',
    'title': 'Compare documents',
    'whatIf': true
  }
};

export const routeOrder = [ 'evidence', 'currency', 'period', 'definition', 'sources' ];

export function formatMoney(value) {
  const sign = value < 0 ? '−' : '';

  return `${sign}£${Math.abs(value).toFixed(2)}m`;
}

export function formatDelta(value) {
  if (Math.abs(value) < 0.005) return 'no change';

  return `${value < 0 ? '−' : '+'}£${Math.abs(value).toFixed(2)}m`;
}

export function formatRate(rate) {
  return `€${rate.toFixed(2)} per £1`;
}

export function describeAssumption(key, value) {
  if (key === 'rate') return formatRate(value);
  if (key === 'adjustment') return value ? 'add-back removed' : 'add-back kept';
  if (key === 'source') return `${sourceDocuments[value].title} (${sourceDocuments[value].date})`;

  return String(value);
}

export function latestGbp(assumptions) {
  return latestEurByPeriod[assumptions.period] / assumptions.rate;
}

function currencySummary(assumptions) {
  const value = latestGbp(assumptions);
  const delta = formatDelta(value - acquisitionRecord.valueGbp);
  const years = assumptions.period === acquisitionRecord.period ? 'Both figures cover FY2024, so any remaining gap depends on the rate.' : 'The reporting years still differ; this alone does not explain performance.';

  return `€${latestEurByPeriod[assumptions.period]}m converts to ${formatMoney(value)} at ${formatRate(assumptions.rate)}: ${delta} against the £10m acquisition record. ${years}`;
}

function periodSummary(assumptions) {
  const value = latestGbp(assumptions);
  const difference = value - acquisitionRecord.valueGbp;
  const delta = formatDelta(difference);

  if (assumptions.period === acquisitionRecord.period) return `${formatMoney(value)} versus £10m, both FY2024. At ${formatRate(assumptions.rate)} the remaining difference is ${delta}.`;

  return `${formatMoney(value)} for ${assumptions.period} versus £10m for FY2024: ${delta} (${((value / acquisitionRecord.valueGbp - 1) * 100).toFixed(1)}%). Different years; the comparison alone does not explain the cause.`;
}

function definitionSummary(assumptions) {
  const { addBackGbp, adjustedGbp, reportedGbp } = definitionExample;

  if (assumptions.adjustment) return `£${adjustedGbp}m adjusted − £${addBackGbp}m restructuring add-back = £${reportedGbp}m reported. Definitions explain this gap.`;

  return `£${adjustedGbp}m still includes the £${addBackGbp}m add-back. Not yet comparable with £${reportedGbp}m reported EBITDA.`;
}

function sourcesSummary(assumptions) {
  const document = sourceDocuments[assumptions.source];
  const status = assumptions.source === 'signed' ? 'It supersedes the 2 June draft.' : 'Unresolved: the later signed report supersedes this draft.';

  return `£${document.valueGbp}m from the ${document.title.toLowerCase()} (${document.date}). ${status}`;
}

function definitionValue(assumptions) {
  return assumptions.adjustment ? definitionExample.reportedGbp : definitionExample.adjustedGbp;
}

const calculators = {
  'currency': { 'summary': currencySummary, 'value': latestGbp },
  'definition': { 'summary': definitionSummary, 'value': definitionValue },
  'period': { 'summary': periodSummary, 'value': latestGbp },
  'sources': { 'summary': sourcesSummary, 'value': (assumptions) => sourceDocuments[assumptions.source].valueGbp }
};

/*
 * A finding is a value plus the subset of assumptions it was computed under. Only the
 * assumptions the route depends on are copied, so an unrelated change cannot stale it.
 */
export function computeFinding(routeId, assumptions) {
  const route = routes[routeId];
  const calculator = calculators[routeId];

  if (!route || !calculator) throw new RangeError(`No finding can be computed for route "${routeId}".`);

  const snapshot = Object.fromEntries(route.depends.map((key) => [ key, assumptions[key] ]));

  return {
    'assumptions': snapshot,
    'routeId': routeId,
    'summary': calculator.summary(assumptions),
    'value': calculator.value(assumptions)
  };
}

/*
 * Compares a saved finding with the live assumptions. Returns what changed (old vs new),
 * the finding recomputed under the live assumptions, and the resulting delta in value.
 */
export function reviewFinding(finding, assumptions) {
  const changes = routes[finding.routeId].depends
    .filter((key) => finding.assumptions[key] !== assumptions[key])
    .map((key) => {
      return { 'from': finding.assumptions[key], key, 'label': assumptionLabels[key], 'to': assumptions[key] };
    });
  const current = computeFinding(finding.routeId, assumptions);

  return {
    changes,
    current,
    'delta': current.value - finding.value,
    'stale': changes.length > 0
  };
}

export function countStale(findings, assumptions) {
  return Object.values(findings).filter((finding) => reviewFinding(finding, assumptions).stale).length;
}

/*
 * The suggested next step after a route, phrased from the live assumptions. Returns null
 * for the what-if examples, which stand alone.
 */
export function followUp(routeId, assumptions) {
  const value = latestGbp(assumptions);
  const reconciled = Math.abs(value - acquisitionRecord.valueGbp) < 0.005;
  const samePeriod = assumptions.period === acquisitionRecord.period;

  if (routeId === 'currency') return {
    'action': 'Continue to reporting periods',
    'body': samePeriod ? 'Both records cover FY2024. Carry the converted value into a same-period comparison.' : 'The latest report covers FY2025; the acquisition record covers FY2024. Keep those dates visible when reading the difference.',
    'target': 'period',
    'title': samePeriod ? 'Next: compare on the same-period basis.' : 'Next: the periods differ too.'
  };

  if (routeId === 'period') {
    if (reconciled) return {
      'action': 'Revisit the exchange-rate assumption',
      'body': samePeriod ? 'For the same period at this sample rate, currency explains the apparent gap. Save the finding or change an assumption to explore further.' : 'The converted amounts are equal at this sample rate, but they cover different years. Equal totals do not establish unchanged performance.',
      'target': 'currency',
      'title': samePeriod ? 'The figures now reconcile.' : 'Equal amounts, different years.'
    };

    return {
      'action': 'Revisit the exchange-rate assumption',
      'body': samePeriod ? 'Both records cover the same year, so check the conversion first: the sample reconciles at €1.20 per £1. A different assumed rate creates a difference; it is not evidence of a business change.' : 'Explaining the gap needs a revenue and cost bridge plus the right currency basis for both years. That evidence is missing from this sample; request it rather than guess a cause.',
      'target': 'currency',
      'title': 'What would explain the remaining difference?'
    };
  }

  return null;
}
