if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js?v=2025-08-06').catch(console.error);
}