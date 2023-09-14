import { download, upload } from './FileTransfer';
import { VTKWebGL2Options, VTKWebGPUOptions } from './WasmOptions';
import Module from './GeometryViewer';
import initializeWebGPUDevice from './WebGPUSupport'
import * as dat from 'dat.gui';
import './style.css';

// Default parameters
var parameters = {
  edgeVisibility: false,
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

function start(instance, filenames) {
  // hide the file chooser
  const dropContainer = document.getElementById("dropcontainer");
  dropContainer.style.display = 'none';

  // canvas starts out invisible. make it visible now.
  let canvas = document.getElementById('canvas');
  canvas.style.display = 'block';

  console.debug("WASM runtime initialized");
  // Initialize application
  viewer = new instance.GeometryViewer();
  for (let i = 0; i < filenames.length; ++i) {
    viewer.loadDataFile(filenames[i]);
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
  let filenames = [];
  for (let i = 0; i < vtkInput.files.length; ++i) {
    let blob = vtkInput.files[i];
    let name = vtkInput.files[i].name;
    await upload(instance.FS, blob, name);
    filenames.push(name);
  }
  start(instance, filenames);
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
    // upload the file to WebAssembly virtual file system
    await upload(instance.FS, blob, filename);
    start(instance, [filename]);
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
