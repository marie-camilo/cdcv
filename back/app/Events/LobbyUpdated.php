<?php

namespace App\Events;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Broadcasting\Channel;

class LobbyUpdated implements ShouldBroadcastNow
{
    public bool $afterCommit = true;

    public function __construct(public string $gameCode) {}

    public function broadcastOn()
    {
        return new Channel('game.' . $this->gameCode);
    }

    public function broadcastAs()
    {
        return 'LobbyUpdated';
    }
}
