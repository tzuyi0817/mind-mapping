export function focusElement(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();

  range.selectNodeContents(element);
  range.collapse();
  selection.removeAllRanges();
  selection.addRange(range);
}
