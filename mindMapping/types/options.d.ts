import { G } from '@svgdotjs/svg.js';
import MindMapping from '../index';
import Renderer from '../core/render';
import type { MappingRoot } from './types/mapping';

export interface MindMappingOptions {
  element: HTMLElement;
  data: MappingRoot;
}

export interface MindNodeOptions {
  data: MappingRoot;
  renderer: Renderer;
  mindMapping: MindMapping;
  group: G;
}

export interface MindRendererOptions {
  mindMapping: MindMapping;
}
