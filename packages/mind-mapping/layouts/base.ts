import { v4 as uuidv4 } from 'uuid';
import MindNode from '../core/node';
import { dfsRenderTree, dfsBoundingNode } from '../utils/dfs';
import { POSITION_ENUM, INIT_POSITION_MAP } from '../configs/constants';
import type Renderer from '../core/renderer';
import type { MappingBase, RenderTree } from '../types/mapping';
import type {
  LayoutRenderLine,
  LayoutRenderGeneralization,
  LayoutRenderExpandButton,
  LayoutRenderExpandPlaceholder,
} from '../types/layout';

class Base {
  constructor(public renderer: Renderer) {}

  get root() {
    return this.renderer.renderTree.root;
  }
  createNode(renderTree: RenderTree) {
    const { instance: cacheNode } = renderTree.node;
    let node = null;

    if (cacheNode) {
      node = cacheNode;
      node.renderer = this.renderer;
      node.reset(renderTree);
    } else {
      const uid = uuidv4();

      node = new MindNode(uid, renderTree, this.renderer);
      renderTree.node.instance = node;
    }
    node.parent?.children.push(node);
    this.renderer.cachedNodes.set(node.uid, node);
    return node;
  }
  async startLayout() {
    const tasks = [this.renderNodes()];
    const [root] = await Promise.all(tasks);

    return root;
  }
  renderNodes() {
    return new Promise<MappingBase>(resolve => {
      dfsRenderTree(
        { node: this.root, isRoot: true },
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
          });
          return node.isExpand;
        },
        renderTree => {
          window.requestAnimationFrame(() => {
            const { isRoot, node } = renderTree;

            if (!isRoot) return;
            resolve(node);
          });
        },
      );
    });
  }
  renderGeneralization({ node, line, generalization }: LayoutRenderGeneralization) {
    if (!generalization) return;
    const { generalizationLineMargin, generalizationNodeMargin } = this.renderer.theme;
    const { top, right, bottom } = this.getBoundingNode(node, 'horizontal');
    const x = right + generalizationLineMargin;

    line.plot(`M ${x},${top} Q ${x + 20},${top + (bottom - top) / 2} ${x},${bottom}`);
    generalization.left = right + generalizationNodeMargin;
    generalization.top = top + (bottom - top - generalization.height) / 2;
  }
  renderExpandButton({ node, expandButtonSize, width, height }: LayoutRenderExpandButton) {
    const { translateX = 0, translateY = 0 } = node.transform();
    const radius = expandButtonSize / 2;

    node.translate(width - translateX, height / 2 - radius - translateY);
  }
  renderExpandPlaceholder({ node, expandButtonSize, width, height }: LayoutRenderExpandPlaceholder) {
    node.size(expandButtonSize, height).x(width).y(0);
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
      renderTree: { deep = 0 },
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
    const { CENTER } = POSITION_ENUM;

    node.top = this.renderer.height * INIT_POSITION_MAP[CENTER];
    node.left = this.renderer.width * INIT_POSITION_MAP[CENTER];
  }
  getMargin(direction: 'marginX' | 'marginY', deep = 1) {
    const {
      theme: { second, node },
      options: { hoverRectPadding },
    } = this.renderer;

    return (deep > 1 ? node[direction] : second[direction]) + hoverRectPadding * 2;
  }
  getBoundingNode(node: MindNode, direction: 'horizontal' | 'vertical') {
    const { generalizationNodeMargin } = this.renderer.theme;

    return dfsBoundingNode(node, generalizationNodeMargin, direction);
  }
}

export default Base;
