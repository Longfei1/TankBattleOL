cmake_minimum_required(VERSION 2.8)

project(server)

set(CMAKE_BUILD_TYPE Release)
set(CMAKE_CXX_STANDARD 11)

include_directories(
    ./
    ../
    $ENV{BOOST_INCLUDE_PATH}
    $ENV{PROTOBUF_INCLUDE_PATH}
)
link_directories(
    $ENV{BOOST_LIB_PATH}
    $ENV{PROTOBUF_LIB_PATH}
)

aux_source_directory(. SRC_PROJECT)

#为排除build文件夹，先逐个列举源目录
file(GLOB_RECURSE SRC_TEMP ./game_server/*.*)
list(APPEND SRC_PROJECT ${SRC_TEMP})
file(GLOB_RECURSE SRC_TEMP ./socket_server/*.*)
list(APPEND SRC_PROJECT ${SRC_TEMP})
file(GLOB_RECURSE SRC_TEMP ./work_server/*.*)
list(APPEND SRC_PROJECT ${SRC_TEMP})
file(GLOB_RECURSE SRC_TEMP ./proto/*.*)
list(APPEND SRC_PROJECT ${SRC_TEMP})

file(GLOB_RECURSE SRC_COMMON ../common/*.*)

add_executable(server.out ${SRC_PROJECT} ${SRC_COMMON})

#链接库
target_link_libraries(server.out pthread protobuf)