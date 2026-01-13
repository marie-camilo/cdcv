<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game; // Import du modèle Game
use Illuminate\Support\Facades\Storage;

class AudioController extends Controller
{
    public function upload(Request $request) {
        // 1. On récupère le token dans le cookie
        $token = $request->cookie('game_cookie');

        if (!$token) {
            return response()->json([
                'game' => null,
                'reason' => 'NO_GAME_LOGGED'
            ], 200);
        }

        // 2. On cherche la partie correspondante
        $game = Game::where('token', $token)->first();

        if (!$game) {
            return response()->json([
                'game' => null,
                'reason' => 'GAME_NOT_FOUND'
            ], 200);
        }

        // 3. Vérification si un fichier est présent
        if ($request->hasFile('audio')) {
            // On utilise l'ID ou le token du game pour créer un sous-dossier unique
            // Cela évite que les groupes n'entendent les canards des autres.
            $folderName = "talkie/" . $game->token;

            // store() crée automatiquement le dossier s'il n'existe pas
            $path = $request->file('audio')->store($folderName, 'public');

            return response()->json([
                'url' => asset('storage/' . $path),
                'filename' => basename($path),
                'status' => 'success'
            ]);
        }

        return response()->json(['error' => 'No audio received'], 400);
    }
}
