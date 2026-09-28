# Mind.kg

Russian-first prototype of a connected learning map for mathematics, physics, computer science, and AI. The curriculum currently contains 268 topic nodes in 31 expandable subject areas. This is a taxonomy foundation, not a claim that any discipline is complete.

## Run locally

This is a dependency-light static application. Serve the project root over HTTP so browser ES modules work:

```sh
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173). KaTeX and the typefaces are loaded from CDNs; topic text and navigation remain in the local files.

## Structure

- `index.html` — application shell, global navigation, and search dialog.
- `styles.css` — design tokens, responsive layouts, and page styles.
- `src/app.js` — component-style page renderers, hash navigation, interactive SVG graph (pan, zoom, node inspector), search, and theme control.
- `src/content.js` — locale-ready topic nodes, expandable subject taxonomy, graph relations, resource/practice fields, and learning depth content.

## Content model

Topics are nodes with stable IDs. Each node can carry a world, taxonomy membership, level, typed graph relations, overview, intuition, theory, definitions, formulas, derivations, examples, proofs, visualization metadata, practice, applications, and typed resource collections. `i18n` has Russian content and reserved Kyrgyz and English slots. Taxonomy categories can include cross-world nodes, such as mathematics prerequisites inside the AI curriculum.

The roadmap opens at subject-area level. Select a category to expand its topic nodes, select a topic for its prerequisite panel, then open the full topic page. Drag the canvas to pan; use the wheel or controls to zoom.

Research-level material describes the difficulty and scope of the material; it does not imply an academic degree. Add evidence and a source before presenting open or empirical claims as settled facts.
