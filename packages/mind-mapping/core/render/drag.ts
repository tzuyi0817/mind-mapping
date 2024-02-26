import { G, type MatrixExtract } from '@svgdotjs/svg.js';
import Renderer from './renderer';
import MindNode from '../node';
import { MOUSE_BUTTON_ENUM } from '../../configs/mouse';
import type { NodeMouseEvent } from '../../types/node';

class Drag {
  MIN_DRAG_DISTANCE = 10;
  isMousedown = false;
  isDragging = false;
  startPosition = { x: 0, y: 0 };
  target: MindNode | null = null;
  drawGroupMatrix: MatrixExtract | null = null;
  clone: G | null = null;
  offset = { x: 0, y: 0 };

  constructor(public renderer: Renderer) {
    this.bindEvents();
    this.onEvents();
  }
  get backupGroup() {
    return this.renderer.mindMapping.backupGroup;
  }
  bindEvents() {
    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
  }
  onEvents() {
    this.renderer.event.on('mousedown-node', this.onMousedown);
    this.renderer.event.on('mousemove', this.onMousemove);
    this.renderer.event.on('mouseup', this.onMouseup);
  }
  onMousedown({ node, event }: NodeMouseEvent) {
    const { renderTree, isGeneralization } = node;
    const { LEFT } = MOUSE_BUTTON_ENUM;
    const { button, clientX, clientY } = event;

    if (button !== LEFT || renderTree.isRoot || isGeneralization) return;
    this.startPosition = { x: clientX, y: clientY };
    this.isMousedown = true;
    this.target = node;
  }
  onMousemove(event: MouseEvent) {
    if (!this.isMousedown) return;
    const { clientX, clientY } = event;
    const { x, y } = this.startPosition;

    if (!this.isDragging && !this.isDragAction(clientX, x) && !this.isDragAction(clientY, y)) return;
    this.startDrag();
    this.dragCloneNode(clientX, clientY);
  }
  onMouseup() {
    if (!this.isMousedown) return;
    this.isMousedown = this.isDragging = false;
    if (!this.target) return;
    this.removeCloneNode();
    this.target.setOpacity(1);
    this.target.showComponent();
    this.target.showChildren();
    this.target = null;
  }
  isDragAction(a: number, b: number) {
    return Math.abs(a - b) > this.MIN_DRAG_DISTANCE;
  }
  startDrag() {
    if (this.isDragging || !this.target) return;
    const drawGroupMatrix = this.renderer.group.transform();
    const { scaleX = 1, scaleY = 1, translateX = 0, translateY = 0 } = drawGroupMatrix;

    this.isDragging = true;
    this.drawGroupMatrix = drawGroupMatrix;
    this.offset.x = this.startPosition.x - this.target.left * scaleX - translateX;
    this.offset.y = this.startPosition.y - this.target.top * scaleY - translateY;
    this.cloneNode(this.target);
  }
  cloneNode(node: MindNode) {
    if (!node.nodeGroup) return;
    const { dragOpacity } = this.renderer.options;
    const clone = node.nodeGroup.clone();
    const expandElement = clone.findOne('.mind-mapping-expand-button');

    expandElement?.remove();
    this.clone = clone;
    this.backupGroup.add(clone);

    clone.opacity(dragOpacity.clone);
    node.setOpacity(dragOpacity.target);
    node.cancelActive();
    node.hideComponent();
    node.hideChildren();
  }
  dragCloneNode(clientX: number, clientY: number) {
    if (!this.isDragging || !this.clone) return;
    const { scaleX = 1, scaleY = 1, translateX = 0, translateY = 0 } = this.drawGroupMatrix ?? {};
    const x = (clientX - this.offset.x - translateX) / scaleX;
    const y = (clientY - this.offset.y - translateY) / scaleY;

    this.clone.transform({ translate: [x, y] });
    this.checkOverlap();
  }
  removeCloneNode() {
    if (!this.clone) return;
    this.clone.remove();
    this.clone = null;
  }
  checkOverlap() {
    if (!this.target) return;
    console.log(this.renderer.createNodesMap(this.target));
  }
}

export default Drag;
