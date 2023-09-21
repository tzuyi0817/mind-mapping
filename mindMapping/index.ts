import { SVG, type Svg } from '@svgdotjs/svg.js';
import type { MindMappingOptions } from '@/mindMapping/types/options';

class MindMapping {
  options: MindMappingOptions;
  element: MindMappingOptions['element'];
  elementRect: DOMRect;
  width: number;
  height: number;
  draw: Svg;

  constructor(options: MindMappingOptions) {
    this.options = this.createOption(options);
    this.element = this.options.element;
    this.elementRect = this.element.getBoundingClientRect();
    this.width = this.elementRect.width;
    this.height = this.elementRect.height;

    // if (this.width <= 0 || this.height <= 0)
    //   throw new Error('The width and height of the container element cannot be 0');

    this.draw = SVG().addTo(this.element).size(this.width, this.height);
  }
  createOption(options: MindMappingOptions) {
    return options;
  }
}

export default MindMapping;
