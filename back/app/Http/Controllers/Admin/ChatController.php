<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\ChatMessage;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        // Parties "en cours" = started
        $runningParties = Game::query()
            ->where('status', 'started')
            ->orderByDesc('started_at')
            ->get();

        // Autres parties = waiting + finished (ou autre)
        $otherParties = Game::query()
            ->where('status', '!=', 'started')
            ->orderByDesc('created_at')
            ->get();

        return view('admin.chat.index', [
            'runningParties' => $runningParties,
            'otherParties' => $otherParties,
            'selectedGame' => null,
            'messages' => collect(),
        ]);
    }

    public function show(Game $game)
    {
        $runningParties = Game::query()
            ->where('status', 'started')
            ->orderByDesc('started_at')
            ->get();

        $otherParties = Game::query()
            ->where('status', '!=', 'started')
            ->orderByDesc('created_at')
            ->get();

        $messages = ChatMessage::query()
            ->where('game_id', $game->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return view('admin.chat.index', [
            'runningParties' => $runningParties,
            'otherParties' => $otherParties,
            'selectedGame' => $game,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, Game $game)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:500'],
        ]);

        ChatMessage::create([
            'game_id' => $game->id,
            'sender' => 'admin',
            'content' => $validated['content'],
        ]);

        return redirect()
            ->route('admin.chat.show', $game)
            ->with('success', 'Message envoyé.');
    }
}
