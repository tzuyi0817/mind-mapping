import { G } from '@svgdotjs/svg.js';
import Event from './event';
import { MOUSE_WHEEL_ACTION, DIRECTION } from '../configs/constants';
import type { MindMappingMergeOptions } from '../types/options';

interface ScaleParams {
  x: number;
  y: number;
  scale: number;
}

class Draw {
  startPosition = { x: 0, y: 0 };
  currentPosition = { x: 0, y: 0 };
  scale = 1;

  options!: MindMappingMergeOptions;
  group!: G;
  event!: Event;
  elementRect!: DOMRect;
  width!: number;
  height!: number;

  constructor() {
    this.bindEvents();
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
  dragDraw() {
    const { mousemoveOffset } = this.event;

    this.currentPosition.x = this.startPosition.x + mousemoveOffset.x;
    this.currentPosition.y = this.startPosition.y + mousemoveOffset.y;
    this.transform();
  }
  onMouseWheel(event: WheelEvent) {
    const { mousewheelAction, disableMouseWheelZoom, scaleCenterUseMousePosition, mousewheelMoveStep } = this.options;
    const { clientX, clientY, deltaX, deltaY } = event;

    if (!deltaX && !deltaY) return;
    if (mousewheelAction === MOUSE_WHEEL_ACTION.ZOOM) {
      if (disableMouseWheelZoom) return;
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
      return;
    }
    const moveX = deltaX ? (deltaX > 0 ? -mousewheelMoveStep : mousewheelMoveStep) : 0;
    const moveY = deltaY ? (deltaY > 0 ? -mousewheelMoveStep : mousewheelMoveStep) : 0;

    this.moveDraw(moveX, moveY);
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
    const { x, y } = this.currentPosition;

    this.group.transform({
      origin: [0, 0],
      scale: this.scale,
      translate: [x, y],
    });
  }
}

export default Draw;
