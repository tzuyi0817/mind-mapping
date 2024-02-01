import { G, Path, Rect } from '@svgdotjs/svg.js';
import Renderer from '../../core/render/renderer';
import MindMapping from '../../index';
import Style from './style';
import Shape from './shape';
import ExpandButton from './expand-button';
import CreateNode from './create-node';
import type { MindNodeOptions } from '../../types/options';
import type { RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class MindNode extends CreateNode {
  nodeGroup: G | null = null;
  children: MindNode[] = [];
  lines: Path[] = [];
  generalization: MindNode | null = null;
  generalizationLine: Path | null = null;
  isMouseover = false;
  width = 0;
  height = 0;
  #top = 0;
  #left = 0;

  renderTree: RenderTree;
  renderer: Renderer;
  mindMapping: MindMapping;
  linesGroup: G;
  nodesGroup: G;
  shape: Shape;
  style: Style;
  expandButton: ExpandButton;
  text?: NodeMap;
  isGeneralization: boolean;
  shapeNode?: Path;
  hoverNode?: Rect;

  constructor(options: MindNodeOptions) {
    super();
    this.renderTree = options.renderTree;
    this.renderer = options.renderer;
    this.mindMapping = options.mindMapping;
    this.linesGroup = options.linesGroup;
    this.nodesGroup = options.nodesGroup;
    this.isGeneralization = options.isGeneralization ?? false;
    this.shape = new Shape(this);
    this.style = new Style(this);
    this.expandButton = new ExpandButton(this);

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
  get node() {
    return this.renderTree.node;
  }
  get isActive() {
    return this.renderTree.node.isActive ?? false;
  }
  get isExpand() {
    return this.renderTree.node.isExpand ?? true;
  }
  get isShowGeneralization() {
    return this.isExpand && !!this.node.data.generalization;
  }
  get childrenCount() {
    return this.node.children.length;
  }
  set top(value: number) {
    this.#top = value;
  }
  set left(value: number) {
    this.#left = value;
  }
  set isActive(value: boolean) {
    this.renderTree.node.isActive = value;
  }
  set isExpand(value: boolean) {
    this.renderTree.node.isExpand = value;
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
    const borderWidth = this.style.getStyle('borderWidth');

    return {
      width: width + paddingX * 2 + shapePaddingX * 2 + borderWidth * 2,
      height: height + paddingY * 2 + shapePaddingY * 2 + borderWidth * 2,
    };
  }
  render() {
    if (!this.nodeGroup) {
      this.nodeGroup = new G();
      this.nodeGroup.addClass('mind-mapping-node');
    }
    this.nodesGroup.add(this.nodeGroup);
    this.renderLine();
    this.setLayout();
    this.update();
    this.onNodeGroup();
  }
  update() {
    this.renderGeneralization();
    this.setPosition();
    if (this.isMouseover || !this.isExpand) {
      this.expandButton.show();
      return;
    }
    this.expandButton.hide();
  }
  renderLine() {
    const diffSize = this.children.length - this.lines.length;

    if (diffSize > 0) {
      for (let index = 0; index < diffSize; index++) {
        this.lines.push(this.linesGroup.path());
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
    const textGroup = this.createTextGroup();
    this.shapeNode = this.shape.createShape();
    this.hoverNode = this.createHoverNode();

    this.style.setShapeStyle(this.shapeNode);
    this.nodeGroup.add(this.shapeNode);
    this.nodeGroup.add(textGroup);
    this.nodeGroup.add(this.hoverNode);
  }
  renderGeneralization() {
    if (!this.isShowGeneralization) return;
    this.generalization = this.createGeneralizationNode();
    this.generalizationLine = this.linesGroup.path();
    this.renderer.layout.renderGeneralization({
      node: this,
      line: this.generalizationLine,
      generalization: this.generalization,
    });
    this.style.setGeneralizationLineStyle(this.generalizationLine);
    this.generalization?.render();
  }
  setPosition() {
    if (!this.nodeGroup) return;
    this.nodeGroup.translate(this.left, this.top);
  }
  onNodeGroup() {
    if (!this.nodeGroup) return;
    this.nodeGroup.on('click', event => {
      event.stopPropagation();
      if (this.isActive) return;
      this.renderer.clearActiveNodes();
      this.renderer.activeNodes.add(this);
      this.isActive = true;
      this.updateActive();
    });
    this.nodeGroup.on('mouseenter', () => {
      this.isMouseover = true;
      this.expandButton.show();
    });
    this.nodeGroup.on('mouseleave', () => {
      if (!this.isMouseover) return;
      this.isMouseover = false;
      this.expandButton.hide();
    });
  }
  updateActive() {
    if (!this.nodeGroup) return;
    if (this.isActive) {
      this.nodeGroup.addClass('active');
      this.expandButton.show();
      return;
    }
    this.nodeGroup.removeClass('active');
    this.expandButton.hide();
  }
}

export default MindNode;
