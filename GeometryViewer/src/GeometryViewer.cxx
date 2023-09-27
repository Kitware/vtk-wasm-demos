#include "GeometryViewer.h"

#include <vtkActor.h>
#include <vtkCallbackCommand.h>
#include <vtkCamera.h>
#include <vtkCellData.h>
#include <vtkCharArray.h>
#include <vtkCollectionRange.h>
#include <vtkDataSetMapper.h>
#include <vtkGLTFReader.h>
#include <vtkInteractorStyleSwitch.h>
#include <vtkInteractorStyleTrackballCamera.h>
#include <vtkMemoryResourceStream.h>
#include <vtkMinimalStandardRandomSequence.h>
#include <vtkNew.h>
#include <vtkOBJReader.h>
#include <vtkPLYReader.h>
#include <vtkPolyData.h>
#include <vtkPolyDataMapper.h>
#include <vtkPolyDataReader.h>
#include <vtkProperty.h>
#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkRenderer.h>
#include <vtkRendererCollection.h>
#include <vtkSDL2RenderWindowInteractor.h>
#include <vtkSTLReader.h>
#include <vtkSetGet.h>
#include <vtkSmartPointer.h>
#include <vtkXMLPolyDataReader.h>
#include <vtkXMLUnstructuredGridReader.h>
#include <vtksys/SystemTools.hxx>

#include <iostream>

//------------------------------------------------------------------------------
GeometryViewer::GeometryViewer() {
  std::cout << __func__ << std::endl;
  this->Window->SetWindowName(__func__);
}

//------------------------------------------------------------------------------
GeometryViewer::~GeometryViewer() { std::cout << __func__ << std::endl; }

//------------------------------------------------------------------------------
void GeometryViewer::LoadDataFile(const std::string &filename) {
  std::cout << __func__ << "(" << filename << ")" << std::endl;
  vtkSmartPointer<vtkAlgorithm> reader;
  vtkSmartPointer<vtkMapper> mapper;
  using systools = vtksys::SystemTools;
  if (systools::StringEndsWith(filename, ".vtp")) {
    auto xmlreader = vtk::TakeSmartPointer(vtkXMLPolyDataReader::New());
    mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    xmlreader->SetFileName(filename.c_str());
    reader = xmlreader;
  } else if (systools::StringEndsWith(filename, ".vtu")) {
    auto xmlreader = vtk::TakeSmartPointer(vtkXMLUnstructuredGridReader::New());
    mapper = vtk::TakeSmartPointer(vtkDataSetMapper::New());
    xmlreader->SetFileName(filename.c_str());
    reader = xmlreader;
  } else if (systools::StringEndsWith(filename, ".glb") ||
             systools::StringEndsWith(filename, ".gltf")) {
    // TODO: Hangs.
    // auto gltfreader = vtk::TakeSmartPointer(vtkGLTFReader::New());
    // mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    // gltfreader->SetFileName(filename.c_str());
    // reader = gltfreader;
  } else if (systools::StringEndsWith(filename, ".obj")) {
    auto objreader = vtk::TakeSmartPointer(vtkOBJReader::New());
    mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    objreader->SetFileName(filename.c_str());
    reader = objreader;
  } else if (systools::StringEndsWith(filename, ".ply")) {
    auto plyreader = vtk::TakeSmartPointer(vtkPLYReader::New());
    mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    plyreader->SetFileName(filename.c_str());
    reader = plyreader;
  }
  mapper->SetInputConnection(reader->GetOutputPort());
  vtkNew<vtkActor> actor;
  actor->SetMapper(mapper);
  mapper->Update();
  mapper->SetStatic(true); // speeds up rendering
  this->Renderer->AddActor(actor);
}

