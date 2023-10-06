import type { Svg } from '@svgdotjs/svg.js';
import Event from './event';

class Draw {
  startPosition = { x: 0, y: 0 };
  currentPosition = { x: 0, y: 0 };

  draw!: Svg;
  event!: Event;

  constructor() {
    this.bindEvents();
  }
  bindEvents() {
    this.moveDraw = this.moveDraw.bind(this);
  }
  onEvents() {
    this.event.on('mousedown', () => {
      this.startPosition.x = this.currentPosition.x;
      this.startPosition.y = this.currentPosition.y;
    });
    this.event.on('drag-draw', this.moveDraw);
  }
  moveDraw() {
    const { mousemoveOffset } = this.event;

    this.currentPosition.x = this.startPosition.x + mousemoveOffset.x;
    this.currentPosition.y = this.startPosition.y + mousemoveOffset.y;
    this.transform();
  }
  transform() {
    const { x, y } = this.currentPosition;

    this.draw.transform({
      origin: [0, 0],
      translate: [x, y],
    });
  }
}

export default Draw;
