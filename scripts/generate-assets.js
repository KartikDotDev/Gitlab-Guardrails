const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "logo.png");
const outputDir = path.join(root, "assets", "icons");

const sizes = [16, 32, 48, 128];

fs.mkdirSync(outputDir, { recursive: true });

for (const size of sizes) {
  const output = path.join(outputDir, `icon-${size}.png`);

  execFileSync("magick", [
    source,
    "-resize",
    `${size}x${size}`,
    output,
  ]);

  console.log(`✓ Generated ${size}x${size}`);
}

console.log("✓ All extension icons generated");