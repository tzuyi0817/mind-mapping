import type { Polygon } from '@svgdotjs/svg.js';
import { isDragAction, isOverlap } from '../../utils/element';
import { throttle } from '../../utils/common';
import { bfsNodeTree } from '../../utils/bfs';
import { MOUSE_BUTTON_ENUM } from '../../configs/mouse';
import type Renderer from './renderer';

class Select {
  perFrame = 1000 / 60;
  moveEdgeTimer: NodeJS.Timeout | null = null;
  isMouseDown = false;
  selectArea: Polygon | null = null;

  constructor(public renderer: Renderer) {
    this.bindEvents();
    this.onEvents();
    this.checkOverlap = throttle(this.checkOverlap);
  }
  bindEvents() {
    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
  }
  onEvents() {
    this.renderer.event.on('mousedown', this.onMousedown);
    this.renderer.event.on('mousemove', this.onMousemove);
    this.renderer.event.on('mouseup', this.onMouseup);
  }
  onMousedown(event: MouseEvent) {
    const { ctrlKey, button } = event;
    const { RIGHT } = MOUSE_BUTTON_ENUM;

    if (!ctrlKey && button !== RIGHT) return;
    event.preventDefault();
    this.isMouseDown = true;
    this.createSelectArea();
  }
  onMousemove(event: MouseEvent) {
    if (!this.isMouseDown) return;
    const { mousemoveOffset: offset, mousedownPosition: start } = this.renderer.event;

    if (!isDragAction(offset.x) && !isDragAction(offset.y)) return;
    const { clientX, clientY } = event;

    this.selectArea?.plot([start.x, start.y, clientX, start.y, clientX, clientY, start.x, clientY]);
    this.checkOverlap();
  }
  onMouseup() {
    this.stopMoveDrawEdge();
    if (!this.isMouseDown) return;
    this.isMouseDown = false;
    this.selectArea?.remove();
    this.selectArea = null;
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
  createSelectArea() {
    const {
      options: { selectAreaStyle },
    } = this.renderer;

    this.selectArea = this.renderer.draw
      .polygon()
      .fill(selectAreaStyle.fill)
      .stroke({ color: selectAreaStyle.strokeColor });
  }
  checkOverlap() {
    window.requestAnimationFrame(() => {
      const rootNode = this.renderer.rootNode?.instance;

      if (!this.selectArea || !rootNode) return;
      const drawGroupMatrix = this.renderer.group.transform();
      const { scaleX = 1, scaleY = 1, translateX = 0, translateY = 0 } = drawGroupMatrix;
      const { x, x2, y, y2 } = this.selectArea.bbox();
      const selectRect = {
        left: (x - translateX) / scaleX,
        top: (y - translateY) / scaleY,
        right: (x2 - translateX) / scaleX,
        bottom: (y2 - translateY) / scaleY,
      };

      bfsNodeTree(rootNode, node => {
        isOverlap(node, selectRect) ? node.active() : node.inactive();
      });
    });
  }
}

export default Select;
