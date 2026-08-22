# alejans
A minimal terminal-themed personal site built with plain HTML, CSS, and JavaScript.

## Edit the status schedule
The `statusSchedule` object near the top of `script.js` is a lookup table for
every weekday and these three local-time chunks: `daytime` (6am-6pm),
`evening` (6pm-10pm), and `overnight` (10pm-6am). Edit the values for `status`,
`working_on`, `location`, and `where_you_can_find_me` for each chunk.

## Add a note
Notes are stored in the `notes` array in `notes.js`. Each note gets a page at
`#article/<slug>`.

- `slug` is the URL-safe identifier used in the article link. Use lowercase
	words separated by hyphens, such as `learning-javascript`.
- `name` is the filename displayed in the notes list and at the top of the
	article. Usually make it the slug with `.md` added, such as
	`learning-javascript.md`.
- `metadata` contains details shown above the article. `published` and
	`author` are examples, and you can add other fields.
- `markdown` is the article body. It supports headings, paragraphs, ordered
	and unordered lists, links, bold, italic, and inline code.

### Add a new note
1. Open `notes.js`.
2. Add a new object to the `notes` array, including a comma after the previous
	 note.
3. Choose one lowercase, hyphenated `slug` that is not used by another note.
4. Set `name` to the same value as the slug with `.md` appended.
5. Add the publication date and time in `metadata.published`, then write the
	 article in `markdown`.
6. Visit `#notes` and select the new filename. Its link will automatically be
	 `#article/<slug>`.

For example, this note appears as `learning-javascript.md` and opens at
`#article/learning-javascript`:
```js
{
	slug: "note-number",
	name: "note_title.md",
	metadata: {
		published: "YYY-MM-DD HHMM",
		author: "Alejandro",
	},
	markdown: `# A heading

               Paragraph text.

               - A list item
            `,
}
```

## Edit the ASCII tables
Other table content lives in the `tables` object near the top of `script.js`.
- Add a row by adding another array to `rows`.
- Add a column by adding another value to each row.
- Use a plain string for text.
- Use `{ text: "label", href: "https://example.com" }` for a link.
The renderer measures every cell and rebuilds the borders automatically.

## Use the terminal
The terminal above the page sections accepts these commands:

- `-help` displays the available commands.
- `status`, `notes`, and `published` navigate to those pages.
- `theme -l` switches to the light theme.
- `theme -d` switches to the dark theme.
- `clear` clears the terminal output.
- `find -"text"` searches note and project names and returns up to three links.

Unrecognized commands display `wrong input`. Terminal output is replaced by
the next result and remains visible while navigating between pages. A fresh
page load starts with an empty terminal.

Command output strings are defined in `runTerminalCommand()` and
`showSearchResults()` in `script.js`.