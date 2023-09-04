import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

export function remarkTocHeadings() {
  return (tree, file) => {
    const toc = [];

    visit(tree, 'heading', (node) => {
      const textContent = toString(node);
      const normalizedTextContent = textContent.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

      toc.push({
        'depth': node.depth,
        'id': normalizedTextContent,
        'url': `#${normalizedTextContent}`,
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
