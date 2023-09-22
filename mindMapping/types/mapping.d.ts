export interface MappingRoot {
  root: MappingBase;
}

interface MappingBase {
  data: {
    text: string;
    generalization?: {
      text: string;
    };
    children: Array<MappingBase>;
  };
}
