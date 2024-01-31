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
    this.onEvents();
  }
  initLayout() {
    this.layout = new Base(this);
  }
  onEvents() {
    this.mindMapping.event.on('mousedown-draw', () => {
      this.clearActiveNodes();
    });
  }
  render() {
    this.isRendering = true;
    this.layout.startLayout();
  }
  clearActiveNodes() {
    if (!this.activeNodes.size) return;
    this.activeNodes.forEach(node => {
      node.isActive = false;
      node.updateActive();
    });
    this.activeNodes.clear();
  }
}

export default Renderer;