void GeometryViewer::LoadDataFileFromMemory(const std::string &filename,
                                            std::uintptr_t buffer,
                                            std::size_t nbytes) {

  std::cout << __func__ << "(" << filename << ',' << buffer << ',' << nbytes
            << ")" << std::endl;
  vtkSmartPointer<vtkAlgorithm> reader;
  vtkSmartPointer<vtkMapper> mapper;
  using systools = vtksys::SystemTools;
  auto wrappedBuffer = vtk::TakeSmartPointer(vtkBuffer<char>::New());
  wrappedBuffer->SetBuffer(reinterpret_cast<char *>(buffer), nbytes);
  wrappedBuffer->SetFreeFunction(true);
  vtkNew<vtkMemoryResourceStream> stream;
  if (systools::StringEndsWith(filename, ".vtp")) {
    auto xmlreader = vtk::TakeSmartPointer(vtkXMLPolyDataReader::New());
    mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    xmlreader->SetReadFromInputString(true);
    std::string inputString;
    inputString.assign(reinterpret_cast<char *>(buffer), nbytes);
    xmlreader->SetInputString(inputString);
    free(reinterpret_cast<char *>(buffer));
    reader = xmlreader;
  } else if (systools::StringEndsWith(filename, ".vtu")) {
    auto xmlreader = vtk::TakeSmartPointer(vtkXMLUnstructuredGridReader::New());
    mapper = vtk::TakeSmartPointer(vtkDataSetMapper::New());
    xmlreader->SetReadFromInputString(true);
    std::string inputString;
    inputString.assign(reinterpret_cast<char *>(buffer), nbytes);
    xmlreader->SetInputString(inputString);
    free(reinterpret_cast<char *>(buffer));
    reader = xmlreader;
  } else if (systools::StringEndsWith(filename, ".vtk")) {
    auto polydataReader = vtk::TakeSmartPointer(vtkPolyDataReader::New());
    mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    polydataReader->ReadFromInputStringOn();
    vtkNew<vtkCharArray> wrappedArray;
    wrappedArray->SetArray(reinterpret_cast<char *>(buffer), nbytes, 1);
    polydataReader->SetInputArray(wrappedArray);
    reader = polydataReader;
  } else if (systools::StringEndsWith(filename, ".glb") ||
             systools::StringEndsWith(filename, ".gltf")) {
    // TODO: Hangs.
    // auto gltfreader = vtk::TakeSmartPointer(vtkGLTFReader::New());
    // mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    // gltfreader->SetFileName(filename.c_str());
    // reader = gltfreader;
  } else if (systools::StringEndsWith(filename, ".obj")) {
    auto objreader = vtk::TakeSmartPointer(vtkOBJReader::New());
    stream->SetBuffer(wrappedBuffer);
    objreader->SetStream(stream);
    mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    reader = objreader;
  } else if (systools::StringEndsWith(filename, ".ply")) {
    auto plyreader = vtk::TakeSmartPointer(vtkPLYReader::New());
    plyreader->SetReadFromInputStream(true);
    stream->SetBuffer(wrappedBuffer);
    plyreader->SetStream(stream);
    mapper = vtk::TakeSmartPointer(vtkPolyDataMapper::New());
    reader = plyreader;
  }
  mapper->SetInputConnection(reader->GetOutputPort());
  mapper->Update();
  mapper->SetStatic(true); // speeds up rendering
  vtkNew<vtkActor> actor;
  actor->SetMapper(mapper);
  this->Renderer->AddActor(actor);
}

//------------------------------------------------------------------------------
void GeometryViewer::Azimuth(double value) {
  std::cout << __func__ << '(' << value << ')' << std::endl;
  this->Renderer->GetActiveCamera()->Azimuth(value);
  this->Renderer->ResetCameraClippingRange();
  vtkWarningWithObjectMacro(this->Renderer, << "Current memory usage "
                                            << (uintptr_t)sbrk(0) << " bytes");
}

//------------------------------------------------------------------------------
void GeometryViewer::Initialize() {
  std::cout << __func__ << std::endl;
  this->Renderer->GradientBackgroundOn();
  this->Renderer->SetGradientMode(
      vtkRenderer::GradientModes::VTK_GRADIENT_RADIAL_VIEWPORT_FARTHEST_CORNER);
  this->Renderer->SetBackground(0.573, 0.553, 0.671);
  this->Renderer->SetBackground2(0.122, 0.11, 0.173);
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
void GeometryViewer::Render() {
  std::cout << __func__ << std::endl;
  this->Window->Render();
}

//------------------------------------------------------------------------------
void GeometryViewer::ResetView() {
  std::cout << __func__ << std::endl;
  auto ren = this->Window->GetRenderers()->GetFirstRenderer();
  if (ren != nullptr) {
    ren->ResetCamera();
  }
}

//------------------------------------------------------------------------------
void GeometryViewer::Run() {
  std::cout << __func__ << std::endl;

  this->Interactor->UpdateSize(1920, 600);
  this->Renderer->GetActiveCamera()->Elevation(30.0);
  this->Renderer->GetActiveCamera()->Azimuth(-40.0);
  this->Renderer->GetActiveCamera()->Zoom(3.0);
  this->Renderer->GetActiveCamera()->Roll(10.0);
  this->Renderer->SetBackground(0.2, 0.3, 0.4);
  this->Renderer->ResetCamera();
  this->Window->Render();
  vtkSDL2RenderWindowInteractor::SafeDownCast(this->Interactor)
      ->AddEventHandler();
}

//------------------------------------------------------------------------------
void GeometryViewer::SetScrollSensitivity(float sensitivity) {
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
void GeometryViewer::SetEdgeVisibility(bool visible) {
  std::cout << __func__ << '(' << visible << ')' << std::endl;
  for (const auto &viewProp : vtk::Range(this->Renderer->GetViewProps())) {
    if (auto actor = static_cast<vtkActor *>(viewProp)) {
      actor->GetProperty()->SetEdgeVisibility(visible);
      actor->GetProperty()->SetEdgeColor(0.0, 0.0, 0.5019);
    }
  }
}

//------------------------------------------------------------------------------
void GeometryViewer::SetLineWidth(double value) {
  std::cout << __func__ << '(' << value << ')' << std::endl;
  for (const auto &viewProp : vtk::Range(this->Renderer->GetViewProps())) {
    if (auto actor = static_cast<vtkActor *>(viewProp)) {
      actor->GetProperty()->SetLineWidth(value);
    }
  }
}
