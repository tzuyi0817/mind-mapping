import { G, Circle, SVG } from '@svgdotjs/svg.js';

export interface NodeMap {
  node: G;
  width: number;
  height: number;
}

export interface NodeExpandButton {
  node?: G;
  fill?: Circle;
  open?: SVG;
  close?: SVG;
}
