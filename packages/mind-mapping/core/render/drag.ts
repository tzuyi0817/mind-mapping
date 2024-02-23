import Renderer from './renderer';
import type { NodeMouseEvent } from '../../types/node';

class Drag {
  isDragging = false;
  startPosition = { x: 0, y: 0 };

  constructor(public renderer: Renderer) {
    this.bindEvents();
    this.onEvents();
  }
  bindEvents() {
    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
  }
  onEvents() {
    this.renderer.event.on('mousedown-node', this.onMousedown);
    this.renderer.event.on('mousemove', this.onMousemove);
  }
  onMousedown({ node, event }: NodeMouseEvent) {
    const { renderTree, isGeneralization } = node;

    if (renderTree.isRoot || isGeneralization) return;
    this.startPosition = { x: event.clientX, y: event.clientY };
    this.isDragging = true;
  }
  onMousemove() {
    if (!this.isDragging) return;
  }
  onMouseup() {
    if (!this.isDragging) return;
    this.isDragging = false;
  }
}

export default Drag;
