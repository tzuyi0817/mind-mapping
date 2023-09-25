import { SVG, type Svg, type G } from '@svgdotjs/svg.js';
import Renderer from './core/render/renderer';
import type { MindMappingOptions } from './types/options';

class MindMapping {
  options: MindMappingOptions;
  element: MindMappingOptions['element'];
  elementRect: DOMRect;
  width: number;
  height: number;
  draw: Svg;
  group: G;
  renderer: Renderer;

  constructor(options: MindMappingOptions) {
    this.options = this.createOption(options);
    this.element = this.options.element;
    this.elementRect = this.element.getBoundingClientRect();
    this.width = this.elementRect.width;
    this.height = this.elementRect.height;

    // if (this.width <= 0 || this.height <= 0)
    //   throw new Error('The width and height of the container element cannot be 0');

    this.draw = SVG().addTo(this.element).size(this.width, this.height);
    this.group = this.draw.group();
    this.renderer = new Renderer({ mindMapping: this });
  }
  createOption(options: MindMappingOptions) {
    return options;
  }
  render() {
    this.renderer.render();
  }
  rerender() {
    this.group.clear();
  }
}

export default MindMapping;
