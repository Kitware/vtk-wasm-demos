import subprocess
import os
import sys
import platform
import argparse

# Default values for the arguments
DEFAULT_TAG = "wasm32-v9.4.1-1059-g71e59d05f0-20250125"

# Function to run commands


def run_command(command, shell=False):
    print(f"Running command: {' '.join(command)}")
    subprocess.run(command, shell=shell, check=True)


if __name__ == "__main__":

    sdk_image = f"kitware/vtk-wasm-sdk:{DEFAULT_TAG}"
    sdk_config = "Release"
    sdk_dir = ""

    # Set up argument parsing
    parser = argparse.ArgumentParser(
        description="Build with VTK SDK for WebAssembly.")
    parser.add_argument("-c", "--sdk_config", default=sdk_config,
                        help="Set the SDK configuration (default: Release)")
    parser.add_argument("-i", "--sdk_image", default=sdk_image,
                        help=f"Set the SDK image (default: kitware/vtk-wasm-sdk:{DEFAULT_TAG})")
    parser.add_argument("-d", "--sdk_dir", default=sdk_dir,
                        help="Set the SDK directory (default: empty)")

    # Parse the arguments
    args = parser.parse_args()

    sdk_image = args.sdk_image
    sdk_config = args.sdk_config
    sdk_dir = args.sdk_dir

    # Check if sdk_dir is set (provided as argument)
    if not sdk_dir:
        sdk_dir = "/VTK-install/{}/lib/cmake/vtk".format(sdk_config)

    # Determine platform for setting shell behavior
    is_windows = platform.system().lower() == "windows"
    shell = True if is_windows else False

    # Check if sdk_dir is provided or not
    if not args.sdk_dir:
        # If sdk_dir is empty, use the default path and run the Docker commands
        run_command([
            "docker", "run", "--rm", "-v", f"{os.getcwd()}:/vtk-wasm-demos",
            sdk_image, "emcmake", "cmake", "-GNinja", "-S", "/vtk-wasm-demos", "-B", "/vtk-wasm-demos/out",
            f"-DCMAKE_BUILD_TYPE={sdk_config}", f"-DVTK_DIR={sdk_dir}"], shell=shell)

        run_command([
            "docker", "run", "--rm", "-v", f"{os.getcwd()}:/vtk-wasm-demos", sdk_image,
            "cmake", "--build", "/vtk-wasm-demos/out"], shell=shell)
    else:
        # If sdk_dir is provided, use the custom directory and run the commands
        print(f"Using VTK SDK at {sdk_dir}")
        run_command(["emcmake", "cmake", "-GNinja", "-S", ".", "-B", "./out-custom-vtk",
                    f"-DCMAKE_BUILD_TYPE={sdk_config}", f"-DVTK_DIR={sdk_dir}"], shell=shell)
        run_command(["cmake", "--build", "./out-custom-vtk"], shell=shell)

    # Run npm commands
    run_command(["npm", "i"], shell=shell)
    run_command(["npm", "run", "build"], shell=shell)
