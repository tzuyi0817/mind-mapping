import type { MindMappingOptions, MindNodeOptions } from './types/options';

declare class MindMapping {
  element: MindMappingOptions['element'];
}

declare class MindNode {
  constructor(options: MindNodeOptions);
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
