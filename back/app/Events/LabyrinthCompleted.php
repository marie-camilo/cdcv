<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LabyrinthCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $gameCode;
    public $newEndingAtMs;
    public $malusMinutes;
    public $finalCode;

    public function __construct($gameCode, $newEndingAtMs, $malusMinutes, $finalCode)
    {
        $this->gameCode = $gameCode;
        $this->newEndingAtMs = $newEndingAtMs;
        $this->malusMinutes = $malusMinutes;
        $this->finalCode = $finalCode;
    }

    public function broadcastOn()
    {
        return new Channel("game.{$this->gameCode}");
    }

    public function broadcastAs()
    {
        return 'LabyrinthCompleted';
    }

    public function broadcastWith()
    {
        return [
            'new_ending_at_ms' => $this->newEndingAtMs,
            'malus_minutes' => $this->malusMinutes,
            'final_code' => $this->finalCode,
        ];
    }
}
