<?php

namespace App\Http\Controllers\Api;

use App\Events\AudioMessageSent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Player;
use App\Models\AudioMessage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AudioController extends Controller
{
    public function index(Request $request)
    {
        // 1) Game via cookie
        $gameToken = $request->cookie('game_cookie');

        if (!$gameToken) {
            return response()->json([
                'reason' => 'NO_GAME_LOGGED'
            ], 401);
        }

        $game = Game::where('token', $gameToken)->first();

        if (!$game) {
            return response()->json([
                'reason' => 'GAME_NOT_FOUND'
            ], 404);
        }

        // 2) Player via cookie (optionnel mais utile pour vérifier l'accès)
        $playerToken = $request->cookie('player_cookie');

        if (!$playerToken) {
            return response()->json([
                'reason' => 'NO_PLAYER_LOGGED'
            ], 401);
        }

        $player = Player::where('token', $playerToken)
            ->where('game_id', $game->id)
            ->first();

        if (!$player) {
            return response()->json([
                'reason' => 'PLAYER_NOT_FOUND'
            ], 404);
        }

        // 3) Messages
        $messages = AudioMessage::where('game_id', $game->id)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'url' => asset('storage/' . $m->file_path),
                'senderPlayerId' => $m->player_id,
                'createdAt' => $m->created_at,
            ]);

        return response()->json([
            'status' => 'success',
            'messages' => $messages
        ]);
    }

    public function upload(Request $request)
    {
        $gameToken = $request->cookie('game_cookie');
        if (!$gameToken) {
            return response()->json(['reason' => 'NO_GAME_LOGGED'], 401);
        }

        $game = Game::where('token', $gameToken)->first();
        if (!$game) {
            return response()->json(['reason' => 'GAME_NOT_FOUND'], 404);
        }

        $playerToken = $request->cookie('player_cookie');
        if (!$playerToken) {
            return response()->json(['reason' => 'NO_PLAYER_LOGGED'], 401);
        }

        $player = Player::where('token', $playerToken)
            ->where('game_id', $game->id)
            ->first();

        if (!$player) {
            return response()->json(['reason' => 'PLAYER_NOT_FOUND'], 404);
        }

        if ($player->role !== 'communicant') {
            return response()->json([
                'reason' => 'FORBIDDEN_ROLE',
                'message' => 'Vous n’êtes pas autorisé à transmettre.'
            ], 403);
        }

        if (!$request->hasFile('audio')) {
            return response()->json(['error' => 'No audio received'], 400);
        }

        $file = $request->file('audio');

        $extension = $file->getClientOriginalExtension() ?: 'webm';
        $gameFolder = $game->code ?? $game->token;
        $folderName = "talkie/" . $gameFolder;

        // 1) Création DB
        $message = AudioMessage::create([
            'game_id' => $game->id,
            'player_id' => $player->id,
            'file_path' => '__pending__',
            'mime_type' => $file->getMimeType(),
        ]);

        try {
            // 2) Stockage fichier
            $filename = "audio_" . $message->id . "." . $extension;
            $path = $file->storeAs($folderName, $filename, 'public');

            // 3) Update DB
            $message->update(['file_path' => $path]);

            $payload = [
                'id' => $message->id,
                'url' => asset('storage/' . $path),
                'filename' => $filename,
                'senderPlayerId' => $player->id,
                'createdAt' => $message->created_at->toISOString(),
            ];

            event(new AudioMessageSent($game->code, $payload));

            return response()->json([
                'status' => 'success',
                ...$payload
            ]);
        } catch (\Throwable $e) {
            // rollback logique : on supprime la ligne sale
            $message->delete();

            return response()->json([
                'status' => 'error',
                'reason' => 'UPLOAD_FAILED'
            ], 500);
        }
    }

    public function resetByCode(string $code)
    {
        abort_unless(Auth::check() && Auth::user()->isAdmin(), 403);

        $game = Game::where('code', $code)->first();

        if (!$game) {
            return response()->json([
                'reason' => 'GAME_NOT_FOUND'
            ], 404);
        }

        // 1) Récupère les messages
        $messages = AudioMessage::where('game_id', $game->id)->get();

        // 2) Supprime les fichiers
        foreach ($messages as $msg) {
            if ($msg->file_path && Storage::disk('public')->exists($msg->file_path)) {
                Storage::disk('public')->delete($msg->file_path);
            }
        }

        // 3) Supprime DB
        AudioMessage::where('game_id', $game->id)->delete();

        // 4) Supprime le dossier talkie/{code}
        $folderName = "talkie/" . $game->code;
        if (Storage::disk('public')->exists($folderName)) {
            Storage::disk('public')->deleteDirectory($folderName);
        }

        return redirect()
            ->route('admin.games.show', $game)
            ->with('success', "Messages audios réinitialisés.");
    }
}
