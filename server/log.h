#pragma once
#include <cstdio>

#define LOG_FORMAT(logger, level, ...)               \
std::printf("[%s]", level);                          \
std::printf(__VA_ARGS__);                            \
std::printf("\n")                                    \


//日志为单例
#define LOG_DEBUG(...) LOG_FORMAT("", "Debug", __VA_ARGS__)
#define LOG_INFO(...) LOG_FORMAT("", "Info", __VA_ARGS__)
#define LOG_WARN(...) LOG_FORMAT("", "Warn", __VA_ARGS__)
#define LOG_ERROR(...) LOG_FORMAT("", "Error", __VA_ARGS__)