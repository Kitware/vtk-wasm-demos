// ----------------------------------------------------------------------------
// Default options
export var options = {
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

// ----------------------------------------------------------------------------
// Sets up a base configuration for VTK-wasm with rendering.
export const BaseConfig = {
    // Must be defined as 'canvas' and nothing else. Auto generated glue js expects .canvas to exist.
    'canvas': (function () {
        var canvas = document.getElementById('canvas');
        return canvas;
    })(),
    //Pipes std::cout and std::cerr into debug and error in dev console.
    'print': (function () {
        return function (text) {
            text = Array.prototype.slice.call(arguments).join(' ');
            console.debug(text);
        };
    })(),
    'printErr': function (text) {
        text = Array.prototype.slice.call(arguments).join(' ');
        console.error(text);
    }
};

// ----------------------------------------------------------------------------
export function makeWebGPUConfig() {
    var cfg = BaseConfig;
    cfg.canvas = (function () {
        var canvas = document.getElementById('canvas');
        return canvas;
    })()
    cfg.preRun = [function (module) {
        // select WEBGPU backend
        module.ENV.VTK_GRAPHICS_BACKEND = 'WEBGPU';
    }];
    return cfg;
}

// ----------------------------------------------------------------------------
export function makeWebGLConfig() {
    var cfg = BaseConfig;
    cfg.canvas = (function () {
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
    })()
    return cfg;
}
