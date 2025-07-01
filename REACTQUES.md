# React Hands-On Practice Questions

1. **Accessible Modal via Portals**  
   **Problem:** Build a modal using React portals that traps focus, closes on ESC or overlay click, and includes proper ARIA roles. Mount it into a `#modal-root` element and write unit tests with React Testing Library.

2. **`useFetch` + SWR Hook**  
   **Problem:** Create a `useFetch(url, options)` hook that:  
   - Uses `AbortController` to cancel in-flight requests.  
   - Deduplicates concurrent requests for the same URL.  
   - Implements stale-while-revalidate caching with automatic background updates.  
   - Supports TypeScript generics for response data typing.

3. **10k Row Virtual List**  
   **Problem:** Implement a windowed list component that efficiently renders 10,000 rows without using third-party libraries. Ensure smooth scrolling (FPS ≥ 50), minimal DOM nodes, and keyboard navigation support.

4. **Dynamic Form Builder**  
   **Problem:** Build a form generator that takes a JSON schema to render controlled inputs (text, select, checkbox), validation rules, and conditional field visibility. Persist form state to `localStorage` so users can resume.

5. **Kanban Drag & Drop**  
   **Problem:** Create a Kanban board with draggable columns and cards using `react-dnd`. Implement optimistic UI updates and sync reorder operations to a backend via PATCH diffs.

6. **Global State Context + Reducer**  
   **Problem:** Set up a theme and authentication context using `React.createContext` and `useReducer`. Persist state in IndexedDB and split bundles using `React.lazy` and `Suspense`.

7. **Error Boundary + Code-Split**  
   **Problem:** Implement an Error Boundary component. Lazy-load routes with `React.lazy` and `Suspense`, displaying a skeleton loader. Gracefully handle component load failures by showing a fallback UI.

8. **Animated List Transitions**  
   **Problem:** Use Framer Motion to animate list item addition, removal, and reordering with FLIP animations. Respect the user’s `prefers-reduced-motion` setting.

9. **Autocomplete Search**  
   **Problem:** Build an accessible autocomplete combobox:  
   - Debounce user input before API calls.  
   - Support keyboard navigation (arrow keys, Enter, Escape).  
   - Show “No results” state and allow clearing the input.

10. **SSR-Ready Blog Page (Next.js)**  
    **Problem:** Create a blog post page in Next.js that:  
    - Uses Static Generation (SSG) and Incremental Static Regeneration (ISR).  
    - Transforms Markdown files into HTML.  
    - Optimizes images with `next/image`.  
    - Includes SEO meta tags and Open Graph data.
