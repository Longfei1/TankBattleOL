cmake_minimum_required(VERSION 2.8)

project(proxy)

set(CMAKE_BUILD_TYPE Release)
set(CMAKE_CXX_STANDARD 11)

include_directories(
    ./
    ../
    $ENV{BOOST_INCLUDE_PATH}
)
link_directories(
    $ENV{BOOST_LIB_PATH}
)

aux_source_directory(. SRC_PROJECT)

#为排除build文件夹，先逐个列举源目录
file(GLOB_RECURSE SRC_TEMP ./proxy_server/*.*)
list(APPEND SRC_PROJECT ${SRC_TEMP})
file(GLOB_RECURSE SRC_TEMP ./socket_client/*.*)
list(APPEND SRC_PROJECT ${SRC_TEMP})
file(GLOB_RECURSE SRC_TEMP ./ws_server/*.*)
list(APPEND SRC_PROJECT ${SRC_TEMP})

file(GLOB_RECURSE SRC_COMMON ../common/*.*)

add_executable(proxy.out ${SRC_PROJECT} ${SRC_COMMON})

#链接库
target_link_libraries(proxy.out pthread)