"use strict";
/**
 * bodhi-throttle: Debounce & Throttle Utility
 * Author: bodheesh
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = debounce;
exports.queueThrottle = queueThrottle;
exports.throttle = throttle;
function debounce(func, wait, options = {}) {
    let timeout = null;
    let lastCall = 0;
    let result;
    let pendingReject = null;
    const debounced = function (...args) {
        const context = this;
        const now = Date.now();
        if (timeout)
            clearTimeout(timeout);
        if (pendingReject) {
            pendingReject('Debounced function call canceled');
            pendingReject = null;
        }
        return new Promise((resolve, reject) => {
            pendingReject = reject;
            if (options.immediate && !timeout) {
                try {
                    const res = func.apply(context, args);
                    Promise.resolve(res).then(resolve).catch(reject);
                }
                catch (err) {
                    reject(err);
                }
            }
            else if (options.maxWait && now - lastCall >= options.maxWait) {
                try {
                    const res = func.apply(context, args);
                    lastCall = now;
                    Promise.resolve(res).then(resolve).catch(reject);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                timeout = setTimeout(() => {
                    if (!options.immediate) {
                        try {
                            const res = func.apply(context, args);
                            Promise.resolve(res).then(resolve).catch(reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    }
                    timeout = null;
                }, wait);
            }
        });
    };
    debounced.cancel = () => {
        if (timeout)
            clearTimeout(timeout);
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
    const wrapper = function (...args) {
        if (debounced.paused)
            return Promise.reject('Debounced function is paused');
        return originalDebounced.apply(this, args);
    };
    wrapper.cancel = debounced.cancel;
    wrapper.pause = debounced.pause;
    wrapper.resume = debounced.resume;
    wrapper.paused = false;
    return wrapper;
}
function queueThrottle(func, wait) {
    let queue = [];
    let running = false;
    let timer = null;
    let canceled = false;
    const processQueue = () => {
        if (canceled)
            return;
        if (queue.length === 0) {
            running = false;
            return;
        }
        running = true;
        const { context, args, resolve, reject } = queue.shift();
        try {
            const result = func.apply(context, args);
            if (result instanceof Promise) {
                result.then(resolve).catch(reject);
            }
            else {
                resolve(result);
            }
        }
        catch (err) {
            reject(err);
        }
        timer = setTimeout(processQueue, wait);
    };
    const throttled = function (...args) {
        if (canceled) {
            return Promise.reject('Queue has been canceled');
        }
        return new Promise((resolve, reject) => {
            queue.push({ context: this, args, resolve, reject });
            if (!running) {
                processQueue();
            }
        });
    };
    throttled.cancel = () => {
        canceled = true;
        if (timer)
            clearTimeout(timer);
        while (queue.length) {
            const item = queue.shift();
            if (item)
                item.reject('Queue canceled');
        }
    };
    throttled.clear = () => {
        while (queue.length) {
            const item = queue.shift();
            if (item)
                item.reject('Queue cleared');
        }
    };
    throttled.paused = false;
    throttled.pause = () => { throttled.paused = true; };
    throttled.resume = () => { throttled.paused = false; };
    const originalThrottled = throttled;
    const wrapper = function (...args) {
        if (throttled.paused)
            return Promise.reject('Queue is paused');
        return originalThrottled.apply(this, args);
    };
    wrapper.cancel = throttled.cancel;
    wrapper.clear = throttled.clear;
    wrapper.pause = throttled.pause;
    wrapper.resume = throttled.resume;
    wrapper.paused = false;
    return wrapper;
}
function throttle(func, wait) {
    let lastTime = 0;
    let timeout = null;
    let pendingReject = null;
    let paused = false;
    const throttled = function (...args) {
        if (throttled.paused)
            return Promise.reject('Throttled function is paused');
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
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        else if (!timeout) {
            return new Promise((resolve, reject) => {
                pendingReject = reject;
                timeout = setTimeout(() => {
                    lastTime = Date.now();
                    timeout = null;
                    try {
                        const res = func.apply(context, args);
                        Promise.resolve(res).then(resolve).catch(reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                }, remaining);
            });
        }
        return Promise.reject('Throttled: call ignored due to interval');
    };
    throttled.cancel = () => {
        if (timeout)
            clearTimeout(timeout);
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
