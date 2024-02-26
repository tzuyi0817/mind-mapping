import MindNode from '../core/node';

export function bfsNodeTree(root: MindNode, callback: (node: MindNode) => boolean | void) {
  const queue: MindNode[] = [root];

  while (queue.length) {
    const node = queue.shift() as MindNode;
    const isFilter = callback(node);

    if (!isFilter && node.children.length) {
      queue.push(...node.children);
    }
  }
}
