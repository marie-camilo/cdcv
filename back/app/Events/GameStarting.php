<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameStarting implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $gameCode;
    public int $startingAt;

    /**
     * @param string $gameCode
     * @param int $startingAt Timestamp UNIX (secondes)
     */
    public function __construct(string $gameCode, int $startingAt)
    {
        $this->gameCode = $gameCode;
        $this->startingAt = $startingAt;
    }

    /**
     * Nom de l’event côté Pusher
     */
    public function broadcastAs(): string
    {
        return 'GameStarting';
    }

    /**
     * Canal de diffusion
     */
    public function broadcastOn(): Channel
    {
        return new Channel('game.' . $this->gameCode);
    }

    /**
     * Données envoyées aux clients
     */
    public function broadcastWith(): array
    {
        return [
            'startingAt' => $this->startingAt
        ];
    }
}
