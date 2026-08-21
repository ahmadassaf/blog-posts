/**
 * Blog visualisation catalogue
 *
 * Article-specific interactive diagrams live here rather than in the reusable
 * design system. Registering a component in this map makes its name available
 * to compiled blog and project MDX through the local MDX renderer.
 */

import GaudiBarLayout from './GaudiBarLayout';
import LinkedDataQualityFramework from './LinkedDataQualityFramework';
import PipelineDiagram from './PipelineDiagram';
import RdfBlankNodeExplorer from './RdfBlankNodeExplorer';
import RdfCollectionExplorer from './RdfCollectionExplorer';
import RdfContainerExplorer from './RdfContainerExplorer';
import RdfTripleExplorer from './RdfTripleExplorer';
import UnifiedProcessorExplorer from './UnifiedProcessorExplorer';

export const VisualisationComponents = {
  GaudiBarLayout,
  LinkedDataQualityFramework,
  PipelineDiagram,
  RdfBlankNodeExplorer,
  RdfCollectionExplorer,
  RdfContainerExplorer,
  RdfTripleExplorer,
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
