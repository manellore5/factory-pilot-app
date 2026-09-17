# AGENTS.md

Guidance for agents (and people) working in this repository. Read this before opening a pull request.

## What this is

A small single-page expense tracker: Vite + React 19 + TypeScript. Three views switched by tabs (no router): an expense list with an add form, a summary of totals by category, and a settings view for the display currency. State lives in memory in `src/App.tsx`; there is no backend.

## Setup and commands

Requires Node >= 22.13 (see `engines` in `package.json`).

```sh
npm ci            # install exactly what package-lock.json pins
npm run dev       # start the Vite dev server (http://localhost:5173)
npm test          # run the Vitest suite once (vitest run)
npm run lint      # eslint . — must report zero problems
npm run build     # tsc -b && vite build — type-checks then bundles to dist/
```

Run `npm test`, `npm run lint`, and `npm run build` before every commit. All three must succeed on `main` at all times.

## Layout

```
src/
  main.tsx              entry point
  App.tsx               top-level state and tab switching
  types.ts              Expense, Category, Currency types and constant lists
  index.css             all styling (plain CSS, no preprocessor)
  lib/                  pure functions, no React imports
    expenses.ts         add/remove/filter/sort/totals
    money.ts            currency symbols, formatting, parsing
  components/           functional React components, one per file
  test/setup.ts         Vitest setup (jest-dom matchers, RTL cleanup)
```

## Code style

- Functional components only. No class components, no default exports except `App`.
- Keep logic out of components. Anything that computes, filters, sorts, formats, or validates belongs in `src/lib/` as a pure function that takes plain data and returns plain data. Components call those functions and render.
- Immutability: `src/lib/` functions never mutate their arguments; return new arrays and objects.
- TypeScript strict mode is on. Do not use `any` or non-null assertions to silence the compiler; fix the types.
- Plain CSS in `src/index.css` using the existing class names. No CSS-in-JS, no utility frameworks.
- No new runtime dependencies without a reason stated in the PR. No router, state library, or form library is needed for this app.
- Formatting: two-space indent, single quotes, no semicolons, trailing commas in multi-line literals (matches the existing files).

## Tests

- Tests live beside the code they test, named `*.test.ts` for `src/lib/` and `*.test.tsx` for components.
- Use Vitest (`describe`/`it`/`expect` imported from `vitest`; globals are off) and React Testing Library with `@testing-library/user-event` for interaction.
- Prefer testing pure functions in `src/lib/` directly. Add a component test only when the behaviour is in the component (rendering, form handling, wiring).
- Query the DOM by role or label text, not by CSS class or test id.

## What a mergeable pull request looks like

1. Small. One issue per PR, one concern per PR. If a fix reveals a second problem, open a second issue rather than widening the PR.
2. Includes a test for the change. A bug fix adds a test that fails without the fix and passes with it. A feature adds tests for the new pure logic and, if there is UI, one component test.
3. `npm test`, `npm run lint`, and `npm run build` all pass on the PR branch.
4. The PR description references the issue it resolves (for example `Fixes #3`), states what changed and why in a few sentences, and mentions anything the reviewer should look at closely.
5. Does not reformat or refactor unrelated code. Diffs should be readable in one sitting.
6. Does not change tooling, dependencies, or this file unless that is the point of the PR.

## Repository hygiene for agents

- Do not commit `.artifacts/` (planning output); it is gitignored.
- Do not regenerate `package-lock.json` unless the change adds or updates a dependency. Use `npm ci` to install; if the lockfile changes without a dependency change, revert it before committing.
- A pull request should contain only the files needed for the issue plus its tests.
- Branch naming is mandatory: create your branch as `factory/issue-<n>`, where `<n>` is the GitHub issue number (for issue #12 the branch is `factory/issue-12`). Open the pull request from that branch. Factory links the pull request to the issue card by this exact name; any other name breaks the link.
- Open the pull request with exactly this command and nothing else afterwards: `gh pr create --fill --base main --head factory/issue-<n>`. Its output must be the single pull request URL; do not print other URLs in the same command. Factory uses that output to link the pull request to the issue card and to start the review automatically.
- Immediately after the pull request is open, move the work item to the Review stage: call `factory_transition_work_item` with stage `review` and the `expectedRevision` from the latest Factory phase update. The Work board changes stage only when you request it; a card left in Building hides that the build is done and the pull request is waiting for review.
