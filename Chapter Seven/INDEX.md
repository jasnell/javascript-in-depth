# Chapter 7: Errors

Examples exploring JavaScript's error handling, stack traces, and error best practices.

## Examples

| File | Description |
|------|-------------|
| [ch07_aggregate_error.js](ch07_aggregate_error.js) | AggregateError for wrapping multiple errors, used by Promise.any() and batch validation. |
| [ch07_async_boundary.js](ch07_async_boundary.js) | Why try-catch doesn't work across async boundaries and how to handle async errors. |
| [ch07_async_stack_traces.js](ch07_async_stack_traces.js) | Async stack traces that show what initiated async operations, with --async-stack-traces flag. |
| [ch07_error_cause.js](ch07_error_cause.js) | The ES2022 cause property for wrapping errors while preserving debugging context. |
| [ch07_error_serialization.js](ch07_error_serialization.js) | Why JSON.stringify loses error properties and strategies for serializing errors correctly. |
| [ch07_finally_trap.js](ch07_finally_trap.js) | How return or throw in finally blocks can suppress or replace the original error. |
| [ch07_prepare_stack_trace.js](ch07_prepare_stack_trace.js) | V8's Error.prepareStackTrace hook for customizing stack trace formatting. |
| [ch07_stack_trace_limit.js](ch07_stack_trace_limit.js) | Error.stackTraceLimit for controlling stack trace depth and improving performance. |
| [ch07_thrown_primitives.js](ch07_thrown_primitives.js) | Why throwing non-Error values loses stack traces and makes debugging harder. |
