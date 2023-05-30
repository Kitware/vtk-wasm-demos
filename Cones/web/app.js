import * as dat from 'dat.gui';
import { options } from './configs.js'

var animationRequestId = null;

// ----------------------------------------------------------------------------
function updateDatasets(app) {
    app.createDatasets(options.nx, options.ny, options.nz, options.dx, options.dy, options.dz);
    app.setMapperStatic(options.mapperIsStatic);
    app.resetView();
    app.render();
}

// ----------------------------------------------------------------------------
function animate(app) {
    app.azimuth(1);
    app.render();
    animationRequestId = requestAnimationFrame(animate.bind(animate, app))
}

// ----------------------------------------------------------------------------
function updateAnimateState(app) {
    if (options.animate) {
        animate(app);
    }
    else {
        console.log("cancel " + animationRequestId)
        cancelAnimationFrame(animationRequestId)
    }
}

// ----------------------------------------------------------------------------
export async function initCanvas(canvas, cfg) {
    let wasmRuntime = await instantiateWasmModule(cfg);
    console.debug("WASM runtime initialized");
    // Show configuration options in a GUI.
    var gui = new dat.GUI()
    gui.add(options, 'nx', 1, 100).onChange(() => {
        updateDatasets(app);
    });
    gui.add(options, 'ny', 1, 100).onChange(() => {
        updateDatasets(app);
    });
    gui.add(options, 'nz', 1, 100).onChange(() => {
        updateDatasets(app);
    });
    gui.add(options, 'dx', 1.0, 5.0).onChange(() => {
        updateDatasets(app);
    });
    gui.add(options, 'dy', 1.0, 5.0).onChange(() => {
        updateDatasets(app);
    });
    gui.add(options, 'dz', 1.0, 5.0).onChange(() => {
        updateDatasets(app);
    });
    gui.add(options, 'mapperIsStatic').onChange(() => {
        app.setMapperStatic(options.mapperIsStatic);
    });
    gui.add(options, 'scrollSensitivty', 0.0, 1.0).onChange(() => {
        app.setScrollSensitivity(options.scrollSensitivty);
    });
    gui.add(options, 'animate').onChange(() => {
        updateAnimateState(app);
    })
    // button that resets view.
    gui.add(
        {
            ResetView: () => {
                app.resetView();
                app.render();
            }
        }, 'ResetView');

    // Initialize application
    let app = new wasmRuntime.Cones();
    console.debug("Application created");
    app.initialize();
    updateDatasets(app);
    updateAnimateState(app);

    // sends a resize event so that the render window fills up browser tab dimensions.
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 0);
    // focus on the canvas to grab keyboard inputs.
    canvas.setAttribute('tabindex', '0');
    // grab focus when the render window region receives mouse clicks.
    canvas.addEventListener('click', () => canvas.focus());
    // starts processing events on browser main thread.
    // TODO: run this on a worker thread and transfer canvas to offscreen
    app.run();
}
