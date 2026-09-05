# JavaScript in Depth

Runnable examples for the book, organized by chapter. Each file demonstrates one
mechanism from that chapter and starts with a one-line comment saying what it
shows.

## Running them

Target runtime is Node.js v24+, run with `node <file>`, with these exceptions.

Files that need a flag (also stated in each file's header):

- V8 native syntax (`%HaveSameMap`, `%HasFastProperties`, `%DebugPrint`) needs
  `--allow-natives-syntax`:
  - `ch02/debug-print-string-types.mjs`
  - `ch05/hidden-classes-shapes.mjs`
  - `ch05/consistent-object-construction.mjs`
  - `ch05/fast-vs-slow-properties.mjs`
  - `ch05/monomorphic-vs-megamorphic.mjs`
- Optimization tracing:
  - `ch06/warmup-hot-loop.mjs` — `node --trace-opt --trace-deopt ...`
  - `ch06/monomorphic-vs-deopt.mjs` — `node --trace-deopt ...`
- Garbage collection:
  - `ch09/dying-young.mjs`, `ch11/trace-gc-allocator.mjs` — `node --trace-gc ...`
  - `ch09/leaking-to-old-gen.mjs` — `node --trace-gc --max-old-space-size=256 ...`
  - `ch09/finalization-registry.mjs`, `ch09/weakref-deref.mjs`,
    `ch09/weakmap-cache.mjs`, `ch09/write-barrier-cost.mjs`,
    `ch09/heap-sampler.mjs` (optional) — `node --expose-gc ...`
- Profiling: `ch11/cpu-prof-workload.mjs` — `node --cpu-prof ...`
- Thread pool: `ch11/threadpool-saturation.mjs` — `UV_THREADPOOL_SIZE=4 node ...`

Version and runtime exceptions:

- `ch07/suppressed-error.mjs` requires **Node 24+**. `SuppressedError` and the
  `using` declaration ship with explicit resource management, which is not in
  Node 22.
- `ch01/listing1.2.js` and `ch01/listing1.3.js` are **Deno** examples
  (`deno run ...`); 1.3 is the puzzle failing on Deno's missing `setImmediate`
  global, which is the point.
- `ch09/jsc-heap-stats.js` is **Bun-only** (`bun jsc-heap-stats.js`); it uses
  `bun:jsc`, which has no Node equivalent.
- Several interval-based samples (memory/ELU/event-loop-delay samplers, the
  thread-pool timer) run continuously by design; stop them with Ctrl-C. The
  `--trace-gc`, `--cpu-prof`, and puzzle files self-terminate.

## What each chapter covers

- **ch01 (When a hello isn't hello)** — the scheduling puzzle as CommonJS vs ESM
  (same code, different output), plus the precision and parse-context asides.
- **ch02 (Strings)** — listings 2.1–2.12, encodings and byte length, code points
  vs code units, surrogate math, normalization, immutability, ConsString cost,
  and a `%DebugPrint` of V8's internal string types.
- **ch03 (Numbers)** — SMI vs HeapNumber, IEEE-754 precision loss, MAX_SAFE_INTEGER,
  Number.EPSILON, bit decomposition, BigInt basics and cost, the decimal problem.
- **ch04 (Primitives, Coercion, Equality)** — null vs undefined, the full falsy
  set (with `'0'` correctly truthy), operators returning operands, symbols,
  ToPrimitive/ToNumber/ToString made observable, loose vs strict equality, and
  the coercion-cost sort.
- **ch05 (Objects)** — data vs accessor properties, all three descriptor
  attributes, prototype lookup and pollution, `this` binding, classes and
  private fields, Proxy, and hidden-class / inline-cache demos.
- **ch06 (Functions)** — emulating `new`, new.target, the four function forms,
  `this` control, closures, rest vs arguments, and the compilation tiers / deopt.
- **ch07 (Errors)** — native types, AggregateError and SuppressedError with
  correct semantics, the cause chain, stack cost, the finally trap, propagation,
  async stack boundaries, and global handlers.
- **ch08 (Scheduling)** — queue ordering (CommonJS for canonical order), promise
  anatomy, microtask draining and starvation, nextTick vs setImmediate, Zalgo.
- **ch09 (Garbage collection)** — young vs old generation under `--trace-gc`,
  the healthy-vs-leak baseline, WeakMap/WeakSet, WeakRef and FinalizationRegistry,
  write-barrier cost, and a Bun-only JSC heapStats sample.
- **ch10 (Streams)** — Node streams, Web Streams, async iterables, backpressure
  honored vs ignored, and the anti-patterns each paired with a corrected version.
- **ch11 (Diagnostics)** — memoryUsage/resourceUsage sampling, heap snapshot,
  `--trace-gc`, `--cpu-prof`, event loop delay, thread pool saturation, and ELU.

Heavy measured harnesses (the streams cost benchmark, the worked heap-leak with
snapshots, the flame-graph program, the deopt-cycle program) live separately and
are not duplicated here.

(Note: This readme was AI generated from the book's preface)
