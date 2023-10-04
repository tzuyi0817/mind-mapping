import { G, Path } from '@svgdotjs/svg.js';
import Renderer from '../../core/render/renderer';
import MindMapping from '../../index';
import Style from './style';
import Shape from './shape';
import CreateNode from './createNode';
import type { MindNodeOptions } from '../../types/options';
import type { RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class MindNode extends CreateNode {
  nodeGroup: G | null = null;
  children: MindNode[] = [];
  lines: Path[] = [];
  width = 0;
  height = 0;
  #top = 0;
  #left = 0;

  renderTree: RenderTree;
  renderer: Renderer;
  mindMapping: MindMapping;
  group: G;
  shape: Shape;
  style: Style;
  text?: NodeMap;

  constructor(options: MindNodeOptions) {
    super();
    this.renderTree = options.renderTree;
    this.renderer = options.renderer;
    this.mindMapping = options.mindMapping;
    this.group = options.group;
    this.shape = new Shape(this);
    this.style = new Style(this);

    this.init();
  }
  get parent() {
    return this.renderTree.parent?.instance;
  }
  get top() {
    return this.#top;
  }
  get left() {
    return this.#left;
  }
  get childrenAreaHeight() {
    return this.children.reduce((total, { height }) => total + height, 0);
  }
  set top(value: number) {
    this.#top = value;
  }
  set left(value: number) {
    this.#left = value;
  }
  init() {
    this.createContent();
    const { width, height } = this.getBounding();

    this.width = width;
    this.height = height;
  }
  createContent() {
    this.text = this.createTextNode();
  }
  getBounding() {
    const textBounding = { width: 0, height: 0 };
    const paddingX = this.style.getCommonStyle('paddingX');
    const paddingY = this.style.getCommonStyle('paddingY');

    if (this.text) {
      textBounding.width += this.text.width;
      textBounding.height += this.text.height;
    }
    const width = textBounding.width;
    const height = textBounding.height;
    const { shapePaddingX, shapePaddingY } = this.shape.getShapePadding({ width, height, paddingX, paddingY });

    return {
      width: width + paddingX * 2 + shapePaddingX * 2,
      height: height + paddingY * 2 + shapePaddingY * 2,
    };
  }
  render() {
    if (!this.nodeGroup) {
      this.nodeGroup = new G();
    }
    this.group.add(this.nodeGroup);
    this.renderLine();
    this.setLayout();
    this.setPosition();
  }
  renderLine() {
    const diffSize = this.children.length - this.lines.length;

    if (diffSize > 0) {
      for (let index = 0; index < diffSize; index++) {
        this.lines.push(this.group.path());
      }
    }
    this.renderer.layout.renderLine({
      node: this,
      lineStyle: this.style.getCommonStyle('lineStyle'),
      lines: this.lines,
      setStyle: line => {
        this.style.setLineStyle(line);
      },
    });
  }
  setLayout() {
    if (!this.nodeGroup) return;
    this.nodeGroup.clear();
    const shapeNode = this.shape.createShape();
    const textGroup = this.createTextGroup();

    this.style.setShapeStyle(shapeNode);
    this.nodeGroup.add(shapeNode);
    this.nodeGroup.add(textGroup);
  }
  setPosition() {
    if (!this.nodeGroup) return;
    this.nodeGroup.translate(this.left, this.top);
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
}

export default MindNode;
