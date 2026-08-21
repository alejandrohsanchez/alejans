# alejans
A minimal terminal-themed personal site built with plain HTML, CSS, and JavaScript.

## Edit the ASCII tables
Table content lives in the `tables` object near the top of `script.js`.
- Add a row by adding another array to `rows`.
- Add a column by adding another value to each row.
- Use a plain string for text.
- Use `{ text: "label", href: "https://example.com" }` for a link.
The renderer measures every cell and rebuilds the borders automatically.