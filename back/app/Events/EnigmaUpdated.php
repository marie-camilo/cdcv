<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EnigmaUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $gameCode;
    public $payload;

    public function __construct($gameCode, $payload)
    {
        $this->gameCode = $gameCode;
        $this->payload = $payload;
    }

    public function broadcastOn()
    {
        return new Channel('game.' . $this->gameCode);
    }

    // AJOUTE CECI pour que le Front puisse faire : channel.bind('EnigmaUpdated', ...)
    public function broadcastAs()
    {
        return 'EnigmaUpdated';
    }
}
