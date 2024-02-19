import Renderer from '../render/renderer';
import type { NodeMouseEvent } from '../../types/node';

class Drag {
  startPosition = { x: 0, y: 0 };

  renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.bindEvents();
    this.onEvents();
  }
  bindEvents() {
    this.start = this.start.bind(this);
  }
  onEvents() {
    this.renderer.event.on('mousedown-node', this.start);
  }
  start({ node, event }: NodeMouseEvent) {
    this.startPosition = { x: event.clientX, y: event.clientY };
  }
}

export default Drag;
