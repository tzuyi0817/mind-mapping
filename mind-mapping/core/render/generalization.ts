import { Path } from '@svgdotjs/svg.js';
import MindNode from './node';

class Generalization {
  parent: MindNode;

  node: MindNode | null = null;
  line: Path | null = null;

  constructor(node: MindNode) {
    this.parent = node;
  }
  render() {
    if (!this.parent.isShowGeneralization) return;
    const { linesGroup, renderer, style } = this.parent;

    if (!this.node) {
      this.node = this.parent.createGeneralizationNode();
    }
    if (!this.line) {
      this.line = linesGroup.path();
    }
    renderer.layout.renderGeneralization({
      node: this.parent,
      line: this.line,
      generalization: this.node,
    });
    style.setGeneralizationLineStyle(this.line);
    this.node.render();
  }
  reset() {
    if (!this.node) return;
    this.node.nodeGroup?.remove();
    this.line?.remove();
    this.line = null;
  }
}

export default Generalization;
