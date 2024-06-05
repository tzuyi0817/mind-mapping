import { DEFAULT_OPTIONS } from '../configs/options';
import type { MappingRoot } from './mapping';

type MindMappingDefaultOptions = typeof DEFAULT_OPTIONS;
export type MindMappingMergeOptions = MindMappingDefaultOptions & MindMappingOptions;

export interface MindMappingOptions {
  element: HTMLElement;
  data: MappingRoot['root'];
}
