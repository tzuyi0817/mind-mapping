import { Path, Rect, G } from '@svgdotjs/svg.js';
import MindNode from '../core/node';
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

interface LayoutRenderExpand {
  expandButtonSize: number;
  width: number;
  height: number;
}

export interface LayoutRenderExpandButton extends LayoutRenderExpand {
  node: G;
}

export interface LayoutRenderExpandPlaceholder extends LayoutRenderExpand {
  node: Rect;
}
