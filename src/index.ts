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
  let pendingReject: ((reason?: any) => void) | null = null;

  const debounced = function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    const context = this;
    const now = Date.now();

    if (timeout) clearTimeout(timeout);
    if (pendingReject) {
      pendingReject('Debounced function call canceled');
      pendingReject = null;
    }

    return new Promise<ReturnType<T>>((resolve, reject) => {
      pendingReject = reject;
      if (options.immediate && !timeout) {
        try {
          const res = func.apply(context, args);
          Promise.resolve(res).then(resolve).catch(reject);
        } catch (err) {
          reject(err);
        }
      } else if (options.maxWait && now - lastCall >= options.maxWait) {
        try {
          const res = func.apply(context, args);
          lastCall = now;
          Promise.resolve(res).then(resolve).catch(reject);
        } catch (err) {
          reject(err);
        }
      } else {
        timeout = setTimeout(() => {
          if (!options.immediate) {
            try {
              const res = func.apply(context, args);
              Promise.resolve(res).then(resolve).catch(reject);
            } catch (err) {
              reject(err);
            }
          }
          timeout = null;
        }, wait);
      }
    });
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    if (pendingReject) {
      pendingReject('Debounced function call canceled');
      pendingReject = null;
    }
  };

  debounced.paused = false;
  debounced.pause = () => { debounced.paused = true; };
  debounced.resume = () => { debounced.paused = false; };

  const originalDebounced = debounced;
  const wrapper = function(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (debounced.paused) return Promise.reject('Debounced function is paused');
    return originalDebounced.apply(this, args);
  } as typeof debounced & { pause: () => void; resume: () => void; paused: boolean };
  wrapper.cancel = debounced.cancel;
  wrapper.pause = debounced.pause;
  wrapper.resume = debounced.resume;
  wrapper.paused = false;
  return wrapper;
}

export function queueThrottle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
) {
  type QueueItem = {
    context: any;
    args: Parameters<T>;
    resolve: (value: ReturnType<T> | PromiseLike<ReturnType<T>>) => void;
    reject: (reason?: any) => void;
  };
  let queue: QueueItem[] = [];
  let running = false;
  let timer: NodeJS.Timeout | null = null;
  let canceled = false;

  const processQueue = () => {
    if (canceled) return;
    if (queue.length === 0) {
      running = false;
      return;
    }
    running = true;
    const { context, args, resolve, reject } = queue.shift()!;
    try {
      const result = func.apply(context, args);
      if (result instanceof Promise) {
        result.then(resolve).catch(reject);
      } else {
        resolve(result);
      }
    } catch (err) {
      reject(err);
    }
    timer = setTimeout(processQueue, wait);
  };

  const throttled = function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (canceled) {
      return Promise.reject('Queue has been canceled');
    }
    return new Promise<ReturnType<T>>((resolve, reject) => {
      queue.push({ context: this, args, resolve, reject });
      if (!running) {
        processQueue();
      }
    });
  };

  throttled.cancel = () => {
    canceled = true;
    if (timer) clearTimeout(timer);
    while (queue.length) {
      const item = queue.shift();
      if (item) item.reject('Queue canceled');
    }
  };

  throttled.clear = () => {
    while (queue.length) {
      const item = queue.shift();
      if (item) item.reject('Queue cleared');
    }
  };
  throttled.paused = false;
  throttled.pause = () => { throttled.paused = true; };
  throttled.resume = () => { throttled.paused = false; };
  
  const originalThrottled = throttled;
  const wrapper = function(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (throttled.paused) return Promise.reject('Queue is paused');
    return originalThrottled.apply(this, args);
  } as typeof throttled & { pause: () => void; resume: () => void; paused: boolean };
  wrapper.cancel = throttled.cancel;
  wrapper.clear = throttled.clear;
  wrapper.pause = throttled.pause;
  wrapper.resume = throttled.resume;
  wrapper.paused = false;
  return wrapper;
}

interface ThrottledFunction<T extends (...args: any[]) => any> {
  (this: any, ...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel: () => void;
  clear?: () => void;
  pause: () => void;
  resume: () => void;
  paused: boolean;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ThrottledFunction<T> {
  let lastTime = 0;
  let timeout: NodeJS.Timeout | null = null;
  let pendingReject: ((reason?: any) => void) | null = null;
  let paused = false;

  const throttled: ThrottledFunction<T> = function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (throttled.paused) return Promise.reject('Throttled function is paused');
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    const context = this;

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      if (pendingReject) {
        pendingReject('Throttled function call canceled');
        pendingReject = null;
      }
      lastTime = now;
      try {
        const res = func.apply(context, args);
        return Promise.resolve(res);
      } catch (err) {
        return Promise.reject(err);
      }
    } else if (!timeout) {
      return new Promise<ReturnType<T>>((resolve, reject) => {
        pendingReject = reject;
        timeout = setTimeout(() => {
          lastTime = Date.now();
          timeout = null;
          try {
            const res = func.apply(context, args);
            Promise.resolve(res).then(resolve).catch(reject);
          } catch (err) {
            reject(err);
          }
        }, remaining);
      });
    }
    return Promise.reject('Throttled: call ignored due to interval');
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    if (pendingReject) {
      pendingReject('Throttled function call canceled');
      pendingReject = null;
    }
  };

  throttled.paused = false;
  throttled.pause = () => { throttled.paused = true; };
  throttled.resume = () => { throttled.paused = false; };

  return throttled;
}
