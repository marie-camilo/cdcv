<?php

use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\GameFlowController;
use Illuminate\Support\Facades\Route;

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
        Route::get('/session', [PlayerController::class, 'session']);

        // Récupérer l’état de la partie
        Route::get('/games/{code}/state', [GameFlowController::class, 'state']);

    });

