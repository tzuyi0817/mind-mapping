import type { Text, Path, Rect } from '@svgdotjs/svg.js';
import type MindNode from './index';
import type { Theme, ThemeNode, ThemeKey } from '../../types/theme';
import type { Shape } from '../../types/shape';
import type { NodeExpandButton } from '../../types/node';

class Style {
  constructor(public node: MindNode) {}

  static setBackgroundStyle(theme: Theme, element: HTMLElement) {
    const { backgroundColor } = theme;

    element.style.backgroundColor = backgroundColor;
  }
  getCommonStyle<T extends keyof Omit<Theme, 'root' | 'second' | 'node' | 'generalization'>>(prop: T): Theme[T] {
    return this.node.renderer.theme[prop];
  }
  getStyle<T extends ThemeKey<ThemeNode>>(prop: T): (ThemeNode | Theme['root'])[T] {
    const {
      renderer: { theme },
      renderTree: { deep = 0 },
      isGeneralization,
    } = this.node;

    if (isGeneralization) return theme.generalization[prop];
    if (deep === 0) return theme.root[prop];
    if (deep === 1) return theme.second[prop];
    return theme.node[prop];
  }
  getTextStyle() {
    return {
      fontSize: this.getStyle('fontSize'),
      fontWeight: this.getStyle('fontWeight'),
      fontFamily: this.getStyle('fontFamily'),
      lineHeight: this.getStyle('lineHeight'),
      fontStyle: this.getStyle('fontStyle'),
      color: this.getStyle('color'),
      textDecoration: this.getStyle('textDecoration'),
      fillColor: this.getStyle('fillColor'),
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
  setDomTextStyle(text: HTMLElement) {
    const style = this.getTextStyle();

    text.style.fontSize = `${style.fontSize}px`;
    text.style.fontWeight = style.fontWeight;
    text.style.fontFamily = style.fontFamily;
    text.style.lineHeight = `${style.lineHeight}`;
    text.style.fontStyle = style.fontStyle;
    text.style.color = style.color;
    text.style.textDecoration = style.textDecoration;
    text.style.backgroundColor = style.fillColor === 'transparent' ? '#fff' : style.fillColor;
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
      color: this.node.renderer.options.hoverRectColor,
    });
  }
  setGeneralizationLineStyle(line: Path) {
    line.fill({ color: 'none' }).stroke({
      width: this.getCommonStyle('generalizationLineWidth'),
      color: this.getCommonStyle('generalizationLineColor'),
    });
  }
  setExpandButtonStyle({ open, close, fill }: NodeExpandButton) {
    const { expandButtonStyle: style } = this.node.renderer.options;

    open.fill({ color: style.color });
    close.fill({ color: style.color });
    fill.fill({ color: style.fill });
  }
}

export default Style;
