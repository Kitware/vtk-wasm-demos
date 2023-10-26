// Break a blob into individual blobs of `chunkSize` number of bytes.
export function chunkify(blob: Blob, chunkSize: number): Array<Blob> {
  const numChunks = Math.ceil(blob.size / chunkSize);
  let i = 0;
  const chunks = [];
  while (i < numChunks) {
    const offset = (i++) * chunkSize;
    chunks.push(blob.slice(offset, offset + chunkSize));
  }
  return chunks;
}
