<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $activeGames = Game::query()
            ->withCount('players')
            ->where(function ($q) {
                $q->where('status', 'started')
                    ->orWhereHas('players');
            })
            ->orderByRaw("
                CASE
                    WHEN status = 'started' THEN 0
                    ELSE 1
                END
            ")
            ->orderByDesc('started_at')
            ->get()
            ->each(function (Game $game) {

                // started_at raw (pour éviter +1h)
                $rawStartedAt = $game->getRawOriginal('started_at');

                $startedAtParis = $rawStartedAt
                    ? Carbon::createFromFormat('Y-m-d H:i:s', $rawStartedAt, 'Europe/Paris')
                    : null;

                $endsAtParis = $game->status === 'started'
                    ? $startedAtParis?->copy()->addMinutes(60)
                    : null;

                // UI status
                $game->ui_status = match (true) {
                    $game->status === 'started' => 'EN COURS',
                    $game->players_count > 0    => 'DÉMARRAGE',
                    default                     => 'EN ATTENTE',
                };

                // Timer JS
                $game->ends_at_ts = $endsAtParis?->timestamp;

                // Capacité (si besoin)
                $game->capacity = 6;
            });

        return view('admin.dashboard', [
            'activeGames' => $activeGames,
            'pendingMessagesCount' => 0,
        ]);
    }
}
