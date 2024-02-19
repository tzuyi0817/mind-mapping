import { Rect, Polygon, Path } from '@svgdotjs/svg.js';
import MindNode from './index';
import { SHAPE } from '../../configs/shape';
import type { ShapePadding } from '../../types/shape';

class Shape {
  node: MindNode;

  constructor(node: MindNode) {
    this.node = node;
  }
  get shape() {
    return this.node.style.getStyle('shape');
  }
  getShapePadding({ width, height, paddingX, paddingY }: ShapePadding) {
    const shape = this.shape;
    const shapeMap = {} as const;

    return { shapePaddingX: 0, shapePaddingY: 0 };
  }
  createShape(): Path {
    const shapeMap = {
      [SHAPE.RECTANGLE]: this.createRect.bind(this),
      [SHAPE.DIAMOND]: this.createRect.bind(this),
      [SHAPE.PARALLELOGRAM]: this.createRect.bind(this),
      [SHAPE.ROUNDED_RECTANGLE]: this.createRect.bind(this),
      [SHAPE.OCTAGONAL_RECTANGLE]: this.createRect.bind(this),
      [SHAPE.OUTER_TRIANGULAR_RECTANGLE]: this.createRect.bind(this),
      [SHAPE.INNER_TRIANGULAR_RECTANGLE]: this.createRect.bind(this),
      [SHAPE.ELLIPSE]: this.createRect.bind(this),
      [SHAPE.CIRCLE]: this.createRect.bind(this),
    } as const;

    return shapeMap[this.shape]();
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
