# Project setup

## Requirements

1. docker
2. python

## Usage

```sh
python ./build.py [-h]
usage: build.py [-h] [-c SDK_CONFIG] [-i SDK_IMAGE] [-a SDK_IMAGE_ARCH] [-t COMMIT_HASH] [-d SDK_DIR]

Build with VTK SDK for WebAssembly.

options:
  -h, --help            show this help message and exit
  -c SDK_CONFIG, --sdk_config SDK_CONFIG
  -i SDK_IMAGE, --sdk_image SDK_IMAGE
  -a SDK_IMAGE_ARCH, --sdk_image_arch SDK_IMAGE_ARCH
  -t COMMIT_HASH, --commit_hash COMMIT_HASH
  -d SDK_DIR, --sdk_dir SDK_DIR
```

## Build

When run without any arguments, the defaults are used for the vtk-wasm-sdk docker image tag and VTK repository commit hash where the examples are downloaded from.

```sh
python ./build.py
```
