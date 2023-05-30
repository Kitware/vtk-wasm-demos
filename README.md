[![Deploy Benchmarks](https://github.com/Kitware/vtkWasmBenchmarks/actions/workflows/build.yml/badge.svg)](https://github.com/Kitware/vtkWasmBenchmarks/actions/workflows/build.yml)

Visit [kitware.github.io/vtkWasmBenchmarks/](https://kitware.github.io/vtkWasmBenchmarks/) to run these applications in your browser.

# Build

If you want to develop, clone the repository.
```sh
git clone https://github.com/Kitware/vtkWasmBenchmarks.git
```

These commands build all applications. VTK C++ applications pull [kitware/vtk-wasm](https://hub.docker.com/r/kitware/vtk-wasm) image from DockerHub for pre-built VTK-wasm32 release binaries.
```sh
npm install
npm run build
```

Finally, serve the static site.
```sh
npm run start
```
