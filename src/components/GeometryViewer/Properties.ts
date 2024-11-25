import { LocationQuery } from "vue-router";

export interface Properties {
    viewApi: string,
    url?: string,
    colorByArray?: string,
    colorMapPreset?: string,

    representation?: number,
    pointSize?: number,
    lineWidth?: number,

    solidColor?: number,
    vertexColor?: number,
    edgeColor?: number,
    opacity?: number,
    edgeOpacity?: number,
    mouseWheelMotionFactor?: number,
    backgroundColor1?: number,
    backgroundColor2?: number,
    highlightOnHover?: number,

    interpolateScalarsBeforeMapping?: boolean,
    showControls?: boolean,
    vertexVisibility?: boolean,
    edgeVisibility?: boolean,
    ditherGradient?: boolean,
    orthographic?: boolean,
    renderPointsAsSpheres?: boolean,
    renderLinesAsTubes?: boolean,
}

export function geometryViewerPropertiesFromQuery(query: LocationQuery | null | undefined): Properties {
    const result: Properties = {
        viewApi: "webgl",
    };
    if (query === undefined || query === null) {
        return result;
    }
    // strings
    if (query?.viewApi !== undefined && query.viewApi !== null) {
        result.viewApi = query.viewApi.toString();
    }
    if (query.url !== undefined && query.url !== null) {
        result.url = query.url.toString();
    }
    if (query.colorByArray !== undefined && query.colorByArray !== null) {
        result.colorByArray = query.colorByArray.toString();
    }
    if (query.colorMapPreset !== undefined && query.colorMapPreset !== null) {
        result.colorMapPreset = query.colorMapPreset.toString();
    }
    if (query.showControls !== undefined && query.showControls !== null) {
        result.showControls = query.showControls.toString() == "true" ? true : false;
    }
    // numbers
    if (query.mouseWheelMotionFactor !== undefined && query.mouseWheelMotionFactor !== null) {
        result.mouseWheelMotionFactor = Number(query.mouseWheelMotionFactor);
    }
    if (query.representation !== undefined && query.representation !== null) {
        result.representation = Number(query.representation);
    }
    if (query.pointSize !== undefined && query.pointSize !== null) {
        result.pointSize = Number(query.pointSize);
    }
    if (query.lineWidth !== undefined && query.lineWidth !== null) {
        result.lineWidth = Number(query.lineWidth);
    }
    if (query.solidColor !== undefined && query.solidColor !== null) {
        result.solidColor = Number(query.solidColor);
    }
    if (query.vertexColor !== undefined && query.vertexColor !== null) {
        result.vertexColor = Number(query.vertexColor);
    }
    if (query.edgeColor !== undefined && query.edgeColor !== null) {
        result.edgeColor = Number(query.edgeColor);
    }
    if (query.opacity !== undefined && query.opacity !== null) {
        result.opacity = Number(query.opacity);
    }
    if (query.edgeOpacity !== undefined && query.edgeOpacity !== null) {
        result.edgeOpacity = Number(query.edgeOpacity);
    }
    if (query.mouseWheelMotionFactor !== undefined && query.mouseWheelMotionFactor !== null) {
        result.mouseWheelMotionFactor = Number(query.mouseWheelMotionFactor);
    }
    if (query.backgroundColor1 !== undefined && query.backgroundColor1 !== null) {
        result.backgroundColor1 = Number(query.backgroundColor1);
    }
    if (query.backgroundColor2 !== undefined && query.backgroundColor2 !== null) {
        result.backgroundColor2 = Number(query.backgroundColor2);
    }
    if (query.highlightOnHover !== undefined && query.highlightOnHover !== null) {
        result.highlightOnHover = Number(query.highlightOnHover);
    }
    // booleans
    if (query.interpolateScalarsBeforeMapping !== undefined && query.interpolateScalarsBeforeMapping !== null) {
        result.interpolateScalarsBeforeMapping = query.interpolateScalarsBeforeMapping.toString() == "true" ? true : false;
    }
    if (query.showControls !== undefined && query.showControls !== null) {
        result.showControls = query.showControls.toString() == "true" ? true : false;
    }
    if (query.vertexVisibility !== undefined && query.vertexVisibility !== null) {
        result.vertexVisibility = query.vertexVisibility.toString() == "true" ? true : false;
    }
    if (query.edgeVisibility !== undefined && query.edgeVisibility !== null) {
        result.edgeVisibility = query.edgeVisibility.toString() == "true" ? true : false;
    }
    if (query.ditherGradient !== undefined && query.ditherGradient !== null) {
        result.ditherGradient = query.ditherGradient.toString() == "true" ? true : false;
    }
    if (query.orthographic !== undefined && query.orthographic !== null) {
        result.orthographic = query.orthographic.toString() == "true" ? true : false;
    }
    if (query.renderPointsAsSpheres !== undefined && query.renderPointsAsSpheres !== null) {
        result.renderPointsAsSpheres = query.renderPointsAsSpheres.toString() == "true" ? true : false;
    }
    if (query.renderLinesAsTubes !== undefined && query.renderLinesAsTubes !== null) {
        result.renderLinesAsTubes = query.renderLinesAsTubes.toString() == "true" ? true : false;
    }
    return result;
}