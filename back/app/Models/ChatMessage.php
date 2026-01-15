<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'game_id',
        'sender',
        'channel',
        'content',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
