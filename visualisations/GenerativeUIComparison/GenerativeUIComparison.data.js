export const salesRecords = Object.freeze([
  { id: 'uk-april', region: 'UK', month: 'April', revenue: 120000, target: 130000, orders: 800, visits: 20000 },
  { id: 'germany-april', region: 'Germany', month: 'April', revenue: 98000, target: 100000, orders: 700, visits: 18000 },
  { id: 'france-april', region: 'France', month: 'April', revenue: 76000, target: 80000, orders: 500, visits: 14000 },
  { id: 'uk-may', region: 'UK', month: 'May', revenue: 156000, target: 150000, orders: 1000, visits: 22000 },
  { id: 'germany-may', region: 'Germany', month: 'May', revenue: 102000, target: 120000, orders: 720, visits: 19000 },
  { id: 'france-may', region: 'France', month: 'May', revenue: 95000, target: 90000, orders: 625, visits: 15000 }
].map((record) => Object.freeze(record)));

export const months = [ 'April', 'May' ];
export const regions = [ 'UK', 'Germany', 'France' ];
export const metricLabels = { revenue: 'Revenue', orders: 'Orders', conversion: 'Conversion' };
export const viewLabels = { overview: 'Chart + table', chart: 'Chart', comparison: 'Month comparison', exceptions: 'Exceptions review', table: 'Data table', summary: 'Summary' };

export const presets = [
  { label: 'Regional performance', prompt: 'Show May revenue across all regions and highlight anyone below target' },
  { label: 'Compare months', prompt: 'Compare UK revenue between April and May' },
  { label: 'Review exceptions', prompt: 'For the May review, show revenue exceptions across all regions' }
];

const unsupported = (message) => ({ ok: false, message });

