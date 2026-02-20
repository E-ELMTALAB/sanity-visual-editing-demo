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
  // Debug: Log when prehero is present (dev-only)
  if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_LCP === 'true') {
    const prehero = document.getElementById("prehero");
    if (prehero) {
      console.log('[LCP Debug] Prehero present at mount time:', {
        element: prehero,
        img: document.getElementById("prehero-img"),
        timestamp: performance.now()
      });
    }
  }

  createRoot(rootEl).render(<App />);

  // EXPERIMENT C: Keep prehero visible for 5+ seconds to ensure LCP is captured from it
  // Only remove after user interaction or after 5s+ to prevent LCP swap
  const experiment = import.meta.env.VITE_EXPERIMENT || 'baseline';
  
  if (experiment === 'C' || experiment === 'c') {
    console.log('[EXPERIMENT C] Keeping prehero visible for 5+ seconds');
    
    const removePrehero = () => {
      const prehero = document.getElementById("prehero");
      if (prehero) {
        console.log('[EXPERIMENT C] Removing prehero at:', performance.now(), 'ms');
        prehero.remove();
      }
    };
    
    // Remove on user interaction (scroll, click, keydown)
    const onInteraction = () => {
      removePrehero();
      window.removeEventListener('scroll', onInteraction);
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
    
    window.addEventListener('scroll', onInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', onInteraction, { passive: true, once: true });
    window.addEventListener('keydown', onInteraction, { once: true });
    
    // Fallback: remove after 5 seconds
    setTimeout(removePrehero, 5000);
  } else {
    // BASELINE/OTHER EXPERIMENTS: Remove prehero ASAP after React mounts
    window.requestAnimationFrame(() => {
      const prehero = document.getElementById("prehero");
      if (prehero) {
        if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_LCP === 'true') {
          console.log('[LCP Debug] Removing prehero after React mount:', {
            timestamp: performance.now(),
            timeSinceMount: performance.now()
          });
        }
        prehero.remove();
      }
    });
  }
}
