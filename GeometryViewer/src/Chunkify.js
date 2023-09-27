import { maxSize } from './ArrayBufferLimits';

var MAX_INT53 = 9007199254740992;
var MIN_INT53 = -9007199254740992;
var bigintToI53Checked = num => (num < MIN_INT53 || num > MAX_INT53) ? NaN : Number(num);

// Break a blob into individual blobs of `chunkSize` number of bytes.
export function chunkify(blob, chunkSize) {
  let numChunks = Math.ceil(blob.size / chunkSize);
  let i = 0;
  let chunks = [];
  while (i < numChunks) {
    let offset = (i++) * chunkSize;
    chunks.push(blob.slice(offset, offset + chunkSize));
  }
  return chunks;
}

