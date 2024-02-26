import { Path } from '@svgdotjs/svg.js';
import MindNode from './index';

class Line {
  lines: Path[] = [];

  constructor(public parent: MindNode) {}

  render() {
    if (!this.parent.isExpand) return;
    const { children, linesGroup, style } = this.parent;
    const diffSize = children.length - this.lines.length;

    if (diffSize > 0) {
      for (let index = 0; index < diffSize; index++) {
        this.lines.push(linesGroup.path());
      }
    }
    this.parent.renderer.layout.renderLine({
      node: this.parent,
      lineStyle: style.getCommonStyle('lineStyle'),
      lines: this.lines,
      setStyle: line => {
        style.setLineStyle(line);
      },
    });
  }
  remove() {
    this.lines.forEach(line => line.remove());
    this.lines = [];
  }
  setOpacity(opacity: number) {
    this.lines.forEach(line => line.opacity(opacity));
  }
  show() {
    this.lines.forEach(line => line.show());
  }
  hide() {
    this.lines.forEach(line => line.hide());
  }
}

export default Line;
