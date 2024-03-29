import type Renderer from './core/renderer';
import type { RenderTree } from './types/mapping';
import type { MindMappingOptions } from './types/options';

declare class MindMapping {
  element: MindMappingOptions['element'];
}

declare class MindNode {
  constructor(uid: string, renderTree: RenderTree, renderer: Renderer, isGeneralization?: boolean);
  // nodeGroup: G | null;
  children: MindNode[];
  isMouseover: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
  isResize: boolean;

  // uid: string;
  // renderTree: RenderTree;
  // renderer: Renderer;
  // shape: Shape;
  // style: Style;
  // line: Line;
  // expandButton: ExpandButton;
  // generalization: Generalization;
  // event: NodeEvent;
  // text?: NodeMap;
  // isGeneralization: boolean;
  // shapeNode?: Path;
  // hoverNode?: Rect;
}
