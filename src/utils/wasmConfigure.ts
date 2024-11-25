export function getConfiguration(viewAPI: string) {
    // Sets up a base configuration for VTK-wasm with WebGL2 rendering.
    if (viewAPI === "webgl") {
        const configuration = {
            //Pipes std::cout and std::cerr into debug and error in dev console.
            print: (text: string): void => console.debug(text),
            printErr: (text: string): void => console.error(text),
        };
        return configuration;
    } else if (viewAPI === "webgpu") {
        // Sets up a base configuration for VTK-wasm with WebGPU rendering.
        const configuration = {
            //Pipes std::cout and std::cerr into debug and error in dev console.
            print: (text: string): void => console.debug(text),
            printErr: (text: string): void => console.error(text),
            preRun: [function (module: any) {
                // select WEBGPU backend
                module.ENV.VTK_GRAPHICS_BACKEND = 'WEBGPU';
            }],
        };
        return configuration;
    } else {
        return null;
    }
}