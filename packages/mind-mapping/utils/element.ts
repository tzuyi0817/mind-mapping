import { MIN_DRAG_DISTANCE, MOUSE_BUTTON_ENUM } from '../configs/constants';
import type MindNode from '../core/node';
import type { MappingBase } from '../types/mapping';
import type { Rect, NodeRect } from '../types/element';

export function selectElement(element: HTMLElement, isCollapse = false) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();

  range.selectNodeContents(element);
  isCollapse && range.collapse();
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

export function isChangeDeep(newDeep: number, oldDeep: number) {
  return (newDeep < 2 && oldDeep >= 2) || (newDeep >= 2 && oldDeep < 2);
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

export function findNodeIndex(node: MindNode, siblings: MappingBase[]) {
  return siblings.findIndex(sibling => node === sibling.instance);
}

export function removeNode(node: MindNode) {
  if (!node.parent) return false;
  const { children } = node.parent.nodeData;
  const index = findNodeIndex(node, children);

  if (index < 0) return false;
  children.splice(index, 1);
  return true;
}
