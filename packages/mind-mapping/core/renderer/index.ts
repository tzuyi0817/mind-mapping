import Editor from './editor';
import Drag from './drag';
import Select from './select';
import RendererCommand from './command';
import Base from '../../layouts/base';
import { bfsNodeTree } from '../../utils/bfs';
import { nextTick } from '../../utils/next-tick';
import { isChangeList } from '../../utils/compare';
import { findNodeIndex, removeNode } from '../../utils/element';
import type MindMapping from '../../index';
import type MindNode from '../node';
import type { MappingBase } from '../../types/mapping';

class Renderer {
  isRendering = false;
  cachedNodes: Map<string, MindNode> = new Map();
  previousCachedNodes: Map<string, MindNode> = new Map();
  activeNodes: Set<MindNode> = new Set();
  previousActiveNodes: Set<MindNode> = new Set();
  rootNode?: MappingBase;

  layout!: Base;
  editor: Editor;
  drag: Drag;
  select: Select;
  command: RendererCommand;

  constructor(public mindMapping: MindMapping) {
    this.editor = new Editor(this);
    this.drag = new Drag(this);
    this.select = new Select(this);
    this.command = new RendererCommand(this, mindMapping.command);
    this.setupLayout(this);
    this.onEvents();
  }
  get renderTree() {
    return this.mindMapping.options.data;
  }
  get options() {
    return this.mindMapping.options;
  }
  get group() {
    return this.mindMapping.group;
  }
  get linesGroup() {
    return this.mindMapping.linesGroup;
  }
  get nodesGroup() {
    return this.mindMapping.nodesGroup;
  }
  get height() {
    return this.mindMapping.height;
  }
  get width() {
    return this.mindMapping.width;
  }
  get elementRect() {
    return this.mindMapping.elementRect;
  }
  get draw() {
    return this.mindMapping.draw;
  }
  get theme() {
    return this.mindMapping.theme;
  }
  get event() {
    return this.mindMapping.event;
  }
  onEvents() {
    this.event.on('mousedown-draw', () => {
      this.clearActiveNodes();
    });
  }
  setupLayout(renderer: Renderer) {
    this.layout = new Base(renderer);
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
    this.emitActiveNodes();
  }
  clearOtherActiveNodes(node: MindNode) {
    for (const activeNode of this.activeNodes) {
      if (activeNode === node) continue;
      activeNode.inactive();
    }
    this.emitActiveNodes(node);
  }
  emitActiveNodes(node: MindNode | null = null) {
    if (!isChangeList(this.activeNodes, this.previousActiveNodes)) return;
    nextTick('EMIT_ACTIVE_NODES', () => {
      this.event.emit('active-node-list', { node, list: this.activeNodes });
    });
    this.previousActiveNodes = new Set(this.activeNodes);
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
    const index = findNodeIndex(toNode, children);

    if (index < 0) return;
    const insertIndex = position === 'before' ? index : index + 1;
    const insertNodes = this.separateNodes(nodes);

    children.splice(insertIndex, 0, ...insertNodes);
    this.render();
  }
  separateNodes(nodes: MindNode[]) {
    const result: MappingBase[] = [];

    for (const node of nodes) {
      const isRemoved = removeNode(node);

      if (!isRemoved) continue;
      result.push(node.renderTree.node);
    }
    return result;
  }
}

export default Renderer;
