import { SVG, type Svg, type G } from '@svgdotjs/svg.js';
import Renderer from './core/renderer';
import Style from './core/node/style';
import Event from './core/event';
import Draw from './core/draw';
import Command from './core/command';
import * as themes from './themes';
import { DEFAULT_OPTIONS } from './configs/options';
import { DEFAULT_MAPPING } from './configs/default-mapping';
import './styles/index.css';
import type { MindMappingMergeOptions, MindMappingOptions } from './types/options';
import type { Theme } from './types/theme';
import type { PickPartial } from './types/common';

export { EVENTS } from './configs/event';

class MindMapping extends Draw {
  options: MindMappingMergeOptions;
  element!: MindMappingOptions['element'];
  elementRect!: DOMRect;
  draw!: Svg;
  group!: G;
  linesGroup!: G;
  nodesGroup!: G;
  backupGroup!: G;
  renderer: Renderer;
  theme!: Theme;
  event: Event;
  command: Command;

  constructor(
    options: PickPartial<MindMappingOptions, 'data'>,
    public width = 0,
    public height = 0,
    public initialWidth = 0,
    public initialHeight = 0,
  ) {
    super(width, height);
    this.options = this.mergeOption(options);
    this.initElement();
    this.initDraw();
    this.event = new Event(this.draw, this.element);
    this.onEvents();
    this.command = new Command(this.event);
    this.renderer = new Renderer(this, this.moveDraw.bind(this));
    this.render();
  }
  mergeOption(options: PickPartial<MindMappingOptions, 'data'>) {
    return { data: DEFAULT_MAPPING, ...DEFAULT_OPTIONS, ...options };
  }
  initElement() {
    this.element = this.options.element;
    if (!this.element) throw new Error('The element cannot be empty');
    this.getElementRect();
    this.initialWidth = this.width;
    this.initialHeight = this.height;
  }
  initDraw() {
    this.draw = SVG().addTo(this.element).size(this.width, this.height);
    this.group = this.draw.group();
    this.group.addClass('mind-mapping-group');

    this.linesGroup = this.group.group();
    this.linesGroup.addClass('mind-mapping-lines-group');

    this.nodesGroup = this.group.group();
    this.nodesGroup.addClass('mind-mapping-nodes-group');

    this.backupGroup = this.group.group();
    this.backupGroup.addClass('mind-mapping-backup-group');
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
  getElementRect() {
    this.elementRect = this.element.getBoundingClientRect();
    this.width = this.elementRect.width;
    this.height = this.elementRect.height;

    if (!this.width || !this.height) {
      throw new Error('The width and height of the container element cannot be 0');
    }
  }
  resize() {
    this.getElementRect();
    this.draw.size(this.width, this.height);
  }
  destroy() {
    this.draw.remove();
    this.event.removeEventListeners();
    this.command.clear();
  }
}

export default MindMapping;
