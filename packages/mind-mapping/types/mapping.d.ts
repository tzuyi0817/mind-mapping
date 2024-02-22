import MindNode from '../core/node';

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
  isExpand?: boolean;
  uid?: string;
}

export interface RenderTree {
  node: MappingBase;
  parent?: MappingBase;
  isRoot: boolean;
  deep?: number;
}