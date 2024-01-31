import { G, Rect, SVG, Circle } from '@svgdotjs/svg.js';
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
  static image(src: string, width: number, height: number) {
    return SVG().image(src).size(width, height).x(0).y(0);
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
  crateExpandButton() {
    const {
      expandButtonSvg: { openSvg, closeSvg },
      expandButtonSize: size,
    } = this.mindMapping.options;
    const group = new G();
    const open = CreateNode.image(openSvg, size, size);
    const close = CreateNode.image(closeSvg, size, size);
    const fill = new Circle().size(size).x(0).y(0);

    group.on('click', (event: Event) => {
      event.stopPropagation();
      this.mindMapping.event.emit('click-expand', this);
    });
    group.on('dblclick', (event: Event) => event.stopPropagation());
    group.on('mouseover', (event: Event) => event.stopPropagation());
    group.on('mouseout', (event: Event) => event.stopPropagation());
    group.addClass('mind-mapping-expand-button');
    return { node: group, open, close, fill };
  }
}

export default CreateNode;
