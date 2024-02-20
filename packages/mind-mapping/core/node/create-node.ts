import { G, Rect, SVG, Circle, Text } from '@svgdotjs/svg.js';
import { v4 as uuidv4 } from 'uuid';
import MindNode from './index';
import Renderer from '../render/renderer';
import Style from '../render/style';
import { getChildrenCount } from '../../utils/dfs';
import type { RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class CreateNode {
  renderTree!: RenderTree;
  style!: Style;
  width!: number;
  height!: number;
  renderer!: Renderer;
  text?: NodeMap;
  children!: MindNode[];

  constructor() {}
  get content() {
    return this.renderTree.node.data;
  }
  get hoverRectPadding() {
    return this.renderer.options.hoverRectPadding;
  }
  createTextNode() {
    const group = new G();
    const { text } = this.content;
    const textNode = group.text(text);
    const children = textNode.children();
    const fontSize = this.style.getStyle('fontSize');
    const lineHeight = this.style.getStyle('lineHeight');

    this.style.setTextStyle(textNode);
    textNode.y(0);
    for (let index = 1; index < children.length; index++) {
      children[index].dy(fontSize * lineHeight);
    }
    const { width, height } = group.bbox();

    return {
      node: group,
      width: Math.ceil(width),
      height: Math.ceil(height),
    };
  }
  createContentGroup() {
    const { width } = this;
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
    const text = this.content.generalization?.text ?? '';

    return new MindNode({
      uid: uuidv4(),
      renderTree: {
        node: {
          data: { text },
          children: [],
        },
        isRoot: false,
      },
      renderer: this.renderer,
      isGeneralization: true,
    });
  }
  crateExpandButton() {
    const {
      expandButtonSvg: { openSvg, closeSvg },
      expandButtonSize: size,
      showExpandChildrenCount: showCount,
      expandButtonStyle: { color, fontSize },
    } = this.renderer.options;
    const group = new G();
    const open = (showCount ? SVG().text('') : SVG(openSvg)).size(size).x(0).y(0);
    const close = SVG(closeSvg).size(size).x(0).y(0);
    const fill = new Circle().size(size).x(0).y(0);

    if (showCount && open instanceof Text) {
      const count = getChildrenCount(this as unknown as MindNode);

      open.text(add => add.tspan(`${count}`).dy(2));
      open.font({
        size: fontSize,
        color,
        x: size / 2,
        y: size / 2,
        anchor: 'middle',
        'dominant-baseline': 'middle',
      });
    }
    group.addClass('mind-mapping-expand-button');
    return { node: group, open, close, fill };
  }
}

export default CreateNode;
