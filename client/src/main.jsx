import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

function enableSmoothScroll() {
  function tryScrollFromHref(href) {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return false;
    const id = href.slice(hashIndex);
    const el = document.querySelector(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (tryScrollFromHref(href)) {
      e.preventDefault();
      if (href.startsWith('/')) history.pushState({}, '', href);
      else location.hash = href;
    }
  });

  window.addEventListener('hashchange', () => tryScrollFromHref(location.hash));
  window.addEventListener('popstate', () => tryScrollFromHref(location.href));
  // On initial load
  setTimeout(() => tryScrollFromHref(location.href), 0);
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

enableSmoothScroll();


