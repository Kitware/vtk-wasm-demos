<script setup lang='ts'>
import type { GeometryViewerModule, GeometryViewer } from "./GeometryViewerFactory";
import { onMounted, onUnmounted, ref } from 'vue'
import { maxSize } from "../../utils/ArrayBufferLimits"
import { chunkify } from "../../utils/chunkify"
import { hexToRgb } from "../../utils/hexToRgb"
import { Properties } from "./Properties";
import { getConfiguration } from '../../utils/wasmConfigure'
import { download } from "../../utils/fileDownload"
import createGeometryViewerModule from './GeometryViewer'
import { hasWebGPU } from "@/utils/wasmWebGPUInit";
import GUI, { Controller } from 'lil-gui'

const props = withDefaults(defineProps<Properties>(), {
  viewApi: "webgl",
  url: "",
  showControls: true,
  representation: 2,
  vertexVisibility: false,
  renderPointsAsSpheres: false,
  pointSize: 1.0,
  edgeVisibility: false,
  renderLinesAsTubes: false,
  lineWidth: 1.0,

  colorByArray: 'Solid',
  colorMapPreset: 'Warm',
  interpolateScalarsBeforeMapping: false,

  solidColor: 0xffffff,
  vertexColor: 0x80ff80,
  edgeColor: 0x000000,
  opacity: 1.0,
  edgeOpacity: 1.0,

  mouseWheelMotionFactor: 0.15,
  backgroundColor1: 0x000000,
  backgroundColor2: 0x1d2671,
  highlightOnHover: 0,
  ditherGradient: true,
  orthographic: false,
});

const options = { ...props, 'simulateFileInput': () => document.getElementById('vtk-input')?.click(), 'colorArrays': ['Solid'] };

var wasmModule: GeometryViewerModule | null = null;
var viewer: GeometryViewer;
var gui: GUI | null = null;
var fpsScript: HTMLScriptElement | null = null;
const supportsWebGPU = ref(false)

var colorByArraysController: Controller;

async function loadFile(file: File) {
  if (wasmModule === null || wasmModule === undefined) {
    return;
  }
  if (viewer === null || viewer === undefined) {
    return;
  }
  let chunks = chunkify(file, /*chunkSize=*/((num: bigint) => (num < -9007199254740992n || num > 9007199254740992n) ? NaN : Number(num))(maxSize))
  let offset = 0;
  let ptr = wasmModule._malloc(file.size);
  for (let i = 0; i < chunks.length; ++i) {
    let chunk = chunks[i];
    let data = new Uint8Array(await chunk.arrayBuffer());
    wasmModule.HEAPU8.set(data, ptr + offset);
    offset += data.byteLength;
  }
  await viewer.loadDataFileFromMemory(file.name, ptr, file.size);
  wasmModule._free(ptr);

  if (gui !== null) {
    let pointDataArrays = await viewer.getPointDataArrays();
    let cellDataArrays = await viewer.getCellDataArrays();
    let colorArrays = ['Solid', ...pointDataArrays.split(';'), ...cellDataArrays.split(';')];
    colorByArraysController = colorByArraysController.options(colorArrays.filter((el) => { return el.length > 0; }));
    colorByArraysController.onChange(async () => {
      await viewer.setColorMapPreset(options.colorMapPreset);
      await viewer.setColorByArray(options.colorByArray);
      await viewer.render();
    });
    await viewer.setColorMapPreset(options.colorMapPreset);
    await viewer.setColorByArray(options.colorByArray);
    await viewer.render();
  } else {
    // set color map for the default file.
    await viewer.setColorMapPreset(options.colorMapPreset);
    await viewer.setColorByArray(options.colorByArray);
    await viewer.render();
  }
  await viewer.resetView();
  await viewer.render();
}

async function onFilesChanged() {
  await viewer.removeAllActors();
  colorByArraysController.setValue('Solid');
  let inputEl = document.getElementById('vtk-input') as HTMLInputElement;
  let files = inputEl.files as FileList;
  await loadFile(files[0]);
}

