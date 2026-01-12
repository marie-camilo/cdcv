<?php

namespace App\Http\Controllers\Api;

use App\Events\LobbyUpdated;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cookie;

class PlayerController extends Controller
{
    public function store(Request $request, string $code)
    {
        $request->validate([
            'name' => 'required|string|max:20'
        ]);

        $game = Game::where('code', $code)->firstOrFail();

        if ($game->status !== 'waiting') {
            return response()->json([
                'error' => 'GAME_NOT_JOINABLE',
                'message' => 'La partie a déjà commencé ou est terminée.'
            ], 403);
        }

        if ($game->players()->count() >= 6) {
            return response()->json([
                'error' => 'GAME_FULL',
                'message' => 'La partie est complète.'
            ], 403);
        }

        if ($game->players()->where('name', $request->name)->exists()) {
            return response()->json([
                'error' => 'PLAYER_ALREADY_EXISTS'
            ], 409);
        }

        $player = $game->players()->create([
            'name' => $request->name,
            'token' => Str::uuid()
        ]);

        event(new LobbyUpdated($game->code));

        return response()
            ->json([
                'success' => true
            ], 201)
            ->cookie(
                'game_token',
                $player->token,
                60 * 24 * 7,   // 7 jours
                '/',
                null,
                false,         // Secure (HTTPS)
                true,         // HttpOnly
                false,
                'Lax'
            );
    }

    public function role(Request $request)
    {
        $token = $request->cookie('game_token');

        if (!$token) {
            return response()->json([
                'error' => 'UNAUTHORIZED'
            ], 401);
        }

        $player = Player::where('token', $token)->first();

        if (!$player || !$player->role) {
            return response()->json([
                'error' => 'ROLE_NOT_ASSIGNED'
            ], 404);
        }

        return response()->json([
            'role' => $player->role
        ]);
    }

    public function session(Request $request)
    {
        $token = $request->cookie('game_token');

        if (!$token) {
            return response()->json([
                'authenticated' => false,
                'reason' => 'NO_COOKIE'
            ], 200);
        }

        $player = Player::where('token', $token)->first();

        if (!$player) {
            return response()->json([
                'authenticated' => false,
                'reason' => 'INVALID_TOKEN'
            ], 200);
        }

        return response()->json([
            'authenticated' => true,
            'player' => [
                'name' => $player->name,
                'game_id' => $player->game_id,
                'role_assigned' => !is_null($player->role)
            ]
        ]);
    }
}

