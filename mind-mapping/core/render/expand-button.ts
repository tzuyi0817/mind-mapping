import { G, Circle, Element } from '@svgdotjs/svg.js';
import MindNode from './node';

class ExpandButton {
  parent: MindNode;

  node?: G;
  fill?: Circle;
  open?: Element;
  close?: Element;
  isShow = false;

  constructor(node: MindNode) {
    this.parent = node;
  }
  render() {
    const {
      nodeGroup,
      childrenCount,
      renderTree,
      style,
      renderer,
      width,
      height,
      mindMapping: {
        options: { expandButtonSize },
      },
    } = this.parent;

    if (!nodeGroup) return;
    if (!childrenCount || renderTree.isRoot) return;
    if (!this.node || !this.fill || !this.open || !this.close) {
      const { node, open, close, fill } = this.parent.crateExpandButton();

      this.node = node;
      this.open = open;
      this.close = close;
      this.fill = fill;
      this.onEvent();
    }
    const { node, open, close, fill } = this;
    const svg = this.parent.isExpand ? close : open;

    style.setExpandButtonStyle({ node, open, close, fill });
    nodeGroup.add(node.add(fill).add(svg));
    renderer.layout.renderExpandButton({ node, expandButtonSize, width, height });
    this.isShow = true;
  }
  onEvent() {
    if (!this.node) return;
    this.node.on('click', (event: Event) => {
      event.stopPropagation();
      this.parent.isExpand = !this.parent.isExpand;
      this.parent.mindMapping.render();
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
