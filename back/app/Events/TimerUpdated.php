<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TimerUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $room;

    public function __construct($room)
    {
        $this->room = $room;
    }

    public function broadcastOn()
    {
        return new Channel('talkie-room.' . $this->room->code);
    }

    public function broadcastAs()
    {
        return 'timer-updated';
    }

    public function broadcastWith()
    {
        return [
            'time_remaining' => $this->room->time_remaining
        ];
    }
}
