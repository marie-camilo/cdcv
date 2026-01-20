<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppUnlocked implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $gameCode;
    public $appId;
    public $fileName; // ✅ AJOUT

    /**
     * @param string $gameCode Le code du lobby (ex: ABCD)
     * @param string $appId L'ID de l'app à débloquer (ex: 'scan', 'puzzle')
     * @param string|null $fileName Le nom de fichier pour l'énigme finale (ex: 'mission_foyer_log')
     */
    public function __construct($gameCode, $appId, $fileName = null)
    {
        $this->gameCode = $gameCode;
        $this->appId = $appId;
        $this->fileName = $fileName; // ✅ AJOUT
    }

    /**
     * Canal sur lequel diffuser
     */
    public function broadcastOn()
    {
        return new Channel('game.' . $this->gameCode);
    }

    /**
     * Nom de l'événement reçu par le Front
     */
    public function broadcastAs()
    {
        return 'AppUnlocked';
    }

    /**
     * ✅ AJOUT : Données envoyées au frontend
     */
    public function broadcastWith()
    {
        return [
            'appId' => $this->appId,
            'fileName' => $this->fileName,
        ];
    }
}
