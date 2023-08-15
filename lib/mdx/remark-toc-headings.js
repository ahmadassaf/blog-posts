import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

export function remarkTocHeadings() {
  return (tree, file) => {
    const toc = [];

    visit(tree, 'heading', (node) => {
      const textContent = toString(node);

      toc.push({
        'depth': node.depth,
        'url': `#${textContent.replace(/\s+/g, '-').toLowerCase()}`,
        'value': textContent
      });
    });
    file.data.toc = toc;
  };
}

export async function extractTocHeadings(markdown) {
  const vfile = await remark().use(remarkTocHeadings).process(markdown);

  return vfile.data.toc;
}
