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

// Download a url. Probes content-disposition header for a filename.
export async function download(url) {
  let response = await fetch(url);
  const disposition = response.headers.get('content-disposition');
  let filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
  if (filename.toLowerCase().startsWith("utf-8''")) {
    filename = decodeURIComponent(filename.replace(/utf-8''/i, ''));
  } else {
    filename = filename.replace(/['"]/g, '');
  }
  let blob = await response.blob();
  return { blob, filename };
}