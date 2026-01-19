<?php

namespace App\Http\Controllers\Api;

use App\Events\AppUnlocked;
use App\Events\EnigmaUpdated;
use App\Events\LabyrinthCompleted;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Labyrinth;
use Carbon\Carbon;
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

            $impostorRoles = collect(['communicant', 'navigateur'])->shuffle()->values();
            $crewRoles = collect(['communicant', 'developpeur', 'cadreur', 'cadreur'])->shuffle()->values();

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

        // ✅ MODIF : Broadcast avec ending_at en millisecondes
        $endingAtMs = \Carbon\Carbon::parse($game->ending_at)->timestamp * 1000;

        event(new GameStarting(
            $game->code,
            $endingAtMs // ✅ Passer ending_at_ms au lieu de starting_at
        ));

        return redirect()
            ->route('admin.games.show', $game)
            ->with('success', "Partie démarrée.")
            ->cookie(
                'ending_at',
                $game->ending_at,
                60 * 24 * 7,
                '/',
                null,
                false,
                true,
                false,
                'Lax'
            );
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

    /**
     * Valide une étape et débloque l'application suivante
     */
    public function validateStep(Request $request, string $code)
    {
        try {
            $game = Game::where('code', $code)->firstOrFail();

            if ($game->status !== 'started') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'La partie n\'est pas en cours'
                ], 400);
            }

            // ✅ MODIF : Mapper les steps vers app + fileName
            $stepsToApps = [
                1 => ['appId' => 'scan', 'fileName' => 'mission_foyer_log'],
                2 => ['appId' => 'puzzle', 'fileName' => 'security_bypass_key'],
                3 => ['appId' => 'phone', 'fileName' => 'comm_relay_data'],
                4 => ['appId' => 'boussole', 'fileName' => 'nav_coordinates_log'],
                5 => ['appId' => 'terminal', 'fileName' => 'system_access_token']
            ];

            $currentStep = $game->step;

            if (!isset($stepsToApps[$currentStep])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Toutes les étapes sont déjà validées'
                ], 400);
            }

            $appToUnlock = $stepsToApps[$currentStep]['appId']; // ✅ MODIF
            $fileName = $stepsToApps[$currentStep]['fileName']; // ✅ AJOUT

            if ($game->step > $currentStep) {
                return response()->json([
                    'status' => 'already_validated',
                    'message' => 'Cette étape a déjà été validée',
                    'current_step' => $game->step
                ], 200);
            }

            $game->step = $currentStep + 1;
            $game->save();

            \Log::info("Étape validée", [
                'game_code' => $game->code,
                'old_step' => $currentStep,
                'new_step' => $game->step,
                'unlocked_app' => $appToUnlock,
                'file_name' => $fileName // ✅ AJOUT
            ]);

            // ✅ MODIF : Broadcast avec fileName
            event(new AppUnlocked($game->code, $appToUnlock, $fileName));

            return response()->json([
                'status' => 'success',
                'message' => 'Étape validée pour tout le groupe',
                'next_step' => $game->step,
                'unlocked_app' => $appToUnlock,
                'file_name' => $fileName // ✅ AJOUT
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Partie introuvable'
            ], 404);

        } catch (\Exception $e) {
            \Log::error("Erreur lors de la validation d'étape", [
                'game_code' => $code,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Erreur serveur lors de la validation'
            ], 500);
        }
    }

    public function updateEnigmaState(Request $request, $code)
    {
        // 1. On récupère les infos envoyées par le front (side, index, status, type)
        $payload = $request->validate([
            'side'   => 'required|string',   // 'left' ou 'right'
            'index'  => 'required|integer',  // index de la case (0-7)
            'status' => 'required|string',   // 'busy', 'success' ou 'failed'
            'type'   => 'required|string',   // 'case_update'
        ]);

        // 2. On déclenche la diffusion immédiate à tout le groupe via Pusher
        // Le front recevra exactement ce payload dans son bind('EnigmaUpdated')
        broadcast(new EnigmaUpdated($code, $payload))->toOthers();

        return response()->json(['message' => 'État de l’énigme diffusé']);
    }
    public function unlockApp(Request $request, string $code)
    {
        $request->validate([
            'app_id' => 'required|string',
            'file_name' => 'nullable|string' // ✅ AJOUT
        ]);

        $appId = $request->input('app_id');
        $fileName = $request->input('file_name'); // ✅ AJOUT

        // Diffuser à tout le groupe via Pusher
        event(new AppUnlocked($code, $appId, $fileName)); // ✅ MODIF : ajout du 3e paramètre

        \Log::info("App débloquée", [
            'game_code' => $code,
            'app_id' => $appId,
            'file_name' => $fileName // ✅ AJOUT
        ]);

        return response()->json([
            'status' => 'success',
            'unlocked_app' => $appId,
            'file_name' => $fileName // ✅ AJOUT
        ]);
    }

    public function getCountdown($code)
    {
        $game = Game::where('code', $code)->firstOrFail();

        if ($game->status !== 'started' || !$game->ending_at) {
            return response()->json([
                'message' => 'La partie n\'est pas en cours ou la date de fin est inconnue.'
            ], 400);
        }

        $now = now();
        $endingAt = $game->ending_at;

        $remainingSeconds = max(0, $now->diffInSeconds($endingAt));

        return response()->json([
            'remaining_seconds' => $remainingSeconds
        ]);

    }
    public function triggerVideo(Request $request, string $code)
    {
        $request->validate([
            'video_id' => 'required|string'
        ]);

        broadcast(new \App\Events\VideoTriggered($code, $request->video_id))->toOthers();

        return response()->json(['status' => 'video_triggered']);
    }

    public function initializeLabyrinth(Request $request)
    {
        $request->validate([
            'game_code' => 'required|string|exists:games,code'
        ]);

        $gameCode = $request->input('game_code');

        // Récupérer la ligne unique du labyrinthe
        $labyrinth = Labyrinth::findOrFail(1);

        // Mettre à jour le code
        $labyrinth->code = $gameCode;
        $labyrinth->save();

        \Log::info("Labyrinthe initialisé", ['game_code' => $gameCode]);

        return response()->json([
            'success' => true,
            'message' => 'Labyrinthe initialisé avec succès',
            'game_code' => $gameCode
        ]);
    }

    /**
     * 🎮 LABYRINTHE : Récupérer le game_code
     */
    public function getLabyrinthCode()
    {
        $labyrinth = Labyrinth::findOrFail(1);

        if (!$labyrinth->code) {
            return response()->json([
                'code' => null,
                'message' => 'Aucun code de partie associé au labyrinthe'
            ], 404);
        }

        return response()->json([
            'code' => $labyrinth->code
        ]);
    }

    /**
     * 🎯 LABYRINTHE : Compléter et broadcaster le code final
     */
    public function completeLabyrinth(Request $request)
    {
        $request->validate([
            'game_code' => 'required|string|exists:games,code',
            'exit_direction' => 'required|in:north,east',
            'malus_count' => 'required|integer|min:0'
        ]);

        $gameCode = $request->input('game_code');
        $exitDirection = $request->input('exit_direction');
        $malusCount = $request->input('malus_count');

        // Récupérer la partie
        $game = Game::where('code', $gameCode)->firstOrFail();

        // Vérifier que le labyrinthe n'a pas déjà été complété
        if ($game->labyrinth_exit !== 'none') {
            return response()->json([
                'success' => false,
                'message' => 'Le labyrinthe a déjà été complété'
            ], 400);
        }

        // 🎯 Générer le code final selon la sortie
        $finalCode = $this->generateFinalCode($exitDirection);

        // 📉 Appliquer les malus au timer
        $malusMinutes = $malusCount * 1; // ✅ CHANGÉ : 1 min par malus (au lieu de 5)
        $newEndingAt = Carbon::parse($game->ending_at)->subMinutes($malusMinutes);

        // 💾 Sauvegarder en DB
        $game->ending_at = $newEndingAt;
        $game->labyrinth_exit = $exitDirection;
        $game->labyrinth_malus_count = $malusCount;
        $game->save();

        // 📡 Broadcast à TOUS les joueurs
        event(new LabyrinthCompleted(
            $gameCode,
            $newEndingAt->timestamp * 1000,
            $malusMinutes,
            $finalCode
        ));

        \Log::info("Labyrinthe complété", [
            'game_code' => $gameCode,
            'exit' => $exitDirection,
            'malus_count' => $malusCount,
            'malus_minutes' => $malusMinutes,
            'final_code' => $finalCode
        ]);

        return response()->json([
            'success' => true,
            'exit_direction' => $exitDirection,
            'malus_applied' => $malusMinutes,
            'new_ending_at_ms' => $newEndingAt->timestamp * 1000,
            'final_code' => $finalCode
        ]);
    }

    /**
     * 🔐 Génère le code final selon la sortie
     */
    private function generateFinalCode($exitDirection)
    {
        if ($exitDirection === 'north') {
            // Sortie des bons enquêteurs
            return 'REACTOR_CORE';
        } else {
            // Sortie des saboteurs
            return 'SHADOW_OPS';
        }
    }
}
