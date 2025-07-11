/**
 * bodhi-throttle: Debounce & Throttle Utility
 * Author: bodheesh
 * License: MIT
 */
export type DebounceOptions = {
    immediate?: boolean;
    maxWait?: number;
};
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number, options?: DebounceOptions): {
    (this: any, ...args: Parameters<T>): any;
    cancel(): void;
};
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): {
    (this: any, ...args: Parameters<T>): any;
    cancel(): void;
};
