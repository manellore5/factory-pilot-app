# factory-pilot-app

Pilot app for the Mastra Factory wayfinder effort. A small expense tracker built with Vite, React 19, and TypeScript, kept deliberately simple so the whole codebase can be read in one sitting.

## Features

- Add expenses with a description, amount, category, and date
- Filter the list by category and delete entries
- Summary view with totals per category
- Settings view to choose the display currency (USD, EUR, GBP)

## Getting started

Requires Node >= 22.13.

```sh
npm ci
npm run dev
```

Other scripts: `npm test` (Vitest), `npm run lint` (ESLint), `npm run build` (type-check and bundle).

## Contributing

See [AGENTS.md](./AGENTS.md) for the layout, code style, and what a mergeable pull request looks like.
