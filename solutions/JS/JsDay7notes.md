## **Notes on Flattening & Unflattening**

## 1. `flatten(obj)`

### Purpose

Convert a nested combination of objects and arrays into a flat map (`{ path: value }`).

### Signature

```js
function flatten(obj)
```

### Key Steps

1. **Initialize** an empty accumulator `result = {}`.
2. **Recursive helper** `recursive(val, path)`:

   * **Primitive or null**: record `result[path] = val`.
   * **Array**:

     * If empty: `result[path] = []` (preserve empty arrays).
     * Else: for each element `item` at index `i`, call

       ```js
       recursive(item, `${path}[${i}]`);
       ```
   * **Object**:

     * Get its keys. If `keys.length === 0`: record `result[path] = {}` (preserve empty objects).
     * Else: for each `key`, build `newPath = path ? `\${path}.\${key}` : key` and recurse on `val[key]`.
3. **Kick off** with `recursive(obj, '')`.
4. **Clean up**: `delete result[''];` removes the empty‐string key created for root primitives or empty objects.
5. **Return** `result`.

### Edge Cases

* **`null`** (treated as primitive)
* **`undefined`** (if encountered explicitly)
* **Empty arrays/objects** (explicitly recorded)

### Example

```js
flatten({
  a: { b: [1, { c: 2 }] },
  d: "hello"
});
// → {
//   "a.b[0]": 1,
//   "a.b[1].c": 2,
//   "d":       "hello"
// }
```

---

## 2. Tokenization (for `unflatten`)

### Goal

Turn a compound path string like `"user.pets[2].name"` into a sequence of steps:

```js
["user", "pets", 2, "name"]
```

### Simple Algorithm (no regex)

1. **Split** on `.` → `parts = path.split('.')`, e.g. `["user", "pets[2]", "name"]`.
2. For each `part`:

   * If it contains no `'['`, push it directly.
   * Else:

     ```js
     const [prop, ...rest] = part.split('[');
     tokens.push(prop);
     rest.forEach(segment => {
       const idx = segment.replace(']', '');
       tokens.push(Number(idx));
     });
     ```

---

## 3. `unflatten(flatMap)`

### Purpose

Reconstruct the original nested objects/arrays from the flat map.

### Signature

```js
function unflatten(flatMap)
```

### Algorithm

1. **Initialize** `result = {}`.
2. Loop **each** `path` in `flatMap`:

   * Extract its `value = flatMap[path]`.
   * **Tokenize** `path` into `tokens`.
   * Let `cur = result`.
   * **Iterate** `i` from `0` to `tokens.length - 1`:

     * `tok = tokens[i]`
     * `isLast = (i === tokens.length - 1)`
     * **If last**: assign `cur[tok] = value`.
     * **Else**:

       1. Look at `next = tokens[i+1]`.
       2. `needsArray = (typeof next === 'number')`.
       3. If `cur[tok] === undefined`, create container:

          ```js
          cur[tok] = needsArray ? [] : {};
          ```
       4. Descend: `cur = cur[tok]`.
3. **Return** `result`.

### Dry‑run Example

Path: `"user.pets[0].name"`, value "Fluffy":

```text
 result = {}             cur → result
 i=0: tok="user"       needsArray=false
   result.user = {}      cur → result.user
 i=1: tok="pets"       needsArray=true
   result.user.pets = [] cur → result.user.pets
 i=2: tok=0              needsArray=false
   result.user.pets[0] = {} cur → that {}
 i=3: tok="name"       isLast=true
   result.user.pets[0].name = "Fluffy"
```

---

## 4. Array‑only Utilities

### `flattenArray(arr)`

```js
function flattenArray(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val)
      ? acc.concat(flattenArray(val))
      : acc.concat(val)
  , []);
}
```

* Recursively concatenates nested arrays into one flat array.

### `unflattenArray(flatArr, shape)`

```js
function unflattenArray(flatArr, shape) {
  let idx = 0;
  function build(dims) {
    if (dims.length === 0) return flatArr[idx++];
    const [len, ...rest] = dims;
    const out = [];
    for (let i = 0; i < len; i++) {
      out.push(build(rest));
    }
    return out;
  }
  return build(shape);
}
```

* Re‑nests a flat array into the given dimensions (e.g. `[2,3]` → 2×3 matrix).

---

> Keep this file (`notes.md`) handy—each function’s intent, algorithmic outline, and edge‐case handling are laid out for quick reference!
