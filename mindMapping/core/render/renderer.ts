import { G } from '@svgdotjs/svg.js';
import MindMapping from '../../index';
import MindNode from './node';
import Base from '../../layouts/base';
import type { MindRendererOptions } from '../../types/options';
import type { MappingRoot } from '../../types/mapping';

class Renderer {
  isRendering = false;
  activeNodes: Set<MindNode> = new Set();

  mindMapping: MindMapping;
  renderTree: MappingRoot;
  group: G;
  layout!: Base;

  constructor(options: MindRendererOptions) {
    this.mindMapping = options.mindMapping;
    this.renderTree = this.mindMapping.options.data;
    this.group = this.mindMapping.group;
    this.initLayout();
  }
  initLayout() {
    this.layout = new Base(this);
  }
  render() {
    this.isRendering = true;
    this.layout.startLayout();
  }
  clearActiveNodes() {
    this.activeNodes.forEach(node => {
      node.renderTree.node.isActive = false;
      node.updateActive();
    });
    this.activeNodes.clear();
  }
}

export default Renderer;
