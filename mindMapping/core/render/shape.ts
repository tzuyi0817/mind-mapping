import { Rect, Polygon, Path } from '@svgdotjs/svg.js';
import MindNode from './node';
import { SHAPE } from '../../configs/shape';

interface ShapePadding {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
}

class Shape {
  node: MindNode;

  constructor(node: MindNode) {
    this.node = node;
  }
  static shape() {
    return SHAPE.RECTANGLE;
  }
  getShapePadding({ width, height, paddingX, paddingY }: ShapePadding) {
    const shape = Shape.shape();
    const shapeMap = {} as const;

    return { shapePaddingX: 0, shapePaddingY: 0 };
  }
  createShape() {
    const shape = Shape.shape();
    const shapeMap = {
      [SHAPE.RECTANGLE]: this.createRect.bind(this),
    } as const;

    return shapeMap[shape]();
  }
  createRect() {
    const { width, height } = this.node;
    const borderRadius = this.node.style.getStyle('borderRadius');

    return new Path().plot(`
      M${borderRadius},0
      L${width - borderRadius},0
      C${width - borderRadius},0 ${width},${0} ${width},${borderRadius}
      L${width},${height - borderRadius}
      C${width},${height - borderRadius} ${width},${height} ${width - borderRadius},${height}
      L${borderRadius},${height}
      C${borderRadius},${height} ${0},${height} ${0},${height - borderRadius}
      L${0},${borderRadius}
      C${0},${borderRadius} ${0},${0} ${borderRadius},${0}
      Z
    `);
  }
}

export default Shape;
