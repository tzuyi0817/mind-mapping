import { MOUSE_BUTTON_ENUM } from '../configs/mouse';

export function focusElement(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();

  range.selectNodeContents(element);
  range.collapse();
  selection.removeAllRanges();
  selection.addRange(range);
}

export function htmlEscape(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function covertToHtml(str: string) {
  return str.split(/\n/).map(htmlEscape).join('<br>');
}

export function replaceHtmlBr(innerHTML: string) {
  const div = document.createElement('div');

  div.innerHTML = innerHTML.replace(/<br>|<div>/gim, '\n');
  return div.textContent ?? '';
}

export function isDragButton(button: number | null) {
  const { LEFT, MIDDLE } = MOUSE_BUTTON_ENUM;

  return button === LEFT || button === MIDDLE;
}
