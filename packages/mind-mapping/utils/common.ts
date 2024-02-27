export function throttle<T>(fun: T, ms = 300) {
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
