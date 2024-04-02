import { G, type Path, type Rect } from '@svgdotjs/svg.js';
import Style from './style';
import Shape from './shape';
import Line from './line';
import Generalization from './generalization';
import ExpandButton from './expand-button';
import CreateNode from './create-node';
import NodeEvent from './node-event';
import type Renderer from '../renderer';
import type { RenderTree } from '../../types/mapping';
import type { NodeMap } from '../../types/node';

class MindNode extends CreateNode {
  nodeGroup: G | null = null;
  children: MindNode[] = [];
  isMouseover = false;
  top = 0;
  left = 0;
  isResize = false;

  shape: Shape;
  line: Line;
  expandButton: ExpandButton;
  generalization: Generalization;
  event: NodeEvent;
  shapeNode?: Path;
  hoverNode?: Rect;

  constructor(
    public uid: string,
    public renderTree: RenderTree,
    public renderer: Renderer,
    public isGeneralization = false,

    public width = 0,
    public height = 0,
    public text?: NodeMap,
  ) {
    super(renderTree, renderer, width, height, text);
    this.shape = new Shape(this);
    this.style = new Style(this);
    this.line = new Line(this);
    this.expandButton = new ExpandButton(this);
    this.generalization = new Generalization(this);
    this.event = new NodeEvent(this);

    this.setBounding();
  }
  get right() {
    return this.left + this.width;
  }
  get bottom() {
    return this.top + this.height;
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
  get deep() {
    return this.renderTree.deep ?? 0;
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
        this.nodesGroup.add(this.nodeGroup);
        this.isResize = true;
      }
      this.line.render();
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
  rerender() {
    return new Promise<boolean>(resolve => {
      const isChangeSize = this.setBounding();

      this.isResize = true;
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
  reset(renderTree: RenderTree) {
    this.left = 0;
    this.top = 0;
    this.children = [];
    this.isResize = this.isChangeDeep(renderTree);
    this.renderTree = renderTree;
    this.generalization.reset();
  }
  destroy() {
    if (!this.nodeGroup) return;
    this.nodeGroup.remove();
    this.line.remove();
    this.generalization.reset();
    this.parent?.line.remove();
    this.inactive();
    this.event.off();
    this.nodeGroup = null;
  }
  setLayout() {
    if (!this.nodeGroup || !this.isResize) return;
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
  active() {
    if (this.isActive) return;
    this.renderer.activeNodes.add(this);
    this.updateActive(true);
    this.renderer.emitActiveNodes(this);
  }
  inactive() {
    if (!this.isActive) return;
    this.renderer.activeNodes.delete(this);
    this.updateActive(false);
  }
  updateActive(isActive: boolean) {
    if (!this.nodeGroup) return;
    this.isActive = isActive;
    isActive ? this.nodeGroup.addClass('active') : this.nodeGroup.removeClass('active');
    isActive ? this.expandButton.show() : this.expandButton.hide();
  }
  setOpacity(opacity: number) {
    if (!this.nodeGroup) return;
    this.nodeGroup.opacity(opacity);
    this.generalization.setOpacity(opacity);
    this.line.setOpacity(opacity);
  }
  show() {
    if (!this.nodeGroup) return;
    this.nodeGroup.show();
    this.showComponent();
  }
  hide() {
    if (!this.nodeGroup) return;
    this.nodeGroup.hide();
    this.hideComponent();
  }
  showComponent() {
    this.line.show();
    this.generalization.show();
  }
  hideComponent() {
    this.line.hide();
    this.generalization.hide();
  }
  showChildren() {
    this.children.forEach(child => {
      child.show();
      child.showChildren();
    });
  }
  hideChildren() {
    this.children.forEach(child => {
      child.hide();
      child.hideChildren();
    });
  }
  isChangeDeep(renderTree: RenderTree) {
    const { deep = 0 } = renderTree;

    return (deep < 2 && this.deep >= 2) || (deep >= 2 && this.deep < 2);
  }
  isAncestor(node: MindNode) {
    if (node.deep <= this.deep || this === node) return false;
    let parent = node.parent;

    while (parent) {
      if (parent === this) return true;
      parent = parent.parent;
    }
    return false;
  }
}

export default MindNode;
