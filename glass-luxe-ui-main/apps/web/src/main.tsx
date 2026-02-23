import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handler to catch browser extension errors that cause lag
window.addEventListener('error', (event) => {
  // Suppress errors from browser extensions trying to access className.indexOf
  if (
    event.message?.includes('indexOf is not a function') &&
    event.message?.includes('className') &&
    (event.filename?.includes('inject.js') || event.filename?.includes('extension'))
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}, true);

// Also catch unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('indexOf is not a function') &&
    event.reason?.message?.includes('className')
  ) {
    event.preventDefault();
  }
});

// Defensive patch: Ensure className is always a string when accessed via getAttribute
// This helps prevent browser extensions from breaking when they try to access className
const originalGetAttribute = Element.prototype.getAttribute;
Element.prototype.getAttribute = function(name: string) {
  if (name === 'class' && this.className && typeof this.className !== 'string') {
    // If className is an object (from React/CSS modules), convert it to string
    if ((this as any).className.baseVal !== undefined) {
      return (this as any).className.baseVal;
    }
    // Fallback: try to get the class string from the element's classList
    return Array.from(this.classList || []).join(' ') || '';
  }
  return originalGetAttribute.call(this, name);
};

const rootEl = document.getElementById("root");

if (rootEl) {
  createRoot(rootEl).render(<App />);
}