async function setupUI() {
  /// setup fps counter
  fpsScript = document.createElement('script');
  fpsScript.onload = () => {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop)
    });
  };
  fpsScript.src = 'https://mrdoob.github.io/stats.js/build/stats.min.js';
  document.head.appendChild(fpsScript);
  /// show configuration options in a GUI.
  gui = new GUI();
  gui.add(options, 'simulateFileInput').name('Choose file');
  const meshFolder = gui.addFolder('Mesh');
  meshFolder?.add(options, 'representation', { Points: 0, Wireframe: 1, Surface: 2 }).onChange(async () => {
    await viewer.setRepresentation(options.representation);
    await viewer.render();
  });
  meshFolder?.add(options, 'vertexVisibility').onChange(async () => {
    await viewer.setVertexVisibility(options.vertexVisibility);
    await viewer.render();
  });
  meshFolder?.add(options, 'renderPointsAsSpheres').onChange(async () => {
    await viewer.setRenderPointsAsSpheres(options.renderPointsAsSpheres);
    await viewer.render();
  });
  meshFolder?.add(options, 'pointSize', 0.1, 10.0, 0.01).onChange(async () => {
    await viewer.setPointSize(options.pointSize);
    await viewer.render();
  });
  meshFolder?.add(options, 'edgeVisibility').onChange(async () => {
    await viewer.setEdgeVisibility(options.edgeVisibility);
    await viewer.render();
  });
  meshFolder?.add(options, 'renderLinesAsTubes').onChange(async () => {
    await viewer.setRenderLinesAsTubes(options.renderLinesAsTubes);
    await viewer.render();
  });
  meshFolder?.add(options, 'lineWidth', 0.1, 5.0, 0.01).onChange(async () => {
    await viewer.setLineWidth(options.lineWidth);
    await viewer.render();
  });
  const colorFolder = gui.addFolder('Color');
  const scalarMapFolder = colorFolder.addFolder('Scalar Mapping');
  colorByArraysController = scalarMapFolder.add(options, 'colorByArray', options.colorArrays);
  let presets = await viewer.getColorMapPresets();
  scalarMapFolder.add(options, 'colorMapPreset', presets.split(';')).onChange(async () => {
    await viewer.setColorMapPreset(options.colorMapPreset);
    await viewer.render();
  });
  scalarMapFolder?.add(options, 'interpolateScalarsBeforeMapping').onChange(async () => {
    await viewer.setInterpolateScalarsBeforeMapping(options.interpolateScalarsBeforeMapping);
    await viewer.render();
  });
  colorFolder.addColor(options, 'solidColor').onChange(async () => {
    const rgb = hexToRgb(options.solidColor);
    await viewer.setColor(rgb[0], rgb[1], rgb[2]);
    await viewer.render();
  });
  colorFolder.addColor(options, 'vertexColor').onChange(async () => {
    const rgb = hexToRgb(options.vertexColor);
    await viewer.setVertexColor(rgb[0], rgb[1], rgb[2]);
    await viewer.render();
  });
  colorFolder.addColor(options, 'edgeColor').onChange(async () => {
    const rgb = hexToRgb(options.edgeColor);
    await viewer.setEdgeColor(rgb[0], rgb[1], rgb[2]);
    await viewer.render();
  });
  colorFolder.add(options, 'opacity', 0.0, 1.0, 0.01).onChange(async () => {
    await viewer.setOpacity(options.opacity);
    await viewer.render();
  })
  colorFolder.add(options, 'edgeOpacity', 0.0, 1.0, 0.01).onChange(async () => {
    await viewer.setEdgeOpacity(options.edgeOpacity);
    await viewer.render();
  })
  const viewFolder = gui.addFolder('View');
  viewFolder.addColor(options, 'backgroundColor1').onChange(async () => {
    const rgb = hexToRgb(options.backgroundColor1);
    await viewer.setBackgroundColor1(rgb[0], rgb[1], rgb[2]);
    await viewer.render();
  });
  viewFolder.addColor(options, 'backgroundColor2').onChange(async () => {
    const rgb = hexToRgb(options.backgroundColor2);
    await viewer.setBackgroundColor2(rgb[0], rgb[1], rgb[2]);
    await viewer.render();
  });
  viewFolder.add(options, 'mouseWheelMotionFactor', 0.15, 1.0, 0.001).onChange(async () => {
    await viewer.setMouseWheelMotionFactor(options.mouseWheelMotionFactor);
  })
  viewFolder?.add(options, 'highlightOnHover', { None: 0, Points: 1, Cells: 2 }).onChange(async () => {
    if (options.highlightOnHover == 0) {
      await viewer.setHighlightOnHover(false, false);
    }
    else if (options.highlightOnHover == 1) {
      await viewer.setHighlightOnHover(true, /*snapToPoint*/true);
    }
    else if (options.highlightOnHover == 2) {
      await viewer.setHighlightOnHover(true, /*snapToPoint*/false);
    }
    await viewer.render();
  });
  viewFolder.add(options, 'ditherGradient').onChange(async () => {
    await viewer.setDitherGradient(options.ditherGradient);
    await viewer.render();
  });
  viewFolder.add(options, 'orthographic').onChange(async () => {
    await viewer.setUseOrthographicProjection(options.orthographic);
    await viewer.render();
  });
  viewFolder.add(options, 'mouseWheelMotionFactor', 0.0, 1.0).onChange(async () => {
    await viewer.setMouseWheelMotionFactor(options.mouseWheelMotionFactor);
  });
  viewFolder.add(
    {
      ResetView: async () => {
        await viewer.resetView();
        await viewer.render();
      }
    }, 'ResetView');
}

