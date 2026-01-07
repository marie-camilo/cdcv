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

        abort_if($game->status !== 'waiting', 403);
        abort_if($game->players()->count() >= 6, 403);

        $player = $game->players()->create([
            'name' => $request->name,
            'token' => Str::uuid()
        ]);

        return response()->json([
            'token' => $player->token
        ], 201);
    }

}
