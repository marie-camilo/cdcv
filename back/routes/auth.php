<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Auth (Breeze-compatible)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    /**
     * ✅ LOGIN (guest)
     * IMPORTANT : on garde le nom "login"
     * car Breeze views utilisent route('login')
     */
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])
            ->name('login');

        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    /**
     * ✅ ZONE ADMIN (auth)
     */
    Route::middleware('auth')->group(function () {

        // ✅ Dashboard admin
        Route::get('/', fn () => view('admin.dashboard'))
            ->name('admin.dashboard');

        // ✅ Logout : Breeze utilise "logout"
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('logout');

        // ✅ Profile : Breeze utilise profile.edit/update/destroy
        Route::get('profile', [ProfileController::class, 'edit'])
            ->name('profile.edit');

        Route::patch('profile', [ProfileController::class, 'update'])
            ->name('profile.update');

        Route::delete('profile', [ProfileController::class, 'destroy'])
            ->name('profile.destroy');

        /**
         * ✅ Email verification : Breeze utilise verification.*
         */
        Route::get('verify-email', EmailVerificationPromptController::class)
            ->name('verification.notice');

        Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');

        Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        /**
         * ✅ Password reset / confirm (si tu veux le garder)
         */
        Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
            ->name('password.confirm');

        Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

        Route::put('password', [PasswordController::class, 'update'])
            ->name('password.update');
    });

    /**
     * ✅ Password reset (guest)
     */
    Route::middleware('guest')->group(function () {

        Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
            ->name('password.request');

        Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
            ->name('password.email');

        Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
            ->name('password.reset');

        Route::post('reset-password', [NewPasswordController::class, 'store'])
            ->name('password.store');
    });
});
