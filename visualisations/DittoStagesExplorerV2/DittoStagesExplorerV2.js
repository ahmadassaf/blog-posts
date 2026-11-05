'use client';

/**
 * THESIS: Ditto is a journey one document takes; the mapping file describes the destination and three stages get it there.
 * FORM: A stage switch above the document as it stands after that stage, with the lines the stage touched marked, and the
 *       mapping file beside it so every output key can be traced to the rule that produced it.
 * SOURCE: Stage behaviour follows json-ditto's published mappers; the document and the mapping file are fictional.
 */

import { useId, useState } from 'react';
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockTitle } from '@gaudi/design-system/core/CodeBlock';
import { ToggleGroupItem, ToggleGroupRoot } from '@gaudi/design-system/core/ToggleGroup';

import { defaultStageId, findStage, mappingLinesFor, mappingSource, runPipeline, stages, stageView } from './DittoStagesExplorerV2.data';

import styles from './DittoStagesExplorerV2.module.css';

// The fixture never changes, so the three stages run once per module load.
const pipeline = runPipeline();

const glyphs = { 'added': '+', 'changed': '~', 'removed': '−', 'same': ' ' };

const DittoStagesExplorerV2 = ({
  id,
  title = 'One document through Ditto’s three stages',
  description = 'Choose a stage to see the document as it stands afterwards. Lines the stage touched are marked, and the mapping file beside it names the rule behind each output key.',
  className = ''
}) => {
  const generatedId = useId();
  const uid = id || generatedId;
  const [ activeStageId, setActiveStageId ] = useState(defaultStageId);
  const stage = findStage(activeStageId);
  const lines = stageView(stage.id, pipeline);
  const hasChanges = lines.some((line) => line.change !== 'same');
  const headingId = `${uid}-heading`;
  const documentId = `${uid}-document`;

  const choose = (value) => {
    if (value) setActiveStageId(value);
  };

  return (
    <figure className={ `${styles.root} ${className}`.trim() }>
      <figcaption className={ styles.caption }>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>

      <ToggleGroupRoot
        type='single'
        variant='outline'
        spacing={ 0 }
        className={ styles.stages }
        aria-label='Pipeline stage'
        value={ stage.id }
        onValueChange={ choose }
      >
        {stages.map((item, index) => (
          <ToggleGroupItem key={ item.id } value={ item.id } className={ styles.stage } aria-controls={ documentId }>
            <span className={ styles.stageIndex } aria-hidden='true'>{index + 1}</span>
            <span className={ styles.stageCopy }>
              <span className={ styles.stageName } data-code={ item.name.startsWith('_') }>{item.name}</span>
              <span className={ styles.stageKind }>{item.kind}</span>
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroupRoot>

      {/* Stage heading spans both columns so the document and the mapping file start on the same line. */}
      <div className={ styles.stageHead }>
        <header className={ styles.panelHeader }>
          <h3 className={ styles.heading } id={ headingId } aria-live='polite' aria-atomic='true'>{stage.name}</h3>
          <span className={ styles.legend }>{hasChanges ? '+ added · − removed by this stage' : 'unchanged by this stage'}</span>
        </header>
        <p className={ styles.line }>{stage.line}</p>
      </div>

      <div className={ styles.panels }>
        <section className={ styles.panel } aria-labelledby={ headingId }>
          <div className={ styles.documentTitle } aria-hidden='true'>document.json</div>
          <pre className={ styles.document } id={ documentId } key={ stage.id }>
            <code>
              {lines.map((line, index) => (
                <span key={ index } className={ styles.docLine } data-change={ line.change } style={{ '--depth': line.depth }}>
                  <span className={ styles.glyph } aria-hidden='true'>{glyphs[line.change]}</span>
                  {line.change !== 'same' && <span className={ styles.srOnly }>{line.change}: </span>}
                  <span>{line.text}</span>
                </span>
              ))}
            </code>
          </pre>
        </section>

        <section className={ styles.panel } aria-label='Mapping file'>
          <CodeBlock code={ mappingSource } language='json' highlightedLines={ mappingLinesFor(stage.mappingKeys) } className={ styles.mapping }>
            <CodeBlockHeader>
              <CodeBlockTitle>mappings.json</CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent />
          </CodeBlock>
        </section>
      </div>

      <small className={ styles.disclosure }>
        The document and the mapping file are fictional. Stage behaviour follows the published <a href='https://github.com/ahmadassaf/json-ditto'>json-ditto</a> mappers.
      </small>
    </figure>
  );
};

export default DittoStagesExplorerV2;
