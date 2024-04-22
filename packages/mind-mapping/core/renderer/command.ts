import { CREATE_NODE_BEHAVIOR } from '../../configs/constants';
import { removeNode, findNodeIndex } from '../../utils/element';
import type Renderer from './index';
import type MindNode from '../node';
import type Command from '../command';

class RendererCommand {
  constructor(
    public renderer: Renderer,
    public command: Command,
  ) {
    this.bindEvents();
    this.registerCommand();
  }
  bindEvents() {
    this.insertNode = this.insertNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
  }
  registerCommand() {
    this.command.add('INSERT_NODE', this.insertNode);
    this.command.add('REMOVE_NODE', this.removeNode);
  }
  insertNode(specifyNodes: MindNode[] = []) {
    if (!this.renderer.activeNodes.size && !specifyNodes.length) return;
    const nodes = specifyNodes.length ? specifyNodes : [...this.renderer.activeNodes];
    const isMultiple = nodes.length > 1;
    const { isActive, isEditor } = this.getNodeBehavior(isMultiple);
    const { secondary, branch } = this.renderer.options.createNodeText;

    for (const node of nodes) {
      if (!node.parent) continue;
      const { children } = node.parent.node;
      const index = children.findIndex(child => child.instance === node);

      if (index < 0) continue;
      const text = node.deep === 1 ? secondary : branch;
      const insertData = {
        data: { text },
        children: [],
        isActive,
        isEditor,
      };

      children.splice(index + 1, 0, insertData);
    }
    this.renderer.editor.hide();
    this.renderer.clearActiveNodes();
    this.renderer.render();
  }
  removeNode(specifyNodes: MindNode[] = []) {
    if (!this.renderer.activeNodes.size && !specifyNodes.length) return;
    const nodes = specifyNodes.length ? specifyNodes : [...this.renderer.activeNodes];
    const root = nodes.find(node => node.renderTree.isRoot);

    if (root) {
      root.node.children = [];
      this.renderer.clearActiveNodes();
    } else {
      const manualActiveNode = this.getManualActiveNode(nodes);

      for (const node of nodes) {
        const isRemoved = removeNode(node);

        if (!isRemoved) continue;
        node.inactive();
      }
      this.renderer.emitActiveNodes();
      manualActiveNode?.active();
    }
    this.renderer.editor.hide();
    this.renderer.render();
  }
  getNodeBehavior(isMultiple: boolean) {
    const { createNodeBehavior } = this.renderer.options;
    const { DEFAULT } = CREATE_NODE_BEHAVIOR;
    const behaviorMap = {
      [DEFAULT]: { isActive: true, isEditor: !isMultiple },
    };

    return behaviorMap[createNodeBehavior];
  }
  getManualActiveNode(removeNodes: MindNode[]) {
    const activeNodes = this.renderer.activeNodes;
    if (removeNodes.length !== 1 || activeNodes.size !== 1) return null;
    const node = removeNodes[0];
    const parent = node.parent;

    if (!parent || !activeNodes.has(node)) return null;
    const siblings = parent.node.children;

    if (siblings.length === 1) return parent;
    const index = findNodeIndex(node, siblings);

    if (index === siblings.length - 1) return siblings[index - 1].instance;
    return siblings[index + 1].instance;
  }
}

export default RendererCommand;
