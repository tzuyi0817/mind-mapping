import { G } from '@svgdotjs/svg.js';
import Renderer from '../../core/render/renderer';
import MindMapping from '../../index';
import Style from './style';
import Shape from './shape';
import CreateNode from './createNode';
import type { MindNodeOptions } from '../../types/options';
import type { MappingBase, RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class MindNode extends CreateNode {
  nodeGroup: G | null = null;
  width = 0;
  height = 0;

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
    this.render();
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
    this.setLayout();
  }
  setLayout() {
    if (!this.nodeGroup) return;
    this.nodeGroup.clear();
    const shapeNode = this.shape.createShape();

    this.style.setShapeStyle(shapeNode);
    this.nodeGroup.add(shapeNode);
  }
}

export default MindNode;
