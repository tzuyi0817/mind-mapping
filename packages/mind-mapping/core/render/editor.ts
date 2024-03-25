import MindNode from '../node';
import Renderer from './renderer';
import { focusElement, replaceHtmlBr, convertToHtml } from '../../utils/element';
import type { NodeMouseEvent } from '../../types/node';

class Editor {
  target: MindNode | null = null;
  isShow = false;
  frame: HTMLDivElement | null = null;
  paddingX = 6;
  paddingY = 4;

  constructor(public renderer: Renderer) {
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
  show({ node }: NodeMouseEvent) {
    const textNode = node.text?.node;
    if (!textNode || this.isShow) return;
    const { width, height, left, top } = textNode.node.getBoundingClientRect();
    if (!this.frame) {
      const div = document.createElement('div');

      div.classList.add('mind-mapping-editor');
      div.setAttribute('contenteditable', 'true');
      document.body.appendChild(div);
      this.frame = div;
    }
    this.frame.innerHTML = convertToHtml(node.content.text);
    this.frame.style.minWidth = `${width + this.paddingX * 2}px`;
    this.frame.style.minHeight = `${height + this.paddingY * 2}px`;
    this.frame.style.left = `${left}px`;
    this.frame.style.top = `${top}px`;
    this.frame.style.display = 'block';
    node.style.setDomTextStyle(this.frame);
    this.target = node;
    this.isShow = true;
    focusElement(this.frame);
  }
  hide() {
    if (!this.isShow || !this.frame || !this.target) return;
    const text = replaceHtmlBr(this.frame.innerHTML);
    const previousText = this.target.content.text;

    if (text !== previousText) {
      this.target.content.text = text;
      this.target.rerender().then(isChangeSize => {
        isChangeSize && this.renderer.render();
      });
    }
    this.frame.style.display = 'none';
    this.target = null;
    this.isShow = false;
  }
}

export default Editor;
