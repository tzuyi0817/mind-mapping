import MindNode from '../core/node';
import type { RenderTree } from '../types/mapping';

export function dfsRenderTree(
  { node: root, parent, isRoot, deep = 0 }: RenderTree,
  beforeCallback?: (renderTree: RenderTree) => boolean | void,
  afterCallback?: (renderTree: RenderTree) => void,
) {
  const isExpand = beforeCallback?.({ node: root, parent, isRoot, deep });

  if (root.children?.length && isExpand) {
    root.children.forEach(node => {
      dfsRenderTree({ node, parent: root, isRoot: false, deep: deep + 1 }, beforeCallback, afterCallback);
    });
  }
  afterCallback?.({ node: root, parent, isRoot, deep });
}

export function dfsBoundingNode(
  root: MindNode,
  generalizationNodeMargin: number,
  direction: 'horizontal' | 'vertical',
) {
  const bounding = {
    top: Number.MAX_SAFE_INTEGER,
    right: Number.MIN_SAFE_INTEGER,
    bottom: Number.MIN_SAFE_INTEGER,
    left: Number.MAX_SAFE_INTEGER,
  };
  const current = {
    top: root.top,
    right: root.left + root.width,
    bottom: root.top + root.height,
    left: root.left,
  };
  if (root.children?.length) {
    root.children.forEach(node => {
      const { generalization } = node;
      const { top, right, bottom, left } = dfsBoundingNode(node, generalizationNodeMargin, direction);
      const generalizationWidth = generalization.node ? generalization.node.width + generalizationNodeMargin : 0;
      const generalizationHeight = generalization.node ? generalization.node.height + generalizationNodeMargin : 0;
      const isHorizontal = direction === 'horizontal';

      bounding.top = Math.min(top, bounding.top);
      bounding.right = Math.max(right + (isHorizontal ? generalizationWidth : 0), bounding.right);
      bounding.bottom = Math.max(bottom + (isHorizontal ? 0 : generalizationHeight), bounding.bottom);
      bounding.left = Math.min(left - (isHorizontal ? generalizationWidth : 0), bounding.left);
    });
  }

  return {
    top: Math.min(bounding.top, current.top),
    right: Math.max(bounding.right, current.right),
    bottom: Math.max(bounding.bottom, current.bottom),
    left: Math.min(bounding.left, current.left),
  };
}

export function getChildrenCount(node: MindNode): number {
  const count = node.children.length;

  if (!count) return 0;
  return count + node.children.reduce((total, child) => total + getChildrenCount(child), 0);
}
