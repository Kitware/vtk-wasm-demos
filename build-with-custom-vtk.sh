#!/bin/sh

set -e
set -x

sdk_config="Release"
readonly sdk_config

# Enter path to your VTK build tree here.
sdk_dir=""
readonly sdk_dir
echo "Using VTK SDK at $sdk_dir"

emcmake cmake -GNinja -S . -B ./out-custom-vtk -DCMAKE_BUILD_TYPE=$sdk_config -DVTK_DIR=$sdk_dir

cmake --build ./out-custom-vtk

npm i

npm run build
