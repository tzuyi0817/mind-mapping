import { RenderTree } from './render-tree';

export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface NodeRect extends Rect {
  height: number;
  width: number;
  renderTree: RenderTree;
}