export const parsePrompt = (prompt, currentScope = {}) => {
  const text = typeof prompt === 'string' ? prompt.trim() : '';
  const lower = text.toLowerCase();

  if (!text) return unsupported('Write a sales question or choose one of the examples.');
  if (text.length > 500) return unsupported('Keep the question under 500 characters.');
  if (!/\b(revenue|sales|orders|conversion|numbers|review|targets?)\b/.test(lower)) {
    return unsupported('This demo understands sales questions about revenue, orders, or conversion. Try an example below the field.');
  }
  if (/\b(?:no|without|not|don't|do not|exclude)\s+(?:(?:a|the)\s+)?(?:chart|table|summary)\b/.test(lower)) {
    return unsupported('Name the format you want: a chart, a table, or a summary. This small demo does not interpret negative layout instructions.');
  }
  const unsupportedYear = [ ...lower.matchAll(/\b(?:19|20)\d{2}\b/g) ].some(([ year ]) => year !== '2026');
  const dayInMonth = /\b(?:april|may)\s+(?:the\s+)?\d{1,2}(?:st|nd|rd|th)?\b|\b\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:april|may)\b/.test(lower);
  const numericDate = /\b\d{1,4}[-/]\d{1,2}(?:[-/]\d{1,4})?\b/.test(lower);
  const relativePeriod = /\b(today|yesterday|tomorrow|ytd|quarters?|quarterly|annual|annually|yearly|q[1-4])\b|\b(?:this|last|next|current|previous)\s+(?:month|year|quarter|week)\b|\byear[ -]to[ -]date\b|\b(?:full|whole|entire)\s+year\b/.test(lower);
  if (unsupportedYear || dayInMonth || numericDate || relativePeriod || /\b(profit|margin|costs?|forecast|predict|prediction|pipeline|weekly|daily|january|february|march|june|july|august|september|october|november|december)\b/.test(lower)) {
    return unsupported('The sample contains April and May 2026 revenue, targets, orders, and visits. It cannot answer forecasts, other periods, or other business metrics.');
  }
  if (/\b(spain|italy|japan|china|america|usa|united states|canada|australia|india|brazil|london|paris|berlin)\b/.test(lower)) {
    return unsupported('Choose UK, Germany, France, or all regions. Other locations are outside this sample.');
  }

  const scopes = [ ...lower.matchAll(/\b(?:in|for|from|across)\s+(?:the\s+)?([a-z]+)\b/g) ];
  if (scopes.some(([, scope ]) => ![ 'uk', 'united', 'germany', 'france', 'all', 'each', 'every', 'april', 'may', 'both', 'this', 'these', 'a', 'my', 'our', 'me', 'review', 'region', 'regions', 'chart', 'table', 'summary' ].includes(scope))) {
    return unsupported('The requested scope is not supported. Use UK, Germany, France, April, May, or all regions.');
  }

  const foundRegions = regions.filter((region) => region === 'UK' ? /\b(uk|united kingdom)\b/.test(lower) : new RegExp(`\\b${region.toLowerCase()}\\b`).test(lower));
  const allRegions = /\b(?:all|each|every)\s+regions?\b/.test(lower);
  if (foundRegions.length > 1 && !allRegions) return unsupported('Choose one region or say “all regions” to compare the full sample.');

  const foundMetrics = Object.keys(metricLabels).filter((metric) => new RegExp(`\\b${metric === 'revenue' ? '(revenue|sales)' : metric}\\b`).test(lower));
  if (foundMetrics.length > 1) return unsupported('Choose one primary metric: revenue, orders, or conversion. The record details include the supporting figures.');

  const metric = foundMetrics[0] || 'revenue';
  const exceptions = /\bexceptions?\b|\bonly\b.*\bbelow\b/.test(lower);
  if ((exceptions || /\btargets?\b/.test(lower)) && metric !== 'revenue') {
    return unsupported('Only revenue has a target in this sample. Ask for revenue exceptions, or remove the target request.');
  }

  const comparison = /\bcompare\b.*\bmonths?\b|\bmonth.*compar|\bapril\b.*\bmay\b|\bmay\b.*\bapril\b/.test(lower);
  if (exceptions && comparison) return unsupported('Review revenue exceptions for one month, or compare both months. This demo has a separate view for each.');
  if (/\b2026\b/.test(lower) && !/\b(?:april|may)\b/.test(lower) && !comparison) {
    return unsupported('Choose April or May 2026. This sample cannot represent a full year.');
  }
  const view = exceptions ? 'exceptions' : comparison ? 'comparison'
    : /\btable\b/.test(lower) && !/\bchart\b/.test(lower) ? 'table'
      : /\bchart\b/.test(lower) && !/\btable\b/.test(lower) ? 'chart'
      : /\bsummary\b|\bsummarize\b/.test(lower) && !/\bchart\b|\btable\b/.test(lower) ? 'summary' : 'overview';

  return {
    ok: true,
    query: {
      prompt: text,
      metric,
      region: allRegions ? 'All regions' : foundRegions[0] || currentScope.region || 'All regions',
      month: /\bapril\b/.test(lower) && !/\bmay\b/.test(lower) ? 'April'
        : /\bmay\b/.test(lower) && !/\bapril\b/.test(lower) ? 'May' : currentScope.month || 'May',
      view,
      highlightBelowTarget: /\bbelow\b|\btargets?\b|\bexceptions?\b/.test(lower)
    }
  };
};

export const summarize = (records) => {
  const total = records.reduce((sum, record) => ({
    revenue: sum.revenue + record.revenue,
    target: sum.target + record.target,
    orders: sum.orders + record.orders,
    visits: sum.visits + record.visits
  }), { revenue: 0, target: 0, orders: 0, visits: 0 });

  return {
    ...total,
    conversion: total.visits ? total.orders / total.visits * 100 : 0,
    gap: total.revenue - total.target,
    gapPercent: total.target ? (total.revenue - total.target) / total.target * 100 : 0,
    averageOrderValue: total.orders ? total.revenue / total.orders : 0
  };
};

export const createResponse = (query, records = salesRecords) => {
  const regionRecords = records.filter((record) => query.region === 'All regions' || record.region === query.region);
  const selected = regionRecords.filter((record) => record.month === query.month);
  const rows = selected.map((record) => ({ ...record, ...summarize([ record ]) }));
  const exceptions = rows.filter((record) => record.gap < 0).sort((left, right) => left.gap - right.gap);

  return {
    query,
    totals: summarize(selected),
    rows,
    exceptions,
    visibleRows: query.view === 'exceptions' ? exceptions : rows,
    monthly: months.map((month) => ({ month, ...summarize(regionRecords.filter((record) => record.month === month)) })),
    recordCount: selected.length
  };
};

