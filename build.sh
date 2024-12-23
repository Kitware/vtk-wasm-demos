#!/bin/sh

set -e
set -x

# Default values for the arguments
sdk_image="kitware/vtk-wasm-sdk:wasm32-v9.4.0-829-g3b526cff4e-20241221"

sdk_config="Release"

sdk_dir=""

# Function to display usage
usage() {
    echo "Usage: $0 [-c sdk_config] [-i sdk_image] [-d sdk_dir]"
    echo "  -c sdk_config  Set the SDK configuration (default: Release)"
    echo "  -i sdk_image   Set the SDK image (default: kitware/vtk-wasm-sdk:wasm32-v9.4.0-829-g3b526cff4e-20241221)"
    echo "  -d sdk_dir     Set the SDK directory (default: empty)"
    exit 1
}

# Parse command-line arguments
while getopts "c:i:d:" opt; do
    case ${opt} in
        c) sdk_config=$OPTARG ;;
        i) sdk_image=$OPTARG ;;
        d) sdk_dir=$OPTARG ;;
        *) usage ;;
    esac
done

readonly sdk_image
readonly sdk_config

# Check if sdk_dir is set (provided as argument)
if [ -z "$sdk_dir" ]; then
    sdk_dir="/VTK-install/$sdk_config/lib/cmake/vtk"
    readonly sdk_dir
    docker run \
        --rm \
        -u "$(id -u):$(id -g)" \
        -v"$PWD":/vtk-wasm-demos \
        $sdk_image \
        emcmake cmake -GNinja -S /vtk-wasm-demos -B /vtk-wasm-demos/out -DCMAKE_BUILD_TYPE=$sdk_config -DVTK_DIR=$sdk_dir
    docker run \
        --rm \
        -v"$PWD":/vtk-wasm-demos \
        $sdk_image \
        cmake --build /vtk-wasm-demos/out
else
    readonly sdk_dir
    echo "Using VTK SDK at $sdk_dir"
    emcmake cmake -GNinja -S . -B ./out-custom-vtk -DCMAKE_BUILD_TYPE=$sdk_config -DVTK_DIR=$sdk_dir
    cmake --build ./out-custom-vtk
fi


npm i

npm run build
