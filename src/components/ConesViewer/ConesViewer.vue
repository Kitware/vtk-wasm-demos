<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { Properties } from "./Properties";
import { getConfiguration } from "@/utils/wasmConfigure"
import { hasWebGPU } from "@/utils/wasmWebGPUInit";

import type { ConesViewerModule, ConesViewer } from "./ConesViewerFactory";
import createConesViewerModule from "./ConesViewer"

import GUI from "lil-gui"
import Stats from "stats.js";

const props = withDefaults(defineProps<Properties>(), {
  viewApi: "webgl",
  showControls: true,
  nx: 2,
  ny: 2,
  nz: 2,
  dx: 2,
  dy: 2,
  dz: 2,
  mapperIsStatic: true,
  mouseWheelMotionFactor: 0.15,
});

var wasmModule: ConesViewerModule | null = null;
var gui: GUI | null = null;
var viewer: ConesViewer;
var fpsScript: HTMLScriptElement | null = null;
const supportsWebGPU = ref(false)

const options = {
  nx: props.nx,
  ny: props.ny,
  nz: props.nz,
  dx: props.dx,
  dy: props.dy,
  dz: props.dz,
  mapperIsStatic: props.mapperIsStatic,
  mouseWheelMotionFactor: props.mouseWheelMotionFactor,
}

async function updateDatasets() {
  await viewer.createDatasets(options.nx, options.ny, options.nz, options.dx, options.dy, options.dz);
  await viewer.setMapperStatic(options.mapperIsStatic);
  await viewer.resetView();
  await viewer.render();
}

function setupUI() {
  /// setup fps counter
  fpsScript = document.createElement("script");
  fpsScript.onload = () => {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop)
    });
  };
  fpsScript.src = "https://mrdoob.github.io/stats.js/build/stats.min.js";
  document.head.appendChild(fpsScript);
  /// show configuration parameters in a GUI.
  gui = new GUI();
  const datasetFolder = gui!.addFolder("Dataset Dimensions")
  datasetFolder.add(options, "nx", 1, 100).onChange(async () => {
    await updateDatasets();
  });
  datasetFolder.add(options, "ny", 1, 100).onChange(async () => {
    await updateDatasets();
  });
  datasetFolder.add(options, "nz", 1, 100).onChange(async () => {
    await updateDatasets();
  });
  datasetFolder.add(options, "dx", 1.0, 5.0).onChange(async () => {
    await updateDatasets();
  });
  datasetFolder.add(options, "dy", 1.0, 5.0).onChange(async () => {
    await updateDatasets();
  });
  datasetFolder.add(options, "dz", 1.0, 5.0).onChange(async () => {
    await updateDatasets();
  });
  gui!.add(options, "mapperIsStatic").onChange(async () => {
    await viewer.setMapperStatic(options.mapperIsStatic);
  });
  gui!.add(options, "mouseWheelMotionFactor", 0.0, 1.0).onChange(async () => {
    await viewer.setMouseWheelMotionFactor(options.mouseWheelMotionFactor);
  });
}

onMounted(async () => {
  console.debug("Mounted with properties ", props);
  if (props.viewApi == "webgpu") {
    supportsWebGPU.value = await hasWebGPU();
    if (!supportsWebGPU.value) {
      return;
    }
  }
  let configuration: any = await getConfiguration(props.viewApi);
  wasmModule = await createConesViewerModule(configuration);
  viewer = new wasmModule!.ConesViewer();
  await viewer.initialize();
  await viewer.resetView();
  await viewer.render();
  await updateDatasets()
  // starts processing events on browser main thread.
  await viewer.run();
  if (props.showControls) {
    setupUI();
  }
});

onUnmounted(async () => {
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
});

</script>

<template>
  <div v-show="!supportsWebGPU && viewApi == 'webgpu'">
    <h3>This application cannot run because your browser does not support WebGPU!</h3>
    <p>Your browser did not provide a GPU adapter. Known to happen on Linux!</p>
  </div>
  <div style="position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;">
    <div class='canvas_container'>
      <canvas v-show="(supportsWebGPU && viewApi == 'webgpu') || viewApi == 'webgl'"
        :class="'ConesViewer' + viewApi + 'Canvas'" id="canvas"></canvas>
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
</style>