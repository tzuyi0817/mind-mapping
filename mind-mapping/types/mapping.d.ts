import MindNode from '../core/render/node';

export interface MappingRoot {
  root: MappingBase;
}

interface MappingBase {
  data: {
    text: string;
    generalization?: {
      text: string;
    };
  };
  children: Array<MappingBase>;
  instance?: MindNode;
  isActive?: boolean;
}

export interface RenderTree {
  node: MappingBase;
  parent?: MappingBase;
  isRoot: boolean;
  deep?: number;
}
