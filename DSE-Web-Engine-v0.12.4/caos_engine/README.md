# CAOS Engine Package (extracted from DOCX)

Files:
- `index.html` — HTML/JS engine loader that fetches `caos_stdlib.cos` (right-click the Reload button to load a local .cos).
- `caos_stdlib.cos` — Externalized CAOS standard library and placeholder default scripts.
- `caos_opcodes.json` — Machine-readable opcode metadata (subset shown; extend as needed).
- `test_harness.js` — Minimal compatibility harness invoking your global `engine`.

Usage:
1. Place all files in the same folder and open `index.html` in a modern browser.
2. Ensure your `engine` exposes `loadCAOSLibrary(text)` and `executeCAOS(code)` and that `validateScriptSyntax` uses `caos_opcodes.json`.
3. Run `test_harness.js` after your engine loads (e.g., via a `<script src="test_harness.js"></script>`).

Notes:
- Headings in `.cos` are commented so the file is valid CAOS source.
- JSON uses `null` for non-returning commands; the `"...“` key indicates where to expand the rest of the opcode table.
