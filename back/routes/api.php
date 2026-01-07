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

        // Infos lobby
        Route::get('/games/{code}', [GameController::class, 'show']);

        // Rejoindre une partie
        Route::post('/games/{code}/players', [PlayerController::class, 'store']);

        // Actions de jeu
        Route::post('/games/{code}/start', [GameFlowController::class, 'start']);

        // Récupération du rôle (joueur connecté)
        Route::get('/me/role', [PlayerController::class, 'role']);
    });
