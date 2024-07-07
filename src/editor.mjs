/*
import {basicSetup, EditorView} from "codemirror"
import {markdown} from "@codemirror/lang-markdown"
import {languages} from "@codemirror/language-data"

// The Markdown parser will dynamically load parsers
// for code blocks, using @codemirror/language-data to
// look up the appropriate dynamic import.
let view = new EditorView({
  doc: "Hello\n\n```javascript\nlet x = 'y'\n```",
  extensions: [
    basicSetup,
    markdown({codeLanguages: languages})
  ],
  parent: document.body
}) 
*/

import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"

export var editor = new EditorView({
  extensions: [basicSetup, javascript()],
  parent: document.body
})