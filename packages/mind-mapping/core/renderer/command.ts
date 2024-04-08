import { CREATE_NODE_BEHAVIOR } from '../../configs/constants';
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
  }
  registerCommand() {
    this.command.add('INSERT_NODE', this.insertNode);
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
    this.renderer.clearActiveNodes();
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
}

export default RendererCommand;
