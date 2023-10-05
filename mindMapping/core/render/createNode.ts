import { G, Rect } from '@svgdotjs/svg.js';
import MindMapping from '../../index';
import Style from './style';
import type { RenderTree } from '../../types/mapping';

class CreateNode {
  renderTree!: RenderTree;
  mindMapping!: MindMapping;
  style!: Style;
  width!: number;
  height!: number;

  constructor() {}
  get content() {
    return this.renderTree.node.data;
  }
  get hoverRectPadding() {
    return this.mindMapping.options.hoverRectPadding;
  }
  createTextNode() {
    const group = new G();
    const { text } = this.content;
    const textNode = group.text(text).y(0);

    this.style.setTextStyle(textNode);
    const { width, height } = group.bbox();

    return {
      node: group,
      width: Math.ceil(width),
      height: Math.ceil(height),
    };
  }
  createHoverNode() {
    const hoverRectPadding = this.hoverRectPadding;
    const width = this.width + hoverRectPadding * 2;
    const height = this.height + hoverRectPadding * 2;
    const hoverNode = new Rect().size(width, height).x(-hoverRectPadding).y(-hoverRectPadding);

    hoverNode.addClass('mind-mapping-hover-node');
    this.style.setHoverStyle(hoverNode);
    return hoverNode;
  }
}

export default CreateNode;
