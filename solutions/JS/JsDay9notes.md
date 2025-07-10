# Day 9 Notes: Async Pagination with Retry & Backoff

These notes summarize the two primary utilities you implemented for Day 9:

---

## 1. `fetchWithRetries(url, options)`

A robust HTTP fetch wrapper that:

* **Retries** failed requests up to `maxRetries` times.
* Uses **exponential backoff** (`initialDelay → initialDelay × 2 → ...`) between attempts.
* **Throws** the last error if all retries fail.

```js
async function fetchWithRetries(
  url,
  { maxRetries = 3, initialDelay = 100 } = {}
) {
  let attempt = 0;
  let delayMs = initialDelay;

  while (true) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;           // success: resolve to Response
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) throw err;                     // give up
      await new Promise(resolve => setTimeout(resolve, delayMs));
      delayMs *= 2;                                           // backoff
    }
  }
}
```

**Key points**:

* Declared `async`, so it **always returns a Promise**.
* `options` are destructured with defaults and a fallback empty object (`= {}`).
* `return res` inside an `async` function resolves the outer promise.
* `throw err` inside an `async` rejects the outer promise.

---

## 2. `async function* fetchPages(startUrl)`

An **async generator** that streams pages of results from a paginated API:

```js
async function* fetchPages(startUrl) {
  let nextUrl   = startUrl;
  let nextFetch = fetchWithRetries(nextUrl);  // kick off page 1

  while (nextFetch) {
    // 1. await the current page’s fetch
    const res  = await nextFetch;
    const data = await res.json();            // expect { items: [...], nextPage: '…' }

    // 2. prefetch next page if available
    if (data.nextPage) {
      nextUrl   = data.nextPage;
      nextFetch = fetchWithRetries(nextUrl);
    } else {
      nextFetch = null;                       // terminate loop
    }

    // 3. yield this page’s items and pause
    yield data.items;
  }
}
```

**Core mechanics**:

1. **Lazy prefetch**: calling `fetchWithRetries(...)` returns a Promise immediately and starts the network request *before* yielding.
2. **Pause points**:

   * `await nextFetch` waits for the in-flight page request.
   * `yield data.items` suspends the generator until the consumer calls `.next()` again.
3. **Loop control**: the `while (nextFetch)` check uses the truthiness of a `Promise` to continue, and setting `nextFetch = null` ends the loop.

---

## 3. Usage Example

```js
(async () => {
  try {
    for await (const items of fetchPages('/api/items?page=1')) {
      console.log('Got', items.length, 'items');
      // process items…
    }
  } catch (err) {
    console.error('Pagination failed:', err);
  }
})();
```

**What’s happening**:

* The generator prefetches while you process each page.
* Errors in any fetch bubble out after retries.
* The loop ends naturally when `nextPage` is `null`.

---

## 4. Why It Matters

* **Clean API**: consumers use `for await…of` and don’t worry about pagination, retries, or timing.
* **High throughput**: overlapping network latency (prefetch) with data processing.
* **Fault tolerance**: automatic retries with backoff.

Keep this file handy to recall Day 9’s design and patterns whenever you revisit pagination or resilient-fetch logic!
