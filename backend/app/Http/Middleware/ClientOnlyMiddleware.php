<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientOnlyMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized - Please login first'
            ], 401);
        }

        if (get_class($user) !== 'App\Models\Client') {
            return response()->json([
                'message' => 'Forbidden - This endpoint is for customers only'
            ], 403);
        }

        return $next($request);
    }
}