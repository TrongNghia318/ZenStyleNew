<?php

use App\Http\Controllers\BookingsController;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes cần xác thực (Authenticated routes)
Route::middleware('auth:sanctum')->group(function () {
   Route::post('/logout', [AuthController::class, 'logout']);
});
// Routes cho Booking (dành cho người dùng đã đăng nhập)
Route::apiResource('bookings', BookingsController::class);
// Routes chỉ dành cho quản trị viên (Admin-only routes)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {});
