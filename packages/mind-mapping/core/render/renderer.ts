import { G } from '@svgdotjs/svg.js';
import MindMapping from '../../index';
import MindNode from '../node';
import Editor from './editor';
import Drag from './drag';
import Base from '../../layouts/base';
import type { MappingRoot } from '../../types/mapping';

class Renderer {
  isRendering = false;
  activeNodes: Set<MindNode> = new Set();
  cachedNodes: Map<string, MindNode> = new Map();
  previousCachedNodes: Map<string, MindNode> = new Map();

  renderTree: MappingRoot;
  group: G;
  editor: Editor;
  drag: Drag;
  layout!: Base;

  constructor(public mindMapping: MindMapping) {
    this.renderTree = mindMapping.options.data;
    this.group = mindMapping.group;
    this.editor = new Editor(this);
    this.drag = new Drag(this);
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