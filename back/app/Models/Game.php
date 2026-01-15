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
        'ending_at' => 'datetime',
    ];

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function getStepLabelAttribute(): string
    {
        return match ((int) $this->step) {
            0 => 'En attente',
            1 => 'Énigme 1 - Départ',
            2 => 'Boîte à outils déverrouillée',
            3 => 'Énigme 2 - Foyer',
            4 => 'Énigme 3 - Labyrinth',
            5 => 'Énigme 4 - Boussole',
            6 => 'Énigme 5 - Énigme finale',
            7 => 'Partie terminée',
            default => 'Étape inconnue',
        };
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }
}
