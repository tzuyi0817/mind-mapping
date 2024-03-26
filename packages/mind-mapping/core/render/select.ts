import Renderer from './renderer';
import { MOUSE_BUTTON_ENUM } from '../../configs/mouse';

class Select {
  perFrame = 1000 / 60;
  moveEdgeTimer: NodeJS.Timeout | null = null;

  constructor(public renderer: Renderer) {
    this.bindEvents();
    this.onEvents();
  }
  bindEvents() {
    this.onMousedown = this.onMousedown.bind(this);
    // this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
  }
  onEvents() {
    this.renderer.event.on('mousedown', this.onMousedown);
    // this.renderer.event.on('mousemove', this.onMousemove);
    this.renderer.event.on('mouseup', this.onMouseup);
  }
  onMousedown(event: MouseEvent) {
    const { ctrlKey, button } = event;
    const { RIGHT } = MOUSE_BUTTON_ENUM;

    if (!ctrlKey && button !== RIGHT) return;
    event.preventDefault();
    console.log('select');
  }
  // onMousemove(event: MouseEvent) {}
  onMouseup() {
    this.stopMoveDrawEdge();
  }
  checkDrawEdge(clientX: number, clientY: number) {
    const {
      elementRect: { left, top, right, bottom },
      options: { drawBorder: border, drawMoveStep: moveStep },
    } = this.renderer;
    const moveX = clientX <= left + border ? moveStep : clientX >= right - border ? -moveStep : 0;
    const moveY = clientY <= top + border ? moveStep : clientY >= bottom - border ? -moveStep : 0;

    this.moveDrawEdge(moveX, moveY);
  }
  moveDrawEdge(moveX: number, moveY: number) {
    if (!moveX && !moveY) return;
    this.renderer.moveDraw(moveX, moveY);
    this.moveEdgeTimer = setTimeout(() => {
      this.moveDrawEdge(moveX, moveY);
    }, this.perFrame);
  }
  stopMoveDrawEdge() {
    if (!this.moveEdgeTimer) return;
    clearTimeout(this.moveEdgeTimer);
  }
}

export default Select;
