# Yulia Krasova — Portfolio

Static portfolio site served by GitHub Pages. Plain HTML/CSS/JS, no build step.

- `index.html` — content (header, links, tabs and their panels)
- `style.css` — dark Notion-style theme
- `script.js` — tab switching (`/#animation`, `/#illustration` open a tab directly)
- `assets/` — images, GIFs and the CV

To add a tab: add a `<button role="tab" data-tab="x">` to the `.tabs` nav and a matching `<section class="panel" id="x" hidden>`.

Preview locally: `npx http-server . -p 8080`
