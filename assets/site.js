(() => {
  'use strict';
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  try {
    savedTheme = localStorage.getItem('ponces-theme');
  } catch (_) {
    // The page also works when browser storage is unavailable.
  }
  let theme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme : preference.matches ? 'dark' : 'light';
  const applyTheme = () => {
    document.documentElement.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle');
    if (button) button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  applyTheme();
  preference.addEventListener('change', (event) => {
    if (!savedTheme) {
      theme = event.matches ? 'dark' : 'light';
      applyTheme();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    button.hidden = false;
    applyTheme();
    button.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      savedTheme = theme;
      try { localStorage.setItem('ponces-theme', theme); } catch (_) { /* Optional persistence. */ }
      applyTheme();
    });
    document.getElementById('year').textContent = new Date().getFullYear();
  });
})();
