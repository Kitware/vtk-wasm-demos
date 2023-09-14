import Module from './GeometryViewer';

export async function upload(wasmFS, blob, name) {
  let buffer = await blob.arrayBuffer();
  wasmFS.writeFile(name, new Uint8Array(buffer));
  console.log("Loaded file:", name);
}

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