import { isArray } from './check-type';

export function isChangeList(a: unknown, b: unknown) {
  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return true;
    return a.every((item, index) => item === b[index]);
  }
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return true;
    for (const item of a) {
      if (!b.has(item)) return true;
    }
    return false;
  }
  return true;
}
