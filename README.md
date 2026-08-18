# Larynex
Nuclear précision Protocol 

## Inkflow

An immersive writing editor — aurora background, water-glass panel, typewriter
scrolling, live word stats and Markdown export. Published at
[/inkflow/](https://reimain.github.io/inkflow/).

- `app/` — Vite + React + TypeScript source
- `inkflow/` — built output served by GitHub Pages

### Rebuilding

```bash
cd app
npm install
npm run build
cp -r dist/. ../inkflow/
```

`vite.config.ts` uses `base: './'`, so the build works from any subdirectory.
