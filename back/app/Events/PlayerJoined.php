<?php

namespace App\Events;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\Channel;

class PlayerJoined implements ShouldBroadcast
{
    public function __construct(
        public string $gameCode,
        public string $playerName
    ) {}

    public function broadcastAs()
    {
        return 'PlayerJoined';
    }

    public function broadcastOn()
    {
        return new Channel('game.' . $this->gameCode);
    }
}
