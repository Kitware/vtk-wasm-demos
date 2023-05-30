cmake_minimum_required(VERSION 3.13)
project(ConesJS)

# Dependencies to download with npm
add_custom_target(
  ConesJSDeps
  WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
  COMMAND
    npm install
)

# Build static files with npm
add_custom_target(
  ConesJS
  DEPENDS ConesJSDeps
  WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
  COMMAND
    npm run build
)

# Copy static files into output directory.
add_custom_target(ConesJSDist
  ALL
  DEPENDS ConesJS
  COMMAND
    ${CMAKE_COMMAND} -E copy_directory
      "${CMAKE_CURRENT_SOURCE_DIR}/dist"
      "${CMAKE_CURRENT_BINARY_DIR}"
)
