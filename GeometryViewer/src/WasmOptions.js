// Sets up a base configuration for VTK-wasm with WebGL2 rendering.
export var VTKWebGL2Options = {
  // Must be defined as 'canvas' and nothing else. Auto generated glue js expects .canvas to exist.
  canvas: (function () {
    var canvas = document.getElementById('canvas');
    canvas.addEventListener(
      "webglcontextlost",
      function (e) {
        console.error('WebGL context lost. You will need to reload the page.');
        e.preventDefault();
      },
      false
    );
    return canvas;
  })(),
  //Pipes std::cout and std::cerr into debug and error in dev console.
  print: (text) => console.debug(text),
  printErr: (text) => console.error(text),
};

// Sets up a base configuration for VTK-wasm with WebGPU rendering.
export var VTKWebGPUOptions = {
  // Must be defined as 'canvas' and nothing else. Auto generated glue js expects .canvas to exist.
  canvas: (function () {
    var canvas = document.getElementById('canvas');
    canvas.addEventListener(
      "webglcontextlost",
      function (e) {
        console.error('WebGL context lost. You will need to reload the page.');
        e.preventDefault();
      },
      false
    );
    return canvas;
  })(),
  //Pipes std::cout and std::cerr into debug and error in dev console.
  print: (text) => console.debug(text),
  printErr: (text) => console.error(text),
  preRun: [function (module) {
    // select WEBGPU backend
    module.ENV.VTK_GRAPHICS_BACKEND = 'WEBGPU';
  }],
};
