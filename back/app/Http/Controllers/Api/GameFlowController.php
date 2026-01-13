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

            $players = $game->players()->get()->shuffle()->values();

            // 1️⃣ Attribution des imposteurs (2 aléatoires)
            $impostors = $players->take(2)->pluck('id')->toArray();

            // 2️⃣ Définition des rôles fonctionnels
            $roles = collect([
                'communicant', //Impostor 1
                'communicant',
                'navigateur', //Impostor 2
                'developpeur',
                'cadreur',
                'cadreur',
            ])->shuffle()->values();

            // 3️⃣ Attribution finale
            foreach ($players as $index => $player) {
                $player->impostor = in_array($player->id, $impostors);
                $player->role = $roles[$index];
                $player->save();
            }

            // 4️⃣ Démarrage de la partie
            $game->status = 'started';
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


    public function log(Request $request, string $code)
    {
        $game = Game::where('code', $code)->first();

        if (!$game) {
            return response()->json([
                'message' => 'GAME_NOT_FOUND'
            ], 404);
        }

        if (!in_array($game->status, ['waiting', 'started'])) {
            return response()->json([
                'message' => 'GAME_NOT_ACCESSIBLE',
                'status' => $game->status,
            ], 403);
        }

        return response()
            ->json([
                'message' => 'GAME_LOGGED',
                'game' => [
                    'status' => $game->status,
                ],
            ])
            ->cookie(
                'game_cookie',
                $game->token,
                300,
                '/',
                null,
                false,         // Secure (HTTPS)
                true,         // HttpOnly
                false,
                'Lax'
            );
    }

    public function getLogSession(Request $request)
    {
        $token = $request->cookie('game_cookie');

        if (!$token) {
            return response()->json([
                'game' => null,
                'reason' => 'NO_GAME_LOGGED'
            ], 200);
        }

        $game = Game::where('token', $token)->first();

        if (!$game) {
            return response()->json([
                'game' => null,
                'reason' => 'GAME_NOT_FOUND'
            ], 200);
        }

        return response()->json([
            'game' => [
                'code' => $game->code,
                'status' => $game->status,
            ],
        ]);
    }
}
