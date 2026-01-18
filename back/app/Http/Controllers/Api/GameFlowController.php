<?php

namespace App\Http\Controllers\Api;

use App\Events\AppUnlocked;
use App\Events\EnigmaUpdated;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Labyrinth;
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

        // 🔒 Sécurité
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

            $impostorRoles = collect([
                'communicant',
                'navigateur',
            ])->shuffle()->values();

            $crewRoles = collect([
                'communicant',
                'developpeur',
                'cadreur',
                'cadreur',
            ])->shuffle()->values();

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

        event(new GameStarting(
            $game->code,
            now()->timestamp
        ));

        return redirect()
            ->route('admin.games.show', $game)
            ->with('success', "Partie démarrée.");
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
            // 1. Trouver la partie en cours
            $game = Game::where('code', $code)->firstOrFail();

            // 2. Vérifier que la partie est bien démarrée
            if ($game->status !== 'started') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'La partie n\'est pas en cours'
                ], 400);
            }

            // 3. Définir quelle application débloquer selon l'étape actuelle
            $stepsToApps = [
                1 => 'scan',
                2 => 'puzzle',
                3 => 'phone',
                4 => 'boussole',
                5 => 'terminal'
            ];

            $currentStep = $game->step;

            // 4. Vérifier si l'étape est valide
            if (!isset($stepsToApps[$currentStep])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Toutes les étapes sont déjà validées'
                ], 400);
            }

            $appToUnlock = $stepsToApps[$currentStep];

            // 5. Empêcher les validations multiples simultanées
            if ($game->step > $currentStep) {
                return response()->json([
                    'status' => 'already_validated',
                    'message' => 'Cette étape a déjà été validée',
                    'current_step' => $game->step
                ], 200);
            }

            // 6. Mise à jour de la base de données (UNIQUEMENT step)
            $game->step = $currentStep + 1;
            $game->save();

            // 7. Log de l'action (optionnel mais utile pour debug)
            \Log::info("Étape validée", [
                'game_code' => $game->code,
                'old_step' => $currentStep,
                'new_step' => $game->step,
                'unlocked_app' => $appToUnlock
            ]);

            // 8. 🔥 Notification Pusher INSTANTANÉE
            event(new AppUnlocked($game->code, $appToUnlock));

            return response()->json([
                'status' => 'success',
                'message' => 'Étape validée pour tout le groupe',
                'next_step' => $game->step,
                'unlocked_app' => $appToUnlock
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
            'app_id' => 'required|string'
        ]);

        $appId = $request->input('app_id');

        // Diffuser à tout le groupe via Pusher
        event(new AppUnlocked($code, $appId));

        return response()->json([
            'status' => 'success',
            'unlocked_app' => $appId
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
}
