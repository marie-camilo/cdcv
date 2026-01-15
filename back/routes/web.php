<?php

use App\Http\Controllers\Admin\ChatController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GameController as AdminGameController;
use App\Http\Controllers\Api\AudioController;
use App\Http\Controllers\Api\GameFlowController as ApiGameFlowController;
use App\Http\Controllers\Api\PlayerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home : si connecté -> admin, sinon -> login admin
Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('login');
});

// Routes auth (/admin/login etc.)
require __DIR__ . '/auth.php';

// /admin : si connecté -> dashboard, sinon -> login
Route::get('/admin', function () {
    return auth()->check()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Admin (protégé)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth'])
    ->group(function () {

        Route::get('/dashboard', DashboardController::class)->name('dashboard');

        Route::get('/parties', [AdminGameController::class, 'index'])->name('games.index');
        Route::get('/parties/{game}', [AdminGameController::class, 'show'])->name('games.show');

        Route::post('/parties/{game:code}/start', [ApiGameFlowController::class, 'start'])->name('games.start');
        Route::post('/parties/{game:code}/reset', [AdminGameController::class, 'reset'])->name('games.reset');

        Route::post('/parties/{game:code}/audio/reset', [AudioController::class, 'resetByCode'])->name('games.audio.reset');

        Route::post('/parties/{game:code}/labyrinth/init', [AdminGameController::class, 'initLabyrinth'])->name('games.init.labyrinth');

        Route::patch('/parties/{game}/joueurs/{player}', [PlayerController::class, 'update'])->name('players.update');
        Route::delete('/parties/{game}/joueurs/{player}', [PlayerController::class, 'destroy'])->name('players.destroy');

        Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
        Route::get('/chat/{game}', [ChatController::class, 'show'])->name('chat.show');
        Route::post('/chat/{game}', [ChatController::class, 'storeAdmin'])->name('chat.store');
    });
