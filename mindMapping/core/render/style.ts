import { Text, Path, Rect } from '@svgdotjs/svg.js';
import MindNode from './node';
import type { Theme, ThemeNode } from '../../types/theme';
import type { Shape } from '../../types/shape';

class Style {
  node: MindNode;

  constructor(node: MindNode) {
    this.node = node;
  }
  static setBackgroundStyle(theme: Theme, element: HTMLElement) {
    const { backgroundColor } = theme;

    element.style.backgroundColor = backgroundColor;
  }
  getCommonStyle<T extends keyof Omit<Theme, 'root' | 'second' | 'node' | 'generalization'>>(prop: T): Theme[T] {
    return this.node.mindMapping.theme[prop];
  }
  getStyle<T extends keyof ThemeNode>(prop: T): ThemeNode[T] {
    const {
      mindMapping: { theme },
      renderTree: { deep = 0 },
    } = this.node;
    const themeMap = {
      0: theme.root,
      1: theme.second,
    };
    // @ts-ignore
    return themeMap[deep]?.[prop] ?? theme.node[prop];
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
  setShapeStyle(shape: Shape) {
    shape.fill({ color: this.getStyle('fillColor') }).stroke({
      color: this.getStyle('borderColor'),
      width: this.getStyle('borderWidth'),
      dasharray: this.getStyle('borderDasharray'),
    });
  }
  setLineStyle(line: Path) {
    line.fill({ color: 'none' }).stroke({
      width: this.getCommonStyle('lineWidth'),
      color: this.getCommonStyle('lineColor'),
      dasharray: this.getCommonStyle('lineDasharray'),
    });
  }
  setHoverStyle(node: Rect) {
    node.radius(5).fill('none').stroke({
      color: this.node.mindMapping.options.hoverRectColor,
    });
  }
}

export default Style;
