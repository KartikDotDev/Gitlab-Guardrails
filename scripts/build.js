'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const output = path.join(root, 'dist', 'gitlab-conflict-guard');
fs.rmSync(output, { recursive: true, force: true });
for (const entry of ['manifest.json', 'policy-schema.json', 'src', 'assets']) fs.cpSync(path.join(root, entry), path.join(output, entry), { recursive: true });
console.log(`Built ${path.relative(root, output)}.`);
