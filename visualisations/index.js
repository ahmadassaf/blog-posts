'use client';

/**
 * Blog visualisation catalogue
 *
 * Article-specific interactive diagrams live here rather than in the reusable
 * design system. Registering a component in this map makes its name available
 * to compiled blog and project MDX through the local MDX renderer.
 */

import { lazy, Suspense } from 'react';

/*
 * Each diagram loads as its own chunk and still renders on the server. next/dynamic is avoided: it
 * renders a server-only preload sibling, which shifts React's useId tree between the server and the
 * browser, so every diagram using useId failed to hydrate.
 */
const diagram = (load) => {
  const Component = lazy(load);
  const Diagram = (props) => <Suspense fallback={ null }><Component { ...props } /></Suspense>;

  return Diagram;
};

const AgileCadenceExplorer = diagram(() => import('./AgileCadenceExplorer'));
const AgileChartsExplorer = diagram(() => import('./AgileChartsExplorer'));
const DittoStagesExplorer = diagram(() => import('./DittoStagesExplorer'));
const GaudiBarLayout = diagram(() => import('./GaudiBarLayout'));
const GenerativeRoutingExplorer = diagram(() => import('./GenerativeRoutingExplorer'));
const GenerativeUIComparison = diagram(() => import('./GenerativeUIComparison'));
const GenerativeUIBlockBuilder = diagram(() => import('./GenerativeUIBlockBuilder'));
const GrowthLevelsExplorer = diagram(() => import('./GrowthLevelsExplorer'));
const ImprovementKataExplorer = diagram(() => import('./ImprovementKataExplorer'));
const JsonLdGraphExplorer = diagram(() => import('./JsonLdGraphExplorer'));
const KnowledgeGraph3D = diagram(() => import('./KnowledgeGraph3D'));
const OlapCubeExplorer = diagram(() => import('./OlapCubeExplorer'));
const SparqlPatternExplorer = diagram(() => import('./SparqlPatternExplorer'));
const LinkedDataQualityFramework = diagram(() => import('./LinkedDataQualityFramework'));
const PipelineDiagram = diagram(() => import('./PipelineDiagram'));
const RdfBlankNodeExplorer = diagram(() => import('./RdfBlankNodeExplorer'));
const RdfCollectionExplorer = diagram(() => import('./RdfCollectionExplorer'));
const RdfContainerExplorer = diagram(() => import('./RdfContainerExplorer'));
const RdfTripleExplorer = diagram(() => import('./RdfTripleExplorer'));
const RdfVsPropertyGraphExplorer = diagram(() => import('./RdfVsPropertyGraphExplorer'));
const UnifiedProcessorExplorer = diagram(() => import('./UnifiedProcessorExplorer'));

export const VisualisationComponents = {
  AgileCadenceExplorer,
  AgileChartsExplorer,
  DittoStagesExplorer,
  GaudiBarLayout,
  GenerativeRoutingExplorer,
  GenerativeUIBlockBuilder,
  GenerativeUIComparison,
  GrowthLevelsExplorer,
  ImprovementKataExplorer,
  JsonLdGraphExplorer,
  KnowledgeGraph3D,
  LinkedDataQualityFramework,
  OlapCubeExplorer,
  PipelineDiagram,
  RdfBlankNodeExplorer,
  RdfCollectionExplorer,
  RdfContainerExplorer,
  RdfTripleExplorer,
  RdfVsPropertyGraphExplorer,
  SparqlPatternExplorer,
  UnifiedProcessorExplorer
};

export { GaudiBarLayout,
  GenerativeRoutingExplorer,
  GenerativeUIBlockBuilder,
  GenerativeUIComparison,
  LinkedDataQualityFramework,
  PipelineDiagram,
  RdfBlankNodeExplorer,
  RdfCollectionExplorer,
  RdfContainerExplorer,
  RdfTripleExplorer,
  UnifiedProcessorExplorer };
