import { G } from '@svgdotjs/svg.js';
import Renderer from '../core/render/renderer';
import MindNode from '../core/render/node';
import MindMapping from '../index';
import type { MappingBase } from '../types/mapping';

class Base {
  renderer: Renderer;
  mindMapping: MindMapping;
  group: G;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.mindMapping = renderer.mindMapping;
    this.group = renderer.mindMapping.group;
  }
  createNode(data: MappingBase) {
    const node = new MindNode({
      data,
      renderer: this.renderer,
      mindMapping: this.mindMapping,
      group: this.group,
    });
  }
}

export default Base;
