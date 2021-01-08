#pragma once
#include <unordered_set>
#include <boost/noncopyable.hpp>

namespace myutils
{
    //id生成器
    template <typename T>
    class IDGenerator : boost::noncopyable
    {
    public:
        IDGenerator() = default;

        //指定生成器id范围[start,end)
        IDGenerator(T start, T end) : start_(start), end_(end), now_(start) 
        {
        }

        T GenerateOneID()
        {
            assert(start_ < end_);

            auto size = end_ - start_;
            if (size > 0 && use_set_.size() < size)
            {
                auto ret = now_;
                use_set_.insert(ret);
                NextID();
                return ret;
            }
            return GetOneInvalidID();
        }

        void ReturnOneID(T id)
        {
            use_set_.erase(id);
            if (use_set_.find(now_) != use_set_.end())
            {
                NextID();
            }
        }

        void Reset(T start, T end)
        {
            start_ = start;
            end_ = end;
            now_ = start;
            use_set_.clear();
        }

        bool IsValidID(T id)
        {
            return id >= start_ && id < end_;
        }

        T GetOneInvalidID()
        {
            return end_;
        }
    private:
        void NextID()
        {
            if (use_set_.size() < end_ - start_)
            {
                do
                {
                    now_++;
                    if (now_ >= end_)
                    {
                        now_ = start_;
                    }
                } while (use_set_.find(now_) != use_set_.end());
            }
        }
    private:
        T start_;
        T end_;
        T now_;

        std::unordered_set<T> use_set_;
    };
}