<?php

namespace App\Services;

use App\Models\Game;
use Illuminate\Support\Str;

class GameCodeGenerator
{
    public static function generate(): string
    {
        do {
            $code = Str::upper(Str::random(6));
        } while (Game::where('code', $code)->exists());

        return $code;
    }
}
