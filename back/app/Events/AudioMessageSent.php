<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class AudioMessageSent implements ShouldBroadcastNow
{
    use SerializesModels;

    public string $gameCode;
    public array $message;

    public function __construct(string $gameCode, array $message)
    {
        $this->gameCode = $gameCode;
        $this->message = $message;
    }

    public function broadcastOn(): Channel
    {
        return new Channel("game.{$this->gameCode}");
    }

    public function broadcastAs(): string
    {
        return "AudioMessageSent";
    }

    // ✅ CECI est la clé : payload envoyé à Pusher
    public function broadcastWith(): array
    {
        return $this->message;
    }
}
