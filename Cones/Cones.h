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

class Cones {
public:
  Cones();
  ~Cones();

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
EMSCRIPTEN_BINDINGS(ConesJSBindings) {
  emscripten::class_<Cones>("Cones")
      .constructor<>()
      .function("initialize", &Cones::Initialize)
      .function("createDatasets", &Cones::CreateDatasets)
      .function("setMapperStatic", &Cones::SetMapperStatic)
      .function("azimuth", &Cones::Azimuth)
      .function("setScrollSensitivity", &Cones::SetScrollSensitivity)
      .function("render", &Cones::Render)
      .function("resetView", &Cones::ResetView)
      .function("run", &Cones::Run)
      .function("getCameraState", &Cones::GetCameraState)
      .function("setCameraState", &Cones::SetCameraState);
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
