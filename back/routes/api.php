<?php

use App\Http\Controllers\Api\EnigmeController;
use App\Http\Controllers\Admin\ChatController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\GameFlowController;
use App\Http\Controllers\Api\AudioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TalkieWalkieController;


Route::middleware('api.key')
    ->prefix('v1')
    ->name('api.')
    ->group(function () {

        // Création d'une partie
        Route::post('/games', [GameController::class, 'store']);

        Route::get('/games/all', [GameController::class, 'showAll']);

        // Infos lobby
        Route::get('/games/{code}', [GameController::class, 'show']);

        // Rejoindre une partie
        Route::post('/games/{code}/players', [PlayerController::class, 'store']);

        // Récupération du rôle (joueur connecté)
        Route::get('/me/role', [PlayerController::class, 'role']);

        // Démarrer la partie via l’admin
        Route::post('/games/{code}/start', [GameFlowController::class, 'start']);

        // Récupérer le cookie du joueur
        Route::get('/session', [PlayerController::class, 'getPlayerCookie']);

        // Récupérer l’état de la partie
        Route::get('/games/{code}/state', [GameFlowController::class, 'state']);

        // Mettre le code de la partie dans un cookie
        Route::post('/games/{code}/log', [GameFlowController::class, 'log']);

        //Récupérer le code de la partie depuis le cookie
        Route::get('/games/log/session', [GameFlowController::class, 'getLogSession']);

        // récupération des messages audio
        Route::get('/audio/messages', [AudioController::class, 'index']);

        // upload d'un message audio
        Route::post('/audio', [AudioController::class, 'upload']);

        // reset des messages audio
        Route::delete('/audio/{code}', [AudioController::class, 'resetByCode']);

        Route::post('/enigme3/{code}', [GameFlowController::class, 'postGameCodeForLabyrinth']);
        Route::get('/enigme3/', [GameFlowController::class, 'getGameCodeForLabyrinth']);

        // Route pour valider une étape de jeu
        Route::post('/game/{code}/validate-step', [GameFlowController::class, 'validateStep']);
        Route::post('/game/{code}/update-enigma', [GameFlowController::class, 'updateEnigmaState']);
        Route::post('/game/{code}/unlock-app', [GameFlowController::class, 'unlockApp']);

        Route::post('/chat/{game}', [ChatController::class, 'storePlayer']);
        Route::post('/chat/impostor/{game}', [ChatController::class, 'storeImpostor']);
        Route::get('/chat/{game}', [ChatController::class, 'getGameMessages']);

        Route::get('/countdown/{code}', [GameFlowController::class, 'getCountdown']);

        Route::post('/game/{code}/trigger-video', [GameFlowController::class, 'triggerVideo']);

        Route::post('/game/clear-cookie', [GameController::class, 'clearCookie']);
    });


