<?php

namespace App\Http\Controllers\Admin;

use App\Events\MessageSent;
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

    public function show(Request $request, Game $game)
    {
        $channel = $request->query('channel', 'general'); // general ou impostor

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
            ->where('channel', $channel)
            ->orderBy('created_at', 'asc')
            ->get();

        return view('admin.chat.index', [
            'runningParties' => $runningParties,
            'otherParties' => $otherParties,
            'selectedGame' => $game,
            'messages' => $messages,
            'selectedChannel' => $channel,
        ]);
    }

    public function storeAdmin(Request $request, Game $game)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:500'],
            'channel' => ['required', 'in:general,impostor'],
        ]);

        $message = ChatMessage::create([
            'game_id' => $game->id,
            'sender' => 'admin',
            'channel' => $validated['channel'],
            'content' => $validated['content'],
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'success' => true,
            'message' => [
                'id' => $message->id,
                'sender' => $message->sender,
                'channel' => $message->channel,
                'content' => $message->content,
                'time' => $message->created_at->format('H:i'),
            ],
        ]);
    }

    public function storePlayer(Request $request, Game $game)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:500'],
        ]);

        $message = ChatMessage::create([
            'game_id' => $game->id,
            'sender' => 'player',
            'channel' => 'general',
            'content' => $validated['content'],
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'success' => true,
            'message' => [
                'id' => $message->id,
                'sender' => $message->sender,
                'channel' => $message->channel,
                'content' => $message->content,
                'time' => $message->created_at->format('H:i'),
            ],
        ]);
    }

    public function storeImpostor(Request $request, Game $game)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:500'],
        ]);

        $message = ChatMessage::create([
            'game_id' => $game->id,
            'sender' => 'player', // ou 'impostor' si tu veux
            'channel' => 'impostor',
            'content' => $validated['content'],
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'success' => true,
            'message' => [
                'id' => $message->id,
                'sender' => $message->sender,
                'channel' => $message->channel,
                'content' => $message->content,
                'time' => $message->created_at->format('H:i'),
            ],
        ]);
    }

    public function getGameMessages(Request $request, Game $game)
    {
        $channel = $request->query('channel'); // general | impostor | null

        $query = ChatMessage::query()
            ->where('game_id', $game->id);

        if ($channel) {
            $query->where('channel', $channel);
        }

        $messages = $query
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'sender' => $m->sender,
                'channel' => $m->channel,
                'content' => $m->content,
                'time' => $m->created_at->format('H:i'),
            ]);

        return response()->json($messages);
    }



}
