import { SVG, type Svg, type G } from '@svgdotjs/svg.js';
import Renderer from './core/render/renderer';
import Style from './core/render/style';
import * as themes from './themes';
import type { MindMappingOptions } from './types/options';
import type { Theme } from './types/theme';

class MindMapping {
  options: MindMappingOptions;
  element: MindMappingOptions['element'];
  elementRect: DOMRect;
  width: number;
  height: number;
  draw: Svg;
  group: G;
  renderer: Renderer;
  theme!: Theme;

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
    this.render();
  }
  createOption(options: MindMappingOptions) {
    return options;
  }
  initTheme() {
    this.theme = themes.SKY_BLUE;
    Style.setBackgroundStyle(this.theme, this.element);
  }
  render() {
    this.initTheme();
    this.renderer.render();
  }
  rerender() {
    this.group.clear();
    this.render();
  }
  removeDraw() {
    this.draw.remove();
  }
}

export default MindMapping;
