import { G, Circle, Image } from '@svgdotjs/svg.js';
import MindNode from './node';

class ExpandButton {
  parent: MindNode;

  node?: G;
  fill?: Circle;
  open?: Image;
  close?: Image;

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
    }
    const { node, open, close, fill } = this;

    style.setExpandButtonStyle({ node, open, close, fill });
    nodeGroup.add(node.add(fill).add(close));
    renderer.layout.renderExpandButton({ node, expandButtonSize, width, height });
  }
}

export default ExpandButton;
