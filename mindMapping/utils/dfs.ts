import type { RenderTree } from '../types/mapping';

export function dfsRenderTree(
  { node: root, parent, isRoot, deep = 0 }: RenderTree,
  beforeCallback?: (renderTree: RenderTree) => void,
  afterCallback?: (renderTree: RenderTree) => void,
) {
  beforeCallback?.({ node: root, parent, isRoot, deep });
  if (root.children?.length) {
    root.children.forEach(node => {
      dfsRenderTree({ node, parent: root, isRoot: false, deep: deep + 1 }, beforeCallback, afterCallback);
    });
  }
  afterCallback?.({ node: root, parent, isRoot, deep });
}
