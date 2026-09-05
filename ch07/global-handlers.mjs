// Global last-resort handlers: uncaughtException and unhandledRejection.

// Fires for synchronous or async throws that no try/catch intercepted.
process.on('uncaughtException', (err, origin) => {
  console.error('uncaughtException:', err.message, '| origin:', origin);
  // In Node the process is now in an undefined state; log and exit.
  process.exit(1);
});

// Fires for a rejected promise with no .catch/await handler.
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason?.message ?? reason);
});

// A rejected promise nobody awaits triggers unhandledRejection.
Promise.reject(new Error('nobody awaited me'));

// An async throw with no handler falls through to uncaughtException.
setTimeout(() => {
  throw new Error('Async error');
}, 50);
