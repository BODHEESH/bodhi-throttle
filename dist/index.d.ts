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
    (this: any, ...args: Parameters<T>): Promise<ReturnType<T>>;
    cancel(): void;
    paused: boolean;
    pause(): void;
    resume(): void;
} & {
    pause: () => void;
    resume: () => void;
    paused: boolean;
};
export declare function queueThrottle<T extends (...args: any[]) => any>(func: T, wait: number): {
    (this: any, ...args: Parameters<T>): Promise<ReturnType<T>>;
    cancel(): void;
    clear(): void;
    paused: boolean;
    pause(): void;
    resume(): void;
} & {
    pause: () => void;
    resume: () => void;
    paused: boolean;
};
interface ThrottledFunction<T extends (...args: any[]) => any> {
    (this: any, ...args: Parameters<T>): Promise<ReturnType<T>>;
    cancel: () => void;
    clear?: () => void;
    pause: () => void;
    resume: () => void;
    paused: boolean;
}
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): ThrottledFunction<T>;
export {};
