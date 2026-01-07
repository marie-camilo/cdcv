<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Services\GameCodeGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GameController extends Controller
{
    public function store()
    {
        $game = Game::create([
            'code' => GameCodeGenerator::generate(),
        ]);

        return response()->json([
            'code' => $game->code,
            'join_url' => url("/join/{$game->code}")
        ], 201);
    }

    public function show(string $code)
    {
        $game = Game::where('code', $code)->firstOrFail();

        return response()->json([
            'players' => $game->players()->pluck('name'),
            'count'   => $game->players()->count(),
            'max'     => 6,
            'status'  => $game->status,
        ]);
    }
}
