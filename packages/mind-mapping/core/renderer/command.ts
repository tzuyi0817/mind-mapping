import { CREATE_NODE_BEHAVIOR } from '../../configs/constants';
import type Command from '../command';
import type MindNode from '../node';
import type { MindMappingMergeOptions } from '../../types/options';

class RendererCommand {
  activeNodes: Set<MindNode> = new Set();

  constructor(
    public command: Command,
    public options: MindMappingMergeOptions,
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
    if (!this.activeNodes.size && !specifyNodes.length) return;
    const nodes = specifyNodes.length ? specifyNodes : [...this.activeNodes];
    const isMultiple = nodes.length > 1;
    const { activeNode, editNode } = this.getNodeBehavior(isMultiple);

    console.log({ activeNode, editNode });
  }
  getNodeBehavior(isMultiple: boolean) {
    const { createNodeBehavior } = this.options;
    const { DEFAULT } = CREATE_NODE_BEHAVIOR;
    const behaviorMap = {
      [DEFAULT]: { activeNode: isMultiple, editNode: !isMultiple },
    };

    return behaviorMap[createNodeBehavior];
  }
}

export default RendererCommand;
