<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Settings API Routes
|--------------------------------------------------------------------------
|
| These routes handle API requests for settings pages.
| The SPA views are served by routes/web.php.
|
*/

Route::middleware(['auth'])->group(function () {
    // Profile API routes
    Route::patch('api/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('api/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Password API routes
    Route::put('api/settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    // Two-factor API routes
    Route::get('api/settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
