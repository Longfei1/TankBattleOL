#pragma once
#include "base_library.h"
#include "game_def.h"
#include "game_req.h"
#include "proto/gamereq.pb.h"
#include "common/utils/utils.h"

#include <boost/asio/io_service.hpp>

#include "boost/date_time/posix_time/posix_time.hpp"
#include "boost/asio/deadline_timer.hpp"

class Room : public std::enable_shared_from_this<Room>
{
public:
    using Ptr = std::shared_ptr<Room>;

private:
    Room(int room_id, boost::asio::io_service& service);

public:
    ~Room();

    static Ptr CreateRoom(boost::asio::io_service& service);

    void ResetRoom();
    void SetPlayer(int player_no, int user_id);
    void RemovePlayer(int player_no);
    int GetPlayer(int player_no);

    int GetRoomID();
    int GetFrameNO();
    void NextFrameNO();
    void ResetGameFrameInfo();

protected:
    static bool GenerateRoomID(int &room_id);
    static void ReturnRoomID(int room_id);

public:
    int room_id_;
    int player[TOTAL_PLAYER];

    std::mutex mtx_;
    std::vector<gamereq::UserOperation> user_opes_;//Íæ¼Ò²Ù×÷
    std::vector<gamereq::GameFrame> game_frames_;//ÓÎÏ·Ö¡

    boost::asio::deadline_timer frame_timer_;

    int frame_no_;//Ö¡±àºÅ
private:
    static std::mutex id_generator_mtx_;
    static myutils::IDGenerator<int> id_generator_;
};

inline void Room::SetPlayer(int player_no, int user_id)
{
    if (player_no >= 0 && player_no < TOTAL_PLAYER)
    {
        //std::lock_guard<std::mutex> lock(mtx_);
        player[player_no] = user_id;
    }
}

inline void Room::RemovePlayer(int player_no)
{
    if (player_no >= 0 && player_no < TOTAL_PLAYER)
    {
        //std::lock_guard<std::mutex> lock(mtx_);
        player[player_no] = 0;
    }
}

inline int Room::GetPlayer(int player_no)
{
    if (player_no >= 0 && player_no < TOTAL_PLAYER)
    {
        //std::lock_guard<std::mutex> lock(mtx_);
        return player[player_no];
    }

    return 0;
}

inline int Room::GetRoomID()
{
    //std::lock_guard<std::mutex> lock(mtx_);
    return room_id_;
}

inline int Room::GetFrameNO()
{
    return frame_no_;
}

inline void Room::ResetGameFrameInfo()
{
    frame_no_ = 0;
    user_opes_.clear();
    game_frames_.clear();
}

inline bool Room::GenerateRoomID(int& room_id)
{
    std::lock_guard<std::mutex> lock(id_generator_mtx_);
    auto id = id_generator_.GenerateOneID();
    if (id_generator_.IsValidID(id))
    {
        room_id = id;
        return true;
    }
    return false;
}

inline void Room::ReturnRoomID(int room_id)
{
    std::lock_guard<std::mutex> lock(id_generator_mtx_);
    id_generator_.ReturnOneID(room_id);
}
