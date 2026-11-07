// Downloads the Switzer webfonts from Fontshare into public/fonts.
//
// The ITF Free Font License allows self-hosting on our own site but forbids
// distributing the font files through a public repository, so they are
// gitignored and fetched before every dev/build run instead of committed.
//
// Usage: node scripts/fetch-fonts.mjs [--strict]
//   --strict  exit with an error when the fonts are missing and cannot be
//             downloaded (used by `build`, so CI never ships without them).

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const DOWNLOAD_URL = 'https://api.fontshare.com/v2/fonts/download/switzer';
const ARCHIVE_DIR = 'Switzer_Complete/Fonts/WEB/fonts/';
const FILES = ['Switzer-Variable.woff2', 'Switzer-VariableItalic.woff2'];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');
const strict = process.argv.includes('--strict');

const missing = FILES.filter((file) => !existsSync(join(outDir, file)));
if (missing.length === 0) process.exit(0);

try {
  const response = await fetch(DOWNLOAD_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${DOWNLOAD_URL}`);
  const entries = readZip(Buffer.from(await response.arrayBuffer()));

  mkdirSync(outDir, { recursive: true });
  for (const file of missing) {
    const data = entries.get(ARCHIVE_DIR + file);
    if (!data) throw new Error(`${ARCHIVE_DIR}${file} not found in the Fontshare archive`);
    writeFileSync(join(outDir, file), data);
  }
  console.log(`[fonts] downloaded ${missing.join(', ')}`);
} catch (error) {
  const message = `[fonts] could not fetch Switzer: ${error instanceof Error ? error.message : error}`;
  if (strict) {
    console.error(message);
    process.exit(1);
  }
  console.warn(`${message}. Falling back to Arial.`);
}

/**
 * Minimal ZIP reader: walks the central directory and returns the
 * stored or deflated entries as a Map of path -> contents.
 * @param {Buffer} zip
 * @returns {Map<string, Buffer>}
 */
function readZip(zip) {
  const EOCD_SIGNATURE = 0x06054b50;
  const CENTRAL_SIGNATURE = 0x02014b50;
  const LOCAL_SIGNATURE = 0x04034b50;

  let eocd = -1;
  for (let i = zip.length - 22; i >= 0; i--) {
    if (zip.readUInt32LE(i) === EOCD_SIGNATURE) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error('the download is not a ZIP archive');

  const count = zip.readUInt16LE(eocd + 10);
  let offset = zip.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let n = 0; n < count; n++) {
    if (zip.readUInt32LE(offset) !== CENTRAL_SIGNATURE) throw new Error('corrupt ZIP central directory');
    const method = zip.readUInt16LE(offset + 10);
    const compressedSize = zip.readUInt32LE(offset + 20);
    const nameLength = zip.readUInt16LE(offset + 28);
    const extraLength = zip.readUInt16LE(offset + 30);
    const commentLength = zip.readUInt16LE(offset + 32);
    const localOffset = zip.readUInt32LE(offset + 42);
    const name = zip.toString('utf8', offset + 46, offset + 46 + nameLength);
    offset += 46 + nameLength + extraLength + commentLength;

    if (name.endsWith('/')) continue;
    if (zip.readUInt32LE(localOffset) !== LOCAL_SIGNATURE) throw new Error(`corrupt ZIP entry ${name}`);
    const dataStart = localOffset + 30 + zip.readUInt16LE(localOffset + 26) + zip.readUInt16LE(localOffset + 28);
    const raw = zip.subarray(dataStart, dataStart + compressedSize);

    if (method === 0) entries.set(name, Buffer.from(raw));
    else if (method === 8) entries.set(name, inflateRawSync(raw));
  }
  return entries;
}
