# Content visualisations

This directory owns the bespoke interactive HTML used by this repository's blog and
project MDX. These visualisations explain article-specific ideas and therefore travel
with the content bundle rather than the generic blog engine or reusable Gaudi design
system.

Each visualisation owns a folder containing its implementation, scoped styles, data,
tests, and local `index.js` entry point:

```text
visualisations/
  ComponentName/
    ComponentName.js
    ComponentName.contract.test.js
    ComponentName.data.js
    ComponentName.module.css
    index.js
```

Add each component to `visualisations/index.js`. The content-owned MDX renderer merges
that catalogue with Gaudi's generic MDX primitives, so articles can write
`<ComponentName />` without local imports. The host mounts this repository at
`data/blog`, then imports `visualisations/MDXLayoutRenderer` as its client rendering
boundary.
