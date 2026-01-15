<?php

use App\Http\Controllers\Admin\ChatController;
use App\Http\Controllers\Admin\GameController as Admin;
use App\Http\Controllers\Api\AudioController;
use App\Http\Controllers\Api\GameFlowController as Api;
use App\Http\Controllers\Api\PlayerController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth'])
    ->group(function () {

        Route::get('/', DashboardController::class)->name('dashboard');

        Route::get('/parties', [Admin::class, 'index'])->name('games.index');

        Route::get('/parties/{game}', [Admin::class, 'show'])->name('games.show');

        Route::post('/parties/{game:code}/start', [Api::class, 'start'])
            ->name('games.start');

        Route::post('/parties/{game:code}/reset', [Admin::class, 'reset'])
            ->name('games.reset');

        Route::post('/parties/{game:code}/audio/reset', [AudioController::class, 'resetByCode'])
            ->name('games.audio.reset');

        Route::post('/parties/{game:code}/labyrinth/init', [Admin::class, 'initLabyrinth'])
            ->name('games.init.labyrinth');

        Route::patch('/parties/{game}/joueurs/{player}', [PlayerController::class, 'update'])
            ->name('players.update');

        Route::delete('/parties/{game}/joueurs/{player}', [PlayerController::class, 'destroy'])
            ->name('players.destroy');


        Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');

        Route::get('/chat/{game}', [ChatController::class, 'show'])->name('chat.show');

        Route::post('/chat/{game}', [ChatController::class, 'store'])->name('chat.store');
    });
