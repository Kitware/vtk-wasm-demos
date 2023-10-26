import { LocationQuery } from "vue-router";

export interface Properties {
    viewApi: string,
    showControls?: boolean,
    nx?: number,
    ny?: number,
    nz?: number,
    dx?: number,
    dy?: number,
    dz?: number,
    mouseWheelMotionFactor?: number,
    mapperIsStatic?: boolean,
    animate?: boolean,
}

export function conesViewerPropertiesFromQuery(query: LocationQuery): Properties {
    const result: Properties = {
        viewApi: "webgl",
    };
    if (query.viewApi !== undefined && query.viewApi !== null) {
        result.viewApi = query.viewApi.toString();
    }
    if (query.showControls !== undefined && query.showControls !== null) {
        result.showControls = query.showControls.toString() == "true" ? true : false;
    }
    if (query.nx !== undefined && query.nx !== null) {
        result.nx = Number(query.nx);
    }
    if (query.ny !== undefined && query.ny !== null) {
        result.ny = Number(query.ny);
    }
    if (query.nz !== undefined && query.nz !== null) {
        result.nz = Number(query.nz);
    }
    if (query.dx !== undefined && query.dx !== null) {
        result.dx = Number(query.dx);
    }
    if (query.dy !== undefined && query.dy !== null) {
        result.dy = Number(query.dy);
    }
    if (query.dz !== undefined && query.dz !== null) {
        result.dz = Number(query.dz);
    }
    if (query.mouseWheelMotionFactor !== undefined && query.mouseWheelMotionFactor !== null) {
        result.mouseWheelMotionFactor = Number(query.mouseWheelMotionFactor);
    }
    if (query.mapperIsStatic !== undefined && query.mapperIsStatic !== null) {
        result.mapperIsStatic = query.mapperIsStatic.toString() == "true" ? true : false;
    }
    if (query.animate !== undefined && query.animate !== null) {
        result.animate = query.animate.toString() == "true" ? true : false;
    }
    return result;
}