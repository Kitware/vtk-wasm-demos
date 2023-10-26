/// <reference types="emscripten" />

export interface GeometryViewer {
    initialize(): void;
    render(): void;
    resetView(): void;
    removeAllActors(): void;
    start(): void;
    halt(): void;
    resume(): void;
    saveScreenshotAsPNG(): void;
    setBackgroundColor1(_0: number, _1: number, _2: number): void;
    setBackgroundColor2(_0: number, _1: number, _2: number): void;
    setMouseWheelMotionFactor(_0: number): void;
    setHighlightOnHover(_0: boolean, _0: boolean): void
    setUseOrthographicProjection(_0: boolean): void;
    setDitherGradient(_0: boolean): void;
    setVertexVisibility(_0: boolean): void;
    setInterpolateScalarsBeforeMapping(_0: boolean): void;
    setRepresentation(_0: number): void;
    setColor(_0: number, _1: number, _2: number): void;
    setVertexColor(_0: number, _1: number, _2: number): void;
    setEdgeColor(_0: number, _1: number, _2: number): void;
    azimuth(_0: number): void;
    setPointSize(_0: number): void;
    setLineWidth(_0: number): void;
    setOpacity(_0: number): void;
    setEdgeOpacity(_0: number): void;
    loadDataFileFromMemory(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string, _1: number, _2: number): void;
    setVertexShaderSource(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
    setFragmentShaderSource(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
    getVertexShaderSource(): ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
    getFragmentShaderSource(): ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
    setColorByArray(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): void;
    setColorMapPreset(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): void;
    getPointDataArrays(): string;
    getCellDataArrays(): string;
    getColorMapPresets(): string;
    delete(): void;
}

export interface GeometryViewerModule extends EmscriptenModule {
    GeometryViewer: { new(): GeometryViewer };
}

export declare let WasmRuntime: GeometryViewerModule;
declare const ready: Promise<GeometryViewerModule>;
export { ready };
