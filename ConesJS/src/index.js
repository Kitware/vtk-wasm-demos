import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkCalculator from '@kitware/vtk.js/Filters/General/Calculator';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import { AttributeTypes } from '@kitware/vtk.js/Common/DataModel/DataSetAttributes/Constants';
import { FieldDataTypes } from '@kitware/vtk.js/Common/DataModel/DataSet/Constants';

import dat from 'dat.gui'

var options = {
  nx: 10,
  ny: 10,
  nz: 10,
  dx: 2.0,
  dy: 2.0,
  dz: 2.0,
  mapperIsStatic: true,
  animate: true,
};

var animationRequestId = null;

// ----------------------------------------------------------------------------
function updateDatasets() {
  // clear all actors.
  renderer.removeAllActors();

  // create a filter on the fly, sort of cool, this is a random scalars
  // filter we create inline, for a simple cone you would not need
  // this
  var x = 0.0, y = 0.0, z = 0.0;
  for (let k = 0; k < options.nz; ++k) {
    for (let j = 0; j < options.ny; ++j) {
      for (let i = 0; i < options.nx; ++i) {
        const coneSource = vtkConeSource.newInstance({
          center: [x, y, z],
          height: 1.0,
          resolution: 10,
        });

        const filter = vtkCalculator.newInstance();

        filter.setInputConnection(coneSource.getOutputPort());
        // filter.setFormulaSimple(FieldDataTypes.CELL, [], 'random', () => Math.random());
        filter.setFormula({
          getArrays: (inputDataSets) => ({
            input: [],
            output: [
              {
                location: FieldDataTypes.CELL,
                name: 'Random',
                dataType: 'Float32Array',
                attribute: AttributeTypes.SCALARS,
              },
            ],
          }),
          evaluate: (arraysIn, arraysOut) => {
            const [scalars] = arraysOut.map((d) => d.getData());
            for (let i = 0; i < scalars.length; i++) {
              scalars[i] = Math.random();
            }
          },
        });

        const mapper = vtkMapper.newInstance();
        mapper.setInputConnection(filter.getOutputPort());

        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);
        // rotate around Z, about the cone's center.
        actor.setOrigin(x, y, z);
        actor.rotateZ(i * j);
        renderer.addActor(actor);
        x += options.dx;
      }
      x = 0.0;
      y += options.dy;
    }
    y = 0.0;
    z += options.dz;
  }
  console.debug(`Created ${options.nx * options.ny * options.nz} cones`);
  renderer.resetCamera();
  renderWindow.render();
}

// ----------------------------------------------------------------------------
function animate() {
  renderer.getActiveCamera().azimuth(1);
  renderer.resetCameraClippingRange();
  renderWindow.render();
  animationRequestId = requestAnimationFrame(animate)
}

function updateMapperStatic() {
  let actors = renderer.getActors();
  for (let i = 0; i < actors.length; ++i) {
    actors[i].getMapper().setStatic(options.mapperIsStatic);
  }
}

// ----------------------------------------------------------------------------
function updateAnimateState() {
  if (options.animate) {    
    animationRequestId = requestAnimationFrame(animate)
  }
  else {
    console.log("cancel " + animationRequestId )
    cancelAnimationFrame(animationRequestId)
  }
}

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0.2, 0.3, 0.4],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------
var gui = new dat.GUI();
gui.add(options, 'nx', 1, 100).step(1).onChange(() => {
  updateDatasets();
});
gui.add(options, 'ny', 1, 100).step(1).onChange(() => {
  updateDatasets();
});
gui.add(options, 'nz', 1, 100).step(1).onChange(() => {
  updateDatasets();
});
gui.add(options, 'dx', 1.0, 5.0).step(1).onChange(() => {
  updateDatasets();
});
gui.add(options, 'dy', 1.0, 5.0).step(1).onChange(() => {
  updateDatasets();
});
gui.add(options, 'dz', 1.0, 5.0).step(1).onChange(() => {
  updateDatasets();
});
gui.add(options, 'mapperIsStatic').onChange(() => {
  updateMapperStatic();
});
gui.add(options, 'animate').onChange(() => {
  updateAnimateState();
})
// button that resets view.
gui.add(
  {
    ResetView: () => {
      renderer.resetCamera();
      renderWindow.render();
    }
  }, 'ResetView');

// Create the cones with default options and render.
updateDatasets();
updateMapperStatic();
updateAnimateState();

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------
global.gui = gui
global.renderer = renderer;
global.renderWindow = renderWindow;
