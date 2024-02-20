import { SVG, type Svg, type G } from '@svgdotjs/svg.js';
import Renderer from './core/render/renderer';
import Style from './core/render/style';
import Event from './core/event';
import Draw from './core/draw';
import * as themes from './themes';
import { DEFAULT_OPTIONS } from './configs/options';
import { DEFAULT_MAPPING } from './configs/default-mapping';
import './styles/index.css';
import type { MindMappingMergeOptions, MindMappingOptions } from './types/options';
import type { Theme } from './types/theme';
import type { PickPartial } from './types/common';

class MindMapping extends Draw {
  options: MindMappingMergeOptions;
  element!: MindMappingOptions['element'];
  elementRect!: DOMRect;
  width!: number;
  height!: number;
  draw!: Svg;
  group!: G;
  linesGroup!: G;
  nodesGroup!: G;
  renderer: Renderer;
  theme!: Theme;
  event: Event;

  constructor(options: PickPartial<MindMappingOptions, 'data'>) {
    super();
    this.options = this.mergeOption(options);
    this.initElement();
    this.initDraw();
    this.event = new Event({ draw: this.draw, element: this.element });
    this.onEvents();
    this.renderer = new Renderer({ mindMapping: this });
    this.render();
  }
  mergeOption(options: PickPartial<MindMappingOptions, 'data'>) {
    return { data: DEFAULT_MAPPING, ...DEFAULT_OPTIONS, ...options };
  }
  initElement() {
    this.element = this.options.element;
    if (!this.element) throw new Error('The element cannot be empty');
    this.elementRect = this.element.getBoundingClientRect();
    this.width = this.elementRect.width;
    this.height = this.elementRect.height;

    if (!this.width || !this.height) {
      throw new Error('The width and height of the container element cannot be 0');
    }
  }
  initDraw() {
    this.draw = SVG().addTo(this.element).size(this.width, this.height);
    this.group = this.draw.group();
    this.group.addClass('mind-mapping-group');

    this.linesGroup = this.group.group();
    this.linesGroup.addClass('mind-mapping-lines-group');

    this.nodesGroup = this.group.group();
    this.nodesGroup.addClass('mind-mapping-nodes-group');
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
  resize() {
    this.elementRect = this.element.getBoundingClientRect();
    this.width = this.elementRect.width;
    this.height = this.elementRect.height;
    this.draw.size(this.width, this.height);
  }
  destroy() {
    this.draw.remove();
    this.event.removeEventListeners();
  }
}

export default MindMapping;
