import EventEmitter from 'eventemitter3';
import { MOUSE_BUTTON_ENUM } from '../configs/mouse';
import type { Svg } from '@svgdotjs/svg.js';

interface props {
  draw: Svg;
  element: HTMLElement;
}

class Event extends EventEmitter {
  draw: Svg;
  element: HTMLElement;

  isMousedown = false;
  isFramePoint = true;
  mousedownButton = MOUSE_BUTTON_ENUM.LEFT;
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
    this.isMousedown = true;
    this.mousedownPosition.x = event.clientX;
    this.mousedownPosition.y = event.clientY;
    this.emit('mousedown', event);
    isMousedownDraw && this.emit('mousedown-draw', event);
  }
  onMousemove(event: MouseEvent) {
    if (!this.isMousedown || !this.isFramePoint) return;
    event.preventDefault();
    const { x, y } = this.mousedownPosition;
    const isDrag = this.mousedownButton !== MOUSE_BUTTON_ENUM.RIGHT;

    this.isFramePoint = false;
    window.requestAnimationFrame(() => {
      this.mousemoveOffset.x = event.clientX - x;
      this.mousemoveOffset.y = event.clientY - y;
      this.emit('mousemove', event);
      isDrag && this.emit('drag-draw', event);
      this.isFramePoint = true;
    });
  }
  onMouseup() {
    this.isMousedown = false;
  }
  onMousewheel(event: WheelEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.emit('mousewheel', event);
  }
}

export default Event;
