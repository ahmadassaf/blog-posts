'use client';

/**
 * THESIS: A knowledge graph is entities joined by directed, labelled relationships, and the same data reads as labelled edges, typed nodes or a property graph.
 * OWN-WORLD: The Semantic Web's own history as a graph you can turn in your hands: people, organisations, places, standards and ideas.
 * STORY: Orbit the graph, pick an entity to light up its neighbourhood, and switch views to see what each graph model adds.
 * FIRST VIEWPORT: The typed view slowly turning, with Tim Berners-Lee focused and his statements listed beside it.
 * FORM: A Three.js scene (browser only) beside a text panel that carries the same facts for every reader.
 */

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Field, { FieldLabel } from '@gaudi/design-system/core/Field';
import { NativeSelect, NativeSelectOption } from '@gaudi/design-system/core/Select';
import { ToggleGroupItem, ToggleGroupRoot } from '@gaudi/design-system/core/ToggleGroup';
import { usePrefersReducedMotion } from '@gaudi/design-system/hooks/a11y/use-prefers-reduced-motion';

import { layoutGraph, nodeById, nodes, nodeTypes, statementsFor, views } from './KnowledgeGraph3D.data.js';

import styles from './KnowledgeGraph3D.module.css';

const typeById = Object.fromEntries(nodeTypes.map((type) => [ type.id, type ]));
const formatProperties = (properties) => Object.entries(properties).map(([ key, value ]) => `${key}: ${value}`).join(', ');

const KnowledgeGraph3D = ({
  title = 'A knowledge graph you can turn around',
  description = 'A small slice of the Semantic Web\'s own history. Drag to orbit, select an entity to light up its neighbourhood, and switch views to see what each graph model adds.',
  className = ''
}) => {
  const uid = useId();
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const positions = useMemo(() => layoutGraph(), []);
  const [ view, setView ] = useState('typed');
  const [ selectedId, setSelectedId ] = useState('tbl');
  const [ hoveredId, setHoveredId ] = useState(null);
  const [ ready, setReady ] = useState(false);

  // The scene loads three.js only in the browser and lives as long as the component
  useEffect(() => {
    let cancelled = false;
    let handle = null;

    import('./KnowledgeGraph3D.scene.js').then(({ createScene }) => {
      if (cancelled || !stageRef.current) return;
      handle = createScene({
        'classNames': styles,
        'container': stageRef.current,
        'onHover': setHoveredId,
        'onSelect': setSelectedId,
        positions,
        reducedMotion
      });
      sceneRef.current = handle;
      setReady(true);
    });

    return () => {
      cancelled = true;
      handle?.dispose();
      sceneRef.current = null;
    };
  }, [ positions, reducedMotion ]);

  useEffect(() => {
    sceneRef.current?.setView(view);
  }, [ view, ready ]);

  // Hover previews a neighbourhood; the selection returns when the pointer leaves
  useEffect(() => {
    sceneRef.current?.setFocus(hoveredId ?? selectedId);
  }, [ hoveredId, selectedId, ready ]);

  const selected = nodeById[selectedId];
  const statements = statementsFor(selectedId);
  const activeView = views.find((item) => item.id === view);

  return (
    <figure className={ `${styles.root} ${className}`.trim() } aria-labelledby={ `${uid}-title` }>
      <figcaption className={ styles.caption }>
        <span id={ `${uid}-title` } className={ styles.title }>{title}</span>
        <span className={ styles.description }>{description}</span>
      </figcaption>

      <div className={ styles.toolbar }>
        <ToggleGroupRoot type='single' variant='outline' size='sm' aria-label='Graph model' value={ view } onValueChange={ (value) => value && setView(value) }>
          {views.map((item) => <ToggleGroupItem key={ item.id } value={ item.id }>{item.label}</ToggleGroupItem>)}
        </ToggleGroupRoot>
        <Field className={ styles.field }>
          <FieldLabel htmlFor={ `${uid}-focus` } className={ styles.fieldLabel }>Focus on</FieldLabel>
          <NativeSelect id={ `${uid}-focus` } size='sm' value={ selectedId } onChange={ (event) => setSelectedId(event.target.value) }>
            {nodes.map((node) => <NativeSelectOption key={ node.id } value={ node.id }>{node.label}</NativeSelectOption>)}
          </NativeSelect>
        </Field>
      </div>

      <div className={ styles.layout }>
        <div className={ styles.stageFrame }>
          <div ref={ stageRef } className={ styles.stage } data-ready={ ready || undefined } />
          {view !== 'labelled' && (
            <ul className={ styles.legend } aria-label='Node types'>
              {nodeTypes.map((type) => (
                <li key={ type.id }><span className={ styles.swatch } style={{ 'background': `var(--ds-color-${type.tone})` }} aria-hidden='true' />{type.label}</li>
              ))}
            </ul>
          )}
          <p className={ styles.hint } aria-hidden='true'>Drag to rotate · click a node</p>
        </div>

        <aside className={ styles.panel } aria-live='polite' aria-label={ `About ${selected.label}` }>
          <p className={ styles.viewNote }>{activeView.description}</p>
          <h4 className={ styles.entity }>
            {view !== 'labelled' && <span className={ styles.swatch } style={{ 'background': `var(--ds-color-${typeById[selected.type].tone})` }} aria-hidden='true' />}
            {selected.label}
          </h4>
          {view !== 'labelled' && <p className={ styles.entityType }>{typeById[selected.type].label}</p>}
          {view === 'property' && Object.keys(selected.properties).length > 0 && (
            <dl className={ styles.properties }>
              {Object.entries(selected.properties).map(([ key, value ]) => (
                <div key={ key }><dt>{key}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          )}
          <ul className={ styles.statements } aria-label={ `Statements about ${selected.label}` }>
            {statements.map((edge) => {
              const otherId = edge.direction === 'out' ? edge.to : edge.from;

              return (
                <li key={ `${edge.from}-${edge.label}-${edge.to}` } className={ styles.statement }>
                  {edge.direction === 'in' && <Button variant='ghost' tone='accent' size='xs' className={ styles.nodeLink } onClick={ () => setSelectedId(otherId) }>{nodeById[otherId].label}</Button>}
                  {edge.direction === 'in' ? null : <span className={ styles.self }>{selected.label}</span>}
                  <span className={ styles.predicate }>{edge.label}</span>
                  {edge.direction === 'out' ? <Button variant='ghost' tone='accent' size='xs' className={ styles.nodeLink } onClick={ () => setSelectedId(otherId) }>{nodeById[otherId].label}</Button> : <span className={ styles.self }>{selected.label}</span>}
                  {view === 'property' && Object.keys(edge.properties).length > 0 && <span className={ styles.edgeProperties }>{formatProperties(edge.properties)}</span>}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </figure>
  );
};

export default KnowledgeGraph3D;
