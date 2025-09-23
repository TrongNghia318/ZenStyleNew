<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientAuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:clients',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $client = Client::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $client->createToken('client_auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Client registration successful',
            'client' => $client,
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

    // Find client by email or phone
    $client = null;
    if ($request->has('email') && $request->email) {
        $client = Client::where('email', $request->email)->first();
    } elseif ($request->has('phone') && $request->phone) {
        $client = Client::where('phone', $request->phone)->first();
    }

    if (!$client || !Hash::check($request->password, $client->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $client->createToken('client_auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Client login successful',
        'client' => $client,
        'access_token' => $token,
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Client logout successful']);
    }

    public function me(Request $request)
    {
        return response()->json(['client' => $request->user()]);
    }
}