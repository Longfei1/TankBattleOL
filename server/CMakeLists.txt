cmake_minimum_required(VERSION 2.8)

project(server)

set(CMAKE_BUILD_TYPE Release)
set(CMAKE_CXX_STANDARD 11)

include_directories(
    ./
    ../
    /usr/program/boost_1_74_0/include 
    /usr/program/protobuf-3.14.0/include
)
link_directories(
    /usr/program/boost_1_74_0/lib 
    /usr/program/protobuf/lib
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