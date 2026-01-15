<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\AudioController;
use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\Game;
use App\Models\Labyrinth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $query = Game::query()->withCount('players');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('q')) {
            $search = $request->q;

            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('id', $search);
            });
        }

        $games = $query
            ->orderByRaw("
            CASE
                WHEN status = 'started' THEN 0
                WHEN status = 'pending' THEN 1
                ELSE 2
            END
        ")
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        // ✅ ui_status par game
        $games->getCollection()->transform(function ($game) {
            $game->ui_status = match (true) {
                $game->status === 'started' => 'EN COURS',
                $game->players_count > 0    => 'DÉMARRAGE',
                default                     => 'EN ATTENTE',
            };

            return $game;
        });

        $gamesCount = Game::count();

        return view('admin.games.index', [
            'games' => $games,
            'gamesCount' => $gamesCount,
        ]);
    }


    public function show(Game $game)
    {
        $game->loadCount('players');
        $game->load(['players' => function ($q) {
            $q->orderByDesc('created_at');
        }]);

        $endsAtTs = null;

        if ($game->status === 'started' && $game->started_at) {
            $endsAtTs = $game->started_at->copy()->addMinutes(60)->timestamp;
        }


        // Badge de statut UI
        $uiStatus = match (true) {
            $game->status === 'started' => 'EN COURS',
            $game->players_count > 0 => 'DÉMARRAGE',
            default => 'EN ATTENTE',
        };

        $game->ui_status = $uiStatus;

        return view('admin.games.show', [
            'game' => $game,
            'endsAtTs' => $endsAtTs,
        ]);
    }

    public function initLabyrinth(Game $game)
    {
        $labyrinth = Labyrinth::findOrFail(1);

        $labyrinth->update([
            'code' => $game->code
        ]);


        return redirect()
            ->route('admin.games.show', $game)
            ->with('success', "Labyrinth initialisé pour la partie {$game->code}.");
    }

    public function reset(string $code, AudioController $audioController)
    {
        $game = Game::query()
            ->where('code', $code)
            ->firstOrFail();

        DB::transaction(function () use ($game) {

            // 1) Supprimer les joueurs
            $game->players()->delete();

            // 2) Supprimer les messages du chat de cette partie
            ChatMessage::query()
                ->where('game_id', $game->id)
                ->delete();

            // 3) Reset de la game
            $game->forceFill([
                'status'     => 'waiting',
                'step'       => 0,
                'started_at' => null,
                'ending_at'  => null,
            ])->save();
        });

        try {
            $audioController->resetByCode($game->code);
        } catch (\Exception $e) {
            return redirect()
                ->route('admin.games.show', $game)
                ->with('error', "Partie réinitialisée, mais échec de la réinitialisation des audios : {$e->getMessage()}");
        }

        return redirect()
            ->route('admin.games.show', $game)
            ->with('success', 'Partie réinitialisée.');
    }
}
