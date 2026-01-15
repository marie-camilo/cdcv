<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $fillable = [
        'name',
        'game_id',
        'role',
        'impostor',
        'token',
    ];

    protected $hidden = [
        'token',
    ];

    protected $casts = [
        'impostor' => 'boolean',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function scopeForGame($query, int $gameId)
    {
        return $query->where('game_id', $gameId);
    }

    public function canBeEdited(): bool
    {
        return $this->game?->status === 'waiting';
    }
}
