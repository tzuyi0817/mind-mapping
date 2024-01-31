import { G, Circle, Image } from '@svgdotjs/svg.js';
import MindNode from './node';

class ExpandButton {
  parent: MindNode;

  node?: G;
  fill?: Circle;
  open?: Image;
  close?: Image;
  isShow = false;

  constructor(node: MindNode) {
    this.parent = node;
  }
  render() {
    const {
      nodeGroup,
      children,
      renderTree,
      style,
      renderer,
      width,
      height,
      mindMapping: {
        options: { expandButtonSize },
      },
      crateExpandButton,
    } = this.parent;

    if (!nodeGroup) return;
    if (!children.length || renderTree.isRoot) return;
    if (!this.node || !this.fill || !this.open || !this.close) {
      const { node, open, close, fill } = crateExpandButton.call(this.parent);

      this.node = node;
      this.open = open;
      this.close = close;
      this.fill = fill;
      this.onEvent();
    }
    const { node, open, close, fill } = this;

    style.setExpandButtonStyle({ node, open, close, fill });
    nodeGroup.add(node.add(fill).add(close));
    renderer.layout.renderExpandButton({ node, expandButtonSize, width, height });
    this.isShow = true;
  }
  onEvent() {
    if (!this.node) return;
    this.node.on('click', (event: Event) => {
      event.stopPropagation();
      this.parent.mindMapping.event.emit('click-expand', this);
    });
    this.node.on('dblclick', (event: Event) => event.stopPropagation());
    this.node.on('mouseover', (event: Event) => event.stopPropagation());
    this.node.on('mouseout', (event: Event) => event.stopPropagation());
  }
  show() {
    if (this.isShow) return;
    requestAnimationFrame(() => this.render());
  }
  hide() {
    if (this.parent.isActive) return;
    requestAnimationFrame(() => {
      this.node?.remove();
      this.isShow = false;
    });
  }
}

export default ExpandButton;
