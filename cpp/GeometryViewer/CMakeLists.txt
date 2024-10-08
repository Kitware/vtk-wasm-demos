cmake_minimum_required(VERSION 3.13)
project(GeometryViewer)

# -----------------------------------------------------------------------------
# EMSCRIPTEN only
# -----------------------------------------------------------------------------

if (NOT EMSCRIPTEN)
  message("Skipping example: This needs to run inside an Emscripten build environment")
  return ()
endif ()

# -----------------------------------------------------------------------------
# Handle VTK dependency
# -----------------------------------------------------------------------------

find_package(VTK
  COMPONENTS
    CommonColor
    FiltersGeometry
    InteractionStyle
    InteractionWidgets
    IOPLY
    IOGeometry
    IOXML
    RenderingOpenGL2
    RenderingWebGPU
    RenderingUI
)

if (NOT VTK_FOUND)
  message("Skipping example: ${VTK_NOT_FOUND_MESSAGE}")
  return ()
endif ()

# -----------------------------------------------------------------------------
# Compile example code
# -----------------------------------------------------------------------------

add_executable(GeometryViewer
  GeometryViewer.h
  GeometryViewer.cxx
)

target_link_libraries(GeometryViewer
  PRIVATE
    ${VTK_LIBRARIES}
)

# -----------------------------------------------------------------------------
# WebAssembly build options
# -----------------------------------------------------------------------------
set(emscripten_link_options)
set(emscripten_compile_options)

list(APPEND emscripten_link_options
  "-lembind"
  "-sASYNCIFY=1" # for webgpu async APIs
  "-sASYNCIFY_STACK_SIZE=81920" #~297 nesting levels
  "-sMODULARIZE=1"
  "-sEXPORT_ES6=1"
  "-sEXPORT_NAME=createGeometryViewerModule"
  "-sENVIRONMENT=web"
  "-sALLOW_MEMORY_GROWTH=1"
  "-sMAXIMUM_MEMORY=4GB"
  "-sSINGLE_FILE=1"
  #"--memoryprofiler"
  #"--cpuprofiler"
  "-sEXPORTED_FUNCTIONS=['_malloc', '_free']"
  "-sEXPORTED_RUNTIME_METHODS=['ENV', 'UTF8ToString']"
)
if (CMAKE_SIZEOF_VOID_P EQUAL 8)
  list(APPEND emscripten_link_options
  "-sWASM_BIGINT=1"
  "-sMAXIMUM_MEMORY=16GB")
endif ()

set(emscripten_debug_options)

if(DEBUGINFO STREQUAL "NONE")
  list(APPEND emscripten_debug_options
    "-g0"
  )
elseif(DEBUGINFO STREQUAL "READABLE_JS")
  list(APPEND emscripten_debug_options
    "-g1"
  )
  list(APPEND emscripten_link_options
    "-sDEMANGLE_SUPPORT=1"
  )
elseif(DEBUGINFO STREQUAL "PROFILE")
  list(APPEND emscripten_debug_options
    "-g2"
  )
  list(APPEND emscripten_link_options
    "-sDEMANGLE_SUPPORT=1"
  )
elseif(DEBUGINFO STREQUAL "DEBUG_NATIVE")
  list(APPEND emscripten_debug_options
    "-g3"
  )
  list(APPEND emscripten_link_options
    "-sASSERTIONS=1"
    "-sDEMANGLE_SUPPORT=1"
  )
endif()

# -----------------------------------------------------------------------------
# Build options
# -----------------------------------------------------------------------------
set(emscripten_optimizations)

if(OPTIMIZE STREQUAL "NO_OPTIMIZATION")
  list(APPEND emscripten_optimizations
    "-O0"
  )
elseif(OPTIMIZE STREQUAL "LITTLE")
  list(APPEND emscripten_optimizations
    "-O1"
  )
elseif(OPTIMIZE STREQUAL "MORE")
  list(APPEND emscripten_optimizations
    "-O2"
  )
elseif(OPTIMIZE STREQUAL "BEST")
  list(APPEND emscripten_optimizations
    "-O3"
  )
elseif(OPTIMIZE STREQUAL "SMALL")
  list(APPEND emscripten_optimizations
    "-Os"
  )
elseif(OPTIMIZE STREQUAL "SMALLEST")
  list(APPEND emscripten_optimizations
    "-Oz"
  )
elseif(OPTIMIZE STREQUAL "SMALLEST_WITH_CLOSURE")
  list(APPEND emscripten_optimizations
    "-Oz"
  )
  list(APPEND emscripten_link_options
    "--closure=1"
  )
endif()

target_compile_options(GeometryViewer
  PUBLIC
    ${emscripten_compile_options}
    ${emscripten_optimizations}
    ${emscripten_debug_options}
)

target_link_options(GeometryViewer
  PUBLIC
    ${emscripten_link_options}
    ${emscripten_optimizations}
    ${emscripten_debug_options}
)

# -----------------------------------------------------------------------------
# VTK modules initialization
# -----------------------------------------------------------------------------

vtk_module_autoinit(
  TARGETS  GeometryViewer
  MODULES  ${VTK_LIBRARIES}
)

set_target_properties(GeometryViewer
PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY "${VUE_COMPONENTS_DIR}/GeometryViewer"
)
