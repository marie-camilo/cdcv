<?php

use App\Http\Controllers\Api\TestController;
use Illuminate\Support\Facades\Route;

Route::middleware('api.key')
    ->name('api.')
    ->group(function () {
        Route::apiResource('test', TestController::class);
});
