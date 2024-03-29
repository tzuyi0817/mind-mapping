import EventEmitter from 'eventemitter3';
import { isDragButton } from '../utils/element';
import type { Svg } from '@svgdotjs/svg.js';

interface props {
  draw: Svg;
  element: HTMLElement;
}

interface MouseEventEmitter extends MouseEventInit {
  preventDefault: () => void;
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
    this.onContextmenu = this.onContextmenu.bind(this);
    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.onMousewheel = this.onMousewheel.bind(this);
  }
  addEventListeners() {
    this.draw.on('click', this.onDrawClick);
    this.draw.on('contextmenu', this.onContextmenu);
    this.element.addEventListener('mousedown', this.onMousedown);
    this.element.addEventListener('wheel', this.onMousewheel);
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('mouseup', this.onMouseup);
  }
  removeEventListeners() {
    this.draw.off('click', this.onDrawClick);
    this.draw.off('contextmenu', this.onContextmenu);
    this.element.removeEventListener('mousedown', this.onMousedown);
    this.element.removeEventListener('wheel', this.onMousewheel);
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
    this.removeAllListeners();
  }
  onDrawClick(event: MouseEventEmitter) {
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

    this.isFramePoint = false;
    window.requestAnimationFrame(() => {
      const { x, y } = this.mousedownPosition;

      this.mousemoveOffset.x = event.clientX - x;
      this.mousemoveOffset.y = event.clientY - y;
      this.emit('mousemove', event);
      this.isFramePoint = true;
      if (!isDragButton(this.mousedownButton)) return;

      event.preventDefault();
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
  onContextmenu(event: MouseEventEmitter) {
    event.preventDefault();
    // On Mac, hold down the ctrl key and click the left mouse button to trigger the contextmenu event.
    if (event.ctrlKey) return;
    this.emit('contextmenu', event);
  }
}

export default Event;
