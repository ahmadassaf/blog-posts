/**
 * The layout object from gaudiBar's `lib/configs.js`, as the post shows it, plus a pure mapping from
 * that object to the source lines it occupies. The component highlights lines through this mapping, so
 * the diagram and the snippet in the post cannot drift apart without the contract test noticing.
 */

// Rendering order. The object itself is keyed alphabetically; these arrays carry the order the file uses.
export const primaryBars = [ 'top', 'bottom' ];
export const secondaryRegions = [ 'left', 'middle', 'right' ];

export const layoutConfig = {
  'bottom': {
    'left': [ 'yabai' ],
    'middle': [],
    'right': [ 'stats' ]
  },
  'top': {
    'left': [ 'weather', 'crypto', 'github', 'prayerTime' ],
    'middle': [],
    'right': [ 'dnd', 'time', 'battery', 'network' ]
  }
};

// One line per plugin, taken from each plugin's README in the widget repository.
export const pluginNotes = {
  'battery': 'Charge percentage and AC state; colour and icon adapt to the charge left.',
  'crypto': 'Prices of the coins you track, via CoinMarketCap (needs an API key in .env).',
  'dnd': 'Shows macOS Do Not Disturb and toggles it from the bar.',
  'github': 'Count of GitHub notifications: comments, mentions, assignments, review requests.',
  'network': 'Ethernet or Wi-Fi indicator with the SSID when connected.',
  'prayerTime': 'The upcoming prayer and its time (needs PHP on the PATH).',
  'stats': 'Network traffic, memory and CPU load, free disk space.',
  'time': 'The current time.',
  'weather': 'High and low temperature plus a condition icon for your configured city.',
  'yabai': 'The focused application and its icon, read through the yabai scripting addition.'
};

export const regionId = (bar, region) => `${bar}-${region}`;

const INDENT = '    ';
const quoted = (plugins) => plugins.map((plugin) => `"${plugin}"`).join(', ');

/**
 * Lay the config out as source lines, tagging each line with the bar and region it belongs to.
 * @param {Object} config - A `lib/configs.js` layout object.
 * @returns {Array<{ bar: string | null, number: number, region: string | null, text: string }>}
 */
export function buildConfigLines(config = layoutConfig) {
  const lines = [{ 'bar': null, 'region': null, 'text': 'module.exports = {' }];

  primaryBars.forEach((bar, barIndex) => {
    lines.push({ bar, 'region': null, 'text': `${INDENT}${bar}: {` });
    secondaryRegions.forEach((region, regionIndex) => {
      const comma = regionIndex < secondaryRegions.length - 1 ? ',' : '';

      lines.push({ bar, 'region': regionId(bar, region), 'text': `${INDENT}${INDENT}${region}: [${quoted(config[bar][region])}]${comma}` });
    });
    lines.push({ bar, 'region': null, 'text': `${INDENT}}${barIndex < primaryBars.length - 1 ? ',' : ''}` });
  });
  lines.push({ 'bar': null, 'region': null, 'text': '}' });

  return lines.map((line, index) => {
    return { ...line, 'number': index + 1 };
  });
}

/**
 * Which source lines belong to each region: `{ 'top-left': [3], ... }`.
 * @param {Object} config - A `lib/configs.js` layout object.
 * @returns {Record<string, number[]>}
 */
export function regionLineNumbers(config = layoutConfig) {
  const numbers = {};

  for (const line of buildConfigLines(config))
    if (line.region) numbers[line.region] = [ ...numbers[line.region] || [], line.number ];

  return numbers;
}

/**
 * Lines a primary bar spans, from its opening brace to its closing brace.
 * @param {Object} config - A `lib/configs.js` layout object.
 * @returns {Record<string, { end: number, start: number }>}
 */
export function barLineRanges(config = layoutConfig) {
  const ranges = {};

  for (const line of buildConfigLines(config))
    if (line.bar) ranges[line.bar] = { 'end': line.number, 'start': ranges[line.bar]?.start ?? line.number };

  return ranges;
}

export const configSource = buildConfigLines().map((line) => line.text).join('\n');

export const regions = primaryBars.flatMap((bar) => secondaryRegions.map((region) => {
  return { bar, 'id': regionId(bar, region), 'plugins': layoutConfig[bar][region], region };
}));

export const regionsById = Object.fromEntries(regions.map((region) => [ region.id, region ]));
