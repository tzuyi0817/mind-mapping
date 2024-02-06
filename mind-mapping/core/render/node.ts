import { G, Path, Rect } from '@svgdotjs/svg.js';
import Renderer from '../../core/render/renderer';
import Style from './style';
import Shape from './shape';
import Generalization from './generalization';
import ExpandButton from './expand-button';
import CreateNode from './create-node';
import type { MindNodeOptions } from '../../types/options';
import type { RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class MindNode extends CreateNode {
  nodeGroup: G | null = null;
  children: MindNode[] = [];
  lines: Path[] = [];
  isMouseover = false;
  width = 0;
  height = 0;
  top = 0;
  left = 0;

  uid: string;
  renderTree: RenderTree;
  renderer: Renderer;
  shape: Shape;
  style: Style;
  expandButton: ExpandButton;
  generalization: Generalization;
  text?: NodeMap;
  isGeneralization: boolean;
  shapeNode?: Path;
  hoverNode?: Rect;

  constructor(options: MindNodeOptions) {
    super();
    this.uid = options.uid;
    this.renderTree = options.renderTree;
    this.renderer = options.renderer;
    this.isGeneralization = options.isGeneralization ?? false;
    this.shape = new Shape(this);
    this.style = new Style(this);
    this.expandButton = new ExpandButton(this);
    this.generalization = new Generalization(this);

    this.init();
  }
  get parent() {
    return this.renderTree.parent?.instance;
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
  get linesGroup() {
    return this.renderer.mindMapping.linesGroup;
  }
  get nodesGroup() {
    return this.renderer.mindMapping.nodesGroup;
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
    return new Promise(resolve => {
      if (!this.nodeGroup) {
        this.nodeGroup = new G();
        this.nodeGroup.addClass('mind-mapping-node');
        this.onNodeGroup();
      }
      this.nodesGroup.add(this.nodeGroup);
      this.renderLine();
      this.setLayout();
      this.update();
      window.requestAnimationFrame(async () => {
        if (this.children.length && this.isExpand) {
          await Promise.all(this.children.map(child => child.render()));
        }
        resolve(true);
      });
    });
  }
  update() {
    this.generalization.render();
    this.setPosition();
    if (this.isMouseover || !this.isExpand) {
      this.expandButton.show();
      return;
    }
    this.expandButton.hide();
  }
  reset(renderer: Renderer) {
    this.left = 0;
    this.top = 0;
    this.renderer = renderer;
    this.generalization.reset();
  }
  destroy() {
    if (!this.nodeGroup) return;
    this.nodeGroup.remove();
    this.removeLine();
    this.generalization.reset();
    this.parent?.removeLine();
    if (this.isActive) {
      this.renderer.activeNodes.delete(this);
      this.updateActive(false);
    }
    this.nodeGroup = null;
  }
  renderLine() {
    if (!this.isExpand) return;
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
  removeLine() {
    this.lines.forEach(line => line.remove());
    this.lines = [];
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
    this.expandButton.renderPlaceholder();
  }
  setPosition() {
    if (!this.nodeGroup) return;
    this.nodeGroup.transform({ translate: [this.left, this.top] });
  }
  onNodeGroup() {
    if (!this.nodeGroup) return;
    this.nodeGroup.on('click', event => {
      event.stopPropagation();
      if (this.isActive) return;
      this.renderer.clearActiveNodes();
      this.renderer.activeNodes.add(this);
      this.updateActive(true);
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
  updateActive(isActive: boolean) {
    if (!this.nodeGroup) return;
    this.isActive = isActive;
    if (isActive) {
      this.nodeGroup.addClass('active');
      this.expandButton.show();
      return;
    }
    this.nodeGroup.removeClass('active');
    this.expandButton.hide();
  }
}

export default MindNode;
