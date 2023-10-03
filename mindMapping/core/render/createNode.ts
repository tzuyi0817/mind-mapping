import { G } from '@svgdotjs/svg.js';
import Style from './style';
import type { RenderTree } from '../../types/mapping';

class CreateNode {
  renderTree!: RenderTree;
  style!: Style;

  constructor() {}
  createTextNode() {
    const group = new G();
    const { text } = this.renderTree.node.data;
    const textNode = group.text(text).y(0);

    this.style.setTextStyle(textNode);
    const { width, height } = group.bbox();

    return {
      node: group,
      width: Math.ceil(width),
      height: Math.ceil(height),
    };
  }
}

export default CreateNode;
