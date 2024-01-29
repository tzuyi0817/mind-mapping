import { G, Rect } from '@svgdotjs/svg.js';
import MindMapping from '../../index';
import MindNode from './node';
import Renderer from './renderer';
import Style from './style';
import type { RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class CreateNode {
  renderTree!: RenderTree;
  mindMapping!: MindMapping;
  style!: Style;
  width!: number;
  height!: number;
  renderer!: Renderer;
  group!: G;
  text?: NodeMap;
  children!: MindNode[];

  constructor() {}
  get content() {
    return this.renderTree.node.data;
  }
  get hoverRectPadding() {
    return this.mindMapping.options.hoverRectPadding;
  }
  createTextNode() {
    const group = new G();
    const { text } = this.content;
    const textNode = group.text(text).y(0);

    this.style.setTextStyle(textNode);
    const { width, height } = group.bbox();

    return {
      node: group,
      width: Math.ceil(width),
      height: Math.ceil(height),
    };
  }
  createTextGroup() {
    const { width, height } = this;
    const textGroup = new G();

    if (this.text) {
      textGroup.add(this.text.node);
    }
    const textBox = textGroup.bbox();
    const moveX = width / 2 - textBox.width / 2;
    const moveY = this.style.getCommonStyle('paddingY');

    textGroup.translate(moveX, moveY);
    return textGroup;
  }
  createHoverNode() {
    const hoverRectPadding = this.hoverRectPadding;
    const width = this.width + hoverRectPadding * 2;
    const height = this.height + hoverRectPadding * 2;
    const hoverNode = new Rect().size(width, height).x(-hoverRectPadding).y(-hoverRectPadding);

    hoverNode.addClass('mind-mapping-hover-node');
    this.style.setHoverStyle(hoverNode);
    return hoverNode;
  }
  createGeneralizationNode() {
    if (!this.content.generalization) return null;
    return new MindNode({
      renderTree: {
        node: {
          data: {
            text: this.content.generalization.text,
          },
          children: [],
        },
        isRoot: false,
      },
      renderer: this.renderer,
      mindMapping: this.mindMapping,
      group: this.group,
      isGeneralization: true,
    });
  }
  crateExpandButtonRect() {
    if (!this.children.length || this.renderTree.isRoot) return;
    return new Rect().fill({ color: 'transparent' });
  }
  createExpandButton() {}
}

export default CreateNode;
