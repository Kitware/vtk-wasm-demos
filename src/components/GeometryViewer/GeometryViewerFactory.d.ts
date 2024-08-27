/// <reference types="emscripten" />

export interface GeometryViewer {
    initialize(): Promise<void>;
    render(): Promise<void>;
    resetView(): Promise<void>;
    removeAllActors(): Promise<void>;
    start(): Promise<void>;
    halt(): Promise<void>;
    resume(): Promise<void>;
    saveScreenshotAsPNG(): Promise<void>;
    setBackgroundColor1(_0: number, _1: number, _2: number): Promise<void>;
    setBackgroundColor2(_0: number, _1: number, _2: number): Promise<void>;
    setMouseWheelMotionFactor(_0: number): Promise<void>;
    setHighlightOnHover(_0: boolean, _0: boolean): Promise<void>
    setUseOrthographicProjection(_0: boolean): Promise<void>;
    setDitherGradient(_0: boolean): Promise<void>;
    setVertexVisibility(_0: boolean): Promise<void>;
    setInterpolateScalarsBeforeMapping(_0: boolean): Promise<void>;
    setRepresentation(_0: number): Promise<void>;
    setColor(_0: number, _1: number, _2: number): Promise<void>;
    setVertexColor(_0: number, _1: number, _2: number): Promise<void>;
    setEdgeColor(_0: number, _1: number, _2: number): Promise<void>;
    azimuth(_0: number): Promise<void>;
    setPointSize(_0: number): Promise<void>;
    setLineWidth(_0: number): Promise<void>;
    setOpacity(_0: number): Promise<void>;
    setEdgeOpacity(_0: number): Promise<void>;
    loadDataFileFromMemory(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string, _1: number, _2: number): Promise<void>;
    setVertexShaderSource(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): Promise<ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string>;
    setFragmentShaderSource(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): Promise<ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string>;
    getVertexShaderSource(): Promise<ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string>;
    getFragmentShaderSource(): Promise<ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string>;
    setColorByArray(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): Promise<void>;
    setColorMapPreset(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): Promise<void>;
    getPointDataArrays(): Promise<string>;
    getCellDataArrays(): Promise<string>;
    getColorMapPresets(): Promise<string>;
    delete(): Promise<void>;
}

export interface GeometryViewerModule extends EmscriptenModule {
    GeometryViewer: { new(): GeometryViewer };
}

export declare let WasmRuntime: GeometryViewerModule;
declare const ready: Promise<GeometryViewerModule>;
export { ready };
