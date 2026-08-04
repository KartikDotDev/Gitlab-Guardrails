'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.join(__dirname, '..');
const { version } = require('../package.json');
const archive = path.join(root, 'dist', `gitlab-conflict-guard-v${version}.zip`);

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  }
  return (value ^ 0xffffffff) >>> 0;
}

function filesIn(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const source = path.join(directory, entry.name);
    const name = `${prefix}${entry.name}`;
    return entry.isDirectory() ? filesIn(source, `${name}/`) : [{ name, source }];
  });
}

function zip(entries) {
  let offset = 0;
  const local = [];
  const central = [];
  for (const entry of entries) {
    const name = Buffer.from(entry.name);
    const data = fs.readFileSync(entry.source);
    const compressed = zlib.deflateRawSync(data);
    const checksum = crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(0, 6); header.writeUInt16LE(8, 8);
    header.writeUInt32LE(checksum, 14); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(name.length, 26);
    const segment = Buffer.concat([header, name, compressed]);
    local.push(segment);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0); directory.writeUInt16LE(20, 4); directory.writeUInt16LE(20, 6); directory.writeUInt16LE(0, 8); directory.writeUInt16LE(8, 10);
    directory.writeUInt32LE(checksum, 16); directory.writeUInt32LE(compressed.length, 20); directory.writeUInt32LE(data.length, 24);
    directory.writeUInt16LE(name.length, 28); directory.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([directory, name]));
    offset += segment.length;
  }
  const directoryData = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directoryData.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directoryData, end]);
}

fs.writeFileSync(archive, zip(filesIn(path.join(root, 'dist', 'gitlab-conflict-guard'))));
console.log(`Created ${path.relative(root, archive)}.`);
