import { Path } from '@svgdotjs/svg.js';
import MindNode from '../core/render/node';
import type { ThemeLineStyle } from './theme';

export interface LayoutRenderLine {
  node: MindNode;
  lineStyle: ThemeLineStyle;
  lines: Array<Path>;
  setStyle?: (line: Path) => void;
}
