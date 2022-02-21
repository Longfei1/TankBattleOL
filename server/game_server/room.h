#pragma once
#include "base_library.h"
#include "game_def.h"
#include "game_req.h"
#include "proto/gamereq.pb.h"
#include "common/utils/utils.h"

#include <boost/asio/io_service.hpp>

#include "boost/date_time/posix_time/posix_time.hpp"
#include "boost/asio/deadline_timer.hpp"

#include "player.h"


class GameServer;
class Room : public std::enable_shared_from_this<Room>
{
public:
    using Ptr = std::shared_ptr<Room>;
    using OpeArray = std::array<uint, TOTAL_PLAYER>;

private:
    Room(uint room_id, boost::asio::io_service& service, GameServer* server);

public:
    ~Room();

    static Ptr CreateRoom(boost::asio::io_service& service, GameServer* server);

    void ResetRoom();
    void SetPlayer(PlayerInfo& player_info);
    void RemovePlayer(uint player_no);
    PlayerInfo* GetPlayerInfoByID(uint user_id);
    PlayerInfo* GetPlayerInfoByNO(uint player_no);

    void ResetGameFrameInfo();

    void SetPlayerOpeCode(uint player_no, uint code);

	void StartGameFrameTimer();
	void StopGameFrameTimer();
    void StartGameFrameTimer(time_t t);

    //属性
	uint GetRoomID();
	uint GetFrameNO();
	void NextFrameNO();
    void SetRoomStatus(uint status);
    uint GetRoomStatus();
	void SetMenuIndex(uint value);
	uint GetMenuIndex();
	void SetGameMode(uint mode);
	uint GetGameMode();

	template <typename T>
    void NotifyRoomPlayer(google::protobuf::uint32 request_id, const T& proto_data, uint exclude_userid = 0);

    static bool IsRoomNOValid(uint room_id);

protected:
    void OnGameFrameSync();

protected:
    static bool GenerateRoomID(uint &room_id);
    static void ReturnRoomID(uint room_id);

public:
    std::mutex mtx_;

private:
    GameServer* game_server_;

    uint room_id_;
    PlayerInfo player_info_[TOTAL_PLAYER];

    std::unordered_map<uint, uint> frame_ope_;
    std::vector<OpeArray> frame_ope_record_;//每帧操作

    boost::asio::deadline_timer frame_timer_;
    time_t frame_start_time_;

    uint frame_no_;//帧编号

    uint status_;//房间状态
    uint menu_index_;//菜单值
    uint game_mode_;//游戏模式
private:
    static std::mutex id_generator_mtx_;
    static myutils::IDGenerator<uint> id_generator_;
};

inline void Room::SetPlayer(PlayerInfo& player_info)
{
    if (player_info.number >= 0 && player_info.number < TOTAL_PLAYER)
    {
        //std::lock_guard<std::mutex> lock(mtx_);
        player_info_[player_info.number] = player_info;
    }
}

inline void Room::RemovePlayer(uint player_no)
{
    if (player_no >= 0 && player_no < TOTAL_PLAYER)
    {
        //std::lock_guard<std::mutex> lock(mtx_);
        player_info_[player_no].Reset();
    }
}

inline PlayerInfo* Room::GetPlayerInfoByNO(uint player_no)
{
	if (player_no >= 0 && player_no < TOTAL_PLAYER && player_info_[player_no].user_id > 0)
	{
        return &player_info_[player_no];
	}
    return nullptr;
}

inline uint Room::GetRoomID()
{
    //std::lock_guard<std::mutex> lock(mtx_);
    return room_id_;
}

inline uint Room::GetFrameNO()
{
    return frame_no_;
}

inline void Room::NextFrameNO()
{
	//暂不考虑帧数超出精度的情况
	frame_no_++;
}

inline bool Room::IsRoomNOValid(uint room_id)
{
    std::lock_guard<std::mutex> lock(id_generator_mtx_);
    return id_generator_.IsValidID(room_id);
}

inline bool Room::GenerateRoomID(uint& room_id)
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

inline void Room::ReturnRoomID(uint room_id)
{
    std::lock_guard<std::mutex> lock(id_generator_mtx_);
    id_generator_.ReturnOneID(room_id);
}

template <typename T>
void Room::NotifyRoomPlayer(google::protobuf::uint32 request_id, const T& proto_data, uint exclude_userid)
{
	for (auto p : player_info_)
	{
		if (p.user_id > 0 && p.user_id != exclude_userid)
		{
			game_server_->NotifyPlayer(p.user_id, request_id, proto_data);
		}
	}
}

inline void Room::SetPlayerOpeCode(uint player_no, uint code)
{
    frame_ope_[player_no] = code;
}

inline void Room::SetRoomStatus(uint status)
{
    status_ = status;
}

inline uint Room::GetRoomStatus()
{
    return status_;
}

inline void Room::SetMenuIndex(uint value)
{
	menu_index_ = value;
}

inline uint Room::GetMenuIndex()
{
	return menu_index_;
}

inline void Room::SetGameMode(uint mode)
{
	game_mode_ = mode;
}

inline uint Room::GetGameMode()
{
	return game_mode_;
}

inline void Room::StartGameFrameTimer(time_t t)
{
    frame_start_time_ = t;
    StartGameFrameTimer();
}