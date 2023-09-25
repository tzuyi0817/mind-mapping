import { G } from '@svgdotjs/svg.js';
import Renderer from '../../core/render/renderer';
import MindMapping from '../../index';
import Shape from './shape';
import type { MindNodeOptions } from '../../types/options';
import type { MappingBase } from '../../types/mapping';

class MindNode {
  nodeGroup: G | null = null;

  nodeData: MappingBase;
  renderer: Renderer;
  mindMapping: MindMapping;
  group: G;
  shape: Shape;

  constructor(options: MindNodeOptions) {
    this.nodeData = options.data;
    this.renderer = options.renderer;
    this.mindMapping = options.mindMapping;
    this.group = options.group;
    this.shape = new Shape(this);

    this.render();
  }
  render() {
    if (!this.nodeGroup) {
      this.nodeGroup = new G();
    }
    this.group.add(this.nodeGroup);
    this.setLayout();
  }
  setLayout() {
    if (!this.nodeGroup) return;
    this.nodeGroup.clear();
    const shapeNode = this.shape.createShape();

    this.nodeGroup.add(shapeNode);
  }
}

export default MindNode;
