import { G } from '@svgdotjs/svg.js';
import Renderer from '../core/render/renderer';
import MindNode from '../core/render/node';
import MindMapping from '../index';
import { dfsRenderTree, dfsBoundingNode } from '../utils/dfs';
import { PositionEnum, INIT_POSITION_MAP } from '../configs/position';
import type { MappingBase, RenderTree } from '../types/mapping';
import type { LayoutRenderLine, LayoutRenderGeneralization, LayoutRenderExpandButton } from '../types/layout';

class Base {
  renderer: Renderer;
  renderTreeRoot: MappingBase;
  mindMapping: MindMapping;
  group: G;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.renderTreeRoot = renderer.renderTree.root;
    this.mindMapping = renderer.mindMapping;
    this.group = renderer.mindMapping.group;
  }
  createNode(renderTree: RenderTree) {
    const node = new MindNode({
      renderTree,
      renderer: this.renderer,
      mindMapping: this.mindMapping,
      group: this.group,
    });

    renderTree.node.instance = node;
    node.parent?.children.push(node);
    return node;
  }
  startLayout() {
    const tasks = [this.renderNodes()];

    Promise.all(tasks);
  }
  renderNodes() {
    dfsRenderTree(
      { node: this.renderTreeRoot, isRoot: true },
      renderTree => {
        const node = this.createNode(renderTree);
        const { isRoot, deep = 0 } = renderTree;
        const { left = 0, width = 0 } = node.parent ?? {};

        isRoot ? this.setNodeCenter(node) : (node.left = left + width + this.getMargin('marginX', deep));
        window.requestAnimationFrame(() => {
          if (node.children.length) {
            const marginY = this.getMargin('marginY', deep + 1);
            const childrenMarginY = (node.children.length + 1) * marginY;
            let top = node.top + node.height / 2 - (node.childrenAreaHeight + childrenMarginY) / 2 + marginY;

            node.children.forEach(child => {
              child.top = top;
              top += child.height + marginY;
            });
          }
          node.render();
        });
        return node.isExpand;
      },
      renderTree => {},
    );
  }
  renderGeneralization({ node, line, generalization }: LayoutRenderGeneralization) {
    if (!generalization) return;
    const { generalizationLineMargin, generalizationNodeMargin } = this.mindMapping.theme;
    const { top, right, bottom } = this.getBoundingNode(node, 'horizontal');
    const x = right + generalizationLineMargin;

    line.plot(`M ${x},${top} Q ${x + 20},${top + (bottom - top) / 2} ${x},${bottom}`);
    generalization.left = right + generalizationNodeMargin;
    generalization.top = top + (bottom - top - generalization.height) / 2;
  }
  renderExpandButton({ node, expandButtonSize, width, height }: LayoutRenderExpandButton) {
    const { translateX = 0, translateY = 0 } = node.transform();
    const radius = expandButtonSize / 2;

    node.translate(width - radius - translateX, height / 2 - radius - translateY);
  }
  renderLine(params: LayoutRenderLine) {
    const { lineStyle } = params;
    const renderLineMap = {
      straight: this.renderStraightLine.bind(this),
    };

    renderLineMap[lineStyle](params);
  }
  renderStraightLine({ node, lines, setStyle }: LayoutRenderLine) {
    const {
      left,
      top,
      width,
      height,
      renderTree: { deep = 0, isRoot },
    } = node;
    const marginX = this.getMargin('marginX', deep + 1);
    const s = marginX * 0.6;

    node.children.forEach((child, index) => {
      const x1 = left + width;
      const x2 = child.left;
      const y1 = top + height / 2;
      const y2 = child.top + child.height / 2;
      const path = `M ${x1},${y1} L ${x1 + s},${y1} L ${x1 + s},${y2} L ${x2},${y2}`;

      lines[index].plot(path);
      setStyle?.(lines[index]);
    });
  }
  setNodeCenter(node: MindNode) {
    const { CENTER } = PositionEnum;

    node.top = this.mindMapping.height * INIT_POSITION_MAP[CENTER];
    node.left = this.mindMapping.width * INIT_POSITION_MAP[CENTER];
  }
  getMargin(direction: 'marginX' | 'marginY', deep = 1) {
    const {
      theme: { second, node },
      options: { hoverRectPadding },
    } = this.mindMapping;

    return (deep > 1 ? node[direction] : second[direction]) + hoverRectPadding * 2;
  }
  getBoundingNode(node: MindNode, direction: 'horizontal' | 'vertical') {
    const { generalizationNodeMargin } = this.mindMapping.theme;

    return dfsBoundingNode(node, generalizationNodeMargin, direction);
  }
}

export default Base;
