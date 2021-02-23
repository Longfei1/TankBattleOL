#include "room.h"

std::mutex Room::id_generator_mtx_;
myutils::IDGenerator<int> Room::id_generator_(1, INT_MAX);
Room::Room(int room_id, boost::asio::io_service& service) : room_id_(room_id), frame_timer_(service),
    frame_no_(0)
{
    ResetRoom();
}

Room::~Room()
{
    ReturnRoomID(room_id_);
}

Room::Ptr Room::CreateRoom(boost::asio::io_service& service)
{
    int id;
    if (GenerateRoomID(id))
    {
        return std::shared_ptr<Room>(new Room(id, service));
    }

    return nullptr;
}

void Room::ResetRoom()
{
    //std::lock_guard<std::mutex> lock(mtx_);

    memset(player, 0, sizeof(player));

    frame_timer_.cancel();

    ResetGameFrameInfo();
}

void Room::NextFrameNO()
{
    //帧编号设置为循环模式
    frame_no_++;
    if (frame_no_ >= INT_MAX)
    {
        frame_no_ = 0;
    }
}