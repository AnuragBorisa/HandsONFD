# Day 10: Template Engine Notes

## 📘 Overview

On Day 10, we built a simple JavaScript template engine (akin to a mini‐Handlebars) that transforms template strings into render functions without using `eval` or `new Function`.

### 🎯 Goal

* **compile** a template string into a fast, reusable `render(data, helpers)` function.
* Support **variable interpolation**, **conditionals**, **loops**, and **custom helpers**.
* Ensure **HTML‐escaping** by default and meaningful errors.

---

## 🧩 Architecture

1. **Tokenization**: Split the template into text and tag tokens.
2. **Parsing**: Build an **AST** from tokens, nesting `#if`, `#each`, and custom blocks.
3. **Rendering**: Walk the AST to produce the final string, resolving data paths, invoking helpers, and escaping output.

```
template string
   ↓ tokenize()
[token1, token2, ...]
   ↓ parse()
AST
   ↓ renderAST(data, helpers)
"<final output>"
```

---

## 🌲 AST Node Types

| Type       | Properties                     | Meaning                                 |
| ---------- | ------------------------------ | --------------------------------------- |
| `root`     | `children[]`                   | Top‐level container                     |
| `text`     | `content`                      | Literal text                            |
| `variable` | `content`                      | `{{path}}` or `{{helper arg1 arg2}}`    |
| `section`  | `name`, `args[]`, `children[]` | Block: `#if`, `#each`, or custom helper |

---

## 🔍 Core Functions

### `tokenize(template)`

* Regex splits on `{{…}}` tags.
* Returns an array of alternating plain‐text and tag tokens.

### `parse(tokens)`

* Iterates tokens, using a stack to nest sections:

  * `{{#name …}}` ⇒ push new `section` node
  * `{{/name}}` ⇒ pop
  * `{{…}}` ⇒ `variable` node
  * else ⇒ `text` node

### `renderAST(node, data, helpers)`

* Recursively visits nodes:

  * **text** ⇒ append `content`
  * **variable** ⇒

    * If matches a helper name ⇒ call helper(fn)
    * Else ⇒ resolve path in `data` & escape
  * **section** ⇒

    * `if`: render children if truthy
    * `each`: iterate array, setting `this`
    * custom: call helper with inner content

### `resolvePath(data, "a.b.c")`

Safely traverse nested objects, returning `undefined` if a link is missing.

### `escapeHTML(str)`

Replaces `& < > " '` with their HTML entities.

---

## ✨ Helpers API

* **Inline helper**: `{{uppercase title}}` → `helpers.uppercase(title)`
* **Block helper**:

  ```hbs
  {{#formatDate createdAt "YYYY-MM-DD"}}
    {{this}}
  {{/formatDate}}
  ```

  invokes `helpers.formatDate(date, fmt, innerContent)`

---

## 🔧 Example Usage

```js
import { compileTemplate } from './template-engine'

const tpl = `
  <h1>{{title}}</h1>
  {{#if user.isAdmin}}<button>Delete</button>{{/if}}
  <ul>{{#each items}}<li>{{this}}</li>{{/each}}</ul>
`;

const render = compileTemplate(tpl);
const html = render(
  { title: 'List', user: { isAdmin: true }, items: ['a','b'] },
  { uppercase: str => str.toUpperCase() }
);
```

---

## 🛠 Next Steps

* Add **error reporting** for mismatched tags.
* Support `{{else}}` blocks in `if`/`each`.
* Cache parsed ASTs for repeated renders.
* Write **unit tests** to verify rendering outputs.

---

> Keep this file as your Day 10 reference for how the token→AST→render pipeline works in our template engine.
