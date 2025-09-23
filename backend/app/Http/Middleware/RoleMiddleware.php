<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized - Please login first'
            ], 401);
        }

        // Determine if this is a Client or User (staff) model
        $userType = get_class($user);
        $isClient = $userType === 'App\Models\Client';
        $isStaff = $userType === 'App\Models\User';

        // If roles are required, only staff (User model) can access
        if (!empty($roles)) {
            // Clients cannot access role-protected endpoints
            if ($isClient) {
                return response()->json([
                    'message' => 'Forbidden - This endpoint is for staff members only'
                ], 403);
            }
            
            // Check if staff user has required role (admin, receptionist, stylist)
            if ($isStaff && !in_array($user->role, $roles)) {
                return response()->json([
                    'message' => 'Forbidden - Insufficient permissions. Required roles: ' . implode(', ', $roles),
                    'your_role' => $user->role
                ], 403);
            }
        }

        return $next($request);
    }
}