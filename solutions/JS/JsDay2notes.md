# Day 2: Deep Clone Utility Notes

This document summarizes the logic and key points of the Day 2 deep-clone implementation for quick future reference.

---

## Problem Statement

* Implement `deepClone(value)` to produce a fully independent copy of any JavaScript value.
* Must support:

  * Plain objects and arrays
  * Built-ins: `Date`, `Map`, `Set`
  * Custom prototypes
  * Symbol-keyed and non-enumerable properties
  * Accessor properties (getters/setters)
  * Nested structures and circular references

---

## High-Level Logic

1. **Primitive & function shortcut**
   If `value === null` or `typeof value !== 'object'`, return `value` immediately.

2. **Circular-reference guard**
   Use a `WeakMap` named `cache` to map original objects to their clones:

   * On first encounter, create an empty clone shell and call `cache.set(original, clone)`.
   * If the same object appears again, return `cache.get(original)` to break cycles.

3. **Built-in types**

   * **`Date`** → `new Date(original)`
   * **`Map`** → create `new Map()`, deep-clone both keys and values
   * **`Set`** → create `new Set()`, deep-clone entries

4. **Arrays**
   Detected via `Array.isArray()`: clone each element by index.

5. **Plain & custom objects**

   * Preserve prototype: `Object.create(Object.getPrototypeOf(original))`
   * Copy **all** own keys (string and symbol, enumerable and non-enumerable) via `Reflect.ownKeys(original)`
   * For **accessors** (`desc.get` or `desc.set` present): use `Object.defineProperty(clone, key, desc)` to copy descriptor verbatim
   * For **data properties**: update `desc.value` with the deep-cloned value and use `Object.defineProperty` to preserve flags

---

## Key Terms

* **WeakMap**: Holds object keys weakly so they can be garbage-collected; ideal for caches that use objects as keys.
* **Circular reference**: An object graph where an object refers back to itself (directly or indirectly), requiring a cache to avoid infinite recursion.
* **Reflect.ownKeys(obj)**: Returns all own property keys (string and symbol, enumerable and non-enumerable).
* **Property descriptor**: An object describing a property’s attributes (value or get/set and flags).
* **Object.getOwnPropertyDescriptor(obj, key)**: Retrieves a property’s descriptor.
* **Object.defineProperty(target, key, desc)**: Defines a property on `target` using the provided descriptor.

---

## Cheat Sheet

```js
function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (cache.has(obj)) return cache.get(obj);

  let clone;
  if (obj instanceof Date) {
    clone = new Date(obj);
    cache.set(obj, clone);
    return clone;
  }
  if (obj instanceof Map) {
    clone = new Map();
    cache.set(obj, clone);
    for (let [k, v] of obj) {
      clone.set(deepClone(k, cache), deepClone(v, cache));
    }
    return clone;
  }
  if (obj instanceof Set) {
    clone = new Set();
    cache.set(obj, clone);
    for (let v of obj) {
      clone.add(deepClone(v, cache));
    }
    return clone;
  }
  if (Array.isArray(obj)) {
    clone = [];
    cache.set(obj, clone);
    obj.forEach((v, i) => clone[i] = deepClone(v, cache));
    return clone;
  }

  clone = Object.create(Object.getPrototypeOf(obj));
  cache.set(obj, clone);
  for (let key of Reflect.ownKeys(obj)) {
    const desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc.get || desc.set) {
      Object.defineProperty(clone, key, desc);
    } else {
      desc.value = deepClone(desc.value, cache);
      Object.defineProperty(clone, key, desc);
    }
  }
  return clone;
}
```

Use this file for a concise overview of each step in the deep-cloning process and the reasons behind them.
