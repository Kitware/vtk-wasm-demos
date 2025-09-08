import subprocess
import os
import platform
import argparse
import aiohttp
import asyncio
import tarfile
import shutil
import contextlib

DEFAULT_TAG = "9.5.20250909-8f25bb8"
DEFAULT_COMMIT_HASH = "d99e8cb530baadfb2266cc811f14d1a34d9756e6"
DEFAULT_SDK_IMAGE_ARCH = "wasm32"


def get_example_url(commit_hash):
    return f"https://gitlab.kitware.com/vtk/vtk/-/archive/{commit_hash}/vtk-{commit_hash}.tar.gz?path=Examples/Emscripten/Cxx"


async def download_file(url, filename):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            with open(filename, "wb") as f:
                f.write(await response.read())


def run_command(command, shell=False):
    print(f"Running: {' '.join(command)}")
    subprocess.run(command, shell=shell, check=True)


@contextlib.contextmanager
def pushd(directory):
    prev = os.getcwd()
    os.chdir(directory)
    try:
        yield prev
    finally:
        os.chdir(prev)


async def main():
    parser = argparse.ArgumentParser(
        description="Build with VTK SDK for WebAssembly.")
    parser.add_argument("-a", "--sdk-image-arch", default=DEFAULT_SDK_IMAGE_ARCH)
    parser.add_argument("-c", "--sdk-config", default="Release")
    parser.add_argument("-d", "--sdk-dir", default="")
    parser.add_argument("-i", "--sdk-image", default=f"kitware/vtk-wasm-sdk:{DEFAULT_TAG}")
    parser.add_argument("-t", "--commit-hash", default=DEFAULT_COMMIT_HASH)
    parser.add_argument("-n", "--dry-run", action="store_true", default=False)
    args = parser.parse_args()

    sdk_non_threaded_dir = args.sdk_dir or f"/VTK-install/{args.sdk_config}/{args.sdk_image_arch}/lib/cmake/vtk"
    sdk_threaded_dir = args.sdk_dir or f"/VTK-install/{args.sdk_config}/{args.sdk_image_arch}-threads/lib/cmake/vtk"
    examples_dest_path = "vtk-examples.tar.gz"
    await download_file(get_example_url(args.commit_hash), examples_dest_path)
    with tarfile.open(examples_dest_path) as tgz:
        tgz.extractall(".")

    projects = []
    sdk_dirs = []
    for root, _, files in os.walk("."):
        if not os.path.split(root)[0].endswith("Cxx"):
            continue
        if "CMakeLists.txt" in files:
            with open(os.path.join(root, "CMakeLists.txt")) as f:
                content = f.read()
                if "CTest" in content:
                    continue
                if "-pthread" in content:
                    sdk_dirs.append(sdk_threaded_dir)
                else:
                    sdk_dirs.append(sdk_non_threaded_dir)
            projects.append(os.path.abspath(root))

    shell = platform.system().lower() == "windows"
    for project_dir, sdk_dir in zip(projects, sdk_dirs):
        print(f"Building: {project_dir}")
        if args.dry_run:
            print(f"Would build {project_dir} with SDK dir {sdk_dir}")
            continue
        with pushd(project_dir) as orig:
            if not args.sdk_dir:
                # Use docker if no SDK dir is provided
                project_build_dir = f"/work/build/{args.sdk_image_arch}"
                run_command([
                    "docker", "run", "--rm", "-v", f"{project_dir}:/work",
                    args.sdk_image, "emcmake", "cmake", "-GNinja", "-S", "/work", "-B", project_build_dir,
                    f"{'-DCMAKE_C_FLAGS=-sMEMORY64=1' if '64' in args.sdk_image_arch else ''}",
                    f"-DCMAKE_BUILD_TYPE={args.sdk_config}", f"-DVTK_DIR={sdk_dir}"], shell=shell)
                run_command([
                    "docker", "run", "--rm", "-v", f"{project_dir}:/work", args.sdk_image,
                    "cmake", "--build", project_build_dir,], shell=shell)
            else:
                project_build_dir = f"./build/{args.sdk_image_arch}"
                run_command(["emcmake", "cmake", "-GNinja", "-S", ".", "-B", project_build_dir,
                            f"-DCMAKE_BUILD_TYPE={args.sdk_config}", f"-DVTK_DIR={sdk_dir}"], shell=shell)
                run_command(
                    ["cmake", "--build", project_build_dir], shell=shell)

            src_dir = os.path.join(project_dir, "build", args.sdk_image_arch)
            dst_dir = os.path.join(orig, "dist", args.sdk_image_arch, os.path.basename(project_dir))
            for file in os.listdir(src_dir):
                if file.endswith((".css", ".html", ".js", ".wasm")):
                    os.makedirs(dst_dir, exist_ok=True)
                    shutil.copy2(os.path.join(src_dir, file),
                                 os.path.join(dst_dir, file))
                    print(f"Copied {file} to {dst_dir}")

if __name__ == "__main__":
    asyncio.run(main())
