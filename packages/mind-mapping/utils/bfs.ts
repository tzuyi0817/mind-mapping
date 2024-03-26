import MindNode from '../core/node';

export function bfsNodeTree(root: MindNode, callback: (node: MindNode) => boolean | void) {
  let queue: MindNode[] = [root];

  while (queue.length) {
    const size = queue.length;
    const nodes: MindNode[] = [];

    for (let index = 0; index < size; index++) {
      const node = queue[index];
      const isFilter = callback(node);

      if (isFilter || !node.children.length) continue;
      nodes.push(...node.children);
    }
    queue = nodes;
  }
}
