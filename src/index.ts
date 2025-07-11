/**
 * bodhi-throttle: Debounce & Throttle Utility
 * Author: bodheesh
 * License: MIT
 */

export type DebounceOptions = {
  immediate?: boolean;
  maxWait?: number;
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
) {
  let timeout: NodeJS.Timeout | null = null;
  let lastCall = 0;
  let result: any;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();

    if (options.immediate && !timeout) {
      result = func.apply(context, args);
    }

    if (timeout) clearTimeout(timeout);

    if (options.maxWait && now - lastCall >= options.maxWait) {
      result = func.apply(context, args);
      lastCall = now;
    } else {
      timeout = setTimeout(() => {
        if (!options.immediate) {
          result = func.apply(context, args);
        }
        timeout = null;
      }, wait);
    }

    return result;
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
) {
  let lastTime = 0;
  let timeout: NodeJS.Timeout | null = null;
  let result: any;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    const context = this;

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      result = func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        result = func.apply(context, args);
      }, remaining);
    }
    return result;
  };

  throttled.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
  };

  return throttled;
}
