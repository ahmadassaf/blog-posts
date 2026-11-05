/**
 * Fixture and pure helpers for the Ditto stages explorer.
 *
 * The transform helpers mirror json-ditto's three mappers (ditto/mappers/premap.js, map.js and
 * postmap.js) for the subset of mapping rules the fixture uses: plain paths, `>>` literals,
 * `||` fallbacks, `!` result references, `@plugin(a|b)` calls and nested objects. Iterable
 * `output`/`innerDocument` blocks, `??` conditions and `$`/`@!` expressions are not modelled.
 * The document and the mapping file are fictional.
 */

export const inputSource = `{
  "firstName": "Mina",
  "lastName": "Okafor",
  "email": "mina@example.org",
  "links": ["https://mina.example", "https://github.com/mina-o"]
}`;

export const mappingSource = `{
  "name": "@concatName(firstName|lastName)",
  "email": { "value": "email" },
  "website": "links[0]",
  "phone": { "mobile": "phones.mobile" },
  "source": ">>crm-export"
}`;

export const inputDocument = JSON.parse(inputSource);
export const mappings = JSON.parse(mappingSource);

const isNil = (value) => value === null || value === undefined;
const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

// Ditto's concatName plugin: join every argument with a space and collapse the gaps.
const concatName = (...parts) => parts
  .flat()
  .join(' ')
  .replace(/\s\s+/g, ' ')
  .trim();

export const plugins = { concatName };

// Lodash-style path lookup for the dot and bracket syntax the rules use.
const getPath = (source, path) => path
  .replace(/\[(?<index>\d+)\]/g, '.$<index>')
  .split('.')
  .filter(Boolean)
  .reduce((current, segment) => (isNil(current) ? undefined : current[segment]), source);

// Mirrors ditto/mappers/lib/extractor.js for the rule forms the fixture needs.
const extract = (document, path, output) => {
  if (isNil(path)) return undefined;
  if (path === '!') return document;
  if (path.startsWith('>>')) return path.slice(2);
  if (path.startsWith('!')) return getPath(output, path.slice(1));
  if (path.includes('||')) {
    const [ primary, fallback ] = path.split('||');

    return extract(document, primary, output) || extract(document, fallback, output);
  }

  return getPath(document, path);
};

// Mirrors ditto/mappers/lib/transformer.js: `@name(a|b)` calls a plugin with resolved arguments.
const transform = (document, rule, output, activePlugins) => {
  if (!rule.startsWith('@')) return extract(document, rule, output);

  const [ name, args = '' ] = rule.slice(1).split(/\((?<args>.*)\)/).filter(Boolean);
  const values = args.split('|').map((arg) => transform(document, arg.replace(',', '|'), output, activePlugins));
  const plugin = activePlugins[name];

  return values.length && plugin ? plugin(...values) : undefined;
};

/** `_preMap`: the published mapper returns the document untouched. */
export const preMap = (document) => document;

/** `_map`: build a new document from the mapping file; keys whose rule resolves to nothing are left out. */
export const map = (document, rules = mappings, activePlugins = plugins) => {
  const processMappings = (input, rule, output) => {
    if (typeof rule === 'string') return transform(input, rule, output, activePlugins);

    const result = {};

    for (const key of Object.keys(rule)) {
      const value = processMappings(input, rule[key], result);

      if (!isNil(value)) result[key] = value;
    }

    return result;
  };

  return processMappings(document, rules, {});
};

// Pure version of ditto/mappers/lib/hoover.js: strip the named keys at any depth.
const hoover = (value, keys) => {
  if (Array.isArray(value)) return value.map((item) => hoover(item, keys));
  if (!isPlainObject(value)) return value;

  return Object.fromEntries(Object.entries(value)
    .filter(([ key ]) => !keys.includes(key))
    .map(([ key, item ]) => [ key, hoover(item, keys) ]));
};

const isEmptyObject = (value) => isPlainObject(value) && Object.keys(value).length === 0;

/** `_postMap`: remove Ditto's internal `$$key` markers, then drop nil values and empty objects at the top level. */
export const postMap = (result) => Object.fromEntries(Object.entries(hoover(result, [ '$$key' ]))
  .filter(([ , value ]) => !isNil(value) && !isEmptyObject(value)));

/** Run the three stages and return the document as it stands after each one, keyed by stage id. */
export const runPipeline = (document = inputDocument, rules = mappings, activePlugins = plugins) => {
  const afterPreMap = preMap(document);
  const afterMap = map(afterPreMap, rules, activePlugins);
  const afterPostMap = postMap(afterMap);

  return {
    'input': document,
    'map': afterMap,
    'output': afterPostMap,
    'postMap': afterPostMap,
    'preMap': afterPreMap
  };
};

/*
 * `highlight` says how the document panel marks a stage: `none` shows it plain, `changes` marks what
 * differs from the previous stage, `all` marks every line because the stage builds the document anew.
 * `mappingKeys` are the mapping-file rules the stage draws attention to.
 */
