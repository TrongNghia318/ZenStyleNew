<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingsController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\AdminUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public product routes (everyone can view - including guests)
Route::get('products', [InventoryController::class, 'index']);
Route::get('products/{id}', [InventoryController::class, 'show']);
Route::put('orders/{id}', [OrderController::class, 'update']);


// Public routes
Route::get('feedbacks', [FeedbackController::class, 'index']);

// User authentication (for staff members)
Route::prefix('user')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Client authentication (for customers)
Route::prefix('client')->group(function () {
    Route::post('/register', [ClientAuthController::class, 'register']);
    Route::post('/login', [ClientAuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [ClientAuthController::class, 'logout']);
        Route::get('/me', [ClientAuthController::class, 'me']);
    });
});

// Admin/Staff only routes
Route::middleware(['auth:sanctum', 'role:admin,receptionist,stylist'])->group(function () {
    // Dashboard stats
    Route::get('admin/dashboard/stats', [AdminUserController::class, 'getDashboardStats']);
    
    // Product management (admin/receptionist only)
    Route::middleware('role:admin,receptionist')->group(function () {
        Route::post('products', [InventoryController::class, 'store']);
        Route::put('products/{id}', [InventoryController::class, 'update']);
        Route::patch('products/{id}', [InventoryController::class, 'update']);
        Route::delete('products/{id}', [InventoryController::class, 'destroy']);
        
        // Product images management
        Route::post('products/{id}/images', [InventoryController::class, 'addImage']);
        Route::delete('products/{id}/images/{imageId}', [InventoryController::class, 'deleteImage']);
    });
    
    // Booking management - all staff can manage
    Route::apiResource('bookings', BookingsController::class);
    
    // Order viewing - all staff can view orders
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    
    // User management (admin/receptionist only)
    Route::middleware('role:admin,receptionist')->group(function () {
        Route::get('admin/staff', [AdminUserController::class, 'getStaffUsers']);
        Route::get('admin/clients', [AdminUserController::class, 'getClients']);
        Route::put('admin/clients/{id}', [AdminUserController::class, 'updateClient']);
    });
    
    // Staff management (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::post('admin/staff', [AdminUserController::class, 'createStaff']);
        Route::put('admin/staff/{id}', [AdminUserController::class, 'updateStaff']);
        Route::delete('admin/staff/{id}', [AdminUserController::class, 'deleteStaff']);
    });
});

// Cart routes (client only)
Route::middleware(['auth:sanctum', 'client.only'])->group(function () {
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart', [CartController::class, 'store']);
    Route::put('cart/{id}', [CartController::class, 'update']);
    Route::delete('cart/{id}', [CartController::class, 'destroy']);
    Route::delete('cart/clear', [CartController::class, 'clear']);
});

// Mixed routes (both staff and clients can access)
Route::middleware('auth:sanctum')->group(function () {
    // Orders - clients can create, staff can view all
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    
    // Feedbacks - anyone authenticated can submit
    Route::post('feedbacks', [FeedbackController::class, 'store']);
});

// Legacy booking routes (keeping for backward compatibility)
// These work without authentication for public booking
Route::get('bookings', [BookingsController::class, 'index']);
Route::post('bookings', [BookingsController::class, 'store']);
Route::get('bookings/{booking}', [BookingsController::class, 'show']);
Route::put('bookings/{booking}', [BookingsController::class, 'update']);
Route::delete('bookings/{booking}', [BookingsController::class, 'destroy']);