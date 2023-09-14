#pragma once

#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>

class CameraState {
public:
  double viewUp[3];
  double position[3];
  double focalPoint[3];
  double viewAngle;
};

class ConesViewer {
public:
  ConesViewer();
  ~ConesViewer();

  int CreateDatasets(int nx, int ny, int nz, double dx, double dy, double dz);
  void SetMapperStatic(bool value);
  void Azimuth(double value);
  void Initialize();
  void Render();
  void ResetView();
  int Run();
  void SetScrollSensitivity(float sensitivity);
  CameraState GetCameraState();
  void SetCameraState(CameraState &state);

private:
  float ScrollSensitivity = 1.0;

  vtkNew<vtkRenderWindowInteractor> Interactor;
  vtkNew<vtkRenderWindow> Window;
  vtkNew<vtkRenderer> Renderer;
};

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
EMSCRIPTEN_BINDINGS(ConesViewerJSBindings) {
  emscripten::class_<ConesViewer>("ConesViewer")
      .constructor<>()
      .function("initialize", &ConesViewer::Initialize)
      .function("createDatasets", &ConesViewer::CreateDatasets)
      .function("setMapperStatic", &ConesViewer::SetMapperStatic)
      .function("azimuth", &ConesViewer::Azimuth)
      .function("setScrollSensitivity", &ConesViewer::SetScrollSensitivity)
      .function("render", &ConesViewer::Render)
      .function("resetView", &ConesViewer::ResetView)
      .function("run", &ConesViewer::Run)
      .function("getCameraState", &ConesViewer::GetCameraState)
      .function("setCameraState", &ConesViewer::SetCameraState);
  emscripten::value_object<CameraState>("CameraState")
      .field("viewUp", &CameraState::viewUp)
      .field("position", &CameraState::position)
      .field("focalPoint", &CameraState::focalPoint)
      .field("viewAngle", &CameraState::viewAngle);
  // Register std::array<int, 2> because CameraState::viewUp and others are
  // interpreted as such
  emscripten::value_array<std::array<double, 3>>("array_double_3")
      .element(emscripten::index<0>())
      .element(emscripten::index<1>())
      .element(emscripten::index<2>());
}
#endif
