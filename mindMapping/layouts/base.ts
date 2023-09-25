import { G } from '@svgdotjs/svg.js';
import Renderer from '../core/render/renderer';
import MindNode from '../core/render/node';
import MindMapping from '../index';
import { dfsRenderTree } from '../utils/dfs';
import type { MappingBase, RenderTree } from '../types/mapping';

class Base {
  renderer: Renderer;
  renderTreeRoot: MappingBase;
  mindMapping: MindMapping;
  group: G;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.renderTreeRoot = renderer.renderTree.root;
    this.mindMapping = renderer.mindMapping;
    this.group = renderer.mindMapping.group;
  }
  createNode(renderTree: RenderTree) {
    const node = new MindNode({
      data: renderTree.node,
      renderer: this.renderer,
      mindMapping: this.mindMapping,
      group: this.group,
    });

    return node;
  }
  startLayout() {
    const tasks = [this.renderNodes()];

    Promise.all(tasks);
  }
  renderNodes() {
    dfsRenderTree({ node: this.renderTreeRoot, isRoot: true }, renderTree => {
      const node = this.createNode(renderTree);
    });
  }
}

export default Base;
