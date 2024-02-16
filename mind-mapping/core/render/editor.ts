import MindNode from '../node';
import Renderer from './renderer';

interface ShowEditorParams {
  node: MindNode;
  event: Event;
}

class Editor {
  target: MindNode | null = null;
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
    this.renderer.event.on('mousedown', ({ target }) => {
      if (target === this.frame) return;
      this.hide();
    });
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
    this.frame.style.display = 'block';
    node.style.setDomTextStyle(this.frame);
    this.target = node;
    this.isShow = true;
  }
  hide() {
    if (!this.isShow || !this.frame || !this.target) return;
    const text = this.frame.innerText;
    const previousText = this.target.content.text;

    if (text !== previousText) {
      this.target.content.text = text;
      this.target.rerender().then(isChangeSize => {
        isChangeSize && this.renderer.render();
      });
    }
    this.frame.style.display = 'none';
    this.isShow = false;
  }
}

export default Editor;
