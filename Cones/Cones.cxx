#include "Cones.h"

#include <vtkActor.h>
#include <vtkCallbackCommand.h>
#include <vtkCamera.h>
#include <vtkCellData.h>
#include <vtkCollectionRange.h>
#include <vtkConeSource.h>
#include <vtkInteractorStyleSwitch.h>
#include <vtkInteractorStyleTrackballCamera.h>
#include <vtkMinimalStandardRandomSequence.h>
#include <vtkNew.h>
#include <vtkPolyData.h>
#include <vtkPolyDataMapper.h>
#include <vtkProperty.h>
#include <vtkRange.h>
#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkRenderer.h>
#include <vtkRendererCollection.h>

#include <iostream>

//------------------------------------------------------------------------------
Cones::Cones() {
  std::cout << __func__ << std::endl;
  this->Window->SetWindowName(__func__);
}

//------------------------------------------------------------------------------
Cones::~Cones() { std::cout << __func__ << std::endl; }

//------------------------------------------------------------------------------
int Cones::CreateDatasets(int nx, int ny, int nz, double dx, double dy,
                          double dz) {
  std::cout << __func__ << '(' << nx << ',' << ny << ',' << nz << ',' << dx
            << ',' << dy << ',' << dz << ')' << std::endl;

  // clear previous actors.
  this->Renderer->RemoveAllViewProps();

  // Used for randomized cell colors.
  vtkNew<vtkMinimalStandardRandomSequence> seq;

  // spacings between cones in all three directions.
  double x = 0.0, y = 0.0, z = 0.0;
  for (int k = 0; k < nz; ++k) {
    for (int j = 0; j < ny; ++j) {
      for (int i = 0; i < nx; ++i) {
        // create a cone
        vtkNew<vtkConeSource> coneSrc;
        coneSrc->SetResolution(10);
        coneSrc->SetCenter(x, y, z);
        coneSrc->Update();
        vtkPolyData *cone = coneSrc->GetOutput();

        // generate random colors for each face of the cone.
        vtkNew<vtkUnsignedCharArray> colors;
        colors->SetNumberOfComponents(4);
        seq->SetSeed(k * ny * nx + j * nx + i);
        for (vtkIdType cellId = 0; cellId < cone->GetNumberOfPolys();
             ++cellId) {
          double red = seq->GetNextRangeValue(0, 255.);
          double green = seq->GetNextRangeValue(0, 255.);
          double blue = seq->GetNextRangeValue(0, 255.);
          colors->InsertNextTuple4(red, green, blue, 255);
        }
        cone->GetCellData()->SetScalars(colors);

        vtkNew<vtkPolyDataMapper> mapper;
        mapper->SetInputData(cone);

        vtkNew<vtkActor> actor;
        actor->SetMapper(mapper);
        actor->GetProperty()->SetEdgeVisibility(1);
        actor->GetProperty()->SetEdgeColor(1.0, 1.0, 1.0);
        mapper->Update();
        actor->SetOrigin(x, y, z);
        actor->RotateZ(i * j);
        this->Renderer->AddActor(actor);
        x += dx;
      }
      x = 0.0;
      y += dy;
    }
    y = 0.0;
    z += dz;
  }
  std::cout << "Created " << nx * ny * nz << " cones" << std::endl;
  return this->Renderer->GetViewProps()->GetNumberOfItems();
}

//------------------------------------------------------------------------------
void Cones::SetMapperStatic(bool value) {
  std::cout << __func__ << '(' << value << ')' << std::endl;
  for (const auto &viewProp : vtk::Range(this->Renderer->GetViewProps())) {
    if (auto actor = static_cast<vtkActor *>(viewProp)) {
      actor->GetMapper()->SetStatic(value);
    }
  }
}

//------------------------------------------------------------------------------
void Cones::Azimuth(double value) {
  std::cout << __func__ << '(' << value << ')' << std::endl;
  this->Renderer->GetActiveCamera()->Azimuth(value);
  this->Renderer->ResetCameraClippingRange();
}

//------------------------------------------------------------------------------
void Cones::Initialize() {
  std::cout << __func__ << std::endl;
  // create the default renderer
  this->Window->AddRenderer(this->Renderer);
  this->Window->SetInteractor(this->Interactor);
  // set the current style to TrackBallCamera. Default is joystick
  if (auto iStyle = vtkInteractorStyle::SafeDownCast(
          this->Interactor->GetInteractorStyle())) {
    if (auto switchStyle = vtkInteractorStyleSwitch::SafeDownCast(iStyle)) {
      switchStyle->SetCurrentStyleToTrackballCamera();
    }
  }
}

//------------------------------------------------------------------------------
void Cones::Render() {
  std::cout << __func__ << std::endl;
  this->Window->Render();
}

//------------------------------------------------------------------------------
void Cones::ResetView() {
  std::cout << __func__ << std::endl;
  auto ren = this->Window->GetRenderers()->GetFirstRenderer();
  if (ren != nullptr) {
    ren->ResetCamera();
  }
}

//------------------------------------------------------------------------------
int Cones::Run() {
  std::cout << __func__ << std::endl;

  this->Interactor->UpdateSize(300, 300);
  this->Renderer->GetActiveCamera()->Elevation(30.0);
  this->Renderer->GetActiveCamera()->Azimuth(-40.0);
  this->Renderer->GetActiveCamera()->Zoom(3.0);
  this->Renderer->GetActiveCamera()->Roll(10.0);
  this->Renderer->SetBackground(0.2, 0.3, 0.4);
  this->Renderer->ResetCamera();
  this->Window->Render();
  this->Interactor->Start();
  return 0;
}

//------------------------------------------------------------------------------
void Cones::SetScrollSensitivity(float sensitivity) {
  std::cout << __func__ << "(" << sensitivity << ")" << std::endl;
  if (auto iStyle = vtkInteractorStyle::SafeDownCast(
          this->Interactor->GetInteractorStyle())) {
    if (auto switchStyle = vtkInteractorStyleSwitch::SafeDownCast(iStyle)) {
      switchStyle->GetCurrentStyle()->SetMouseWheelMotionFactor(sensitivity);
    } else {
      iStyle->SetMouseWheelMotionFactor(sensitivity);
    }
  }
  this->ScrollSensitivity = sensitivity;
}

//------------------------------------------------------------------------------
CameraState Cones::GetCameraState() {
  auto cam = this->Renderer->GetActiveCamera();
  CameraState camState;
  cam->GetViewUp(camState.viewUp);
  cam->GetPosition(camState.position);
  cam->GetFocalPoint(camState.focalPoint);
  camState.viewAngle = cam->GetViewAngle();
  return camState;
}

//------------------------------------------------------------------------------
void Cones::SetCameraState(CameraState &state) {
  auto cam = this->Renderer->GetActiveCamera();
  cam->SetViewUp(state.viewUp);
  cam->SetPosition(state.position);
  cam->SetFocalPoint(state.focalPoint);
  cam->SetViewAngle(state.viewAngle);
  this->Renderer->ResetCameraClippingRange();
}
