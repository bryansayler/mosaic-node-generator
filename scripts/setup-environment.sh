#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but was not found on PATH." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but was not found on PATH." >&2
  exit 1
fi

echo "Using Node.js $(node --version) and npm $(npm --version)"
echo "Installing dependencies from package-lock.json..."
npm ci --no-audit --no-fund

echo "Compiling TypeScript..."
npm run build

echo "Environment setup complete. Run 'npm run test:ts' for the maintained test suite."
