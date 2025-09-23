<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,receptionist,stylist',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        $token = $user->createToken('user_auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registration successful',
            'user' => $user,
            'access_token' => $token,
        ], 201);
    }

   public function login(Request $request)
{
    $request->validate([
        'email' => 'required_without:phone|email',
        'phone' => 'required_without:email|string',
        'password' => 'required',
    ]);

    // Find user by email or phone
    $user = null;
    if ($request->has('email') && $request->email) {
        $user = User::where('email', $request->email)->first();
    } elseif ($request->has('phone') && $request->phone) {
        $user = User::where('phone', $request->phone)->first();
    }

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('user_auth_token')->plainTextToken;

    return response()->json([
        'message' => 'User login successful',
        'user' => $user,
        'access_token' => $token,
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'User logout successful']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}