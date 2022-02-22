#include "room.h"
#include "common/log/log.h"
#include "game_server.h"

const uint kFrameInterval = 1000 / GAME_FRAMES_NUM;

std::mutex Room::id_generator_mtx_;
myutils::IDGenerator<uint> Room::id_generator_(1, UINT_MAX);
Room::Room(uint room_id, boost::asio::io_service& service, GameServer* server) : game_server_(server), 
	room_id_(room_id),frame_timer_(service), frame_start_time_(0), frame_running_(false), frame_no_(0),
	status_(0), menu_index_(0), game_mode_(0)
{
    ResetRoom();
}

Room::~Room()
{
    ReturnRoomID(room_id_);
}

Room::Ptr Room::CreateRoom(boost::asio::io_service& service, GameServer* server)
{
    uint id;
    if (GenerateRoomID(id))
    {
        return std::shared_ptr<Room>(new Room(id, service, server));
    }

    return nullptr;
}

void Room::ResetRoom()
{
    //std::lock_guard<std::mutex> lock(mtx_);

	for (uint i = 0; i < TOTAL_PLAYER; i++)
	{
		player_info_[i].Reset();
	}

	StopGameFrameTimer();

	status_ = 0;
	menu_index_ = 0;
	game_mode_ = 0;
}

PlayerInfo* Room::GetPlayerInfoByID(uint user_id)
{
	for (uint i = 0; i < TOTAL_PLAYER; i++)
	{
		if (player_info_[i].user_id == user_id)
		{
			return &player_info_[i];
		}
	}
	return nullptr;
}

void Room::ResetGameFrameInfo()
{
	frame_no_ = 0;

	frame_ope_.clear();
	frame_ope_record_.clear();
}

void Room::StartGameFrameTimer()
{
    auto room_ptr = shared_from_this();

	frame_timer_.expires_from_now(boost::posix_time::millisec(kFrameInterval));
    frame_timer_.async_wait([this, room_ptr](boost::system::error_code error)
		{
			if (!error)
			{
				std::lock_guard<std::mutex> lock(room_ptr->mtx_);
				room_ptr->OnGameFrameSync();
			}
			else if (error != boost::system::errc::operation_canceled)
			{
				LOG_ERROR("StartGameFrameTimer error, roomid(%d)", room_ptr->GetRoomID());
			}
		});
}

void Room::StopGameFrameTimer()
{
	frame_timer_.cancel();

	frame_start_time_ = 0;
	frame_running_ = false;
	ResetGameFrameInfo();
}

void Room::OnGameFrameSync()
{
	if (!frame_running_)
	{
		return;
	}

	auto frameno = GetFrameNO();
	if (frameno != 0 || frame_ope_.size() == TOTAL_PLAYER
		|| time(nullptr) - frame_start_time_ > FRAME_TIMEOUT_TIME)
	{
		gamereq::GameFrameNtf current_frame;
		current_frame.set_frame(frameno);

		OpeArray record{};
		record.fill(0);

		//写入当前帧所有玩家操作
		for (auto& it : frame_ope_)
		{
			auto ope = current_frame.add_useropes();
			ope->set_playerno(it.first);
			ope->set_opecode(it.second);

			record[it.first] = it.second;
		}

		//下发游戏帧
		NotifyRoomPlayer(GR_GAME_FRAME, current_frame);

		frame_ope_.clear();
		frame_ope_record_.push_back(record);
		NextFrameNO();
	}

	//开启下一帧定时器
	StartGameFrameTimer();
}