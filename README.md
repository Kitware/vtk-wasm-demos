# Project setup

## Requirements

1. docker
2. python

## Usage

```sh
python ./build.py [-h]
usage: build.py [-h] [-a SDK_IMAGE_ARCH] [-c SDK_CONFIG] [-d SDK_DIR] [-i SDK_IMAGE] [-t COMMIT_HASH]

Build with VTK SDK for WebAssembly.

options:
  -h, --help            show this help message and exit
  -a SDK_IMAGE_ARCH, --sdk-image-arch SDK_IMAGE_ARCH
  -c SDK_CONFIG, --sdk-config SDK_CONFIG
  -d SDK_DIR, --sdk-dir SDK_DIR
  -i SDK_IMAGE, --sdk-image SDK_IMAGE
  -t COMMIT_HASH, --commit-hash COMMIT_HASH
```

## Build

When run without any arguments, the defaults are used for the vtk-wasm-sdk docker image tag and VTK repository commit hash where the examples are downloaded from.

```sh
python ./build.py
```
