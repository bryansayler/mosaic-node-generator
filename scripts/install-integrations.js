#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const catalog = require(path.join(root, 'integrations/catalog.json'));
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node scripts/install-integrations.js [--all] [--dry-run] [--destination=PATH]');
  console.log('Defaults to critical integrations and .integrations/. Repositories are shallow cloned and never executed.');
  process.exit(0);
}
const all = args.includes('--all');
const dryRun = args.includes('--dry-run');
const destinationArg = args.find(arg => arg.startsWith('--destination='));
const destination = path.resolve(root, destinationArg ? destinationArg.split('=').slice(1).join('=') : '.integrations');
const selected = all ? catalog : catalog.filter(item => item.tier === 'critical');
if (!dryRun) fs.mkdirSync(destination, { recursive: true });
let failed = 0;
selected.forEach(item => {
  const target = path.join(destination, item.repo.replace(/\.git$/, '').split('/').pop());
  if (fs.existsSync(target)) { console.log(`SKIP  ${item.name}: ${target} already exists`); return; }
  console.log(`${dryRun ? 'PLAN' : 'CLONE'} ${item.name} -> ${target}`);
  if (!dryRun) {
    const result = spawnSync('git', ['clone', '--depth', '1', '--filter=blob:none', item.repo, target], { stdio: 'inherit' });
    if (result.status !== 0) failed += 1;
  }
});
if (failed) { console.error(`${failed} integration clone(s) failed; rerun to retry only missing repositories.`); process.exit(1); }
console.log(`${dryRun ? 'Planned' : 'Installed'} ${selected.length} ${all ? 'total' : 'critical'} integrations.`);
