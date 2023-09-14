#pragma once

#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>

#include <string>

class GeometryViewer {
public:
  GeometryViewer();
  ~GeometryViewer();

  void LoadDataFile(const std::string &filename);

  void Initialize();
  void Render();
  void ResetView();
  void Run();

  void Azimuth(double value);
  void SetScrollSensitivity(float sensitivity);
  void SetEdgeVisibility(bool visible);

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
      .function("initialize", &GeometryViewer::Initialize)
      .function("render", &GeometryViewer::Render)
      .function("resetView", &GeometryViewer::ResetView)
      .function("run", &GeometryViewer::Run)
      .function("azimuth", &GeometryViewer::Azimuth)
      .function("setScrollSensitivity", &GeometryViewer::SetScrollSensitivity)
      .function("setEdgeVisibility", &GeometryViewer::SetEdgeVisibility);
}
#endif
