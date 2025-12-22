# Chapter 6: Functions

Examples covering function internals, closures, optimization, and advanced function features.

## Examples

| File | Description |
|------|-------------|
| [ch06_arguments_object.js](ch06_arguments_object.js) | How the legacy arguments object prevents optimizations and why rest parameters are better. *Requires `--allow-natives-syntax`* |
| [ch06_closures_memory.js](ch06_closures_memory.js) | How closures create Context objects on the heap and their memory implications. |
| [ch06_eval_scope.js](ch06_eval_scope.js) | How direct eval pollutes scope and prevents optimizations vs indirect eval in global scope. |
| [ch06_generator_state_machine.js](ch06_generator_state_machine.js) | Using generators as state machines for parsers, protocols, and async-like control flow. |
| [ch06_inlining.js](ch06_inlining.js) | When TurboFan inlines functions and what prevents inlining (size, recursion, megamorphism). *Requires `--allow-natives-syntax`* |
| [ch06_new_keyword.js](ch06_new_keyword.js) | The four steps of the new operator and what happens when constructors return values. |
| [ch06_optimization_tiers.js](ch06_optimization_tiers.js) | V8's compilation tiers (Ignition, Sparkplug, Maglev, TurboFan) and optimization status. *Requires `--allow-natives-syntax`* |
| [ch06_tail_call_optimization.js](ch06_tail_call_optimization.js) | Proper tail calls (Safari only), trampolining, and alternatives for deep recursion without stack overflow. |
| [ch06_this_binding.js](ch06_this_binding.js) | The four this binding rules: new, explicit (call/apply/bind), implicit, and default. |
