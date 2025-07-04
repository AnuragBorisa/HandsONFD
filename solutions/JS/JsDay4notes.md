**Day 4: Promise Combinators & Polyfills**

---

## 1. Promises in JavaScript

A **Promise** represents a value that may be available now, later, or never. It has three states:

* **Pending**: neither fulfilled nor rejected
* **Fulfilled**: resolved with a value
* **Rejected**: resolved with a reason (error)

### Creating a Promise

```js
const p = new Promise((resolve, reject) => {
  // executor runs immediately
  asyncOperation(
    result => resolve(result),  // on success
    error  => reject(error)      // on failure
  );
});
```

### Consuming a Promise

Using `.then()` and `.catch()`:

```js
p
  .then(value => console.log("Fulfilled with:", value))
  .catch(err => console.error("Rejected with:", err));
```

Or with **async/await**:

```js
async function handle() {
  try {
    const value = await p;
    console.log("Fulfilled with:", value);
  } catch (err) {
    console.error("Rejected with:", err);
  }
}
```

---

## 2. Event Loop: Microtasks vs. Macrotasks

| Queue          | Examples                     | Execution Order                                   |
| -------------- | ---------------------------- | ------------------------------------------------- |
| **Microtasks** | `Promise.then/catch/finally` | After current stack finishes, **before** timers   |
| **Macrotasks** | `setTimeout`, I/O callbacks  | Next turn of the event loop, **after** microtasks |

1. Run all synchronous code.
2. Drain the microtask queue.
3. Execute the next macrotask.
4. Repeat.

---

## 3. Promise Helper Methods (Combinators)

### 3.1 `Promise.allSettled(promises)`

* Waits for **all** promises to settle.
* Returns an array of outcome objects: `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`.

### 3.2 `Promise.any(promises)`

* Resolves with the **first** fulfilled value.
* If **all** reject, rejects with an `AggregateError` of all reasons.

### 3.3 `Promise.race(promises)`

* Settles as soon as **any** input settles (fulfill or reject).

### 3.4 `promiseRaceTimeout(promises, ms)`

* Races your promises against a timeout promise that rejects after `ms` ms.
* If none settle within the timeout, rejects with a timeout error.

---

## 4. Key Techniques

### 4.1 Normalizing values

Wrap any input in `Promise.resolve(p)` so even plain values or thenables become true Promises.

### 4.2 Spread operator (`...`)

Use `[ ...arrayA, extra ]` to build a single array containing all elements of `arrayA` plus additional items.

---

## 5. Polyfill Implementations

```js
// 1) promiseAllSettled
function promiseAllSettled(promises) {
  return new Promise(resolve => {
    const results = [];
    let settledCount = 0;
    if (promises.length === 0) return resolve(results);

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => { results[i] = { status: 'fulfilled',  value }; })
        .catch(reason => { results[i] = { status: 'rejected',   reason }; })
        .finally(() => {
          settledCount++;
          if (settledCount === promises.length) {
            resolve(results);
          }
        });
    });
  });
}

// 2) promiseAny
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejectedCount = 0;
    if (promises.length === 0) return reject(new AggregateError([], 'All promises rejected'));

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => resolve(value))
        .catch(err => {
          errors[i] = err;
          rejectedCount++;
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, 'All promises rejected'));
          }
        });
    });
  });
}

// 3) promiseRace
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p)
        .then(resolve)
        .catch(reject);
    });
  });
}

// 4) promiseRaceTimeout
function promiseRaceTimeout(promises, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms)
  );

  return new Promise((resolve, reject) => {
    [...promises.map(p => Promise.resolve(p)), timeout]
      .forEach(p => p.then(resolve).catch(reject));
  });
}
```

---

**End of Day 4 Notes**
