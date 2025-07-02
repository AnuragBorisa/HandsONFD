# JavaScript Day 1 Notes

This document summarizes the key utility functions implemented on Day 1: **debounce**, **simpleThrottle**, and **throttle**. Each section includes the code and a step-by-step explanation of how it works.

---

## 1. `debounce(fn, wait)`

Delays invoking the original function `fn` until **`wait`** milliseconds have passed since the **last** call.

```js
export function debounce(fn, wait) {
  let timerId = null;

  function debounced(...args) {
    const ctx = this;
    // 1. Cancel any pending invocation
    clearTimeout(timerId);
    // 2. Schedule a new one
    timerId = setTimeout(() => {
      fn.apply(ctx, args);   // 4. Execute with original `this` and args
      timerId = null;        // 5. Clear the timer handle
    }, wait);
  }

  // Optional: allow manual cancellation
  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
}
```

### Logic Breakdown

1. **Capture calls**: Every time you call `debounced(...)`, you first clear any existing timer.
2. **Reset timer**: Then you set a new `setTimeout(...)` for **`wait`** ms in the future.
3. **Invoke**: When time expires without another call, the callback runs `fn` using the saved `ctx` (the original `this`) and arguments.
4. **Cancel**: You can call `.cancel()` to drop a pending invocation.

**Use case**: e.g., waiting for the user to stop typing before sending a search request.

---

## 2. `simpleThrottle(fn, wait)`

Ensures `fn` runs at most **once** every **`wait`** milliseconds, with an **immediate** first execution.

```js
export function simpleThrottle(fn, wait) {
  let lastTime = 0;

  return function simpleThrottled(...args) {
    const ctx = this;
    const now = Date.now();

    // 1. If enough time passed since last run, execute
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(ctx, args);
    }
    // 2. Otherwise, skip the call
  };
}
```

### Logic Breakdown

1. **Initialize**: `lastTime = 0` makes the very first call always run (since `now - 0 >= wait`).
2. **Gate calls**: On each call, calculate `now - lastTime`. If it's ≥ `wait`, update `lastTime` and invoke `fn`.
3. **Skip bursts**: Any calls within `wait` ms of the last invocation are ignored.

**Use case**: e.g., limiting scroll or resize handlers to once per interval.

---

## 3. `throttle(fn, wait, leading = true, trailing = true)`

A more advanced throttle supporting two modes:

* **`leading`**: run at the start of a new interval
* **`trailing`**: run once at the end if calls occurred during the interval

```js
export function throttle(fn, wait = 0, leading = true, trailing = true) {
  let lastTime = 0;
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;

  function invoke(time) {
    fn.apply(lastThis, lastArgs);
    lastTime = time;
    lastArgs = lastThis = null;
  }

  function throttled(...args) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;

    // 1. Handle `leading=false` initial delay
    if (lastTime === 0 && !leading) {
      lastTime = now;
    }

    // 2. Compute time left in current window
    const remaining = wait - (now - lastTime);

    // 3. If window passed, run immediately
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      invoke(now);

    // 4. Otherwise, if trailing requested, schedule end-of-window run
    } else if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => {
        invoke(Date.now());
        timeoutId = null;
      }, remaining);
    }
  }

  return throttled;
}
```

### Logic Breakdown

1. **State**:

   * `lastTime`: when `fn` last ran
   * `timeoutId`: pending trailing timer handle
   * `lastArgs/lastThis`: captured call context and args
2. **Leading flag**:

   * If `leading=false`, pretend the function just ran on first call (delay until trailing).
3. **remaining**:

   * `wait - (now - lastTime)` tells how many ms left in the current window.
4. **Immediate run**:

   * If `remaining ≤ 0`, clear any pending timer and invoke immediately.
5. **Trailing run**:

   * If still inside window and `trailing=true`, schedule one timer to fire after `remaining` ms.
6. **Invoke**:

   * Both leading and trailing go through `invoke()`, which updates `lastTime` and calls `fn` with the correct `this` and arguments.

**Use case**: e.g., live search that updates immediately on the first keystroke (`leading`) and once more when the user pauses typing (`trailing`).
