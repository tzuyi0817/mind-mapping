import { Path } from '@svgdotjs/svg.js';
import MindNode from '../core/render/node';

export interface LayoutRenderLine {
  node: MindNode;
  lineStyle: string;
  lines: Array<Path>;
  setStyle?: (line: Path) => void;
}
