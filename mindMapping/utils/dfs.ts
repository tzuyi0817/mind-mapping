import type { RenderTree } from '../types/mapping';

export function dfsRenderTree(
  { node: root, parent, isRoot, deep = 0 }: RenderTree,
  callback: (renderTree: RenderTree) => void,
) {
  if (root.children?.length) {
    root.children.forEach(node => {
      dfsRenderTree({ node, parent: root, isRoot: false, deep: deep + 1 }, callback);
    });
  }
  callback?.({ node: root, parent, isRoot, deep });
}
