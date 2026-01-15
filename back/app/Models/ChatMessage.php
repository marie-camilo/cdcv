<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'game_id',
        'sender',
        'content',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
