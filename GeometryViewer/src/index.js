import { chunkify, download } from './FileTransfer';
import { VTKWebGL2Options, VTKWebGPUOptions } from './WasmOptions';
import { maxSize } from './ArrayBufferLimits';
import Module from './GeometryViewer';
import initializeWebGPUDevice from './WebGPUSupport'
import * as dat from 'dat.gui';
import './style.css';

var MAX_INT53 = 9007199254740992;
var MIN_INT53 = -9007199254740992;
var bigintToI53Checked = num => (num < MIN_INT53 || num > MAX_INT53) ? NaN : Number(num);

// Default parameters
var parameters = {
  edgeVisibility: false,
  lineWidth: 1.0,
  scrollSensitivty: 0.15,
  animate: false,
};
var animationRequestId = null;
var viewer = null;

function spinABit() {
  viewer?.azimuth(1);
  viewer?.render();
  animationRequestId = requestAnimationFrame(spinABit)
}

function updateAnimateState() {
  if (parameters.animate) {
    spinABit();
  }
  else {
    console.log("cancel " + animationRequestId)
    cancelAnimationFrame(animationRequestId)
  }
}

function setupUI() {
  /// setup canvas
  let canvas = document.getElementById('canvas');
  canvas.oncontextmenu = (event) => { event.preventDefault(); };
  canvas.onclick = (event) => { canvas.focus(); }; // grab focus when the render window region receives mouse clicks.
  canvas.tabIndex = -1;

  /// setup fps counter
  var script = document.createElement('script');
  script.onload = () => {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop)
    });
  };
  script.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js';
  document.head.appendChild(script);

  /// show configuration parameters in a GUI.
  var gui = new dat.GUI()
  gui.add(parameters, 'edgeVisibility').onChange(() => {
    viewer?.setEdgeVisibility(parameters.edgeVisibility);
    if (!parameters.animate) {
      viewer?.render();
    }
  });
  gui.add(parameters, 'lineWidth').onChange(() => {
    viewer?.setLineWidth(parameters.lineWidth);
    if (!parameters.animate) {
      viewer?.render();
    }
  });
  gui.add(parameters, 'scrollSensitivty', 0.0, 1.0).onChange(() => {
    viewer?.setScrollSensitivity(parameters.scrollSensitivty);
  });
  gui.add(parameters, 'animate').onChange(() => {
    updateAnimateState();
  })
  // button that resets view.
  gui.add(
    {
      ResetView: () => {
        viewer?.resetView();
        viewer?.render();
      }
    }, 'ResetView');

}

async function start(instance, blobs) {
  // hide the file chooser
  const dropContainer = document.getElementById("dropcontainer");
  dropContainer.style.display = 'none';

  // canvas starts out invisible. make it visible now.
  let canvas = document.getElementById('canvas');
  canvas.style.display = 'block';

  console.debug("WASM runtime initialized");
  // Initialize application
  viewer = new instance.GeometryViewer();
  for (let i = 0; i < blobs.length; ++i) {
    let blob = blobs[i];
    let name = blobs[i].name;
    let chunks = chunkify(blob, /*chunkSize=*/bigintToI53Checked(maxSize))
    let offset = 0;
    let ptr = instance._malloc(blob.size);
    for (let i = 0; i < chunks.length; ++i) {
      let chunk = chunks[i];
      let data = new Uint8Array(await chunk.arrayBuffer());
      instance.HEAPU8.set(data, ptr + offset);
      offset += data.byteLength;
    }
    viewer.loadDataFileFromMemory(name, ptr, blob.size);
    instance._free(ptr);
  }
  viewer.initialize();
  viewer.resetView();
  viewer.render();
  // starts processing events on browser main thread.
  viewer.run();
  // sends a resize event so that the render window fills up browser tab dimensions.
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 0);
}

function configure() {
  return new Promise((resolve) => {
    const urlParams = new URL(window.location.toString()).searchParams;
    if (urlParams.get('viewAPI') === "WebGL") {
      let configuration = VTKWebGL2Options;
      resolve(configuration)
    } else if (urlParams.get('viewAPI') === "WebGPU") {
      initializeWebGPUDevice().then((device) => {
        let configuration = VTKWebGPUOptions;
        // Set the device from JS. This can be done in C++ as well.
        // See https://github.com/kainino0x/webgpu-cross-platform-demo/blob/main/main.cpp#L51
        configuration.preinitializedWebGPUDevice = device;
        resolve(configuration)
      })
    }
  });
}

/// canvas starts out invisible.
let canvas = document.getElementById('canvas');
canvas.style.display = 'none';

/// A file drop kicks off the GeometryViewer application
let vtkInput = document.getElementById("vtk-input");
vtkInput.onchange = async () => {
  setupUI();
  let configuration = await configure();
  let instance = await Module(configuration);
  await start(instance, vtkInput.files);
}

/// A URL input also starts the GeometryViewer
let vtkUrl = document.getElementById("vtk-url");
vtkUrl.oninput = async () => {
  if (!vtkUrl.checkValidity()) {
    return;
  }
  if (!vtkUrl.value.length) {
    return;
  }
  // download the file from url
  try {
    let { blob, filename } = await download(vtkUrl.value);
    setupUI();
    let configuration = await configure();
    let instance = await Module(configuration);
    blob.name = filename;
    await start(instance, [blob]);
  } catch (error) {
    alert(`An error occurred with ${vtkUrl.value}. Please enter the URL to a supported mesh file. ${error}`);
    return;
  }
}

/// connect drop events
const dropContainer = document.getElementById("dropcontainer");
dropContainer.addEventListener("dragover", (e) => {
  // prevent default to allow drop
  e.preventDefault();
}, false);

dropContainer.addEventListener("dragenter", () => {
  dropContainer.classList.add("drag-active");
});

dropContainer.addEventListener("dragleave", () => {
  dropContainer.classList.remove("drag-active");
});

dropContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  dropContainer.classList.remove("drag-active");
  vtkInput.files = e.dataTransfer.files;
});
