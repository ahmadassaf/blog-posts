import { slug } from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export default function remarkTocHeadings(options) {

  return (tree) => visit(tree, 'heading', (node, index, parent) => {
    const textContent = toString(node);

    options.exportRef.push({
      'depth': node.depth,
      'id': slug(textContent),
      'url': `#${slug(textContent)}`,
      'value': textContent
    });
  });
}
