import Renderer from './renderer';
import type { NodeMouseEvent } from '../../types/node';

class Drag {
  startPosition = { x: 0, y: 0 };

  constructor(public renderer: Renderer) {
    this.bindEvents();
    this.onEvents();
  }
  bindEvents() {
    this.start = this.start.bind(this);
  }
  onEvents() {
    this.renderer.event.on('mousedown-node', this.start);
  }
  start({ event }: NodeMouseEvent) {
    this.startPosition = { x: event.clientX, y: event.clientY };
  }
}

export default Drag;
