// Writes a gzip copy (file.gz) next to every text file in out/. The host does not
// compress on the fly (mod_deflate is inactive), so .htaccess hands browsers these
// copies instead: pages and stylesheets arrive at a fifth of their size.
import { createReadStream, createWriteStream, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { createGzip, constants } from "node:zlib";

const OUT = "out";
const TEXT = /\.(?:html|css|js|mjs|json|svg|txt|xml)$/;
// Tiny files gain nothing; api/ is server-side and never served as static text.
const MIN_BYTES = 1024;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path !== join(OUT, "api")) yield* walk(path);
    } else if (TEXT.test(entry.name) && statSync(path).size >= MIN_BYTES) {
      yield path;
    }
  }
}

let count = 0;
let before = 0;
for (const file of walk(OUT)) {
  await pipeline(
    createReadStream(file),
    createGzip({ level: constants.Z_BEST_COMPRESSION }),
    createWriteStream(`${file}.gz`),
  );
  before += statSync(file).size;
  count += 1;
}
console.log(`precompress: ${count} file(s), ${(before / 1048576).toFixed(1)} MB → .gz copies in ${OUT}/`);
