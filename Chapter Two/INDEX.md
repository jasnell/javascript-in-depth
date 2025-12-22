# Chapter 2: Strings

Examples exploring JavaScript's UTF-16 string representation, Unicode handling, and V8's internal string optimizations.

## Examples

| File | Description |
|------|-------------|
| [ch02_grapheme_clusters.js](ch02_grapheme_clusters.js) | How grapheme clusters (emoji with modifiers, combined characters) differ from code points and break string methods. |
| [ch02_regex_unicode.js](ch02_regex_unicode.js) | How the `u` flag fixes regex matching for characters beyond the BMP (like emoji). |
| [ch02_rope_performance.js](ch02_rope_performance.js) | V8's rope-like ConsString structure and when flattening occurs. *Requires `--allow-natives-syntax`* |
| [ch02_sliced_string.js](ch02_sliced_string.js) | How substring() creates SlicedStrings that reference parent strings, causing potential memory retention. *Requires `--allow-natives-syntax`* |
| [ch02_string_comparison.js](ch02_string_comparison.js) | Locale-aware string comparison with Intl.Collator, including the Swedish alphabet example where ä > z. |
| [ch02_string_concatenation.js](ch02_string_concatenation.js) | How V8 defers string copying with ConsStrings and when flattening happens. *Requires `--allow-natives-syntax`* |
| [ch02_string_interning.js](ch02_string_interning.js) | How V8 interns certain strings to share memory for identical values. *Requires `--allow-natives-syntax`* |
| [ch02_string_length_surrogates.js](ch02_string_length_surrogates.js) | Why string.length doesn't match visible characters for emoji and other surrogate pairs. |
| [ch02_text_encoding.js](ch02_text_encoding.js) | TextEncoder/TextDecoder for converting between JavaScript's UTF-16 and UTF-8 for network/file I/O. |
| [ch02_unicode_normalization.js](ch02_unicode_normalization.js) | How visually identical strings can differ at the code unit level and why normalization matters. |
