import MindNode from './index';

class NodeEvent {
  constructor(public node: MindNode) {
    this.bindEvents();
  }
  bindEvents() {
    this.onClick = this.onClick.bind(this);
    this.onMouseenter = this.onMouseenter.bind(this);
    this.onMouseleave = this.onMouseleave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDblclick = this.onDblclick.bind(this);
  }
  on() {
    if (!this.node.nodeGroup) return;
    this.node.nodeGroup.on('click', this.onClick);
    this.node.nodeGroup.on('mouseenter', this.onMouseenter);
    this.node.nodeGroup.on('mouseleave', this.onMouseleave);
    this.node.nodeGroup.on('mousedown', this.onMouseDown);
    this.node.nodeGroup.on('dblclick', this.onDblclick);
  }
  off() {
    if (!this.node.nodeGroup) return;
    this.node.nodeGroup.off('click', this.onClick);
    this.node.nodeGroup.off('mouseenter', this.onMouseenter);
    this.node.nodeGroup.off('mouseleave', this.onMouseleave);
    this.node.nodeGroup.off('dblclick', this.onDblclick);
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
  onMouseDown(event: Event) {
    event.stopPropagation();
    this.node.renderer.event.emit('mousedown-node', { node: this.node, event });
  }
  onDblclick(event: Event) {
    event.stopPropagation();
    this.node.renderer.event.emit('dblclick-node', { node: this.node, event });
  }
}

export default NodeEvent;
