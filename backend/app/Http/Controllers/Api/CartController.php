<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $client = $request->user();
        
        if (!($client instanceof \App\Models\Client)) {
            return response()->json(['message' => 'Only clients can access cart'], 403);
        }

        $cartItems = Cart::with('inventory.images')
            ->where('client_id', $client->client_id)
            ->get();

        return response()->json(['cart_items' => $cartItems]);
    }

    public function store(Request $request)
    {
        $client = $request->user();
        
        if (!($client instanceof \App\Models\Client)) {
            return response()->json(['message' => 'Only clients can add to cart'], 403);
        }

        $request->validate([
            'item_id' => 'required|exists:inventories,item_id',
            'quantity' => 'required|integer|min:1'
        ]);

        $existingCartItem = Cart::where('client_id', $client->client_id)
            ->where('item_id', $request->item_id)
            ->first();

        if ($existingCartItem) {
            $newQuantity = $existingCartItem->quantity + $request->quantity;
            $existingCartItem->update(['quantity' => $newQuantity]);
            $cartItem = $existingCartItem;
        } else {
            $cartItem = Cart::create([
                'client_id' => $client->client_id,
                'item_id' => $request->item_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart',
            'cart_item' => $cartItem->load('inventory')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $client = $request->user();
        
        $cartItem = Cart::where('cart_id', $id)
            ->where('client_id', $client->client_id)
            ->firstOrFail();

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Cart updated',
            'cart_item' => $cartItem->load('inventory')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $client = $request->user();
        
        $cartItem = Cart::where('cart_id', $id)
            ->where('client_id', $client->client_id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    public function clear(Request $request)
    {
        $client = $request->user();
        
        Cart::where('client_id', $client->client_id)->delete();

        return response()->json(['message' => 'Cart cleared']);
    }
}