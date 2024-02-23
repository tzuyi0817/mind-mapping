import { Path } from '@svgdotjs/svg.js';
import MindNode from './index';

class Generalization {
  node: MindNode | null = null;
  line: Path | null = null;

  constructor(public parent: MindNode) {}

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
    this.node.cancelActive();
    this.node.event.off();
    this.line?.remove();
    this.line = this.node.nodeGroup = null;
  }
  setOpacity(opacity: number) {
    this.node?.setOpacity(opacity);
    this.line?.opacity(opacity);
  }
}

export default Generalization;
