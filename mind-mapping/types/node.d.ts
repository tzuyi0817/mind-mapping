import { G, Circle, Svg, Element } from '@svgdotjs/svg.js';

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
