import { slug } from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export default function remarkTocHeadings(options) {
  console.log('REMARK');

  return (tree) => visit(tree, 'heading', (node, index, parent) => {
    const textContent = toString(node);

    console.log('options', options);
    console.log('textContent ', textContent);
    options.exportRef.push({
      'depth': node.depth,
      'url': `#${slug(textContent)}`,
      'value': textContent
    });
  });
}
