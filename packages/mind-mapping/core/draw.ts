import { SVG, type Svg, type G } from '@svgdotjs/svg.js';
import Event from './event';
import Renderer from './renderer';
import { MOUSE_WHEEL_ACTION, DIRECTION } from '../configs/constants';
import { DEFAULT_OPTIONS } from '../configs/options';
import { DEFAULT_MAPPING } from '../configs/default-mapping';
import type { MindMappingMergeOptions, MindMappingOptions } from '../types/options';
import type { PickPartial } from '../types/common';

interface ScaleParams {
  x: number;
  y: number;
  scale: number;
}

abstract class Draw {
  width = 0;
  height = 0;
  initialWidth = 0;
  initialHeight = 0;
  startPosition = { x: 0, y: 0 };
  currentPosition = { x: 0, y: 0 };
  scale = 1;

  element!: MindMappingOptions['element'];
  elementRect!: DOMRect;
  options: MindMappingMergeOptions;
  draw!: Svg;
  group!: G;
  linesGroup!: G;
  nodesGroup!: G;
  backupGroup!: G;
  event: Event;
  renderer!: Renderer;

  constructor(options: PickPartial<MindMappingOptions, 'data'>) {
    this.options = this.mergeOption(options);
    this.initElement();
    this.initDraw();
    this.bindEvents();
    this.event = new Event(this.draw, this.element);
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
  getElementRect() {
    this.elementRect = this.element.getBoundingClientRect();
    this.width = this.elementRect.width;
    this.height = this.elementRect.height;

    if (!this.width || !this.height) {
      throw new Error('The width and height of the container element cannot be 0');
    }
  }
  bindEvents() {
    this.dragDraw = this.dragDraw.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
  }
  onEvents() {
    this.event.on('mousedown', () => {
      this.startPosition.x = this.currentPosition.x;
      this.startPosition.y = this.currentPosition.y;
    });
    this.event.on('mousewheel', this.onMouseWheel);
    this.event.on('drag-draw', this.dragDraw);
  }
  dragDraw(event: MouseEvent) {
    if (event.ctrlKey) return;
    const { mousemoveOffset } = this.event;

    this.currentPosition.x = this.startPosition.x + mousemoveOffset.x;
    this.currentPosition.y = this.startPosition.y + mousemoveOffset.y;
    this.transform();
  }
  onMouseWheel(event: WheelEvent) {
    const { mousewheelAction, mousewheelMoveStep } = this.options;
    const { deltaX, deltaY } = event;

    if (!deltaX && !deltaY) return;
    if (mousewheelAction === MOUSE_WHEEL_ACTION.ZOOM) {
      this.zoomDraw(event);
      return;
    }
    const moveX = deltaX ? (deltaX > 0 ? -mousewheelMoveStep : mousewheelMoveStep) : 0;
    const moveY = deltaY ? (deltaY > 0 ? -mousewheelMoveStep : mousewheelMoveStep) : 0;

    this.moveDraw(moveX, moveY);
  }
  zoomDraw(event: WheelEvent) {
    const { scaleCenterUseMousePosition, disableMouseWheelZoom } = this.options;
    if (disableMouseWheelZoom) return;
    const { clientX, clientY, deltaX, deltaY } = event;
    const x = scaleCenterUseMousePosition ? clientX - this.elementRect.left : this.width / 2;
    const y = scaleCenterUseMousePosition ? clientY - this.elementRect.top : this.height / 2;
    const directionX = deltaX > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
    const directionY = deltaY > 0 ? DIRECTION.DOWN : DIRECTION.UP;
    const scaleMap = {
      [DIRECTION.UP]: this.deflation.bind(this),
      [DIRECTION.DOWN]: this.enlarge.bind(this),
      [DIRECTION.LEFT]: this.deflation.bind(this),
      [DIRECTION.RIGHT]: this.enlarge.bind(this),
    };

    deltaY ? scaleMap[directionY](x, y) : scaleMap[directionX](x, y);
  }
  enlarge(x: number, y: number) {
    const scale = this.scale + this.options.scaleRatio;

    this.scaleDraw({ x, y, scale });
  }
  deflation(x: number, y: number) {
    const scale = Math.max(this.scale - this.options.scaleRatio, 0.1);

    this.scaleDraw({ x, y, scale });
  }
  scaleDraw({ x, y, scale }: ScaleParams) {
    const previousScale = this.scale;
    const ratio = 1 - scale / previousScale;
    const moveX = (x - this.currentPosition.x) * ratio;
    const moveY = (y - this.currentPosition.y) * ratio;

    this.scale = scale;
    this.moveDraw(moveX, moveY);
  }
  moveDraw(moveX: number, moveY: number) {
    this.currentPosition.x += moveX;
    this.currentPosition.y += moveY;
    this.transform();
  }
  transform() {
    this.group.transform({
      origin: [0, 0],
      scale: this.scale,
      translate: [this.currentPosition.x, this.currentPosition.y],
    });
  }
}

export default Draw;
