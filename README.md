# Blog content bundle

This repository owns the articles, projects, and bespoke interactive content rendered by the blog engine. The engine consumes this repository at `data/blog` and compiles its MDX at build time.

## Content

Posts and projects are grouped by category and authored as MDX. Frontmatter supplies the content type, title, publication state, taxonomy, and other presentation metadata expected by Contentlayer.

## Custom MDX components

Article-specific interactive work lives in [`visualisations/`](./visualisations). The catalogue exports a content-owned `MDXLayoutRenderer` that merges these components with the reusable Gaudi MDX primitives supplied by the host.

This keeps the responsibilities separate:

- `blog-posts` owns prose, projects, data, and bespoke interactive components;
- `blog` provides the generic Next.js and Contentlayer engine;
- `@gaudi/design-system` provides reusable interface and MDX primitives.

To add an interactive component:

1. Create a self-contained folder under `visualisations/` with its implementation, scoped styles, data, and tests.
2. Export it from `visualisations/index.js`.
3. Use the exported component name directly in MDX, for example `<PipelineDiagram />`.
4. Run the visualization contract tests before publishing the content bundle.

The custom component catalogue is trusted application code and executes in the browser. Do not use it to render unsanitized third-party HTML.

## Verification

```sh
node --test $(find visualisations -name '*.contract.test.js' | sort)
```
