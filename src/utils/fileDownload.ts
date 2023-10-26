// Download a url. Probes content-disposition header for a filename.
export async function download(url: string) {
  const response = await fetch(url);
  const disposition = response.headers.get('content-disposition');
  let filename = disposition!.split(/;(.+)/)[1].split(/=(.+)/)[1];
  if (filename.toLowerCase().startsWith("utf-8''")) {
    filename = decodeURIComponent(filename.replace(/utf-8''/i, ''));
  } else {
    filename = filename.replace(/['"]/g, '');
  }
  const blob = await response.blob();
  return { blob, filename };
}
