#pragma once

#include <memory>
#include <string>

class vtkDataSet;
class GeometryViewer {
public:
  GeometryViewer();
  ~GeometryViewer();

  void LoadDataFileFromMemory(const std::string &filename,
                              std::uintptr_t buffer, std::size_t nbytes);
  void WriteDataFileToVirtualFS(const std::string &filename,
                              std::uintptr_t buffer, std::size_t nbytes);

  void Initialize();
  void Render();
  void ResetView();
  void SetSize(int width, int height);
  void RemoveAllActors();

  // std::string SetVertexShaderSource(std::string source);
  // std::string SetFragmentShaderSource(std::string source);
  // std::string GetVertexShaderSource();
  // std::string GetFragmentShaderSource();

  void Start();
  void Halt();
  void Resume();

  void SetBackgroundColor1(int r, int g, int b);
  void SetBackgroundColor2(int r, int g, int b);
  void SetMouseWheelMotionFactor(float sensitivity);
  void SetUseOrthographicProjection(bool value);
  void SetDitherGradient(bool value);
  void SetHighlightOnHover(bool value, bool snapToPoint = false);

  void Azimuth(float value);

  void SetRepresentation(int representation);
  void SetVertexVisibility(bool visible);
  void SetRenderPointsAsSpheres(bool value);
  void SetPointSize(float value);
  void SetEdgeVisibility(bool visible);
  void SetRenderLinesAsTubes(bool value);
  void SetLineWidth(float value);

  void SetColorByArray(const std::string &arrayName);
  void SetInterpolateScalarsBeforeMapping(bool value);
  void SetColor(int r, int g, int b);
  void SetColorMapPreset(const std::string &presetName);
  void SetVertexColor(int r, int g, int b);
  void SetEdgeColor(int r, int g, int b);
  void SetOpacity(float value);
  void SetEdgeOpacity(float value);

  std::string GetPointDataArrays();
  std::string GetCellDataArrays();
  std::string GetColorMapPresets();

  void SaveScreenshotAsPNG();

private:
  class Internal;
  std::unique_ptr<Internal> P;
};

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
EMSCRIPTEN_BINDINGS(GeometryViewerJSBindings) {
  emscripten::class_<GeometryViewer>("GeometryViewer")
      .constructor<>()
      .function("loadDataFileFromMemory",
                &GeometryViewer::LoadDataFileFromMemory)
      .function("initialize", &GeometryViewer::Initialize)
      .function("render", &GeometryViewer::Render)
      .function("resetView", &GeometryViewer::ResetView)
      .function("setSize", &GeometryViewer::SetSize)
      .function("removeAllActors", &GeometryViewer::RemoveAllActors)
      .function("start", &GeometryViewer::Start)
      .function("halt", &GeometryViewer::Halt)
      .function("resume", &GeometryViewer::Resume)
      .function("setBackgroundColor1", &GeometryViewer::SetBackgroundColor1)
      .function("setBackgroundColor2", &GeometryViewer::SetBackgroundColor2)
      .function("setMouseWheelMotionFactor",
                &GeometryViewer::SetMouseWheelMotionFactor)
      .function("setUseOrthographicProjection",
                &GeometryViewer::SetUseOrthographicProjection)
      .function("setDitherGradient", &GeometryViewer::SetDitherGradient)
      .function("setHighlightOnHover", &GeometryViewer::SetHighlightOnHover)
      .function("azimuth", &GeometryViewer::Azimuth)
      .function("setRepresentation", &GeometryViewer::SetRepresentation)
      .function("setVertexVisibility", &GeometryViewer::SetVertexVisibility)
      .function("setRenderPointsAsSpheres", &GeometryViewer::SetRenderPointsAsSpheres)
      .function("setPointSize", &GeometryViewer::SetPointSize)
      .function("setEdgeVisibility", &GeometryViewer::SetEdgeVisibility)
      .function("setRenderLinesAsTubes", &GeometryViewer::SetRenderLinesAsTubes)
      .function("setLineWidth", &GeometryViewer::SetLineWidth)
      .function("setColorByArray", &GeometryViewer::SetColorByArray)
      .function("setInterpolateScalarsBeforeMapping",
                &GeometryViewer::SetInterpolateScalarsBeforeMapping)
      .function("setColor", &GeometryViewer::SetColor)
      .function("setColorMapPreset", &GeometryViewer::SetColorMapPreset)
      .function("setVertexColor", &GeometryViewer::SetVertexColor)
      .function("setEdgeColor", &GeometryViewer::SetEdgeColor)
      .function("setOpacity", &GeometryViewer::SetOpacity)
      .function("setEdgeOpacity", &GeometryViewer::SetEdgeOpacity)
      .function("getPointDataArrays", &GeometryViewer::GetPointDataArrays)
      .function("getCellDataArrays", &GeometryViewer::GetCellDataArrays)
      .function("getColorMapPresets", &GeometryViewer::GetColorMapPresets)
      .function("saveScreenshotAsPNG", &GeometryViewer::SaveScreenshotAsPNG);
}
#endif
