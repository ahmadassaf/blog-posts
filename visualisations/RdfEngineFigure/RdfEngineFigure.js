'use client';

/**
 * RDF Engine Figure
 *
 * @description Three interactive figures for the article on building an RDF
 * database. `architecture` lets the reader open each part of the layered
 * design, `engines` steps a query through the engine before and after, and
 * `fact` shows which facts a caller can see for the tokens they hold.
 * Nothing autoplays; every state change is a reader action.
 */

import { useId, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';

import { defaultPartId, facts, findPart, hasDisagreement, isVisible, journey, labelText, layers, statuses, tokens, visibleFacts } from './RdfEngineFigure.data';

import styles from './RdfEngineFigure.module.css';

const Architecture = ({ uid }) => {
  const [ partId, setPartId ] = useState(defaultPartId);
  const active = findPart(partId);

  const renderBlock = (part) => (
    <button
      key={ part.id }
      type='button'
      className={ styles.block }
      data-status={ part.status }
      data-selected={ part.id === active.id }
      aria-pressed={ part.id === active.id }
      aria-controls={ `${uid}-detail` }
      aria-label={ `${part.label}, ${statuses[part.status].toLowerCase()}` }
      onClick={ () => setPartId(part.id) }
    >
      <strong>{part.label}</strong>
      <span>{part.sub}</span>
    </button>
  );

  return (
    <>
      <div className={ styles.diagram }>
        <div className={ styles.server }>
          <div className={ styles.serverHead }>
            <span className={ styles.serverLabel }>One server, replaceable at any time</span>
            <ul className={ styles.legend } aria-label='Key'>
              {Object.entries(statuses).map(([ id, label ]) => (
                <li key={ id } data-status={ id }><span aria-hidden='true' />{label}</li>
              ))}
            </ul>
          </div>
          {layers.filter((layer) => !layer.outside).map((layer) => (
            <section key={ layer.id } className={ styles.band } data-kind={ layer.kind } aria-label={ layer.label }>
              {layer.kind !== 'row' && <span className={ styles.bandLabel }>{layer.label}</span>}
              <div className={ styles.blocks }>{layer.parts.map(renderBlock)}</div>
            </section>
          ))}
        </div>
        {layers.filter((layer) => layer.outside).map((layer) => (
          <section key={ layer.id } className={ styles.outside } aria-label={ layer.label }>
            <div className={ styles.blocks }>{layer.parts.map(renderBlock)}</div>
          </section>
        ))}
      </div>

      <div className={ styles.detail } id={ `${uid}-detail` } aria-live='polite'>
        <div className={ styles.detailHeading }>
          <h3>{active.title}</h3>
          <span className={ styles.badge } data-status={ active.status }>{statuses[active.status]}</span>
        </div>
        <p>{active.description}</p>
        <div className={ styles.note }>
          <Icon name='Info' decorative />
          <p>{active.agent}</p>
        </div>
      </div>
    </>
  );
};

const Engines = ({ uid }) => {
  const [ index, setIndex ] = useState(0);
  const active = journey[index];

  return (
    <>
      <div className={ styles.rail }>
        <ol className={ styles.steps } aria-label='Stages of a query'>
          {journey.map((step, position) => (
            <li key={ step.id } className={ styles.step } data-selected={ position === index }>
              <button
                type='button'
                className={ styles.stepButton }
                aria-label={ `Step ${position + 1}: ${step.label}` }
                aria-current={ position === index ? 'step' : undefined }
                aria-controls={ `${uid}-detail` }
                onClick={ () => setIndex(position) }
              >
                <span className={ styles.node } aria-hidden='true'>{position + 1}</span>
                <span className={ styles.stepLabel }>{step.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className={ styles.detail } id={ `${uid}-detail` } aria-live='polite'>
        <div className={ styles.detailHeading }>
          <h3>{active.title}</h3>
        </div>
        <dl className={ styles.compare }>
          <div data-side='before'><dt>Where we began</dt><dd>{active.before}</dd></div>
          <Icon name='ArrowRight' className={ styles.compareArrow } decorative />
          <div data-side='now'><dt>One engine</dt><dd>{active.now}</dd></div>
        </dl>
      </div>

      <div className={ styles.navigation }>
        <Button size='sm' variant='ghost' tone='neutral' onClick={ () => setIndex((value) => value - 1) } disabled={ index === 0 } aria-label='Previous stage'>
          <Icon name='ArrowLeft' decorative /><span>Previous</span>
        </Button>
        <span className={ styles.position } role='status'>Step {index + 1} of {journey.length}</span>
        <Button size='sm' variant='ghost' tone='neutral' onClick={ () => setIndex((value) => value + 1) } disabled={ index === journey.length - 1 } aria-label='Next stage'>
          <span>Next</span><Icon name='ArrowRight' decorative />
        </Button>
      </div>
    </>
  );
};

const Fact = () => {
  const [ held, setHeld ] = useState([ 'sourceA' ]);
  const visible = visibleFacts(held);
  const toggle = (id) => setHeld((current) => (current.includes(id) ? current.filter((token) => token !== id) : [ ...current, id ]));

  return (
    <>
      <div className={ styles.toolbar } role='group' aria-label='Tokens the caller holds'>
        <span className={ styles.toolbarLabel }>The caller holds</span>
        {tokens.map((token) => {
          const on = held.includes(token.id);

          return (
            <Button key={ token.id } size='sm' tone='neutral' variant={ on ? 'solid' : 'ghost' } aria-pressed={ on } onClick={ () => toggle(token.id) }>
              {token.label}
            </Button>
          );
        })}
      </div>

      <ul className={ styles.facts } aria-label='Stored facts and whether this caller can see them'>
        {facts.map((fact) => {
          const shown = isVisible(fact, held);

          return (
            <li key={ fact.id } className={ styles.fact } data-visible={ shown }>
              <span className={ styles.factState }>
                <Icon name={ shown ? 'Check' : 'Lock' } decorative />
                <span className={ styles.srOnly }>{shown ? 'Visible' : 'Hidden'}</span>
              </span>
              <p className={ styles.statement }>
                <span>{fact.subject}</span> <span className={ styles.predicate }>{fact.predicate}</span> <strong>{shown ? fact.object : 'hidden'}</strong>
              </p>
              <dl className={ styles.factMeta }>
                <div><dt>Source</dt><dd>{shown ? fact.source : 'hidden'}</dd></div>
                <div><dt>Label</dt><dd><code>{labelText(fact)}</code></dd></div>
              </dl>
            </li>
          );
        })}
      </ul>

      <div className={ styles.detail } role='status'>
        <p><strong>This caller sees {visible.length} of {facts.length} facts.</strong> The others are dropped by the scan before any other part of the query runs.</p>
        {hasDisagreement(held) && (
          <div className={ styles.note }>
            <Icon name='Info' decorative />
            <p>Two sources disagree about the headcount. Both facts are kept, each with its source, and a policy decides which to prefer when reading.</p>
          </div>
        )}
      </div>
    </>
  );
};

const FIGURES = {
  'architecture': {
    'description': 'Select a box to see what it does and why an agent cares. Colour separates the core engine from the add-ons.',
    'render': Architecture,
    'title': 'The design, layer by layer'
  },
  'engines': {
    'description': 'Step through a query, and compare how each stage worked when we began with how it works on one engine.',
    'render': Engines,
    'title': 'From two query paths to one engine'
  },
  'fact': {
    'description': 'Change which tokens the caller holds and watch which facts they are allowed to see.',
    'render': Fact,
    'title': 'Every fact carries a source and a label'
  }
};

export default function RdfEngineFigure({ figure = 'architecture' }) {
  const uid = useId();
  const name = figure in FIGURES ? figure : 'architecture';
  const { description, 'render': Render, title } = FIGURES[name];

  return (
    <figure className={ styles.root } data-testid={ `rdf-engine-figure-${name}` } aria-labelledby={ `${uid}-title` }>
      <figcaption className={ styles.caption }>
        <strong id={ `${uid}-title` }>{title}</strong>
        <span>{description}</span>
      </figcaption>
      <div className={ styles.canvas }>
        <Render uid={ uid } />
      </div>
    </figure>
  );
}
