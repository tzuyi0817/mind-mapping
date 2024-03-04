import { G, Circle, Element, Rect } from '@svgdotjs/svg.js';
import MindNode from './index';

class ExpandButton {
  node?: G;
  fill?: Circle;
  open?: Element;
  close?: Element;
  isShow = false;
  placeholder?: Rect;
  lastStatus = false;

  constructor(public parent: MindNode) {}

  get isRequired() {
    return this.parent.node.children.length && !this.parent.renderTree.isRoot;
  }
  get expandButtonSize() {
    return this.parent.renderer.options.expandButtonSize;
  }
  get expandButtonStyle() {
    return this.parent.renderer.options.expandButtonStyle;
  }
  get showExpandChildrenCount() {
    return this.parent.renderer.options.showExpandChildrenCount;
  }
  get isExpand() {
    return this.parent.isExpand;
  }
  set isExpand(value) {
    this.parent.isExpand = value;
  }
  render() {
    const { nodeGroup, style, renderer, width, height } = this.parent;

    if (!nodeGroup || !this.isRequired) return;
    if (!this.node || !this.fill || !this.open || !this.close) {
      const { node, open, close, fill } = this.parent.crateExpandButton();

      this.node = node;
      this.open = open;
      this.close = close;
      this.fill = fill;
      this.onEvent();
    }
    const { node, open, close, fill, isExpand } = this;
    const svg = isExpand ? close : open;

    if (this.showExpandChildrenCount) {
      const strokeColor = isExpand ? 'transparent' : this.expandButtonStyle.strokeColor;

      fill.stroke({ color: strokeColor });
    }
    node.clear();
    style.setExpandButtonStyle({ node, open, close, fill });
    nodeGroup.add(node.add(fill).add(svg));
    renderer.layout.renderExpandButton({ node, expandButtonSize: this.expandButtonSize, width, height });
    this.isShow = true;
    this.lastStatus = isExpand;
  }
  renderPlaceholder() {
    const { nodeGroup, renderer, width, height } = this.parent;

    if (!nodeGroup || !this.isRequired) return;
    this.placeholder = new Rect().fill('transparent');
    nodeGroup.add(this.placeholder);
    renderer.layout.renderExpandPlaceholder({
      node: this.placeholder,
      width,
      height,
      expandButtonSize: this.expandButtonSize,
    });
  }
  onEvent() {
    if (!this.node) return;
    this.node.on('click', (event: Event) => {
      event.stopPropagation();
      this.isExpand = !this.isExpand;
      this.parent.renderer.render();
    });
    this.node.on('dblclick', (event: Event) => event.stopPropagation());
    this.node.on('mouseover', (event: Event) => event.stopPropagation());
    this.node.on('mouseout', (event: Event) => event.stopPropagation());
  }
  show() {
    if (this.lastStatus === this.isExpand && this.isShow) return;
    this.render();
  }
  hide() {
    if (this.parent.isActive || !this.isExpand || !this.isShow) return;
    requestAnimationFrame(() => {
      this.node?.remove();
      this.isShow = false;
    });
  }
}

export default ExpandButton;
