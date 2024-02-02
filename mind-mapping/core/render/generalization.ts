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
    if (!this.parent.isShowGeneralization || this.node) return;
    const { linesGroup, renderer, style } = this.parent;

    this.node = this.parent.createGeneralizationNode();
    this.line = linesGroup.path();
    renderer.layout.renderGeneralization({
      node: this.parent,
      line: this.line,
      generalization: this.node,
    });
    style.setGeneralizationLineStyle(this.line);
    this.node?.render();
  }
  reset() {
    if (!this.node || !this.line) return;
    this.node.nodesGroup.remove();
    this.line.remove();
    this.node = this.line = null;
  }
}

export default Generalization;
