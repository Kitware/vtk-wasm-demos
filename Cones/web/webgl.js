import { initCanvas } from "./app.js";
import { makeWebGLConfig } from "./configs.js";
import './style.css';

// ----------------------------------------------------------------------------
var canvas = document.createElement('canvas');
canvas.setAttribute('id', 'canvas');
canvas.setAttribute('class', 'canvas');
document.body.appendChild(canvas);

let cfg = makeWebGLConfig();
await initCanvas(canvas, cfg);
