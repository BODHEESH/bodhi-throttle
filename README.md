# bodhi-throttle

## Install

```bash
npm install bodhi-throttle
```


[![npm version](https://img.shields.io/npm/v/bodhi-throttle.svg)](https://www.npmjs.com/package/bodhi-throttle)
[![npm downloads](https://img.shields.io/npm/dm/bodhi-throttle.svg)](https://www.npmjs.com/package/bodhi-throttle)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A lightweight, fast, and flexible debounce, throttle, and queueThrottle utility for JavaScript and TypeScript projects.

---

## Table of Contents
- [Install](#install)
- [Advantages](#advantages)
- [Usage](#usage)
  - [TypeScript Example](#typescript-example)
  - [JavaScript Example](#javascript-example)
  - [Async Usage](#async-usage)
  - [QueueThrottle](#queuethrottle)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Why use bodhi-throttle?](#why-use-bodhi-throttle)
- [Contributing](#contributing)
- [License](#license)

---


```bash
npm install bodhi-throttle
```

---

## Advantages
- **Ultra-lightweight:** Minimal footprint, no dependencies.
- **Flexible:** Works with both JavaScript and TypeScript out of the box.
- **High performance:** Optimized for speed in high-frequency scenarios.
- **Feature-rich:** Supports immediate/cancel options, maxWait for debouncing, and more.
- **TypeScript support:** Full typings and type safety.
- **Simple API:** Easy to use, with intuitive function signatures.

---

## Usage

### TypeScript Example

```typescript
import { debounce, throttle } from 'bodhi-throttle';

// Debounce Example
const debouncedFn = debounce((msg: string) => {
  console.log('Debounced:', msg);
}, 300, { immediate: false });

debouncedFn('Hello');
debouncedFn('World'); // Only this will log after 300ms

debouncedFn.cancel(); // Cancel any pending execution

// Throttle Example
const throttledFn = throttle((msg: string) => {
  console.log('Throttled:', msg);
}, 500);

throttledFn('First');
throttledFn('Second'); // Only 'First' logs immediately, 'Second' is ignored if within 500ms

throttledFn.cancel(); // Cancel any pending trailing execution
```

### JavaScript Example

```js
const { debounce, throttle } = require('bodhi-throttle');

// Debounce Example
const debouncedFn = debounce(function(msg) {
  console.log('Debounced:', msg);
}, 300, { immediate: true });

debouncedFn('Hello');
debouncedFn('World'); // Only 'Hello' logs immediately, 'World' ignored if within 300ms

debouncedFn.cancel();

// Throttle Example
const throttledFn = throttle(function(msg) {
  console.log('Throttled:', msg);
}, 400);

throttledFn('A');
throttledFn('B'); // Only 'A' logs immediately, 'B' is ignored if within 400ms

throttledFn.cancel();
```

### Async Usage

Both debounce and throttle support async functions and return Promises. If a call is canceled, the promise is rejected.

```typescript
import { debounce, throttle } from 'bodhi-throttle';

const fetchData = async (query: string) => {
  // Simulate API
  return `Result for ${query}`;
};

const debouncedFetch = debounce(fetchData, 500);
debouncedFetch('hello').then(console.log).catch(console.error);
debouncedFetch('world').then(console.log).catch(console.error);

debouncedFetch.cancel(); // Cancels pending execution

const saveData = async (data: string) => {
  // Simulate API
  return `Saved: ${data}`;
};

const throttledSave = throttle(saveData, 1000);
throttledSave('A').then(console.log).catch(console.error);
throttledSave('B').then(console.log).catch(console.error);

throttledSave.cancel(); // Cancels trailing execution
```

### QueueThrottle

Use `queueThrottle` when you want every call to be handled (queued and executed in order), rather than ignored or dropped during the throttle interval.

```typescript
import { queueThrottle } from 'bodhi-throttle';

const saveData = async (data: string) => {
  // Simulate API
  return `Saved: ${data}`;
};

const queuedSave = queueThrottle(saveData, 1000);

queuedSave('A').then(console.log); // Executes immediately
queuedSave('B').then(console.log); // Executes after 1s
queuedSave('C').then(console.log); // Executes after 2s

// You can clear the queue or cancel all pending calls:
// queuedSave.clear();
// queuedSave.cancel();
```

---

## API Reference

### debounce(func, wait, options?)
- `func`: Function to debounce
- `wait`: Delay in ms
- `options` (optional):
  - `immediate` (boolean): Trigger on the leading edge (default: false)
  - `maxWait` (number): Maximum wait time before forced execution
- **Returns:** Debounced function with `.cancel()`, `.pause()`, `.resume()`, and `.paused` properties

### throttle(func, wait)
- `func`: Function to throttle
- `wait`: Interval in ms
- **Returns:** Throttled function with `.cancel()`, `.pause()`, `.resume()`, and `.paused` properties

### queueThrottle(func, wait)
- `func`: Function to queue and throttle
- `wait`: Interval in ms between executions
- **Returns:** Queued-throttled function with `.cancel()`, `.clear()`, `.pause()`, `.resume()`, and `.paused` properties

---

## Pause and Resume

All returned functions (`debounce`, `throttle`, `queueThrottle`) support pausing and resuming execution:

- `.pause()`: Pauses the function. Any calls while paused are immediately rejected with a descriptive error.
- `.resume()`: Resumes normal operation.
- `.paused`: Boolean property indicating the paused state.

**Example:**

```js
const debounced = debounce(fn, 200);
debounced.pause();
debounced('A').catch(console.error); // Will reject with "Debounced function is paused"
debounced.resume();
debounced('B').then(console.log); // Will work as normal
```

This works the same for `throttle` and `queueThrottle` as well.

---

## Error Handling

All returned functions return Promises (if original or async). If a call is canceled, paused, or rejected, handle errors with `.catch()`:

```js
const fn = debounce(async () => { ... }, 200);
fn('test').catch(console.error); // Handles rejection if paused/canceled
```

---

## Why use bodhi-throttle?
- Prevents excessive function calls in UI events (scroll, resize, input)
- Improves performance in real-time applications
- Reduces server/API load by limiting request frequency
- Easy drop-in replacement for other debounce/throttle utilities

---

## Contributing

Contributions, bug reports, and feature requests are welcome!
- Fork the repo and create a PR
- Open issues for bugs or ideas
- Join our [GitHub discussions](https://github.com/bodheesh/bodhi-throttle/discussions)

---

## License

MIT © BODHEESH


### JavaScript Example

```js
const { debounce, throttle } = require('bodhi-throttle');

// Debounce Example
const debouncedFn = debounce(function(msg) {
  console.log('Debounced:', msg);
}, 300, { immediate: true });

debouncedFn('Hello');
debouncedFn('World'); // Only 'Hello' logs immediately, 'World' ignored if within 300ms

debouncedFn.cancel();

// Throttle Example
const throttledFn = throttle(function(msg) {
  console.log('Throttled:', msg);
}, 400);

throttledFn('A');
throttledFn('B'); // Only 'A' logs immediately, 'B' is ignored if within 400ms

throttledFn.cancel();
```

## API

---

## 🆕 Promise & Async Support

Both `debounce` and `throttle` now support async functions and return Promises when the original function is async. If a call is canceled (e.g., by calling `.cancel()`), the returned promise will be rejected.

### Async Debounce Example

```typescript
import { debounce } from 'bodhi-throttle';

const fetchData = async (query: string) => {
  // Simulate API
  return `Result for ${query}`;
};

const debouncedFetch = debounce(fetchData, 500);

debouncedFetch('hello').then(console.log).catch(console.error);
debouncedFetch('world').then(console.log).catch(console.error); // Only this will resolve after 500ms

// Cancel any pending execution (rejects the promise)
debouncedFetch.cancel();
```

### Async Throttle Example

```typescript
import { throttle } from 'bodhi-throttle';

const saveData = async (data: string) => {
  // Simulate API
  return `Saved: ${data}`;
};

const throttledSave = throttle(saveData, 1000);

throttledSave('A').then(console.log).catch(console.error);
throttledSave('B').then(console.log).catch(console.error); // Only 'A' resolves immediately, 'B' is scheduled or ignored

// Cancel any pending trailing execution (rejects the promise)
throttledSave.cancel();
```

---

## 🆕 Queue Mode (queueThrottle)

Use `queueThrottle` when you want every call to be handled (queued and executed in order), rather than ignored or dropped during the throttle interval.

### Usage Example

```typescript
import { queueThrottle } from 'bodhi-throttle';

const saveData = async (data: string) => {
  // Simulate API
  return `Saved: ${data}`;
};

const queuedSave = queueThrottle(saveData, 1000);

queuedSave('A').then(console.log); // Executes immediately
queuedSave('B').then(console.log); // Executes after 1s
queuedSave('C').then(console.log); // Executes after 2s

// You can clear the queue or cancel all pending calls:
// queuedSave.clear();
// queuedSave.cancel();
```

- **All calls are queued and executed in order.**
- **Each call is at least `wait` ms apart.**
- **Returns a Promise for each call.**
- **.clear()**: Rejects all pending calls but keeps the throttle active.
- **.cancel()**: Cancels all pending calls and disables the throttle instance.

---

### debounce(func, wait, options?)
- `func`: Function to debounce
- `wait`: Delay in ms
- `options` (optional):
  - `immediate` (boolean): Trigger on the leading edge (default: false)
  - `maxWait` (number): Maximum wait time before forced execution
- **Returns:** Debounced function with a `.cancel()` method

### throttle(func, wait)
- `func`: Function to throttle
- `wait`: Interval in ms
- **Returns:** Throttled function with a `.cancel()` method

## Why use bodhi-throttle?
- Prevents excessive function calls in UI events (scroll, resize, input)
- Improves performance in real-time applications
- Reduces server/API load by limiting request frequency
- Easy drop-in replacement for other debounce/throttle utilities

## Final Notes

Always check the documentation for the latest updates  
Join our community discussions  
Report issues and suggest features through [GitHub](https://github.com/bodheesh/bodhi-throttle)  
Consider contributing to the project  
Made with ❤️ by BODHEESH

## License

MIT © BODHEESH
