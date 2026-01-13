<?php

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
        // Routes Talkie-Walkie
//        Route::prefix('talkie')->group(function () {
//            Route::post('/rooms/join', [TalkieWalkieController::class, 'joinRoom']);
//            Route::get('/rooms/{code}', [TalkieWalkieController::class, 'getRoom']);
//            Route::post('/rooms/update-timer', [TalkieWalkieController::class, 'updateTimer']);
//            Route::post('/rooms/speaking', [TalkieWalkieController::class, 'speaking']);
//            Route::post('/rooms/leave', [TalkieWalkieController::class, 'leaveRoom']);
//        });

        Route::post('/audio', [AudioController::class, 'upload']);
    });


