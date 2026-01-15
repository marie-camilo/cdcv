<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MessageSent implements ShouldBroadcastNow
{
    public function __construct(public ChatMessage $message) {}

    public function broadcastOn(): Channel
    {
        return new Channel('chat.game.' . $this->message->game_id);
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'game_id' => $this->message->game_id,
            'sender' => $this->message->sender,
            'channel' => $this->message->channel,
            'content' => $this->message->content,
            'time' => $this->message->created_at->format('H:i'),
        ];
    }
}
