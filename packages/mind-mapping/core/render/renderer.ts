import { G } from '@svgdotjs/svg.js';
import MindMapping from '../../index';
import MindNode from '../node';
import Editor from './editor';
import Drag from './drag';
import Select from './select';
import Base from '../../layouts/base';
import { bfsNodeTree } from '../../utils/bfs';
import type { MappingRoot, MappingBase } from '../../types/mapping';

class Renderer {
  isRendering = false;
  activeNodes: Set<MindNode> = new Set();
  cachedNodes: Map<string, MindNode> = new Map();
  previousCachedNodes: Map<string, MindNode> = new Map();
  rootNode?: MappingBase;

  renderTree: MappingRoot;
  group: G;
  elementRect: DOMRect;
  moveDraw: (moveX: number, moveY: number) => void;
  editor: Editor;
  drag: Drag;
  select: Select;
  layout!: Base;

  constructor(public mindMapping: MindMapping) {
    this.renderTree = mindMapping.options.data;
    this.group = mindMapping.group;
    this.elementRect = mindMapping.elementRect;
    this.moveDraw = mindMapping.moveDraw.bind(mindMapping);
    this.editor = new Editor(this);
    this.drag = new Drag(this);
    this.select = new Select(this);
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
    this.rootNode = await this.layout.startLayout();

    this.destroyExtraNodes();
    this.rootNode.instance?.render();
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
  createNodesMap(filterNode?: MindNode) {
    const nodesMap = new Map<number, MindNode[]>();

    if (!this.rootNode?.instance) return nodesMap;
    bfsNodeTree(this.rootNode.instance, node => {
      const { deep } = node.renderTree;
      if (deep === undefined || filterNode === node) return true;

      const nodes = nodesMap.get(deep) ?? [];

      nodes.push(node);
      nodesMap.set(deep, nodes);
    });
    return nodesMap;
  }
  moveNodeToBeChild(node: MindNode | null, toNode: MindNode | null) {
    if (!toNode || !node?.parent) return;
    const { parent } = node;
    const index = parent.children.indexOf(node);

    if (index < 0) return;
    parent.node.children.splice(index, 1);
    toNode.node.children.push(node.renderTree.node);
    this.render();
  }
}

export default Renderer;
