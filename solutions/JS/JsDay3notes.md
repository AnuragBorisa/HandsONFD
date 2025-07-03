# EventEmitter Notes

This document summarizes the implementation and key design decisions of the `EventEmitter` class.

---

## Class Overview

```js
class EventEmitter {
  constructor(parent = null) { ... }
  on(event, fn) { ... }
  off(event, fn) { ... }
  once(event, fn) { ... }
  emit(event, ...args) { ... }
}
```

* Provides methods to register (`on`), deregister (`off`), and emit (`emit`) events.
* Supports one-time listeners (`once`) and wildcard listeners (`'*'`).
* Optional bubbling: child emitters can forward events to a parent emitter.

---

## Constructor

```js
constructor(parent = null) {
  this.parent    = parent;
  this.listeners = new Map();
}
```

* **`parent`**: if provided, any `emit` on this instance will bubble up to the parent.
* **`listeners`**: a `Map` where keys are event names (strings) and values are arrays of listener functions.

---

## `.on(event, fn)`

```js
on(event, fn) {
  if (!this.listeners.has(event)) {
    this.listeners.set(event, []);
  }
  this.listeners.get(event).push(fn);
}
```

1. Checks if an array exists for `event`; if not, creates one.
2. Appends `fn` to the event’s listener array.

**Note**: duplicates allowed unless you check with `includes` first.

---

## `.off(event, fn)`

```js
off(event, fn) {
  const arr = this.listeners.get(event);
  if (!arr) return;
  this.listeners.set(
    event,
    arr.filter(l => l !== fn)
  );
}
```

1. Retrieves the listener array for `event`.
2. If none exists, does nothing.
3. Filters out all references matching `fn` and replaces the array.

**Why `filter(l => l !== fn)`?**

* `filter` keeps elements for which the callback returns `true`.
* `l !== fn` drops every entry equal to `fn`, removing duplicate registrations too.

---

## `.once(event, fn)`

```js
once(event, fn) {
  const wrapper = (...args) => {
    this.off(event, wrapper);
    fn(...args);
  };
  this.on(event, wrapper);
}
```

1. Wraps the original `fn` in a `wrapper` function.
2. `wrapper` first removes itself (`off`), then calls `fn`.
3. Registers `wrapper` via `.on` so it runs only once.

**Key point**: removing before invoking guards against re-registration within the callback.

---

## `.emit(event, ...args)`

```js
emit(event, ...args) {
  const exact = this.listeners.get(event);
  if (exact) {
    for (const fn of Array.from(exact)) {
      fn(...args);
    }
  }

  const wild = this.listeners.get('*');
  if (wild) {
    for (const fn of Array.from(wild)) {
      fn(event, ...args);
    }
  }

  if (this.parent) {
    this.parent.emit(event, ...args);
  }
}
```

1. **Exact listeners**:

   * Retrieves listeners for `event`.
   * Uses `Array.from` to clone the array, preventing mutation during iteration.
   * Calls each listener with `(...args)`.
2. **Wildcard listeners**:

   * Listeners under `'*'` catch every event.
   * Invoked with `(event, ...args)` signature.
3. **Bubbling**:

   * If `parent` is set, forwards the same `emit` call to the parent after local listeners.

**Why clone arrays?**

* If listeners add/remove handlers during iteration, cloning avoids skipping or re-invoking.

---

## Usage Patterns

* **Basic**: `.on` + `.emit` to register and trigger callbacks.
* **Removal**: `.off` to unsubscribe.
* **One-time**: `.once` for single-use handlers.
* **Wildcard**: `.on('*', cb)` to intercept all events.
* **Hierarchy**: `new EventEmitter(parent)` for layered event systems.

---

## Summary of Key Points

* **Registry**: a `Map<string, Function[]>` holds event-to-listener arrays.
* **`on`/`off`**: manage that registry.
* **`once`**: implemented via a self-removing wrapper.
* **Wildcard**: stored under `'*'` and receives the event name.
* **Bubbling**: only occurs in `emit`, not in registration methods.
* **Cloning listeners**: ensures safe iteration when callbacks modify listeners.

Keep this cheat-sheet handy to quickly recall how each part of `EventEmitter` works!
