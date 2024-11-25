cmake_minimum_required(VERSION 3.13)
project(ConesViewer)

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
    FiltersSources      # VTK pipeline
    InteractionStyle    # Mouse handling
    RenderingOpenGL2    # For Rendering with OpenGL
    RenderingWebGPU     # For Rendering with WebGPU
    RenderingUI         # For SDL2 Window
)

if (NOT VTK_FOUND)
  message("Skipping example: ${VTK_NOT_FOUND_MESSAGE}")
  return ()
endif ()

# -----------------------------------------------------------------------------
# Compile example code
# -----------------------------------------------------------------------------

add_executable(ConesViewer
  ConesViewer.h
  ConesViewer.cxx
)

target_link_libraries(ConesViewer
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
  "-sEXPORT_NAME=createConesViewerModule"
  "-sENVIRONMENT=web"
  "-sALLOW_MEMORY_GROWTH=1"
  "-sSINGLE_FILE=1"
  "-sMAXIMUM_MEMORY=4GB"
  "-sEXPORTED_RUNTIME_METHODS=['ENV']" # ENV holds the environment variables accessible by C getenv
)

# -----------------------------------------------------------------------------
# Optimizations
# -----------------------------------------------------------------------------
set(emscripten_optimizations)
set(emscripten_debug_options)

if (CMAKE_BUILD_TYPE STREQUAL "Release")
  set(cones_viewer_optimize "BEST")
  set(cones_viewer_debug_info "NONE")
elseif (CMAKE_BUILD_TYPE STREQUAL "MinSizeRel")
  set(cones_viewer_optimize "SMALLEST_WITH_CLOSURE")
  set(cones_viewer_debug_info "NONE")
elseif (CMAKE_BUILD_TYPE STREQUAL "RelWithDebInfo")
  set(cones_viewer_optimize "MORE")
  set(cones_viewer_debug_info "PROFILE")
elseif (CMAKE_BUILD_TYPE STREQUAL "Debug")
  set(cones_viewer_optimize "NO_OPTIMIZATION")
  set(cones_viewer_debug_info "DEBUG_NATIVE")
endif ()
set(cones_viewer_optimize_NO_OPTIMIZATION "-O0")
set(cones_viewer_optimize_LITTLE "-O1")
set(cones_viewer_optimize_MORE "-O2")
set(cones_viewer_optimize_BEST "-O3")
set(cones_viewer_optimize_SMALLEST "-Os")
set(cones_viewer_optimize_SMALLEST_WITH_CLOSURE "-Oz")
set(cones_viewer_optimize_SMALLEST_WITH_CLOSURE_link "--closure=1")

if (DEFINED "cones_viewer_optimize_${cones_viewer_optimize}")
  list(APPEND emscripten_optimizations
    ${cones_viewer_optimize_${cones_viewer_optimize}})
  list(APPEND emscripten_link_options
    ${cones_viewer_optimize_${cones_viewer_optimize}_link})
else ()
  message (FATAL_ERROR "Unrecognized value for cones_viewer_optimize=${cones_viewer_optimize}")
endif ()

set(cones_viewer_debug_info_NONE "-g0")
set(cones_viewer_debug_info_READABLE_JS "-g1")
set(cones_viewer_debug_info_PROFILE "-g2")
set(cones_viewer_debug_info_DEBUG_NATIVE "-g3")
set(cones_viewer_debug_info_DEBUG_NATIVE_link "-sASSERTIONS=1")
if (DEFINED "cones_viewer_debug_info_${cones_viewer_debug_info}")
  list(APPEND emscripten_debug_options
    ${cones_viewer_debug_info_${cones_viewer_debug_info}})
  list(APPEND emscripten_link_options
    ${cones_viewer_debug_info_${cones_viewer_debug_info}_link})
else ()
  message (FATAL_ERROR "Unrecognized value for cones_viewer_debug_info=${cones_viewer_debug_info}")
endif ()

target_compile_options(ConesViewer
  PUBLIC
    ${emscripten_compile_options}
    ${emscripten_optimizations}
    ${emscripten_debug_options}
)

target_link_options(ConesViewer
  PUBLIC
    ${emscripten_link_options}
    ${emscripten_optimizations}
    ${emscripten_debug_options}
)

# -----------------------------------------------------------------------------
# VTK modules initialization
# -----------------------------------------------------------------------------

vtk_module_autoinit(
  TARGETS  ConesViewer
  MODULES  ${VTK_LIBRARIES}
)

set_target_properties(ConesViewer
PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY "${VUE_COMPONENTS_DIR}/ConesViewer"
)
