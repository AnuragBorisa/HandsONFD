**Day 8 Notes: Building a Minimal Observable Library in JavaScript**

---

## 1. Core Concept

* **Observable**: a producer of multiple values over time (unlike a single-value Promise).
* **Observer**: callbacks `{ next, error, complete }` for handling values, errors, and completion.
* **Subscription**: handle `{ unsubscribe() }` that stops the stream and cleans up resources.

---

## 2. `Observable` Skeleton

```js
class Observable {
  constructor(subscribeFn) {
    this._subscribeFn = subscribeFn;   // store the producer
  }

  subscribe(next, err, complete) {
    // 1. Normalize callbacks into an observer object
    const observer = {
      next:     typeof next     === 'function' ? next     : () => {},
      error:    typeof err      === 'function' ? err      : () => {},
      complete: typeof complete === 'function' ? complete : () => {}
    };

    // 2. Run the producer, capturing cleanup
    const cleanup = this._subscribeFn(observer);

    // 3. Return subscription with unsubscribe
    return {
      unsubscribe: () => { if (cleanup) cleanup(); }
    };
  }
}
```

---

## 3. Key Operators

### a) `.map(fn)`

* **Purpose**: transform each emitted value.
* **Pattern**:

  1. Subscribe to source.
  2. On `next`, apply `fn` and forward with `observer.next(mapped)`.
  3. Forward `error` and `complete`.
  4. Cleanup unsubscribes inner subscription.

```js
Observable.prototype.map = function(fn) {
  return new Observable(observer => {
    const sub = this.subscribe(
      v => observer.next(fn(v)),
      e => observer.error(e),
      () => observer.complete()
    );
    return () => sub.unsubscribe();
  });
};
```

### b) `.filter(pred)`

* **Purpose**: forward only values passing `pred(value)`.

```js
Observable.prototype.filter = function(pred) {
  return new Observable(observer => {
    const sub = this.subscribe(
      v => { if (pred(v)) observer.next(v); },
      e => observer.error(e),
      () => observer.complete()
    );
    return () => sub.unsubscribe();
  });
};
```

### c) `.merge(other$)`

* **Purpose**: combine two streams into one.

```js
Observable.prototype.merge = function(other$) {
  return new Observable(observer => {
    const s1 = this.subscribe(v => observer.next(v), e => observer.error(e));
    const s2 = other$.subscribe(v => observer.next(v), e => observer.error(e),
      () => observer.complete());
    return () => { s1.unsubscribe(); s2.unsubscribe(); };
  });
};
```

### d) `.takeUntil(notifier$)`

* **Purpose**: complete the main stream when `notifier$` emits once.

```js
Observable.prototype.takeUntil = function(notify$) {
  return new Observable(observer => {
    const main = this.subscribe(
      v => observer.next(v),
      e => observer.error(e),
      () => observer.complete()
    );
    const note = notify$.subscribe(
      () => { observer.complete(); main.unsubscribe(); note.unsubscribe(); },
      e => observer.error(e)
    );
    return () => { main.unsubscribe(); note.unsubscribe(); };
  });
};
```

---

## 4. Static Helper: `fromEvent`

* **Purpose**: wrap DOM events into an Observable stream.

```js
Observable.fromEvent = function(element, eventName) {
  return new Observable(observer => {
    const handler = e => observer.next(e);
    element.addEventListener(eventName, handler);
    return () => element.removeEventListener(eventName, handler);
  });
};
```

---

## 5. Usage Example

```js
// 1) Emit 1,2,3 then complete
const numbers$ = new Observable(o => {
  [1,2,3].forEach(n => o.next(n));
  o.complete();
});

// 2) Double values
const doubled$ = numbers$.map(x => x * 2);

doubled$.subscribe(
  v => console.log('doubled:', v),
  e => console.error('error', e),
  () => console.log('done doubling')
);
```

---

## 6. Flow Summary

1. **Define** Observable (store producer logic).
2. **Attach** operators via prototype (`map`, `filter`, etc.).
3. **Subscribe** to start the chain (normalize callbacks → invoke producer → forward through operators).
4. **Unsubscribe** cleans up any timers or listeners.

> **Tip**: Think of operators as plumbing fixtures you install before opening the valve (subscribe).

---

*End of Day 8 Notes.*
