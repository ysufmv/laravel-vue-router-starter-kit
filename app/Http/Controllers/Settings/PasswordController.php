<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use Illuminate\Http\JsonResponse;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(): JsonResponse
    {
        return response()->json(['status' => 'ok']);
    }

    /**
     * Update the user's password.
     */
    public function update(PasswordUpdateRequest $request): JsonResponse
    {
        $request->user()->update([
            'password' => $request->password,
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }
}
