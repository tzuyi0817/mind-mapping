import { Path, Rect, G } from '@svgdotjs/svg.js';
import MindNode from '../core/render/node';
import type { ThemeLineStyle } from './theme';

export interface LayoutRenderLine {
  node: MindNode;
  lineStyle: ThemeLineStyle;
  lines: Array<Path>;
  setStyle?: (line: Path) => void;
}

export interface LayoutRenderGeneralization {
  node: MindNode;
  line: Path;
  generalization: MindNode | null;
}

export interface LayoutRenderExpandButton {
  node: G;
  expandBtnSize: number;
  width: number;
  height: number;
}
