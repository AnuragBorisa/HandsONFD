/*
 * Simple JavaScript template engine (Day 10)
 * Supports: {{variable}}, {{#if}}, {{#each}}, custom helpers, HTML-escaping, nesting
 * No use of eval/new Function – interpret an AST at runtime.
 */

// Compile the template into a reusable render function
export function compileTemplate(template) {
    const tokens = tokenize(template);
    const ast = parse(tokens);
    return function render(data = {}, helpers = {}) {
      return renderAST(ast, data, helpers);
    };
  }
  
  // Split the template into text and tag tokens
  function tokenize(template) {
    const re = /(\{\{[#\/]?[^}]+\}\})/g;
    return template.split(re).filter(t => t !== '');
  }
  
  // Parse tokens into an AST with nested sections
  function parse(tokens) {
    const root = { type: 'root', children: [] };
    const stack = [root];
  
    for (let token of tokens) {
      const curr = stack[stack.length - 1];
  
      if (token.startsWith('{{#')) {
        // Section start
        const content = token.slice(3, -2).trim();
        const [name, ...args] = content.split(/\s+/);
        const node = { type: 'section', name, args, children: [] };
        curr.children.push(node);
        stack.push(node);
  
      } else if (token.startsWith('{{/')) {
        // Section end
        stack.pop();
  
      } else if (token.startsWith('{{')) {
        // Variable or helper-invocation inline
        const content = token.slice(2, -2).trim();
        curr.children.push({ type: 'variable', content });
  
      } else {
        // Plain text
        curr.children.push({ type: 'text', content: token });
      }
    }
  
    return root;
  }
  
  // Safely resolve nested paths (e.g. user.name.first)
  function resolvePath(data, path) {
    return path.split('.').reduce((obj, key) => {
      return obj != null ? obj[key] : undefined;
    }, data);
  }
  
  // Escape HTML by default
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  // Recursively render the AST
  function renderAST(node, data, helpers) {
    let out = '';
  
    switch (node.type) {
      case 'root':
      case 'section':
        for (let child of node.children) {
          out += renderAST(child, data, helpers);
        }
        break;
  
      case 'text':
        out += node.content;
        break;
  
      case 'variable': {
        // Check for helper invocation: e.g. uppercase name
        const parts = node.content.split(/\s+/);
        if (parts.length > 1 && helpers[parts[0]]) {
          const fn = helpers[parts[0]];
          const args = parts.slice(1).map(arg => {
            if (/^['"].*['"]$/.test(arg)) return arg.slice(1, -1);
            return resolvePath(data, arg);
          });
          out += fn(...args);
        } else {
          const val = resolvePath(data, node.content);
          out += escapeHTML(val != null ? val : '');
        }
        break;
      }
  
      case 'section': {
        const { name, args, children } = node;
  
        if (name === 'if') {
          const cond = resolvePath(data, args[0]);
          if (cond) {
            out += children.map(c => renderAST(c, data, helpers)).join('');
          }
        }
  
        else if (name === 'each') {
          const arr = resolvePath(data, args[0]) || [];
          for (let item of arr) {
            // `this` refers to each item
            out += children.map(c => renderAST(c, { ...data, this: item }, helpers)).join('');
          }
        }
  
        else if (helpers[name]) {
          // Custom block helper: last arg is inner content
          const fn = helpers[name];
          const helperArgs = args.map(a => {
            if (/^['"].*['"]$/.test(a)) return a.slice(1, -1);
            return resolvePath(data, a);
          });
          const inner = children.map(c => renderAST(c, data, helpers)).join('');
          out += fn(...helperArgs, inner);
        }
        break;
      }
    }
  
    return out;
  }
  