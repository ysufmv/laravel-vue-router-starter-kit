<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SPA Routes
|--------------------------------------------------------------------------
|
| All routes here return the SPA view since Vue Router handles client-side
| routing. Backend routes are defined separately for API endpoints.
|
*/

// Helper function to return SPA view
$spaView = function () {
    return view('app', [
        'appearance' => session('appearance', 'system'),
    ]);
};

/*
|--------------------------------------------------------------------------
| Public Routes (Guest or Authenticated)
|--------------------------------------------------------------------------
*/

Route::get('/', $spaView)->name('home');

/*
|--------------------------------------------------------------------------
| Guest Only Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['guest'])->group(function () use ($spaView) {
    Route::get('/auth/login', $spaView)->name('login');
    Route::get('/auth/register', $spaView)->name('register');
    Route::get('/auth/forgot-password', $spaView)->name('password.request');
    Route::get('/auth/reset-password/{token}', $spaView)->name('password.reset');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () use ($spaView) {
    Route::get('/dashboard', $spaView)->name('dashboard');
    Route::get('/auth/confirm-password', $spaView)->name('password.confirm');
});

Route::middleware(['auth'])->group(function () use ($spaView) {
    Route::get('/auth/verify-email', function () use ($spaView) {
        if (request()->user()->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }
        return $spaView();
    })->name('verification.notice');
});

/*
|--------------------------------------------------------------------------
| Two-Factor Challenge Route
|--------------------------------------------------------------------------
*/

Route::get('/auth/two-factor-challenge', function () use ($spaView) {
    if (!session('login.id')) {
        return redirect()->route('login');
    }
    return $spaView();
})->name('two-factor.login');

/*
|--------------------------------------------------------------------------
| SPA Catch-All Route
|--------------------------------------------------------------------------
|
| This route will catch all requests and return the SPA view.
| Vue Router will handle client-side routing.
| Note: The settings/* paths are handled by API controllers in settings.php
|
*/

Route::get('/{any?}', $spaView)->where('any', '^(?!api|sanctum|settings).*$')->name('spa');
