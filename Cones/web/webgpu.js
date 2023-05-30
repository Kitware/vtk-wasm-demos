import { initCanvas } from "./app.js";
import { makeWebGPUConfig } from "./configs.js";
import './style.css';

// ----------------------------------------------------------------------------
function reportUnsupportedBrowser(reason) {
    var webgpuSupportEl = document.createElement('h1');
    webgpuSupportEl.innerText = "Your browser does not support webgpu!";
    document.body.appendChild(webgpuSupportEl)
    var explainEl = document.createElement('p');
    explainEl.innerText = reason;
    document.body.appendChild(explainEl)
}

// ----------------------------------------------------------------------------
if (navigator.gpu === undefined) {
  reportUnsupportedBrowser("On supported browsers, maybe serve from localhost instead of ip?");
} else {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');
    canvas.setAttribute('class', 'canvas');
    document.body.appendChild(canvas)

    let cfg = makeWebGPUConfig();

    let adapter = await navigator.gpu.requestAdapter();
    if (adapter === null) {
        reportUnsupportedBrowser("Your browser did not provide a GPU adapter. Known to happen on Linux!");
    }
    else {
        console.log("Found an adapter");
        let device = await adapter.requestDevice();
        console.log("Obtained a device");
    
        // Set the device from JS. This can be done in C++ as well.
        // See https://github.com/kainino0x/webgpu-cross-platform-demo/blob/main/main.cpp#L51
        cfg.preinitializedWebGPUDevice = device;
        await initCanvas(canvas, cfg);
    }
}
