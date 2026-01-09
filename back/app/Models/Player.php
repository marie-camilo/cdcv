<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $fillable = ['name', 'game_id', 'role', 'token'];

    protected $hidden = ['role', 'token'];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}