export const formatMetric = (value, metric = 'revenue') => metric === 'conversion'
  ? `${value.toFixed(2)}%`
  : new Intl.NumberFormat('en-GB', metric === 'orders'
    ? { maximumFractionDigits: 0 }
    : { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);

export const formatGap = (value) => `${value >= 0 ? '+' : '−'}${formatMetric(Math.abs(value))}`;

export const describeScope = (query) => `${metricLabels[query.metric]} · ${query.region} · ${query.view === 'comparison' ? 'April + May' : query.month} 2026 · ${viewLabels[query.view]}`;

export const getTextAnswer = (response) => {
  const { query, totals, visibleRows, monthly } = response;
  const scope = query.region === 'All regions' ? 'all three regions' : query.region;

  if (query.view === 'comparison') {
    const change = monthly[1][query.metric] - monthly[0][query.metric];
    const changeText = query.metric === 'conversion' ? `${Math.abs(change).toFixed(2)} percentage points` : formatMetric(Math.abs(change), query.metric);

    return {
      introduction: `For ${scope}, ${query.metric} ${change === 0 ? 'was unchanged' : `${change > 0 ? 'increased' : 'decreased'} by ${changeText}`} from April to May 2026.`,
      lines: monthly.map((row) => `${row.month}: ${formatMetric(row[query.metric], query.metric)}${query.metric === 'revenue' ? ` against a ${formatMetric(row.target)} target (${formatGap(row.gap)}).` : '.'}`),
      conclusion: 'Both months use the same definitions. Conversion is orders divided by visits; all currency values are GBP.'
    };
  }

  if (query.view === 'exceptions') {
    return {
      introduction: `${visibleRows.length} ${visibleRows.length === 1 ? 'region is' : 'regions are'} below revenue target in ${query.month} 2026 within ${scope}.`,
      lines: visibleRows.map((row) => `${row.region}: ${formatMetric(row.revenue)} against ${formatMetric(row.target)}, a ${formatMetric(-row.gap)} shortfall (${Math.abs(row.gapPercent).toFixed(1)}%).`),
      conclusion: visibleRows.length ? 'Review the largest shortfall first. These figures identify the gap; they do not establish its cause.' : 'There are no revenue exceptions in this scope.'
    };
  }

  return {
    introduction: `${metricLabels[query.metric]} for ${scope} in ${query.month} 2026 ${query.metric === 'conversion' ? 'is' : 'totals'} ${formatMetric(totals[query.metric], query.metric)}${query.metric === 'revenue' ? ` against a ${formatMetric(totals.target)} target (${formatGap(totals.gap)}, ${totals.gap === 0 ? 'on target' : `${Math.abs(totals.gapPercent).toFixed(1)}% ${totals.gap < 0 ? 'below' : 'above'} target`})` : ''}.`,
    lines: visibleRows.map((row) => `${row.region}: ${formatMetric(row[query.metric], query.metric)}${query.metric === 'revenue' ? `, ${formatGap(row.gap)} versus target.` : '.'}`),
    conclusion: query.metric === 'conversion' ? `The combined rate uses ${formatMetric(totals.orders, 'orders')} orders divided by ${formatMetric(totals.visits, 'orders')} visits, rather than averaging regional percentages.`
      : `${formatMetric(totals.orders, 'orders')} orders from ${formatMetric(totals.visits, 'orders')} visits. Conversion: ${formatMetric(totals.conversion, 'conversion')}. These are fictional monthly totals.`
  };
};

export const sortRows = (rows, key = 'revenue', direction = 'descending') => [ ...rows ].sort((left, right) => {
  const order = typeof left[key] === 'string' ? left[key].localeCompare(right[key]) : left[key] - right[key];

  return direction === 'ascending' ? order : -order;
});
