import MindNode from '../node';
import Renderer from './renderer';

interface ShowEditorParams {
  node: MindNode;
  event: Event;
}

class Editor {
  isShow = false;
  frame: HTMLParagraphElement | null = null;
  paddingX = 6;
  paddingY = 4;

  renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.bindEvents();
    this.onEvents();
  }
  bindEvents() {
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }
  onEvents() {
    this.renderer.event.on('dblclick-node', this.show);
    this.renderer.event.on('click-draw', this.hide);
    this.renderer.event.on('drag-draw', this.hide);
  }
  show({ node }: ShowEditorParams) {
    const textNode = node.text?.node;
    if (!textNode || this.isShow) return;
    const { width, height, left, top } = textNode.node.getBoundingClientRect();

    if (!this.frame) {
      const paragraph = document.createElement('p');

      paragraph.classList.add('mind-mapping-editor');
      paragraph.setAttribute('contenteditable', 'true');
      document.body.appendChild(paragraph);
      this.frame = paragraph;
    }
    this.frame.innerText = node.content.text;
    this.frame.style.minWidth = `${width + this.paddingX * 2}px`;
    this.frame.style.minHeight = `${height + this.paddingY * 2}px`;
    this.frame.style.left = `${left}px`;
    this.frame.style.top = `${top}px`;
    node.style.setDomTextStyle(this.frame);
    this.frame.style.display = 'block';
    this.isShow = true;
  }
  hide() {
    if (!this.isShow || !this.frame) return;
    this.frame.style.display = 'none';
    this.isShow = false;
  }
}

export default Editor;
