(() => {
  const app = document.querySelector('#app');
  const showError = (message) => {
    if (!app || app.dataset.rendered === 'true') return;
    app.innerHTML = `<main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#070b12;color:#e8eef7;font-family:system-ui,sans-serif"><div style="max-width:680px;text-align:center"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8391a5;margin-bottom:12px">AI Intelligence OS</div><h1 style="margin:0 0 12px">Workspace failed to start</h1><p style="color:#ff9b9b">${String(message || 'The application bundle could not be started.').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}</p><p style="color:#8391a5;font-size:13px">Please refresh once. If this persists, the deployment needs attention.</p></div></main>`;
  };
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('/app.js')) showError(event.message || 'app.js failed to execute');
  });
  window.addEventListener('unhandledrejection', (event) => showError(event.reason?.message || String(event.reason || 'Unhandled application error')));
  const script = document.createElement('script');
  script.src = '/app.js?v=80a837b';
  script.onload = () => { setTimeout(() => { if (!app?.dataset.rendered && app?.querySelector('.auth,.shell')) return; }, 0); };
  script.onerror = () => showError('Unable to load the application bundle (/app.js).');
  document.body.appendChild(script);
  setTimeout(() => {
    if (app && !app.querySelector('.auth,.shell')) showError('The application bundle did not finish loading within 8 seconds.');
  }, 8000);
})();
