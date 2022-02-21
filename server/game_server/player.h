#pragma once

#include "base_library.h"
#include "game_def.h"

struct PlayerInfo
{
	uint number;//序号
	uint user_id;//用户ID
	bool ready;

	void Reset()
	{
		memset(this, 0, sizeof(*this));
	}
};