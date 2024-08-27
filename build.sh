#!/bin/sh

set -e
set -x

sdk_version="wasm32-v9.3.1-3934-g13405b1d99-20240824"
readonly sdk_version

sdk_image="kitware/vtk-wasm-sdk"
readonly sdk_image

sdk_config="Release"
readonly sdk_config

sdk_dir="/VTK-install/$sdk_config/lib/cmake/vtk"
readonly sdk_dir

docker run \
    --rm \
    -u "$(id -u):$(id -g)" \
    -v"$PWD":/vtk-wasm-demos \
    $sdk_image:$sdk_version \
    emcmake cmake -GNinja -S /vtk-wasm-demos -B /vtk-wasm-demos/out -DCMAKE_BUILD_TYPE=$sdk_config -DVTK_DIR=$sdk_dir

docker run \
    --rm \
    -v"$PWD":/vtk-wasm-demos \
    $sdk_image:$sdk_version \
    cmake --build /vtk-wasm-demos/out

npm i

npm run build
