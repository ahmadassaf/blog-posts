'use client';

/**
 * THESIS: The layout object in `lib/configs.js` is the whole layout system; the diagram should prove that, not decorate it.
 * STORY: Pick a region on either bar and the line that places its plugins lights up in the config, with each plugin named once.
 * FORM: Two primary bars rendered as toggle groups beside the real config as a code block; one figure, one status line.
 */

import { useId, useMemo, useState } from 'react';
import { CodeBlock, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLanguage, CodeBlockTitle, toPlainLines } from '@gaudi/design-system/core/CodeBlock';
import { ToggleGroupItem, ToggleGroupRoot } from '@gaudi/design-system/core/ToggleGroup';

import { configSource, pluginNotes, primaryBars, regionLineNumbers, regionsById, secondaryRegions } from './GaudiBarLayoutV2.data';

import styles from './GaudiBarLayoutV2.module.css';

/*
 * The code block receives prepared lines instead of a `highlightedLines` spec. A spec change makes the design
 * system re-tokenise the source asynchronously and show plain text until the new tokens arrive, so every click
 * would flash. Plain lines with a `highlighted` state render synchronously and keep shiki out of this chunk.
 */
const codeLines = toPlainLines(configSource);
const lineNumbersByRegion = regionLineNumbers();

const describeRegion = (region) => `${region.bar} bar, ${region.region} region`;

const PrimaryBar = ({ bar, selectedId, onSelect }) => (
  <div className={ styles.bar } data-bar={ bar }>
    <span className={ styles.barLabel } aria-hidden='true'>{bar} primary bar</span>
    <ToggleGroupRoot
      type='single'
      variant='outline'
      spacing={ 0 }
      className={ styles.regions }
      aria-label={ `${bar} primary bar` }
      value={ regionsById[selectedId].bar === bar ? selectedId : '' }
      onValueChange={ (value) => value && onSelect(value) }
    >
      {secondaryRegions.map((name) => {
        const region = regionsById[`${bar}-${name}`];
        const empty = region.plugins.length === 0;

        return (
          <ToggleGroupItem
            key={ region.id }
            value={ region.id }
            className={ styles.region }
            data-empty={ empty || undefined }
            aria-label={ `${describeRegion(region)}: ${empty ? 'no plugins' : region.plugins.join(', ')}` }
          >
            <span className={ styles.regionName }>{name}</span>
            <span className={ styles.plugins } aria-hidden='true'>
              {region.plugins.map((plugin) => <code key={ plugin }>{plugin}</code>)}
              {empty && <em>empty</em>}
            </span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroupRoot>
  </div>
);

/**
 * @param {Object} props
 * @param {string} [props.id] - Stable id prefix; generated when omitted.
 * @param {string} [props.title] - Visible diagram title.
 * @param {string} [props.description] - Short explanation shown in the figcaption.
 * @param {string} [props.className] - Additional root figure class.
 * @returns {JSX.Element}
 */
const GaudiBarLayoutV2 = ({
  id,
  title = 'The layout is the config',
  description = 'Choose a region on either bar to see the line in lib/configs.js that fills it and the plugins named there. Bars show plugin names only; no readings are simulated.',
  className = ''
}) => {
  const generatedId = useId();
  const uid = id || generatedId;
  const [ selectedId, setSelectedId ] = useState('top-left');
  const [ status, setStatus ] = useState('');
  const selected = regionsById[selectedId];
  const highlighted = lineNumbersByRegion[selectedId];

  const lines = useMemo(() => codeLines.map((line) => {
    return { ...line, 'state': { 'highlighted': highlighted.includes(line.number) } };
  }), [ highlighted ]);

  const select = (regionId) => {
    setSelectedId(regionId);
    setStatus(describeRegion(regionsById[regionId]));
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() } aria-label='How lib/configs.js places gaudiBar plugins'>
      <figcaption className={ styles.caption }>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>

      <div className={ styles.layout }>
        <div className={ styles.desktop } role='group' aria-label='gaudiBar on the desktop'>
          <PrimaryBar bar={ primaryBars[0] } selectedId={ selectedId } onSelect={ select } />
          <p className={ styles.wallpaper } aria-hidden='true'>desktop: the bars sit above the wallpaper and behind every window</p>
          <PrimaryBar bar={ primaryBars[1] } selectedId={ selectedId } onSelect={ select } />
        </div>

        <div className={ styles.config }>
          <CodeBlock
            code={ configSource }
            lines={ lines }
            language='javascript'
            label='The layout object in lib/configs.js'
            className={ styles.code }
            showLineNumbers
          >
            <CodeBlockHeader className={ styles.codeHeader }>
              <CodeBlockTitle>lib/configs.js</CodeBlockTitle>
              <CodeBlockLanguage>js</CodeBlockLanguage>
              <CodeBlockCopyButton className={ styles.copy } alwaysVisible />
            </CodeBlockHeader>
            <CodeBlockContent />
          </CodeBlock>

          <section className={ styles.inspector } aria-labelledby={ `${uid}-region` }>
            <h3 id={ `${uid}-region` } className={ styles.inspectorTitle }>
              <span>{selected.bar} bar</span>
              <span aria-hidden='true'>·</span>
              <span>{selected.region} region</span>
            </h3>
            <p className={ styles.lineRef }>
              Line {highlighted.join(', ')} · {selected.plugins.length === 1 ? '1 plugin' : `${selected.plugins.length} plugins`} in a flex row
            </p>
            {selected.plugins.length > 0 && (
              <dl className={ styles.pluginList }>
                {selected.plugins.map((plugin) => (
                  <div key={ plugin }>
                    <dt><code>{plugin}</code></dt>
                    <dd>{pluginNotes[plugin]}</dd>
                  </div>
                ))}
              </dl>
            )}
            {selected.plugins.length === 0 && (
              <p className={ styles.empty }>
                An empty array renders nothing. Left and right stay on the edges through <code>justify-content: space-between</code>, and the middle region is centred on its own, so leaving it empty costs no space.
              </p>
            )}
          </section>
        </div>
      </div>

      <p className={ styles.visuallyHidden } role='status' aria-live='polite'>{status}</p>
    </figure>
  );
};

export default GaudiBarLayoutV2;
