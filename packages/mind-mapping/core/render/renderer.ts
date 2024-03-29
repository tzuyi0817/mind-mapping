import type { Svg, G } from '@svgdotjs/svg.js';
import MindMapping from '../../index';
import Editor from './editor';
import Drag from './drag';
import Select from './select';
import Base from '../../layouts/base';
import { bfsNodeTree } from '../../utils/bfs';
import type MindNode from '../node';
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
  draw: Svg;
  moveDraw: (moveX: number, moveY: number) => void;
  editor: Editor;
  drag: Drag;
  select: Select;
  layout!: Base;

  constructor(public mindMapping: MindMapping) {
    this.renderTree = mindMapping.options.data;
    this.group = mindMapping.group;
    this.elementRect = mindMapping.elementRect;
    this.draw = mindMapping.draw;
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
  clearOtherActiveNodes(node: MindNode) {
    this.activeNodes.forEach(activeNode => {
      if (activeNode === node) return;
      activeNode.updateActive(false);
      this.activeNodes.delete(activeNode);
    });
  }
  createNodesMap(filterNode?: MindNode) {
    const nodesMap = new Map<number, MindNode[]>();

    if (!this.rootNode?.instance) return nodesMap;
    bfsNodeTree(this.rootNode.instance, node => {
      const { deep } = node.renderTree;
      if (deep === undefined || filterNode === node) return true;
      const nodes = nodesMap.get(deep);

      nodes ? nodes.push(node) : nodesMap.set(deep, [node]);
    });
    return nodesMap;
  }
  moveNodesToBeChild(nodes: MindNode[], toNode: MindNode) {
    if (!nodes.length) return;
    const insertNodes = this.separateNodes(nodes);

    toNode.node.children.push(...insertNodes);
    this.render();
  }
  moveNodesToBeSibling(nodes: MindNode[], toNode: MindNode, position: 'before' | 'after') {
    if (!toNode.parent || !nodes.length) return;
    const { children } = toNode.parent.node;
    const index = children.findIndex(child => toNode === child.instance);

    if (index < 0) return;
    const insertIndex = position === 'before' ? index : index + 1;
    const insertNodes = this.separateNodes(nodes);

    children.splice(insertIndex, 0, ...insertNodes);
    this.render();
  }
  separateNodes(nodes: MindNode[]) {
    const result: MappingBase[] = [];

    for (const node of nodes) {
      if (!node.parent) continue;
      const { children } = node.parent.node;
      const index = children.findIndex(child => node === child.instance);

      if (index < 0) continue;
      children.splice(index, 1);
      result.push(node.renderTree.node);
    }
    return result;
  }
}

export default Renderer;
