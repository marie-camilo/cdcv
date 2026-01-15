<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Labyrinth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Events\GameStarting;

class GameFlowController extends Controller
{
    public function start(string $code)
    {
        abort_unless(Auth::check() && Auth::user()->isAdmin(), 403);

        $game = Game::where('code', $code)->firstOrFail();

        // 🔒 Sécurité
        if ($game->status !== 'waiting') {
            return redirect()
                ->route('admin.games.show', $game)
                ->with('error', "Impossible : la partie est déjà démarrée.");
        }

        if ($game->players()->count() !== 6) {
            return redirect()
                ->route('admin.games.show', $game)
                ->with('error', "Impossible : il faut exactement 6 joueurs.");
        }

        DB::transaction(function () use ($game) {

            $players = $game->players()->get()->shuffle()->values();

            $impostors = $players->take(2);
            $crewmates = $players->slice(2)->values();

            $impostorRoles = collect([
                'communicant',
                'navigateur',
            ])->shuffle()->values();

            $crewRoles = collect([
                'communicant',
                'developpeur',
                'cadreur',
                'cadreur',
            ])->shuffle()->values();

            foreach ($impostors as $index => $player) {
                $player->impostor = true;
                $player->role = $impostorRoles[$index];
                $player->save();
            }

            foreach ($crewmates as $index => $player) {
                $player->impostor = false;
                $player->role = $crewRoles[$index];
                $player->save();
            }

            $now = now();

            $game->status = 'started';
            $game->step = 1;
            $game->started_at = $now;
            $game->ending_at = $now->copy()->addHour();

            $game->save();
        });

        event(new GameStarting(
            $game->code,
            now()->timestamp
        ));

        return redirect()
            ->route('admin.games.show', $game)
            ->with('success', "Partie démarrée.");
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

    public function postGameCodeForLabyrinth(string $code)
    {
        $labyrinth = Labyrinth::findOrFail(1);

        $labyrinth->update([
            'code' => $code
        ]);

        return response()->json([
            'code' => $labyrinth->code
        ]);
    }

    public function getGameCodeForLabyrinth()
    {
        $labyrinth = Labyrinth::findOrFail(1);


        return response()->json([
            'code' => $labyrinth->code
        ]);
    }
}
