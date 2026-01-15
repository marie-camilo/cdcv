<?php

namespace App\Http\Controllers\Api;

use App\Events\LobbyUpdated;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                'player_cookie',
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
        $token = $request->cookie('player_cookie');

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
            'role' => $player->role,
            'impostor' => (bool) $player->impostor
        ]);
    }

    public function getPlayerCookie(Request $request)
    {
        $token = $request->cookie('player_cookie');

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

        $player->load('game');

        return response()->json([
            'authenticated' => true,
            'player' => [
                'id' => $player->id,
                'name' => $player->name,
                'game_id' => $player->game_id,
                'game_code' => $player->game->code ?? null,
                'role_assigned' => !is_null($player->role)
            ]
        ]);
    }

    public function update(Request $request, Game $game, Player $player)
    {
        abort_unless(Auth::check() && Auth::user()->isAdmin(), 403);

        // sécurité : empêche d'éditer un joueur d'une autre partie
        abort_unless($player->game_id === $game->id, 404);

        // sécurité : pas modifiable si la partie a commencé
        if ($game->status !== 'waiting') {
            return back()->with('error', 'Impossible de modifier un joueur : la partie est déjà commencée.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:50'],
        ]);

        $player->update([
            'name' => $validated['name'],
        ]);

        return back()->with('success', 'Nom du joueur mis à jour.');
    }

    public function destroy(Game $game, Player $player)
    {
        abort_unless(Auth::check() && Auth::user()->isAdmin(), 403);

        // sécurité : empêche de supprimer un joueur d'une autre partie
        abort_unless($player->game_id === $game->id, 404);

        // sécurité : pas supprimable si la partie a commencé
        if ($game->status !== 'waiting') {
            return back()->with('error', 'Impossible de supprimer un joueur : la partie est déjà commencée.');
        }

        $player->delete();

        return back()->with('success', 'Joueur supprimé.');
    }
}

