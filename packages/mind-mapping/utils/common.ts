export function throttle(fun: unknown, ms = 300) {
  if (typeof fun !== 'function') throw new TypeError('The first argument is not a function.');
  let timer: NodeJS.Timeout | null = null;

  return function closure(this: unknown, ...args: unknown[]) {
    if (timer) return;
    timer = setTimeout(() => {
      Reflect.apply(fun, this, args);
      timer = null;
    }, ms);
  };
}

export function debounce(fun: unknown, ms = 300) {
  if (typeof fun !== 'function') throw new TypeError('The first argument is not a function.');
  let timer: NodeJS.Timeout | null = null;

  return function closure(this: unknown, ...args: unknown[]) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      Reflect.apply(fun, this, args);
      timer = null;
    }, ms);
  };
}

export function simpleDeepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
