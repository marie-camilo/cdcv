<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\GameStarting;

class GameFlowController extends Controller
{
    public function start(Request $request, string $code)
    {
//        $token = $request->cookie('game_token');
//
//        if (!$token) {
//            return response()->json(['error' => 'UNAUTHORIZED'], 401);
//        }

        $game = Game::where('code', $code)->firstOrFail();

        // 🔒 Sécurité
        if ($game->status !== 'waiting') {
            return response()->json(['error' => 'GAME_ALREADY_STARTED'], 403);
        }

        if ($game->players()->count() !== 6) {
            return response()->json(['error' => 'INVALID_PLAYER_COUNT'], 403);
        }

        // (Optionnel mais recommandé)
        // vérifier que le token correspond à un admin

        DB::transaction(function () use ($game) {
            $players = $game->players()->get()->shuffle();

            foreach ($players as $index => $player) {
                $player->role = $index < 2 ? 'impostor' : 'crewmate';
                $player->save();
            }

            $game->status = 'starting';
            $game->started_at = now();
            $game->save();
        });

        event(new GameStarting(
            $game->code,
            now()->timestamp
        ));

        return response()->json([
            'success' => true
        ]);
    }

    public function state(string $code)
    {
        $game = Game::where('code', $code)->firstOrFail();

        return response()->json([
            'code' => $game->code,
            'status' => $game->status,
            'started_at' => $game->started_at
        ]);
    }

}
