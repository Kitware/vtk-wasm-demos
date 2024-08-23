$erroractionpreference = "stop"

$sdk_version="v9.3.0-2490-g97c85d6930-20240401"
$sdk_image="kitware/vtk-wasm-sdk"
$sdk_config="Release"

$sdk_dir="/VTK-install/$sdk_config/lib/cmake/vtk"

docker run `
    --rm `
    -v"$pwd":/vtk-wasm-demos `
    ${sdk_image}:${sdk_version} `
    emcmake cmake -GNinja -S /vtk-wasm-demos -B /vtk-wasm-demos/out -DCMAKE_BUILD_TYPE="$sdk_config" -DVTK_DIR="$sdk_dir"

docker run `
    --rm `
    -v"$pwd":/vtk-wasm-demos `
    ${sdk_image}:${sdk_version} `
    cmake --build /vtk-wasm-demos/out

npm i

npm run build
