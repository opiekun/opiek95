# opiek95

A Windows 95 style desktop for my portfolio. Open the journal, projects, resume, and music player from the desktop or Start menu.

## Local preview

Requires Node.js 20 or later. Run `npm start` and open `http://127.0.0.1:4173/`.

The browser files live in `site/`. `server.mjs` serves that directory and handles journal routes. Local tests live in an ignored `tests/` directory and can be run with `npm test` when present.

## GitHub Pages

The Pages workflow publishes a static build after changes reach `main`. Run `npm run build:pages` to inspect the output in `.pages/`. The build prefixes site paths with `/opiek95/` and generates files for direct journal links.
