<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameStarting implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $gameCode;
    public int $endingAtMs; // ✅ CHANGÉ : on envoie ending_at, pas starting_at

    /**
     * @param string $gameCode
     * @param int $endingAtMs Timestamp UNIX en MILLISECONDES
     */
    public function __construct(string $gameCode, int $endingAtMs)
    {
        $this->gameCode = $gameCode;
        $this->endingAtMs = $endingAtMs; // ✅ CHANGÉ
    }

    /**
     * Nom de l'event côté Pusher
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
            'ending_at_ms' => $this->endingAtMs // ✅ CHANGÉ : ending_at_ms au lieu de startingAt
        ];
    }
}
