function reportUnsupportedBrowser(reason) {
  document.body.replaceChildren();
  var webgpuSupportEl = document.createElement('h1');
  webgpuSupportEl.innerText = "Your browser does not support webgpu!";
  document.body.appendChild(webgpuSupportEl)
  var explainEl = document.createElement('p');
  explainEl.innerText = reason;
  document.body.appendChild(explainEl);
}

export default function initializeWebGPUDevice() {
  return new Promise((resolve, reject) => {
    navigator.gpu.requestAdapter().then((adapter) => {
      if (adapter === null) {
        reject(new Error("Unable to obtain a WebGPU adapter!"));
        reportUnsupportedBrowser("Your browser did not provide a GPU adapter. Known to happen on Linux!");
      }
      else {
        const requiredLimits = {};
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
        adapter.requestDevice({ requiredLimits }).then((device) => {
          if (device === null) {
            reject(new Error("Unable to obtain a WebGPU device!"));
          }
          resolve(device);
        })
      }
    });
  });
}
