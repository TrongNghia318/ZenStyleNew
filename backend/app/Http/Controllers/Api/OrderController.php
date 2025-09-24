<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Inventory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Only staff can view all orders
        if (!($user instanceof \App\Models\User)) {
            return response()->json([
                'message' => 'Only staff members can view all orders'
            ], 403);
        }

        $orders = Order::with(['client', 'user', 'orderDetails.inventory'])
            ->orderBy('order_date', 'desc')
            ->get();

        return response()->json([
            'orders' => $orders,
            'staff_user' => $user->name
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:inventories,item_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'email' => 'required|email',
            'payment_method' => 'string',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // Check inventory availability first
                foreach ($request->items as $item) {
                    $inventory = Inventory::findOrFail($item['item_id']);
                    
                    if ($inventory->quantity < $item['quantity']) {
                        throw new Exception("Insufficient stock for {$inventory->name}. Available: {$inventory->quantity}, Requested: {$item['quantity']}");
                    }
                }

                // Reduce inventory quantities
                foreach ($request->items as $item) {
                    $inventory = Inventory::findOrFail($item['item_id']);
                    $inventory->decrement('quantity', $item['quantity']);
                }

                $authenticatedUser = $request->user();

                // Calculate total
                $total = 0;
                foreach ($request->items as $item) {
                    $total += $item['price'] * $item['quantity'];
                }

                // Create order data
                $orderData = [
                    'order_date' => Carbon::now(),
                    'status' => 'pending',
                    'total_price' => $total,
                    'payment_method' => $request->payment_method ?? 'cash',
                    'email' => $request->email,
                ];

                // Assign client_id or user_id based on authenticated user type
                if ($authenticatedUser instanceof \App\Models\User) {
                    $orderData['user_id'] = $authenticatedUser->user_id;
                    $orderData['client_id'] = null;
                } elseif ($authenticatedUser instanceof \App\Models\Client) {
                    $orderData['client_id'] = $authenticatedUser->client_id;
                    $orderData['user_id'] = null;
                }

                $order = Order::create($orderData);

                // Create order details
                foreach ($request->items as $item) {
                    OrderDetail::create([
                        'order_id' => $order->order_id,
                        'item_id' => $item['item_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }
                // Clear the client's cart after successful order
if ($authenticatedUser instanceof \App\Models\Client) {
    \App\Models\Cart::where('client_id', $authenticatedUser->client_id)->delete();
}
                // Send email notification
                try {
                    Mail::to($order->email)->send(new OrderConfirmation($order));
                } catch (Exception $e) {
                    Log::error('Email sending error: ' . $e->getMessage());
                    // Don't fail the order if email fails
                }

                return response()->json(['order' => $order->load('orderDetails.inventory')], 201);
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();
        
        $query = Order::with(['orderDetails.inventory', 'client', 'user']);
        
        // If it's a client, they can only see their own orders
        if ($user instanceof \App\Models\Client) {
            $query->where('client_id', $user->client_id);
        }
        // Staff can see all orders
        
        $order = $query->findOrFail($id);
        
        return response()->json(['order' => $order]);
    }

 public function update(Request $request, string $id)
{
    $request->validate([
        'status' => 'required|string|in:pending,paid,cancelled'
    ]);

    $order = Order::findOrFail($id);
    $order->status = $request->status;
    $order->save();
    
    return response()->json([
        'message' => 'Order status updated successfully',
        'order' => $order->load(['client', 'user', 'orderDetails.inventory'])
    ]);
}
    public function destroy(string $id)
    {
        //
    }
}