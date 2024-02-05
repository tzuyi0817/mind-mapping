import { G } from '@svgdotjs/svg.js';
import MindMapping from '../index';
import Renderer from '../core/render';
import { DEFAULT_OPTIONS } from '../configs/options';
import type { MappingRoot, RenderTree } from './mapping';

type MindMappingDefaultOptions = typeof DEFAULT_OPTIONS;
export type MindMappingMergeOptions = MindMappingDefaultOptions & MindMappingOptions;

export interface MindMappingOptions {
  element: HTMLElement;
  data: MappingRoot;
}

export interface MindNodeOptions {
  uid: string;
  renderTree: RenderTree;
  renderer: Renderer;
  isGeneralization?: boolean;
}

export interface MindRendererOptions {
  mindMapping: MindMapping;
}
