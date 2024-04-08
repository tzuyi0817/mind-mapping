import Renderer from './renderer';
import Style from './node/style';
import Draw from './draw';
import Command from './command';
import * as themes from '../themes';
import '../styles/index.css';
import type { MindMappingOptions } from '../types/options';
import type { Theme } from '../types/theme';
import type { PickPartial } from '../types/common';

class MindMapping extends Draw {
  renderer: Renderer;
  theme!: Theme;
  command: Command;

  constructor(options: PickPartial<MindMappingOptions, 'data'>) {
    super(options);
    this.onEvents();
    this.command = new Command(this.event);
    this.renderer = new Renderer(this);
    this.render();
  }
  render() {
    this.setupTheme();
    this.renderer.render();
  }
  setupTheme() {
    this.theme = themes.SKY_BLUE;
    Style.setBackgroundStyle(this.theme, this.element);
  }
  rerender() {
    this.group.clear();
    this.render();
  }
  resize() {
    this.getElementRect();
    this.draw.size(this.width, this.height);
  }
  destroy() {
    this.draw.remove();
    this.event.removeEventListeners();
    this.command.clear();
  }
}

export default MindMapping;
