# Chapter 8: The Event Loop

Examples demonstrating the event loop, microtasks, macrotasks, and asynchronous execution ordering.

## Examples

| File | Description |
|------|-------------|
| [ch08_event_loop_starvation.js](ch08_event_loop_starvation.js) | How continuously queueing microtasks can starve macrotasks and block the event loop. |
| [ch08_microtask_priority.js](ch08_microtask_priority.js) | How all microtasks drain completely before the next macrotask runs. |
| [ch08_promise_interleaving.js](ch08_promise_interleaving.js) | How multiple promise chains interleave execution through the microtask queue. |
