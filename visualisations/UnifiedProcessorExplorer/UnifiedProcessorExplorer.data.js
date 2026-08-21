const markdown = {
  'code': '.md / .mdx',
  'description': 'Human-authored Markdown enters or leaves the processor as plain text.',
  'id': 'markdown',
  'kind': 'document',
  'label': 'Markdown',
  'type': 'Document'
};

const html = {
  'code': '.html',
  'description': 'Browser-ready HTML enters or leaves the processor as serialized markup.',
  'id': 'html',
  'kind': 'document',
  'label': 'HTML',
  'type': 'Document'
};

const mdast = {
  'code': 'mdast',
  'description': 'The Markdown Abstract Syntax Tree preserves headings, paragraphs, links, lists, and embedded MDX as structured nodes.',
  'id': 'mdast',
  'kind': 'tree',
  'label': 'MDAST',
  'plugin': {
    'code': 'remark-*',
    'description': 'Remark plugins visit and transform Markdown-level nodes before the tree moves on.',
    'id': 'remark-plugins',
    'label': 'remark plugins',
    'type': 'Plugin layer'
  },
  'type': 'Syntax tree',
  'utility': {
    'code': 'mdast-util-*',
    'description': 'MDAST utilities provide focused helpers for creating, inspecting, and changing Markdown tree nodes.',
    'id': 'mdast-utils',
    'label': 'mdast utilities',
    'type': 'Utility layer'
  }
};

const hast = {
  'code': 'hast',
  'description': 'The Hypertext Abstract Syntax Tree represents HTML elements, attributes, text, and embedded nodes in a form tools can inspect.',
  'id': 'hast',
  'kind': 'tree',
  'label': 'HAST',
  'plugin': {
    'code': 'rehype-*',
    'description': 'Rehype plugins visit and transform HTML-level nodes before the tree is serialized.',
    'id': 'rehype-plugins',
    'label': 'rehype plugins',
    'type': 'Plugin layer'
  },
  'type': 'Syntax tree',
  'utility': {
    'code': 'hast-util-*',
    'description': 'HAST utilities provide focused helpers for creating, inspecting, and changing HTML tree nodes.',
    'id': 'hast-utils',
    'label': 'hast utilities',
    'type': 'Utility layer'
  }
};

const edge = (id, label, description, type = 'Processor') => {
  return { description, id, label, type };
};

export const processorViews = {
  'rehype': {
    'description': 'Inspect how Rehype parses HTML into HAST, lets plugins and utilities modify the tree, and serializes it back again.',
    'nodes': { hast, html },
    'routes': {
      'forward': {
        'edges': [ edge('rehype-parse', 'rehype-parse', 'Parses HTML markup and produces a HAST syntax tree.', 'Parser') ],
        'label': 'HTML → HAST',
        'order': [ 'html', 'hast' ]
      },
      'reverse': {
        'edges': [ edge('rehype-stringify', 'rehype-stringify', 'Serializes a HAST syntax tree back into HTML markup.', 'Compiler') ],
        'label': 'HAST → HTML',
        'order': [ 'hast', 'html' ]
      }
    },
    'title': 'Rehype works on the HTML tree'
  },
  'remark': {
    'description': 'Inspect how Remark parses Markdown into MDAST, lets plugins and utilities modify the tree, and serializes it back again.',
    'nodes': { markdown, mdast },
    'routes': {
      'forward': {
        'edges': [ edge('remark-parse', 'remark-parse', 'Parses Markdown text and produces an MDAST syntax tree.', 'Parser') ],
        'label': 'Markdown → MDAST',
        'order': [ 'markdown', 'mdast' ]
      },
      'reverse': {
        'edges': [ edge('remark-stringify', 'remark-stringify', 'Serializes an MDAST syntax tree back into Markdown text.', 'Compiler') ],
        'label': 'MDAST → Markdown',
        'order': [ 'mdast', 'markdown' ]
      }
    },
    'title': 'Remark works on the Markdown tree'
  },
  'unified': {
    'credit': 'Adapted from Timothy Lin’s Unified pipeline diagram.',
    'description': 'Follow the complete processor in either direction, then select any tree, package, plugin layer, or utility surface to inspect its role.',
    'nodes': { hast, html, markdown, mdast },
    'routes': {
      'forward': {
        'edges': [
          edge('remark-parse', 'remark-parse', 'Parses Markdown text and produces an MDAST syntax tree.', 'Parser'),
          edge('remark-rehype', 'remark-rehype', 'Transforms the Markdown tree into the equivalent HTML tree.', 'Tree bridge'),
          edge('rehype-stringify', 'rehype-stringify', 'Serializes the HAST syntax tree into HTML markup.', 'Compiler')
        ],
        'label': 'Markdown → HTML',
        'order': [ 'markdown', 'mdast', 'hast', 'html' ]
      },
      'reverse': {
        'edges': [
          edge('rehype-parse', 'rehype-parse', 'Parses HTML markup and produces a HAST syntax tree.', 'Parser'),
          edge('rehype-remark', 'rehype-remark', 'Transforms the HTML tree into the equivalent Markdown tree.', 'Tree bridge'),
          edge('remark-stringify', 'remark-stringify', 'Serializes the MDAST syntax tree into Markdown text.', 'Compiler')
        ],
        'label': 'HTML → Markdown',
        'order': [ 'html', 'hast', 'mdast', 'markdown' ]
      }
    },
    'title': 'Unified connects Markdown and HTML through syntax trees'
  }
};

export const getProcessorView = (view) => processorViews[view] || processorViews.unified;
