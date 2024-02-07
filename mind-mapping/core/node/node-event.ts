import MindNode from './index';

class NodeEvent {
  node: MindNode;

  constructor(node: MindNode) {
    this.node = node;
    this.bindEvents();
  }
  bindEvents() {
    this.onClick = this.onClick.bind(this);
    this.onMouseenter = this.onMouseenter.bind(this);
    this.onMouseleave = this.onMouseleave.bind(this);
  }
  on() {
    if (!this.node.nodeGroup) return;
    this.node.nodeGroup.on('click', this.onClick);
    this.node.nodeGroup.on('mouseenter', this.onMouseenter);
    this.node.nodeGroup.on('mouseleave', this.onMouseleave);
  }
  off() {
    if (!this.node.nodeGroup) return;
    this.node.nodeGroup.off('click', this.onClick);
    this.node.nodeGroup.off('mouseenter', this.onMouseenter);
    this.node.nodeGroup.off('mouseleave', this.onMouseleave);
  }
  onClick(event: Event) {
    event.stopPropagation();
    if (this.node.isActive) return;
    this.node.renderer.clearActiveNodes();
    this.node.renderer.activeNodes.add(this.node);
    this.node.updateActive(true);
  }
  onMouseenter() {
    this.node.isMouseover = true;
    this.node.expandButton.show();
  }
  onMouseleave() {
    if (!this.node.isMouseover) return;
    this.node.isMouseover = false;
    this.node.expandButton.hide();
  }
}

export default NodeEvent;
