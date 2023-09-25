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
}

export interface RenderTree {
  node: MappingBase;
  parent?: MappingBase;
  isRoot: boolean;
}
