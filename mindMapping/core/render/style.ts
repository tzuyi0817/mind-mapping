import { Text } from '@svgdotjs/svg.js';
import MindNode from './node';
import type { Theme, ThemeNode } from '../../types/theme';

class Style {
  node: MindNode;

  constructor(node: MindNode) {
    this.node = node;
  }
  getCommonStyle(prop: keyof Omit<Theme, 'root' | 'second' | 'node' | 'generalization'>) {
    return this.node.mindMapping.theme[prop];
  }
  getStyle(prop: keyof ThemeNode) {
    const theme = this.node.mindMapping.theme;
    const themeMap = {
      node: theme.node,
    } as const;

    return themeMap['node'][prop];
  }
  getTextStyle() {
    return {
      fontSize: this.getStyle('fontSize'),
      fontWeight: this.getStyle('fontWeight'),
      fontFamily: this.getStyle('fontFamily'),
      lineHeight: this.getStyle('lineHeight'),
    };
  }
  setTextStyle(text: Text) {
    text
      .font({
        fill: this.getStyle('color'),
        family: this.getStyle('fontFamily'),
        size: this.getStyle('fontSize'),
        style: this.getStyle('fontStyle'),
        weight: this.getStyle('fontWeight'),
      })
      .attr('text-decoration', this.getStyle('textDecoration'));
  }
}

export default Style;
