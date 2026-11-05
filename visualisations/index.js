'use client';

/**
 * Blog visualisation catalogue
 *
 * Article-specific interactive diagrams live here rather than in the reusable
 * design system. Registering a component in this map makes its name available
 * to compiled blog and project MDX through the local MDX renderer.
 */

import { lazy, Suspense, useSyncExternalStore } from 'react';

import ImprovementKataExplorerSkeleton from './ImprovementKataExplorer/ImprovementKataExplorer.skeleton';
import DiagramSkeleton from './DiagramSkeleton';

/*
 * Each diagram loads as its own chunk. next/dynamic is avoided: it renders a server-only preload
 * sibling, which shifts React's useId tree between the server and the browser, so every diagram using
 * useId failed to hydrate. The diagram is not server-rendered either: its CSS module travels with the
 * lazy chunk, so server HTML would paint unstyled until the chunk arrived. The server and the hydration
 * pass render the skeleton; the diagram mounts once the browser owns the tree.
 */
// The store never changes (mounted-ness is fixed once true), so the subscribe function has nothing to do.
const subscribeNoop = () => () => undefined;
const useMounted = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

const diagram = (load, Fallback = DiagramSkeleton) => {
  const Component = lazy(load);
  const Diagram = (props) => {
    const mounted = useMounted();

    if (!mounted) return <Fallback />;

    return <Suspense fallback={ <Fallback /> }><Component { ...props } /></Suspense>;
  };

  return Diagram;
};

const AgileCadenceExplorer = diagram(() => import('./AgileCadenceExplorer'));
const AgileChartsExplorer = diagram(() => import('./AgileChartsExplorer'));
const DittoStagesExplorer = diagram(() => import('./DittoStagesExplorer'));
const DittoStagesExplorerV2 = diagram(() => import('./DittoStagesExplorerV2'));
const GaudiBarLayout = diagram(() => import('./GaudiBarLayout'));
const GaudiBarLayoutV2 = diagram(() => import('./GaudiBarLayoutV2'));
const GenerativeRoutingExplorer = diagram(() => import('./GenerativeRoutingExplorer'));
const GenerativeRoutingExplorerV2 = diagram(() => import('./GenerativeRoutingExplorerV2'));
const GenerativeUIComparison = diagram(() => import('./GenerativeUIComparison'));
const GenerativeUIBlockBuilder = diagram(() => import('./GenerativeUIBlockBuilder'));
const GrowthLevelsExplorer = diagram(() => import('./GrowthLevelsExplorer'));
const GrowthLevelsExplorerV2 = diagram(() => import('./GrowthLevelsExplorerV2'));
const ImprovementKataExplorer = diagram(() => import('./ImprovementKataExplorer'), ImprovementKataExplorerSkeleton);
const JsonLdGraphExplorer = diagram(() => import('./JsonLdGraphExplorer'));
const OlapCubeExplorer = diagram(() => import('./OlapCubeExplorer'));
const SparqlPatternExplorer = diagram(() => import('./SparqlPatternExplorer'));
const LinkedDataQualityFramework = diagram(() => import('./LinkedDataQualityFramework'));
const LinkedDataQualityFrameworkV2 = diagram(() => import('./LinkedDataQualityFrameworkV2'));
const PipelineDiagram = diagram(() => import('./PipelineDiagram'));
const PipelineDiagramV2 = diagram(() => import('./PipelineDiagramV2'));
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
  DittoStagesExplorerV2,
  GaudiBarLayout,
  GaudiBarLayoutV2,
  GenerativeRoutingExplorer,
  GenerativeRoutingExplorerV2,
  GenerativeUIBlockBuilder,
  GenerativeUIComparison,
  GrowthLevelsExplorer,
  GrowthLevelsExplorerV2,
  ImprovementKataExplorer,
  JsonLdGraphExplorer,
  LinkedDataQualityFramework,
  LinkedDataQualityFrameworkV2,
  OlapCubeExplorer,
  PipelineDiagram,
  PipelineDiagramV2,
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
