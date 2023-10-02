import type { RenderTree } from '../types/mapping';

export function dfsRenderTree(
  { node, parent, isRoot, deep = 0 }: RenderTree,
  callback: (renderTree: RenderTree) => void,
) {
  if (node.children?.length) {
    node.children.forEach(node => {
      dfsRenderTree({ node, parent, isRoot: false, deep: deep + 1 }, callback);
    });
  }
  callback?.({ node, parent, isRoot, deep });
}
