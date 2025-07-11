"use strict";
/**
 * bodhi-throttle: Debounce & Throttle Utility
 * Author: bodheesh
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = debounce;
exports.throttle = throttle;
function debounce(func, wait, options = {}) {
    let timeout = null;
    let lastCall = 0;
    let result;
    const debounced = function (...args) {
        const context = this;
        const now = Date.now();
        if (options.immediate && !timeout) {
            result = func.apply(context, args);
        }
        if (timeout)
            clearTimeout(timeout);
        if (options.maxWait && now - lastCall >= options.maxWait) {
            result = func.apply(context, args);
            lastCall = now;
        }
        else {
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
        if (timeout)
            clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
}
function throttle(func, wait) {
    let lastTime = 0;
    let timeout = null;
    let result;
    const throttled = function (...args) {
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
        }
        else if (!timeout) {
            timeout = setTimeout(() => {
                lastTime = Date.now();
                timeout = null;
                result = func.apply(context, args);
            }, remaining);
        }
        return result;
    };
    throttled.cancel = () => {
        if (timeout)
            clearTimeout(timeout);
        timeout = null;
    };
    return throttled;
}
