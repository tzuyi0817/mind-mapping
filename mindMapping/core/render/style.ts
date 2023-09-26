import MindNode from './node';
import type { ThemeNode } from '../../types/theme';

class Style {
  node: MindNode;

  constructor(node: MindNode) {
    this.node = node;
  }
  getStyle(prop: keyof ThemeNode) {
    const theme = this.node.mindMapping.theme;

    return theme.node[prop];
  }
}

export default Style;
