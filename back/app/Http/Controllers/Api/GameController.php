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
        if (Game::count() >= 10) {
            return response()->json([
                'message' => 'Nombre maximum de parties atteint'
            ], 405);
        }

        $game = Game::create([
            'code' => GameCodeGenerator::generate(),
        ]);

        return response()->json([
            'code' => $game->code,
            'join_url' => url("/games/{$game->code}/players")
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

    public function showAll()
    {
        return response()->json([
            'count' => Game::count(),
            'games' => Game::withCount('players')->get()->map(function ($game) {
                return [
                    'code'    => $game->code,
                    'status'  => $game->status,
                    'players' => $game->players_count,
                    'created' => $game->created_at,
                ];
            })
        ]);
    }
}
