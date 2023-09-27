import { G } from '@svgdotjs/svg.js';
import Style from './style';
import type { MappingBase } from '../../types/mapping';

class CreateNode {
  nodeData!: MappingBase;
  style!: Style;

  constructor() {}
  createTextNode() {
    const group = new G();
    // const fontStyle = this.style.getTextStyle();
    const { text } = this.nodeData.data;
    const textNode = group.text(text);

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