export const stages = [
  {
    'highlight': 'none',
    'id': 'input',
    'kind': 'arrives as-is',
    'line': 'The document exactly as the source sends it: its own field names, its own nesting.',
    'mappingKeys': [],
    'name': 'Input document'
  },
  {
    'highlight': 'changes',
    'id': 'preMap',
    'kind': 'pass-through hook',
    'line': 'Runs before the mapping to prepare the input; the published mapper returns the document unchanged.',
    'mappingKeys': [],
    'name': '_preMap'
  },
  {
    'highlight': 'all',
    'id': 'map',
    'kind': 'mapping applied',
    'line': 'Builds a new document from the mapping file: every key comes from a rule, and input keys do not carry over.',
    'mappingKeys': [ 'name', 'email', 'website', 'phone', 'source' ],
    'name': '_map'
  },
  {
    'highlight': 'changes',
    'id': 'postMap',
    'kind': 'cleanup',
    'line': 'Strips Ditto’s internal $$key markers and drops empty values: the phone rule matched nothing, so phone goes.',
    'mappingKeys': [ 'phone' ],
    'name': '_postMap'
  },
  {
    'highlight': 'none',
    'id': 'output',
    'kind': 'one shape out',
    'line': 'The unified result. The same input and mapping file always produce this document.',
    'mappingKeys': [],
    'name': 'Unified output'
  }
];

export const defaultStageId = 'map';

export const findStage = (stageId) => stages.find((stage) => stage.id === stageId) || findStage(defaultStageId);

const formatValue = (value) => {
  if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`;

  return JSON.stringify(value);
};

const describe = (key) => (key === undefined ? '' : `"${key}": `);

const comma = (last) => (last ? '' : ',');

// Emit the lines for one key/value with a single change marker; nested objects expand.
const pushValue = (lines, { change, depth, key, last, value }) => {
  if (!isEmptyObject(value) && isPlainObject(value)) {
    const keys = Object.keys(value);

    lines.push({ change, depth, 'text': `${describe(key)}{` });
    keys.forEach((childKey, index) => pushValue(lines, { change, 'depth': depth + 1, 'key': childKey, 'last': index === keys.length - 1, 'value': value[childKey] }));
    lines.push({ change, depth, 'text': `}${comma(last)}` });

    return;
  }

  lines.push({ change, depth, 'text': `${describe(key)}${isEmptyObject(value) ? '{}' : formatValue(value)}${comma(last)}` });
};

// Keys of `after` in order, with keys only `before` had slotted back after their old neighbour.
const mergeKeys = (before, after) => {
  const keys = Object.keys(after);

  Object.keys(before).forEach((name, index, names) => {
    if (keys.includes(name)) return;

    const anchor = index === 0 ? -1 : keys.indexOf(names[index - 1]);

    keys.splice(anchor + 1, 0, name);
  });

  return keys;
};

const leafChange = (before, after) => {
  if (before === undefined) return 'added';
  if (JSON.stringify(before) === JSON.stringify(after)) return 'same';

  return 'changed';
};

const pushDiff = (lines, { after, before, depth, key, last }) => {
  if (isPlainObject(before) && isPlainObject(after) && !isEmptyObject(after)) {
    const keys = mergeKeys(before, after);

    lines.push({ 'change': 'same', depth, 'text': `${describe(key)}{` });
    keys.forEach((name, index) => pushDiff(lines, { 'after': after[name], 'before': before[name], 'depth': depth + 1, 'key': name, 'last': index === keys.length - 1 }));
    lines.push({ 'change': 'same', depth, 'text': `}${comma(last)}` });

    return;
  }

  if (after === undefined) {
    pushValue(lines, { 'change': 'removed', depth, key, last, 'value': before });

    return;
  }

  pushValue(lines, { 'change': leafChange(before, after), depth, key, last, 'value': after });
};

/**
 * Render `after` as JSON-like lines, each carrying a change marker against `before`:
 * `same`, `added`, `changed`, or `removed` for lines `before` had and `after` no longer has.
 */
export const diffDocuments = (before, after) => {
  const lines = [];

  pushDiff(lines, { after, before, 'depth': 0, 'last': true });

  return lines;
};

/** The document panel for a stage: the document after that stage, marked according to the stage's `highlight` mode. */
export const stageView = (stageId, pipeline = runPipeline()) => {
  const stage = findStage(stageId);
  const index = stages.indexOf(stage);
  const document = pipeline[stage.id];

  if (stage.highlight === 'all') return diffDocuments({}, document);
  if (stage.highlight === 'changes' && index > 0) return diffDocuments(pipeline[stages[index - 1].id], document);

  return diffDocuments(document, document);
};

/** 1-based line numbers of the mapping-file rules named by `keys`. */
export const mappingLinesFor = (keys, source = mappingSource) => source
  .split('\n')
  .reduce((found, line, index) => (keys.some((key) => line.trimStart().startsWith(`"${key}":`)) ? [ ...found, index + 1 ] : found), []);
