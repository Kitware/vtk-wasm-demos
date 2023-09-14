import { VTKWebGL2Options, VTKWebGPUOptions } from './WasmOptions';
import Module from './ConesViewer';
import initializeWebGPUDevice from './WebGPUSupport'
import * as dat from 'dat.gui';
import './style.css';

// Default parameters
var parameters = {
  nx: 10,
  ny: 10,
  nz: 10,
  dx: 2.0,
  dy: 2.0,
  dz: 2.0,
  mapperIsStatic: true,
  scrollSensitivty: 0.15,
  animate: true,
};
var animationRequestId = null;
var viewer = null;

function updateDatasets() {
  viewer?.createDatasets(parameters.nx, parameters.ny, parameters.nz, parameters.dx, parameters.dy, parameters.dz);
  viewer?.setMapperStatic(parameters.mapperIsStatic);
  viewer?.resetView();
  viewer?.render();
}

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
  var gui = new dat.GUI();
  gui.add(parameters, 'nx', 1, 100).onChange(() => {
    updateDatasets();
  });
  gui.add(parameters, 'ny', 1, 100).onChange(() => {
    updateDatasets();
  });
  gui.add(parameters, 'nz', 1, 100).onChange(() => {
    updateDatasets();
  });
  gui.add(parameters, 'dx', 1.0, 5.0).onChange(() => {
    updateDatasets();
  });
  gui.add(parameters, 'dy', 1.0, 5.0).onChange(() => {
    updateDatasets();
  });
  gui.add(parameters, 'dz', 1.0, 5.0).onChange(() => {
    updateDatasets();
  });
  gui.add(parameters, 'mapperIsStatic').onChange(() => {
    viewer?.setMapperStatic(parameters.mapperIsStatic);
  });
  gui.add(parameters, 'scrollSensitivty', 0.0, 1.0).onChange(() => {
    viewer?.setScrollSensitivity(parameters.scrollSensitivty);
  });
  gui.add(parameters, 'animate').onChange(() => {
    updateAnimateState();
  });
}

function start(instance) {
  console.debug("WASM runtime initialized");
  // Initialize application
  viewer = new instance.ConesViewer();
  updateDatasets();
  viewer.initialize();
  viewer.resetView();
  viewer.render();
  updateAnimateState();
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

let configuration = await configure();
let instance = await Module(configuration);
setupUI();
start(instance);
