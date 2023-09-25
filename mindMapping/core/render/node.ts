import { G } from '@svgdotjs/svg.js';
import Renderer from '../../core/render/renderer';
import MindMapping from '../../index';
import type { MindNodeOptions } from '../../types/options';
import type { MappingBase } from '../../types/mapping';

class MindNode {
  nodeGroup: G | null = null;

  nodeData: MappingBase;
  renderer: Renderer;
  mindMapping: MindMapping;
  group: G;

  constructor(options: MindNodeOptions) {
    this.nodeData = options.data;
    this.renderer = options.renderer;
    this.mindMapping = options.mindMapping;
    this.group = options.group;
  }
  render() {
    if (!this.nodeGroup) {
      this.nodeGroup = new G();
    }
    this.group.add(this.nodeGroup);
  }
}

export default MindNode;
