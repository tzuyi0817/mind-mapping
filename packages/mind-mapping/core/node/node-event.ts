import MindNode from './index';

class NodeEvent {
  constructor(public node: MindNode) {
    this.bindEvents();
  }
  get isRoot() {
    return this.node.renderTree.isRoot;
  }
  get renderer() {
    return this.node.renderer;
  }
  bindEvents() {
    this.onClick = this.onClick.bind(this);
    this.onMouseenter = this.onMouseenter.bind(this);
    this.onMouseleave = this.onMouseleave.bind(this);
    this.onMousedown = this.onMousedown.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.onDblclick = this.onDblclick.bind(this);
    this.onContextmenu = this.onContextmenu.bind(this);
  }
  on() {
    if (!this.node.nodeGroup) return;
    this.node.nodeGroup.on('click', this.onClick);
    this.node.nodeGroup.on('mouseenter', this.onMouseenter);
    this.node.nodeGroup.on('mouseleave', this.onMouseleave);
    this.node.nodeGroup.on('mousedown', this.onMousedown);
    // this.node.nodeGroup.on('mouseup', this.onMouseup);
    this.node.nodeGroup.on('dblclick', this.onDblclick);
    this.node.nodeGroup.on('contextmenu', this.onContextmenu);
  }
  off() {
    if (!this.node.nodeGroup) return;
    this.node.nodeGroup.off('click', this.onClick);
    this.node.nodeGroup.off('mouseenter', this.onMouseenter);
    this.node.nodeGroup.off('mouseleave', this.onMouseleave);
    this.node.nodeGroup.off('mousedown', this.onMousedown);
    // this.node.nodeGroup.off('mouseup', this.onMouseup);
    this.node.nodeGroup.off('dblclick', this.onDblclick);
    this.node.nodeGroup.off('contextmenu', this.onContextmenu);
  }
  onClick(event: Event) {
    event.stopPropagation();
    if (this.node.isActive) return;
    this.renderer.clearActiveNodes();
    this.node.active();
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
  onMousedown(event: Event) {
    if (!this.isRoot) event.stopPropagation();
    this.renderer.event.emit('mousedown-node', { node: this.node, event });
  }
  onMouseup(event: Event) {
    event.stopPropagation();
    this.renderer.event.emit('mouseup-node', { node: this.node, event });
  }
  onDblclick(event: Event) {
    event.stopPropagation();
    this.renderer.event.emit('dblclick-node', { node: this.node, event });
  }
  onContextmenu(event: MouseEventInit) {
    // On Mac, hold down the ctrl key and click the left mouse button to trigger the contextmenu event.
    if (event.ctrlKey) return;
    if (!this.node.isActive || this.renderer.activeNodes.size > 1) {
      this.renderer.clearOtherActiveNodes(this.node);
      this.node.active();
    }
    this.renderer.event.emit('contextmenu-node', { node: this.node, event });
  }
}

export default NodeEvent;
