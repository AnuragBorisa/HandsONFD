# LRUCache Implementation Notes

These notes document the design and implementation details of the `LRUCache` class for future reference.

---

## 1. Overview

An **LRU (Least-Recently-Used) Cache** evicts the entry that was accessed the longest time ago when capacity is exceeded.  This implementation supports:

* **O(1)** time complexity for every operation (`get`, `set`, `delete`, `size`).
* **Configurable** maximum size via `maxSize`.
* **Per-entry TTL** (time-to-live) so entries expire automatically after a given duration.

---

## 2. Data Structures

### 2.1 JavaScript `Map`

* Stores key ⇒ node mappings for **O(1)** lookups.
* Node objects hold the entry’s value, TTL expiry, and linked-list pointers.

### 2.2 Doubly-Linked List

* Maintains usage order: most-recently-used (MRU) at the **front**, least-recently-used (LRU) at the **back**.
* Each node has:

  ```js
  { key, value, expiresAt, prev, next }
  ```
* Two **sentinel** nodes (`head`, `tail`) simplify insertion/removal at boundaries without null checks.

```
[head] ⇄ nodeA ⇄ nodeB ⇄ … ⇄ nodeZ ⇄ [tail]
```

* `head.next` is always the MRU node.
* `tail.prev` is always the LRU node.

---

## 3. Internal Helper Methods

### 3.1 `_addNode(node)`

Inserts `node` *immediately after* the `head` sentinel (making it MRU).

```js
node.prev = head;
node.next = head.next;
head.next.prev = node;
head.next = node;
```

### 3.2 `_removeNode(node)`

Unlinks `node` from the list by rewiring its neighbors:

```js
node.prev.next = node.next;
node.next.prev = node.prev;
// optional cleanup:
node.prev = node.next = null;
```

### 3.3 `_moveToHead(node)`

Marks an existing node as MRU:

```js
_removeNode(node);
_addNode(node);
```

### 3.4 `_evictTail()`

Removes the LRU node (`tail.prev`) when `map.size > maxSize`:

```js
const node = tail.prev;
if (node !== head) {
  _removeNode(node);
  map.delete(node.key);
}
```

---

## 4. Public API

### 4.1 `constructor({ maxSize = 100 } = {})`

* **Options object** via destructuring makes the API extensible.
* Defaults:

  * `maxSize`: maximum number of entries before eviction.
* Initializes:

  * `this.map = new Map()`
  * `this.head` & `this.tail` sentinel nodes, linked to each other.

### 4.2 `get(key)`

Retrieves the value for `key`, or `undefined` if missing or expired:

1. Look up `node` in `map` (O(1)).
2. If not found, return `undefined`.
3. Check TTL: if `node.expiresAt <= Date.now()`, treat as expired:

   * Remove from list & `map`.
   * Return `undefined`.
4. Otherwise, move `node` to head (MRU) and return `node.value`.

### 4.3 `set(key, value, ttl)`

Inserts or updates an entry with optional `ttl` (ms):

1. Compute `expiresAt = ttl != null ? Date.now() + ttl : Infinity`.
2. If `map.has(key)`:

   * Update `node.value` and `node.expiresAt`.
   * Move to head (MRU).
3. Else (new entry):

   * Create `node = { key, value, expiresAt, prev: null, next: null }`.
   * `map.set(key, node)`.
   * `_addNode(node)` to link it as MRU.
   * If `map.size > maxSize`, call `_evictTail()`.

### 4.4 `delete(key)`

Removes an entry if present:

1. Look up `node` in `map`.
2. If missing, return `false`.
3. `_removeNode(node)` and `map.delete(key)`.
4. Return `true`.

### 4.5 `size()`

Returns `map.size` (number of non-evicted entries).

---

## 5. Usage Example

```js
const cache = new LRUCache({ maxSize: 2 });
cache.set("A", 1);
cache.set("B", 2, 5000);  // B expires in 5s
cache.get("A");          // 1 (A becomes MRU)
cache.set("C", 3);       // Evicts B (LRU)
cache.get("B");          // undefined
cache.size();              // 2 (A, C)
```

---

## 6. Common Pitfalls

* **`Date.now()` vs. `Date.now`**: Always call `Date.now()` to get the timestamp.
* **Using `_moveToHead` on a new node**: New nodes must be inserted with `_addNode`, not `_moveToHead` (which assumes existing links).
* **Implicit globals**: Always declare variables (`const node = …`)..

---

## 7. Complexity

* **Time**: All operations (`get`, `set`, `delete`, `size`) run in **O(1)**.
* **Space**: Additional overhead for linked-list pointers, but linear in cache size.

---

Keep these notes handy for a quick refresher on how the `LRUCache` works under the hood!
