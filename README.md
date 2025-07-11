# bodhi-throttle

## Install

```bash
npm install bodhi-throttle
```


A lightweight, fast, and flexible debounce & throttle utility for JavaScript and TypeScript projects.

## Advantages

- **Ultra-lightweight:** Minimal footprint, no dependencies.
- **Flexible:** Works with both JavaScript and TypeScript out of the box.
- **High performance:** Optimized for speed in high-frequency scenarios.
- **Feature-rich:** Supports immediate/cancel options, maxWait for debouncing, and more.
- **TypeScript support:** Full typings and type safety.
- **Simple API:** Easy to use, with intuitive function signatures.

## Features
- **Debounce:** Delay function execution until after a pause in calls.
- **Throttle:** Limit function execution to at most once per interval.
- **Cancel:** Cancel pending debounced/throttled executions.
- **Immediate execution:** Optionally trigger on the leading edge.


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

## API

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

## License

MIT
