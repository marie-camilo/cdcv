<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameStreamController extends Controller
{
    public function stream(Request $request, string $code)
    {
        ini_set('output_buffering', 'off');
        ini_set('zlib.output_compression', false);
        while (ob_get_level() > 0) {
            ob_end_flush();
        }

        return response()->stream(function () use ($code) {

            echo "retry: 1000\n\n";
            flush();

            while (true) {
                $game = Game::where('code', $code)->first();

                if (!$game) {
                    echo "event: error\n";
                    echo "data: Game not found\n\n";
                    flush();
                    break;
                }

                echo "data: " . json_encode([
                        'players' => $game->players()->pluck('name'),
                        'count'   => $game->players()->count(),
                        'max'     => 6,
                        'status'  => $game->status,
                    ]) . "\n\n";

                flush();
                sleep(1);
            }

        }, 200, [
            'Content-Type'                => 'text/event-stream',
            'Cache-Control'               => 'no-cache',
            'Connection'                  => 'keep-alive',
            'Access-Control-Allow-Origin' => 'http://localhost:3000',
        ]);
    }
}
