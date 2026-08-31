'use client';

/**
 * Blog visualisation catalogue
 *
 * Article-specific interactive diagrams live here rather than in the reusable
 * design system. Registering a component in this map makes its name available
 * to compiled blog and project MDX through the local MDX renderer.
 */

import dynamic from 'next/dynamic';

const AgileCadenceExplorer = dynamic(() => import('./AgileCadenceExplorer'));
const AgileChartsExplorer = dynamic(() => import('./AgileChartsExplorer'));
const DittoStagesExplorer = dynamic(() => import('./DittoStagesExplorer'));
const GaudiBarLayout = dynamic(() => import('./GaudiBarLayout'));
const GrowthLevelsExplorer = dynamic(() => import('./GrowthLevelsExplorer'));
const ImprovementKataExplorer = dynamic(() => import('./ImprovementKataExplorer'));
const JsonLdGraphExplorer = dynamic(() => import('./JsonLdGraphExplorer'));
const OlapCubeExplorer = dynamic(() => import('./OlapCubeExplorer'));
const SparqlPatternExplorer = dynamic(() => import('./SparqlPatternExplorer'));
const LinkedDataQualityFramework = dynamic(() => import('./LinkedDataQualityFramework'));
const PipelineDiagram = dynamic(() => import('./PipelineDiagram'));
const RdfBlankNodeExplorer = dynamic(() => import('./RdfBlankNodeExplorer'));
const RdfCollectionExplorer = dynamic(() => import('./RdfCollectionExplorer'));
const RdfContainerExplorer = dynamic(() => import('./RdfContainerExplorer'));
const RdfTripleExplorer = dynamic(() => import('./RdfTripleExplorer'));
const RdfVsPropertyGraphExplorer = dynamic(() => import('./RdfVsPropertyGraphExplorer'));
const UnifiedProcessorExplorer = dynamic(() => import('./UnifiedProcessorExplorer'));

export const VisualisationComponents = {
  AgileCadenceExplorer,
  AgileChartsExplorer,
  DittoStagesExplorer,
  GaudiBarLayout,
  GrowthLevelsExplorer,
  ImprovementKataExplorer,
  JsonLdGraphExplorer,
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
  LinkedDataQualityFramework,
  PipelineDiagram,
  RdfBlankNodeExplorer,
  RdfCollectionExplorer,
  RdfContainerExplorer,
  RdfTripleExplorer,
  UnifiedProcessorExplorer };
