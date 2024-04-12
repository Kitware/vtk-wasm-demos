# Project setup

## Requirements

1. docker
2. npm

The build process is composed of two steps. You will need to compile C++ components to generate `.wasm` files and then run some `npm` commands to bundle those into a static site. For convenience, the shell scripts provided for Windows and Unix do everything needed to build a website from a fresh clone.

## Build

**Windows**
```sh
.\build.ps1
```

**Unix**
```sh
./build.sh
```
