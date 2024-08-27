export async function hasWebGPU(): Promise<boolean> {
  if (navigator.gpu === undefined) {
    return false;
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (adapter === null) {
    return false;
  }
  return true;
}
