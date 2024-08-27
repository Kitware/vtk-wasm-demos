/// <reference types="emscripten" />

export interface ConesViewer {
    initialize(): Promise<void>;
    render(): Promise<void>;
    resetView(): Promise<void>;
    run(): Promise<void>;
    createDatasets(nx: number, ny: number, nz: number, dx: number, dy: number, dz: number): Promise<void>;
    setMapperStatic(value: boolean): Promise<void>;
    azimuth(value: number): Promise<void>;
    setMouseWheelMotionFactor(value: number): Promise<void>;
    delete(): Promise<void>;
}

export interface ConesViewerModule extends EmscriptenModule {
    ConesViewer: { new(): ConesViewer };
}

export declare let WasmRuntime: ConesViewerModule;
declare const ready: Promise<ConesViewerModule>;
export { ready };
