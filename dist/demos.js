import { ORIGIN, PATHNAME } from "./constants.js";
export default function getDemos() {
  const ARCH = document.querySelector("input[name='architecture']:checked").value;
  return {
    Cone: {
      name: "Cone",
      description: "Simple demo rendering of a cone geometry.",
      previewURL: `${ORIGIN}${PATHNAME}${ARCH}/Cone/index.html`,
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/Cone/index.html`,
    },
    ConeMultiBackendWebGL: {
      name: "Cone Multi Backend (WebGL)",
      description: "A demo rendering of a cone geometry using multiple backends (WebGL and WebGPU).",
      previewURL: "", //`${ORIGIN}${PATHNAME}${ARCH}/ConeMultiBackend/webgl.html`,
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/ConeMultiBackend/webgl.html`,
    },
    ConeMultiBackendWebGPU: {
      name: "Cone Multi Backend (WebGPU)",
      description: "A demo rendering of a cone geometry using multiple backends (WebGL and WebGPU).",
      previewURL: "",  //`${ORIGIN}${PATHNAME}${ARCH}/ConeMultiBackend/webgpu.html`,
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/ConeMultiBackend/webgpu.html`,
    },
    GeometryViewerWebGL: {
      name: "Geometry Viewer (WebGL)",
      description: "A viewer for 3D geometry data, allowing users to visualize and interact with 3D models.",
      previewURL: `${ORIGIN}${PATHNAME}${ARCH}/GeometryViewer/index.html?viewApi=webgl&showControls=false&url=https://data.kitware.com/api/v1/file/6285865d4acac99f429d979b/download&colorByArray=Normals&colorMapPreset=Warm`,
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/GeometryViewer/index.html?viewApi=webgl&url=https://data.kitware.com/api/v1/file/6285865d4acac99f429d979b/download&showControls=true&colorByArray=Normals&colorMapPreset=Warm`,
    },
    GeometryViewerWebGPU: {
      name: "Geometry Viewer (WebGPU)",
      description: "A viewer for 3D geometry data, allowing users to visualize and interact with 3D models.",
      previewURL: `${ORIGIN}${PATHNAME}${ARCH}/GeometryViewer/index.html?viewApi=webgpu&showControls=false&url=https://data.kitware.com/api/v1/file/6285865d4acac99f429d979b/download&colorByArray=Normals&colorMapPreset=Warm`,
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/GeometryViewer/index.html?viewApi=webgpu&url=https://data.kitware.com/api/v1/file/6285865d4acac99f429d979b/download&showControls=true&colorByArray=Normals&colorMapPreset=Warm`,
    },
    MultiCone: {
      name: "MultiCone",
      description: "Simple demo rendering of a cone geometry.",
      previewURL: `${ORIGIN}${PATHNAME}${ARCH}/MultiCone/index.html`,
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/MultiCone/index.html`,
    },
    MultipleCanvases: {
      name: "MultipleCanvases",
      description: "Simple demo rendering of a cone geometry.",
      previewURL: "",
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/MultipleCanvases/index.html`,
    },
    WrappedMace: {
      name: "WrappedMace",
      description: "Simple demo rendering of a cone geometry.",
      previewURL: `${ORIGIN}${PATHNAME}${ARCH}/WrappedMace/index.html`,
      onClickURL: `${ORIGIN}${PATHNAME}${ARCH}/WrappedMace/index.html`,
    },
  }
}
