/// <reference types="emscripten" />

export interface ConesViewer {
    initialize(): void;
    render(): void;
    resetView(): void;
    run(): void;
    createDatasets(nx: number, ny: number, nz: number, dx: number, dy: number, dz: number): void;
    setMapperStatic(value: boolean): void;
    azimuth(value: number): void;
    setMouseWheelMotionFactor(value: number): void;
    delete(): void;
}

export interface ConesViewerModule extends EmscriptenModule {
    ConesViewer: { new(): ConesViewer };
}

export declare let WasmRuntime: ConesViewerModule;
declare const ready: Promise<ConesViewerModule>;
export { ready };
