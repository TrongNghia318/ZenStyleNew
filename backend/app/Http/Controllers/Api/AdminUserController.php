<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * Get all staff users (admin/receptionist only)
     */
    public function getStaffUsers(Request $request)
    {
        $user = $request->user();
        
        // Only admin and receptionist can view all staff
        if (!($user instanceof \App\Models\User) || !in_array($user->role, ['admin', 'receptionist'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $staff = User::select('user_id', 'name', 'email', 'phone', 'role', 'created_at')
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json(['staff' => $staff]);
    }

    /**
     * Get all clients (admin/receptionist only)
     */
    public function getClients(Request $request)
    {
        $user = $request->user();
        
        // Only admin and receptionist can view clients
        if (!($user instanceof \App\Models\User) || !in_array($user->role, ['admin', 'receptionist'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $clients = Client::select('client_id', 'name', 'email', 'phone', 'loyalty_points', 'membership_tier', 'created_at')
                         ->orderBy('created_at', 'desc')
                         ->get();

        return response()->json(['clients' => $clients]);
    }

    /**
     * Create new staff member (admin only)
     */
    public function createStaff(Request $request)
    {
        $user = $request->user();
        
        // Only admin can create staff
        if (!($user instanceof \App\Models\User) || $user->role !== 'admin') {
            return response()->json(['message' => 'Only administrators can create staff accounts'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,receptionist,stylist',
        ]);

        $staff = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'Staff member created successfully',
            'staff' => $staff->only(['user_id', 'name', 'email', 'phone', 'role'])
        ], 201);
    }

    /**
     * Update staff member (admin only, or user updating themselves)
     */
    public function updateStaff(Request $request, $id)
    {
        $currentUser = $request->user();
        $targetUser = User::findOrFail($id);
        
        // Only admin can update others, or users can update themselves
        if (!($currentUser instanceof \App\Models\User)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($currentUser->role !== 'admin' && $currentUser->user_id != $id) {
            return response()->json(['message' => 'You can only update your own account'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id, 'user_id')],
            'phone' => 'sometimes|string|max:20',
            'password' => 'sometimes|string|min:8|confirmed',
            'role' => 'sometimes|in:admin,receptionist,stylist',
        ]);

        // Only admin can change roles
        if (isset($validated['role']) && $currentUser->role !== 'admin') {
            unset($validated['role']);
        }

        // Hash password if provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $targetUser->update($validated);

        return response()->json([
            'message' => 'Staff member updated successfully',
            'staff' => $targetUser->only(['user_id', 'name', 'email', 'phone', 'role'])
        ]);
    }

    /**
     * Delete staff member (admin only)
     */
    public function deleteStaff(Request $request, $id)
    {
        $user = $request->user();
        
        // Only admin can delete staff
        if (!($user instanceof \App\Models\User) || $user->role !== 'admin') {
            return response()->json(['message' => 'Only administrators can delete staff accounts'], 403);
        }

        // Prevent admin from deleting themselves
        if ($user->user_id == $id) {
            return response()->json(['message' => 'You cannot delete your own account'], 400);
        }

        $targetUser = User::findOrFail($id);
        
        // Check if user has associated data that would be affected
        // You might want to add additional checks here based on your business logic
        
        $targetUser->delete();

        return response()->json(['message' => 'Staff member deleted successfully']);
    }

    /**
     * Update client information (admin/receptionist only)
     */
    public function updateClient(Request $request, $id)
    {
        $user = $request->user();
        
        // Only admin and receptionist can update clients
        if (!($user instanceof \App\Models\User) || !in_array($user->role, ['admin', 'receptionist'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('clients')->ignore($id, 'client_id')],
            'phone' => 'sometimes|string|max:20',
            'loyalty_points' => 'sometimes|integer|min:0',
            'membership_tier' => 'sometimes|string|nullable',
        ]);

        $client->update($validated);

        return response()->json([
            'message' => 'Client updated successfully',
            'client' => $client->only(['client_id', 'name', 'email', 'phone', 'loyalty_points', 'membership_tier'])
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        $user = $request->user();
        
        // Only staff can access dashboard stats
        if (!($user instanceof \App\Models\User)) {
            return response()->json(['message' => 'Staff access required'], 403);
        }

        // Get counts
        $totalUsers = User::count();
        $totalClients = Client::count();
        $totalBookings = \App\Models\Booking::count();
        $totalProducts = \App\Models\Inventory::count();
        $totalOrders = \App\Models\Order::count();

        // Today's bookings
        $today = now()->format('Y-m-d');
        $todayBookings = \App\Models\Booking::whereDate('booking_date', $today)->count();

        // Low stock products
        $lowStockProducts = \App\Models\Inventory::whereRaw('quantity <= threshold')->count();

        // Pending orders
        $pendingOrders = \App\Models\Order::where('status', 'pending')->count();

        return response()->json([
            'stats' => [
                'total_staff' => $totalUsers,
                'total_clients' => $totalClients,
                'total_bookings' => $totalBookings,
                'today_bookings' => $todayBookings,
                'total_products' => $totalProducts,
                'low_stock_products' => $lowStockProducts,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
            ]
        ]);
    }
}