# Blog content bundle

This repository owns the articles, projects, and bespoke interactive content rendered by the blog engine. The engine consumes this repository at `data/blog` and compiles its MDX at build time.

## Content

Posts and projects are grouped by category and authored as MDX. Frontmatter supplies the content type, title, publication state, taxonomy, and other presentation metadata expected by Contentlayer.

## Voice and direction for personal stories

Personal stories should show what happened, how I responded, what helped, and what I do differently as a result. Give the practical response enough space that the reader can follow how I found a way forward. This applies across the blog, including the Becoming a CTO series.

Keep the writing personal and natural. Connect lessons to the experience that produced them; avoid generic advice, essay signposting, and conclusions added only to repeat the point. Each story can find its own shape.

Avoid anecdotes about teammates thanking me or praising my work. Show what the work changed through concrete actions and outcomes, rather than using praise as evidence of its value.

Write for an outside reader. Refer naturally to a conversation or "a retro", without dates, internal document labels, or meeting-note categories that the story does not need. Use internal material to ground the experience, rather than narrating it as a report on those sources.

Use only experiences, actions and outcomes supported by the source material. Make the useful response clear while distinguishing what worked from a proposal or a change still being put into practice. Never invent a successful outcome to make a story feel resolved.

Keep useful links to other posts inside natural sentences. Put external reading references at the end of personal stories. Technical documentation, project descriptions and research articles can retain the structure and citations their subject needs.

## Custom MDX components

Do not add decorative labels such as "Synthetic data", "Illustrative", "Demo" or "Interactive illustration" to article visuals. Keep controls and statuses that help readers use them. When example data needs explaining, do it once in the surrounding article rather than repeating badges and disclaimers inside each visual.

Article-specific interactive work lives in [`visualisations/`](./visualisations). The catalogue exports a content-owned `MDXLayoutRenderer` that dynamically loads these components and registers the reusable Gaudi primitives used by the content.

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
