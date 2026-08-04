'use strict';

const fs = require('node:fs');
const path = require('node:path');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));
const policySchema = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'policy-schema.json'), 'utf8'));
const requiredIcons = ['16', '32', '48', '128'];

function pngDimensions(file) {
  const data = fs.readFileSync(file);
  if (data.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} is not a PNG.`);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

if (manifest.manifest_version !== 3) throw new Error('Manifest V3 is required.');
if (manifest.version !== '0.1.0') throw new Error('Release version must be 0.1.0.');
if (!manifest.storage || manifest.storage.managed_schema !== 'policy-schema.json') throw new Error('Managed storage schema is missing.');
if (policySchema.type !== 'object' || policySchema.additionalProperties !== false || !policySchema.properties.allowedGitLabDomains) throw new Error('Managed storage schema is invalid.');
for (const size of requiredIcons) {
  const icon = manifest.icons && manifest.icons[size] && path.join(__dirname, '..', manifest.icons[size]);
  if (!icon || !fs.existsSync(icon)) throw new Error(`Missing ${size}px icon.`);
  const [width, height] = pngDimensions(icon);
  if (width !== Number(size) || height !== Number(size)) throw new Error(`Icon ${size}px has incorrect dimensions.`);
}
for (const [file, dimensions] of Object.entries({
  'assets/store/resolve-conflicts-screenshot.png': [1280, 800],
  'assets/store/screenshot-placeholder.png': [1280, 800],
  'assets/store/promo-small-placeholder.png': [440, 280],
  'assets/store/promo-marquee-placeholder.png': [1400, 560]
})) {
  const [width, height] = pngDimensions(path.join(__dirname, '..', file));
  if (width !== dimensions[0] || height !== dimensions[1]) throw new Error(`${file} has incorrect dimensions.`);
}
for (const file of ['README.md', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'PRIVACY.md', 'ENTERPRISE.md', 'RELEASE_CHECKLIST.md', 'RELEASE_NOTES_v0.1.0.md', 'RELEASE_AUDIT.md']) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) throw new Error(`Missing release file: ${file}`);
}
console.log('Release lint passed.');
