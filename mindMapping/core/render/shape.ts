import { Rect, Polygon, Path } from '@svgdotjs/svg.js';
import MindNode from './node';
import { SHAPE } from '../../configs/shape';

class Shape {
  node: MindNode;

  constructor(node: MindNode) {
    this.node = node;
  }
  getShape() {
    return SHAPE.RECTANGLE;
  }
  createShape() {
    const shape = this.getShape();
    const shapeMap = {
      [SHAPE.RECTANGLE]: this.createRect,
    } as const;

    return shapeMap[shape]();
  }
  createRect() {
    return new Rect().size(100, 100).radius(10);
  }
}

export default Shape;
