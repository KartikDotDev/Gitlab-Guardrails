'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  }
  return (value ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function png(width, height, pixel) {
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1); rows[row] = 0;
    for (let x = 0; x < width; x++) Buffer.from(pixel(x, y)).copy(rows, row + 1 + x * 4);
  }
  const header = Buffer.alloc(13); header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  return Buffer.concat([Buffer.from('\x89PNG\r\n\x1a\n', 'binary'), chunk('IHDR', header), chunk('IDAT', zlib.deflateSync(rows)), chunk('IEND', Buffer.alloc(0))]);
}

function write(relativePath, width, height, pixel) {
  const target = path.join(__dirname, '..', relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, png(width, height, pixel));
}

function iconPixel(size) {
  return (x, y) => {
    const edge = Math.max(1, Math.round(size * 0.08));
    const cx = size / 2; const cy = size / 2;
    const shield = y > size * 0.12 && y < size * 0.88 && Math.abs(x - cx) < (size * 0.38 - Math.abs(y - cy) * 0.2);
    const line = Math.abs(x - cx) < edge || Math.abs(y - cy) < edge;
    if (shield) return line ? [255, 255, 255, 255] : [27, 94, 32, 255];
    return [0, 0, 0, 0];
  };
}

for (const size of [16, 32, 48, 128]) write(`assets/icons/icon-${size}.png`, size, size, iconPixel(size));
write('assets/store/screenshot-placeholder.png', 1280, 800, (x, y) => (x > 120 && x < 1160 && y > 160 && y < 640 ? [255, 248, 225, 255] : [35, 43, 51, 255]));
write('assets/store/promo-small-placeholder.png', 440, 280, (x, y) => (x > 28 && x < 412 && y > 28 && y < 252 ? [27, 94, 32, 255] : [255, 193, 7, 255]));
write('assets/store/promo-marquee-placeholder.png', 1400, 560, (x, y) => (x > 70 && x < 1330 && y > 56 && y < 504 ? [27, 94, 32, 255] : [255, 193, 7, 255]));
