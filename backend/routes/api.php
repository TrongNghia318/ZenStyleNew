<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\FeedbackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public product routes (everyone can view - including guests)
Route::get('products', [InventoryController::class, 'index']);
Route::get('products/{id}', [InventoryController::class, 'show']);

// Admin/Staff only product management routes
Route::middleware(['auth:sanctum', 'role:admin,receptionist'])->group(function () {
    Route::post('products', [InventoryController::class, 'store']);
    Route::put('products/{id}', [InventoryController::class, 'update']);
    Route::patch('products/{id}', [InventoryController::class, 'update']);
    Route::delete('products/{id}', [InventoryController::class, 'destroy']);
    
    // Product images management (admin/staff only)
    Route::post('products/{id}/images', [InventoryController::class, 'addImage']);
    Route::delete('products/{id}/images/{imageId}', [InventoryController::class, 'deleteImage']);
});

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

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Orders API
    Route::get('orders', [OrderController::class, 'index'])->middleware('role:admin,receptionist,stylist');
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::post('orders', [OrderController::class, 'store']);
    
    // Feedbacks
    Route::post('feedbacks', [FeedbackController::class, 'store']);
});

// Public routes
Route::get('feedbacks', [FeedbackController::class, 'index']);

// Cart routes (client only)
Route::middleware(['auth:sanctum', 'client.only'])->group(function () {
    Route::apiResource('cart', CartController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::delete('cart/clear', [CartController::class, 'clear']);
});


// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Orders API
    Route::get('orders', [OrderController::class, 'index'])->middleware('role:admin,receptionist,stylist');
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::post('orders', [OrderController::class, 'store']);
    
    // Feedbacks
    Route::post('feedbacks', [FeedbackController::class, 'store']);
});

// Public routes
Route::get('feedbacks', [FeedbackController::class, 'index']);

// Cart routes (client only)
Route::middleware(['auth:sanctum', 'client.only'])->group(function () {
    Route::apiResource('cart', CartController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::delete('cart/clear', [CartController::class, 'clear']);
});
