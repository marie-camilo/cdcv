<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PlayerController extends Controller
{
    public function store(Request $request, $code): \Illuminate\Http\JsonResponse
    {
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

        $player = $game->players()->create([
            'name' => $request->name,
            'token' => Str::uuid()
        ]);

        return response()->json([
            'token' => $player->token
        ], 201);
    }

}
