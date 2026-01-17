<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SPA Catch-All Route
|--------------------------------------------------------------------------
|
| This route will catch all requests and return the SPA view.
| Vue Router will handle client-side routing.
|
*/

Route::get('/{any?}', function () {
    return view('app', [
        'appearance' => session('appearance', 'system'),
    ]);
})->where('any', '^(?!api|sanctum).*$')->name('spa');
