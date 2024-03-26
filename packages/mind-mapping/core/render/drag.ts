import { G, type MatrixExtract, type Box } from '@svgdotjs/svg.js';
import Renderer from './renderer';
import MindNode from '../node';
import { throttle } from '../../utils/common';
import { isOverlap, isDragAction } from '../../utils/element';
import { MOUSE_BUTTON_ENUM } from '../../configs/mouse';
import type { NodeMouseEvent, NodeOverlap } from '../../types/node';

class Drag {
  isMousedown = false;
  isDragging = false;
  target: MindNode | null = null;
  drawGroupMatrix: MatrixExtract | null = null;
  nodesMap: Map<number, MindNode[]> | null = null;
  clone: G | null = null;
  cloneBbox?: Box;
  overlapNode: MindNode | null = null;

  startPosition = { x: 0, y: 0 };
  offset = { x: 0, y: 0 };
  transform = { x: 0, y: 0 };

  constructor(public renderer: Renderer) {
    this.bindEvents();
    this.onEvents();
    this.checkOverlap = throttle(this.checkOverlap);
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

    if (!this.isDragging && !isDragAction(clientX - x) && !isDragAction(clientY - y)) return;
    this.startDrag();
    this.dragCloneNode(clientX, clientY);
    this.updateDrawGroupMatrix();
    this.renderer.select.stopMoveDrawEdge();
    this.renderer.select.checkDrawEdge(clientX, clientY);
  }
  onMouseup() {
    if (!this.isMousedown) return;
    this.isMousedown = this.isDragging = false;
    this.renderer.moveNodeToBeChild(this.target, this.overlapNode);
    this.reset();
  }
  updateDrawGroupMatrix() {
    return (this.drawGroupMatrix = this.renderer.group.transform());
  }
  startDrag() {
    if (this.isDragging || !this.target) return;
    const drawGroupMatrix = this.updateDrawGroupMatrix();
    const { scaleX = 1, scaleY = 1, translateX = 0, translateY = 0 } = drawGroupMatrix;

    this.isDragging = true;
    this.offset.x = this.startPosition.x - this.target.left * scaleX - translateX;
    this.offset.y = this.startPosition.y - this.target.top * scaleY - translateY;
    this.cloneNode(this.target);
    this.generateCheckMap();
  }
  cloneNode(node: MindNode) {
    if (!node.nodeGroup) return;
    const { dragOpacity } = this.renderer.options;
    const clone = node.nodeGroup.clone();
    const expandElement = clone.findOne('.mind-mapping-expand-button');

    expandElement?.remove();
    this.clone = clone;
    this.cloneBbox = clone.bbox();
    this.backupGroup.add(clone);

    clone.opacity(dragOpacity.clone);
    node.setOpacity(dragOpacity.target);
    node.inactive();
    node.hideComponent();
    node.hideChildren();
  }
  generateCheckMap() {
    window.requestAnimationFrame(() => {
      if (!this.target) return;
      this.nodesMap = this.renderer.createNodesMap(this.target);
    });
  }
  dragCloneNode(clientX: number, clientY: number) {
    if (!this.isDragging || !this.clone) return;
    const { scaleX = 1, scaleY = 1, translateX = 0, translateY = 0 } = this.drawGroupMatrix ?? {};
    const x = (clientX - this.offset.x - translateX) / scaleX;
    const y = (clientY - this.offset.y - translateY) / scaleY;

    this.clone.transform({ translate: [x, y] });
    this.transform.x = x;
    this.transform.y = y;
    this.checkOverlap();
  }
  removeCloneNode() {
    if (!this.clone) return;
    this.clone.remove();
    this.clone = null;
  }
  checkOverlap() {
    if (!this.cloneBbox || !this.nodesMap) return;
    const { width, height } = this.cloneBbox;
    const { x: left, y: top } = this.transform;
    const rect = { left, top, right: left + width, bottom: top + height };
    const overlap: NodeOverlap = { node: null, deep: -1 };

    for (const [deep, nodes] of this.nodesMap) {
      const node = nodes.find(node => isOverlap(node, rect));

      if (!node) continue;
      overlap.node = node;
      overlap.deep = deep;
      break;
    }
    if (this.overlapNode && this.overlapNode === overlap.node) return;
    this.renderer.clearActiveNodes();
    this.overlapNode = null;
    if (!overlap.node) return;
    overlap.node.active();
    this.overlapNode = overlap.node;
  }
  reset() {
    if (!this.target) return;
    this.removeCloneNode();
    this.renderer.clearActiveNodes();
    this.target.setOpacity(1);
    this.target.showComponent();
    this.target.showChildren();
    this.target = this.nodesMap = this.overlapNode = null;
  }
}

export default Drag;
