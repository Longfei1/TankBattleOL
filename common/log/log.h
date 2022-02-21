#pragma once
#include <cstdio>
#include <ctime>

#define LOG_FORMAT(logger, level, ...)               \
auto now = time(nullptr);							 \
auto t = localtime(&now);							 \
std::printf("[%s][%4d-%.2d-%.2d %.2d:%.2d:%.2d]", level, t->tm_year + 1900, t->tm_mon + 1, t->tm_mday, t->tm_hour, t->tm_min, t->tm_sec);\
std::printf(__VA_ARGS__);                            \
std::printf("\n")                                    \


//日志为单例
#define LOG_TRACE(...) LOG_FORMAT("", "Trace", __VA_ARGS__)
#define LOG_DEBUG(...) LOG_FORMAT("", "Debug", __VA_ARGS__)
#define LOG_INFO(...) LOG_FORMAT("", "Info", __VA_ARGS__)
#define LOG_WARN(...) LOG_FORMAT("", "Warn", __VA_ARGS__)
#define LOG_ERROR(...) LOG_FORMAT("", "Error", __VA_ARGS__)