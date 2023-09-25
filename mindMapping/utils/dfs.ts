import type { RenderTree } from '../types/mapping';

export function dfsRenderTree({ node, parent, isRoot }: RenderTree, callback: (renderTree: RenderTree) => void) {
  if (node.children?.length) {
    node.children.forEach(node => {
      dfsRenderTree({ node, parent, isRoot: false }, callback);
    });
  }
  callback?.({ node, parent, isRoot });
}
