# JavaScript Hands-On Practice Questions

1. **Debounce & Throttle Utility**  
   **Problem:** Implement two functions:  
   - `debounce(fn, wait)`: delays invoking `fn` until `wait` milliseconds have passed since the last call.  
   - `throttle(fn, wait, options)`: ensures `fn` is called at most once every `wait` ms, supporting `options.leading` and `options.trailing`.

2. **Deep Clone with Edge Cases**  
   **Problem:** Create `deepClone(value)` that:  
   - Recursively copies objects and arrays.  
   - Preserves prototypes, `Date`, `Map`, `Set`.  
   - Handles circular references via `WeakMap`.

3. **Mini EventEmitter**  
   **Problem:** Build an `EventEmitter` class with methods `on`, `off`, `once`, and `emit`. Support wildcard listeners (`*`) and optional bubbling between emitters.

4. **Promise Combinators Polyfill**  
   **Problem:** Polyfill the following:  
   - `Promise.allSettled(promises)`  
   - `Promise.any(promises)`  
   - `promiseRaceTimeout(promises, ms)`: races promises but rejects if none resolve within `ms`.

5. **LRU Cache**  
   **Problem:** Implement `class LRUCache` with `get`, `set`, `delete`, and `size` operations in O(1) time using a `Map` and a doubly linked list. Support configurable `maxSize` and TTL per entry.

6. **Currying & Partial Application**  
   **Problem:** Write:  
   - `curry(fn)`: transforms a function into a sequence of unary functions.  
   - `compose(...fns)` and `pipe(...fns)`: compose functions right-to-left and left-to-right.  
   - Support placeholders (e.g., `_`) for partial application.

7. **Flatten & Unflatten**  
   **Problem:** Implement:  
   - `flatten(obj)`: converts nested objects/arrays into a flat map of paths to values (e.g., `{a: {b: [1]}}` → `{'a.b[0]': 1}`).  
   - `unflatten(map)`: rebuilds the original nested structure, handling sparse arrays.

8. **Observable/Reactive Core**  
   **Problem:** Build a minimal reactive library:  
   - `Observable` with methods `map`, `filter`, `merge`, `takeUntil`.  
   - `Observable.fromEvent(element, event)` to wrap DOM events.

9. **Async Iterable Paginator**  
   **Problem:** Write `async function* fetchPages(url)` that:  
   - Fetches paginated API endpoints, yielding items per page.  
   - Lazy prefetches the next page while processing the current.  
   - Retries failed requests with exponential backoff (max 3 attempts).

10. **Template Engine**  
    **Problem:** Implement `render(template, data)` to:  
    - Parse `{{variable}}`, `{{#if}}...{{/if}}`, `{{#each}}...{{/each}}` without `eval`.  
    - Compile templates into efficient render functions.  
    - Support helper functions for custom tags.
