import EventEmitter from 'eventemitter3';
import { isDragButton } from '../utils/element';
import type { Svg } from '@svgdotjs/svg.js';

interface props {
  draw: Svg;
  element: HTMLElement;
}

class Event extends EventEmitter {
  draw: Svg;
  element: HTMLElement;

  isFramePoint = true;
  mousedownButton: number | null = null;
  mousedownPosition = { x: 0, y: 0 };
  mousemoveOffset = { x: 0, y: 0 };

  constructor({ draw, element }: props) {
    super();
    this.draw = draw;
    this.element = element;
    this.bindEvents();
    this.addEventListeners();
  }
  bindEvents() {
    this.onDrawClick = this.onDrawClick.bind(this);
    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.onMousewheel = this.onMousewheel.bind(this);
  }
  addEventListeners() {
    this.draw.on('click', this.onDrawClick);
    this.element.addEventListener('mousedown', this.onMousedown);
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('mouseup', this.onMouseup);
    this.element.addEventListener('wheel', this.onMousewheel);
  }
  removeEventListeners() {
    this.draw.off('click', this.onDrawClick);
    this.element.removeEventListener('mousedown', this.onMousedown);
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
    this.element.removeEventListener('wheel', this.onMousewheel);
    this.removeAllListeners();
  }
  onDrawClick(event: globalThis.Event) {
    this.emit('click-draw', event);
  }
  onMousedown(event: MouseEvent) {
    const { target, button } = event;
    const isMousedownDraw = this.draw.node === target;

    this.mousedownButton = button;
    this.mousedownPosition.x = event.clientX;
    this.mousedownPosition.y = event.clientY;
    this.emit('mousedown', event);
    isMousedownDraw && this.emit('mousedown-draw', event);
  }
  onMousemove(event: MouseEvent) {
    if (!this.isFramePoint) return;
    event.preventDefault();
    const { x, y } = this.mousedownPosition;

    this.isFramePoint = false;
    window.requestAnimationFrame(() => {
      this.emit('mousemove', event);
      this.isFramePoint = true;
      if (!isDragButton(this.mousedownButton)) return;
      this.mousemoveOffset.x = event.clientX - x;
      this.mousemoveOffset.y = event.clientY - y;
      this.emit('drag-draw', event);
    });
  }
  onMouseup(event: MouseEvent) {
    this.mousedownButton = null;
    this.emit('mouseup', event);
  }
  onMousewheel(event: WheelEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.emit('mousewheel', event);
  }
}

export default Event;
