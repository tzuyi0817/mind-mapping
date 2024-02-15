import { G } from '@svgdotjs/svg.js';
import MindMapping from '../../index';
import MindNode from '../node';
import Editor from './editor';
import Base from '../../layouts/base';
import type { MindRendererOptions } from '../../types/options';
import type { MappingRoot } from '../../types/mapping';

class Renderer {
  isRendering = false;
  activeNodes: Set<MindNode> = new Set();
  cachedNodes: Map<string, MindNode> = new Map();
  previousCachedNodes: Map<string, MindNode> = new Map();

  mindMapping: MindMapping;
  renderTree: MappingRoot;
  group: G;
  editor: Editor;
  layout!: Base;

  constructor(options: MindRendererOptions) {
    this.mindMapping = options.mindMapping;
    this.renderTree = this.mindMapping.options.data;
    this.group = this.mindMapping.group;
    this.editor = new Editor(this);
    this.initLayout();
    this.onEvents();
  }
  get options() {
    return this.mindMapping.options;
  }
  get theme() {
    return this.mindMapping.theme;
  }
  get event() {
    return this.mindMapping.event;
  }
  initLayout() {
    this.layout = new Base(this);
  }
  onEvents() {
    this.event.on('mousedown-draw', () => {
      this.clearActiveNodes();
    });
  }
  async render() {
    this.isRendering = true;
    this.previousCachedNodes = new Map(this.cachedNodes);
    this.cachedNodes.clear();
    const rootNode = await this.layout.startLayout();

    this.destroyExtraNodes();
    await rootNode.instance?.render();
    this.isRendering = false;
  }
  destroyExtraNodes() {
    for (const node of this.previousCachedNodes.values()) {
      if (this.cachedNodes.has(node.uid)) continue;
      node.destroy();
    }
  }
  clearActiveNodes() {
    if (!this.activeNodes.size) return;
    this.activeNodes.forEach(node => {
      node.updateActive(false);
    });
    this.activeNodes.clear();
  }
}

export default Renderer;
