import { G } from '@svgdotjs/svg.js';
import Style from './style';

class CreateNode {
  style!: Style;

  constructor() {}
  createTextNode() {
    const group = new G();
    const fontSize = this.style.getStyle('fontSize');

    console.log({ fontSize });
  }
}

export default CreateNode;
