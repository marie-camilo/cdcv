<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VideoTriggered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $gameCode;
    public $videoId;

    public function __construct($gameCode, $videoId = 'foyer')
    {
        $this->gameCode = $gameCode;
        $this->videoId = $videoId;
    }

    public function broadcastOn()
    {
        return new Channel('game.' . $this->gameCode);
    }

    public function broadcastAs()
    {
        return 'VideoTriggered';
    }
}
