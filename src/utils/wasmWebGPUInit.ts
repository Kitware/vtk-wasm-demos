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

export async function getDevice(): Promise<GPUDevice | null> {
  const adapter = await navigator.gpu.requestAdapter();
  if (adapter === null) {
    return null;
  }
  const requiredLimits: any = {};
  // App ideally needs as much GPU memory it can get.
  // when adapter limits are greater than default, copy adapter limits to device requirements.
  // maxBufferSize
  if (adapter.limits.maxBufferSize > 268435456) {
    requiredLimits.maxBufferSize = adapter.limits.maxBufferSize;
  }
  // maxStorageBufferBindingSize
  if (adapter.limits.maxStorageBufferBindingSize > 134217728) {
    requiredLimits.maxStorageBufferBindingSize = adapter.limits.maxStorageBufferBindingSize;
  }
  // maxUniformBufferBindingSize
  if (adapter.limits.maxUniformBufferBindingSize > 65536) {
    requiredLimits.maxUniformBufferBindingSize = adapter.limits.maxUniformBufferBindingSize;
  }
  return await adapter.requestDevice({ requiredLimits });
}
