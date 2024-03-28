import { MOUSE_BUTTON_ENUM } from '../configs/mouse';
import { MIN_DRAG_DISTANCE } from '../configs/constants';
import type { Rect, NodeRect } from '../types/element';

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

export function convertToHtml(str: string) {
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

export function isDragAction(offset: number) {
  return Math.abs(offset) > MIN_DRAG_DISTANCE;
}

export function isOverlap(rectA: Rect, rectB: Rect) {
  return !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );
}

export function getInsertPosition(node: NodeRect | null, move: Rect) {
  if (!node) return 'none';
  if (node.renderTree.isRoot) return 'child';
  const OFFSET_HEIGHT = node.height / 3;
  const offsetTop = move.bottom - node.top;
  const offsetBottom = node.bottom - move.top;

  if (offsetTop > 0 && offsetTop < OFFSET_HEIGHT) return 'before';
  if (offsetBottom > 0 && offsetBottom < OFFSET_HEIGHT) return 'after';
  return 'child';
}
