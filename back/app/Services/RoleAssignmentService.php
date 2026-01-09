<?php

use App\Models\Game;

class RoleAssignmentService
{
    public function assign(Game $game): void
    {
        DB::transaction(function () use ($game) {

            $players = $game->players()->lockForUpdate()->get()->shuffle();

            $players->take(2)->each->update(['role' => 'impostor']);
            $players->skip(2)->each->update(['role' => 'crewmate']);

            $game->update(['status' => 'started']);
        });
    }
}
