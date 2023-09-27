#pragma once

#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>

#include <string>

class GeometryViewer {
public:
  GeometryViewer();
  ~GeometryViewer();

  void LoadDataFile(const std::string &filename);
  void LoadDataFileFromMemory(const std::string &filename,
                              std::uintptr_t buffer, std::size_t nbytes);

  void Initialize();
  void Render();
  void ResetView();
  void Run();

  void Azimuth(double value);
  void SetScrollSensitivity(float sensitivity);
  void SetEdgeVisibility(bool visible);
  void SetLineWidth(double value);

private:
  float ScrollSensitivity = 1.0;

  vtkNew<vtkRenderWindowInteractor> Interactor;
  vtkNew<vtkRenderWindow> Window;
  vtkNew<vtkRenderer> Renderer;
};

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
EMSCRIPTEN_BINDINGS(GeometryViewerJSBindings) {
  emscripten::class_<GeometryViewer>("GeometryViewer")
      .constructor<>()
      .function("loadDataFile", &GeometryViewer::LoadDataFile)
      .function("loadDataFileFromMemory",
                &GeometryViewer::LoadDataFileFromMemory)
      .function("initialize", &GeometryViewer::Initialize)
      .function("render", &GeometryViewer::Render)
      .function("resetView", &GeometryViewer::ResetView)
      .function("run", &GeometryViewer::Run)
      .function("azimuth", &GeometryViewer::Azimuth)
      .function("setScrollSensitivity", &GeometryViewer::SetScrollSensitivity)
      .function("setEdgeVisibility", &GeometryViewer::SetEdgeVisibility)
      .function("setLineWidth", &GeometryViewer::SetLineWidth);
}
#endif
