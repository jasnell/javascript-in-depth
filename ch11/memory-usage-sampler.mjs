// Samples process.memoryUsage() on an interval to expose rss, heapTotal, heapUsed, and external over time.

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

// A slow leak so the trend is visible: each tick retains more.
const retained = [];
setInterval(() => {
  for (let i = 0; i < 2000; i++) retained.push({ i, buf: Buffer.alloc(256) });
}, 1000);

setInterval(() => {
  const m = process.memoryUsage();
  console.log(
    `rss ${mb(m.rss)} MB  ` +
    `heapTotal ${mb(m.heapTotal)} MB  ` +
    `heapUsed ${mb(m.heapUsed)} MB  ` +
    `external ${mb(m.external)} MB  ` +
    `arrayBuffers ${mb(m.arrayBuffers)} MB`,
  );
}, 2000);
