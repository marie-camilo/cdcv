<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'code',
        'status',
        'step',
        'started_at',
        'token',
    ];

    protected $hidden = ['token'];

    protected $casts = [
        'started_at' => 'datetime',
    ];

    public function players()
    {
        return $this->hasMany(Player::class);
    }
}
