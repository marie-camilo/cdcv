<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
// Importation indispensable pour le "Now"
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppUnlocked implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $gameCode;
    public $appId;

    /**
     * @param string $gameCode Le code du lobby (ex: ABCD)
     * @param string $appId L'ID de l'app à débloquer (ex: 'scan', 'puzzle')
     */
    public function __construct($gameCode, $appId)
    {
        $this->gameCode = $gameCode;
        $this->appId = $appId;
    }

    /**
     * Canal sur lequel diffuser (Public ici pour simplifier)
     */
    public function broadcastOn()
    {
        return new Channel('game.' . $this->gameCode);
    }

    /**
     * Nom de l'événement reçu par le Front (optionnel, par défaut c'est le nom de la classe)
     */
    public function broadcastAs()
    {
        return 'AppUnlocked';
    }
}
