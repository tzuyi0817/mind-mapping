import { G, Circle, Element } from '@svgdotjs/svg.js';
import MindNode from '../core/node';

export interface NodeMap {
  node: G;
  width: number;
  height: number;
}

export interface NodeExpandButton {
  node: G;
  fill: Circle;
  open: Element;
  close: Element;
}

export interface NodeMouseEvent {
  node: MindNode;
  event: MouseEvent;
}
