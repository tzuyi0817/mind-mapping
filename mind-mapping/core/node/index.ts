import { G, Path, Rect } from '@svgdotjs/svg.js';
import Renderer from '../render/renderer';
import Style from '../render/style';
import Shape from './shape';
import Line from './line';
import Generalization from './generalization';
import ExpandButton from './expand-button';
import CreateNode from './create-node';
import NodeEvent from './node-event';
import type { MindNodeOptions } from '../../types/options';
import type { RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class MindNode extends CreateNode {
  nodeGroup: G | null = null;
  children: MindNode[] = [];
  isMouseover = false;
  width = 0;
  height = 0;
  top = 0;
  left = 0;
  isResize = false;

  uid: string;
  renderTree: RenderTree;
  renderer: Renderer;
  shape: Shape;
  style: Style;
  line: Line;
  expandButton: ExpandButton;
  generalization: Generalization;
  event: NodeEvent;
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
    this.line = new Line(this);
    this.expandButton = new ExpandButton(this);
    this.generalization = new Generalization(this);
    this.event = new NodeEvent(this);

    this.setBounding();
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
  createContent() {
    this.text = this.createTextNode();
  }
  getBounding() {
    const textBounding = { width: 0, height: 0 };
    const paddingX = this.style.getCommonStyle('paddingX');
    const paddingY = this.style.getCommonStyle('paddingY');

    if (this.text) {
      textBounding.width += this.text.width;
      textBounding.height = Math.max(textBounding.height, this.text.height);
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
  setBounding() {
    this.createContent();
    const { width, height } = this.getBounding();
    const isChangeSize = this.width !== width || this.height !== height;

    this.width = width;
    this.height = height;
    return isChangeSize;
  }
  render() {
    return new Promise(resolve => {
      if (!this.nodeGroup) {
        this.nodeGroup = new G();
        this.nodeGroup.addClass('mind-mapping-node');
        this.event.on();
        this.setLayout();
        this.nodesGroup.add(this.nodeGroup);
      }
      this.line.render();
      this.update();
      window.requestAnimationFrame(async () => {
        if (this.children.length && this.isExpand) {
          await Promise.all(this.children.map(child => child.render()));
        }
        resolve(true);
      });
    });
  }
  rerender() {
    return new Promise<boolean>(resolve => {
      const isChangeSize = this.setBounding();

      this.setLayout();
      resolve(isChangeSize);
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
    this.line.remove();
    this.generalization.reset();
    this.parent?.line.remove();
    this.cancelActive();
    this.event.off();
    this.nodeGroup = null;
  }
  setLayout() {
    if (!this.nodeGroup) return;
    this.nodeGroup.clear();
    const contentGroup = this.createContentGroup();
    this.shapeNode = this.shape.createShape();
    this.hoverNode = this.createHoverNode();

    this.style.setShapeStyle(this.shapeNode);
    this.nodeGroup.add(this.shapeNode);
    this.nodeGroup.add(contentGroup);
    this.nodeGroup.add(this.hoverNode);
    this.expandButton.renderPlaceholder();
    this.isResize = false;
  }
  setPosition() {
    if (!this.nodeGroup) return;
    this.nodeGroup.transform({ translate: [this.left, this.top] });
  }
  cancelActive() {
    if (!this.isActive) return;
    this.renderer.activeNodes.delete(this);
    this.updateActive(false);
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
