import type Event from './core/event';
import type { MindMappingOptions } from './types/options';

declare class MindMapping {
  element: MindMappingOptions['element'];
  event: Event;
}
