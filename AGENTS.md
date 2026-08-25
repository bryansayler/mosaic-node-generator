# Repository guidance for coding agents

## Mission

Maintain the Node.js/TypeScript mosaic generator with small, reviewable changes. Preserve the public API and CLI behavior unless a task explicitly asks for a breaking change.

## Repository map

- `index.ts` exports the package API.
- `cli.ts` implements the command-line interface.
- `lib/` contains the TypeScript implementation.
- `test/ts/` and `test/js/` contain the TypeScript and JavaScript test suites.
- `dist/` contains checked-in compiler output and must be regenerated when TypeScript source changes.
- `test/data/` contains image fixtures; do not replace or recompress them without a task-specific reason.

## Setup

Run `./scripts/setup-environment.sh` from the repository root. The script installs the locked npm dependencies and compiles the project. Do not commit `node_modules/` or local environment files.

## Validation

Choose the narrowest useful checks while iterating, then run all relevant checks before finishing:

- `npm run build` — compile TypeScript and refresh `dist/`.
- `npm run test:ts` — run the maintained TypeScript tests.
- `npm run test:js` — run the legacy JavaScript tests. This suite currently has known failures: it expects a missing `profile.jpg`, and it calls an `index.test` export that does not exist. Report these failures rather than hiding or bypassing them.
- `npm test` — run both suites when the task changes runtime behavior or tests.

When source files are changed, review the generated `dist/` diff and include the corresponding generated files in the same commit.

## Working conventions

- Follow the style already present in the file being edited; this project targets an older TypeScript toolchain.
- Do not perform unrelated dependency upgrades or large formatting passes.
- Keep temporary outputs out of Git. Mosaic outputs, thumbnail directories, dependencies, logs, and `.env` files are already ignored.
- Never add secrets, API keys, personal images, or credentials to the repository.
- Summarize changed behavior and list every validation command in the final response, including known or environment-related failures.