onMounted(async () => {
  console.debug("Mounted with properties ", props);
  if (props.viewApi == "webgpu") {
    supportsWebGPU.value = await hasWebGPU();
    if (!supportsWebGPU.value) {
      return;
    }
  }
  let configuration: any = getConfiguration(props.viewApi);
  wasmModule = await createGeometryViewerModule(configuration);
  viewer = new wasmModule!.GeometryViewer();
  await viewer.initialize();
  await viewer.resetView();
  await viewer.render();
  // starts processing events on browser main thread.
  await viewer.start();
  /// connect drop events
  const dropDestination = document.getElementById('canvas') as HTMLElement;
  dropDestination!.addEventListener('dragover', (e: DragEvent) => {
    // prevent default to allow drop
    e.preventDefault();
  }, false);

  dropDestination!.addEventListener('dragenter', () => {
    dropDestination!.classList.add('drag-active');
  });

  dropDestination!.addEventListener('dragleave', () => {
    dropDestination!.classList.remove('drag-active');
  });
  dropDestination!.addEventListener('drop', async (e: DragEvent) => {
    e.preventDefault();
    dropDestination!.classList.remove('drag-active');
    const dataTransfer = e.dataTransfer as DataTransfer;
    await loadFile(dataTransfer.files[0]);
  });

  if (props.showControls) {
    await setupUI();
  } else {
    // white background when we're showing ourselves with other apps.
    // ideally this is exposed via a property.
    await viewer.setBackgroundColor1(255, 255, 255);
    await viewer.setBackgroundColor2(255, 255, 255);
  }
  // load the default file.
  if (props.url.length) {
    let { blob, filename } = await download(props.url);
    await loadFile(new File([blob], filename));
  }
})

onUnmounted(() => {
  if (fpsScript !== null) {
    document.body.removeChild(fpsScript);
  }
  if (gui !== null) {
    gui.destroy();
  }
  if (viewer !== undefined) {
    viewer.delete();
  }
  wasmModule = null;
})

</script>

<template>
  <div v-show="!supportsWebGPU && viewApi == 'webgpu'">
    <h3>This application cannot run because your browser does not support WebGPU!</h3>
    <p>Your browser did not provide a GPU adapter. Known to happen on Linux!</p>
  </div>
  <input type='file' id='vtk-input' v-on:change="onFilesChanged" accept='.obj, .ply, .vtk, .vtp, .vtu' required>

  <div style="position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;">
    <div class='canvas_container'>
      <canvas v-show="(supportsWebGPU && viewApi == 'webgpu') || viewApi == 'webgl'"
        :class="'GeometryViewer' + viewApi + 'Canvas'" id="canvas"></canvas>
    </div>
    <div class='tooltip'
      style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;"
      unselectable="on" onselectstart="return false;" onmousedown="return false;"
      oncontextmenu="event.preventDefault()">
    </div>
  </div>
</template>

<style scoped>
canvas {
  position: absolute;
  left: 0px;
  top: 0px;
  display: block;
  border: 0px none;
  outline: none;
}

.tooltip {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;

  /* Position the tooltip */
  position: absolute;
  opacity: 0.7;
  z-index: 1;
}

input {
  display: none;
}
</style>