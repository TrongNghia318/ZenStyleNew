<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id('cart_id');
            $table->foreignId('client_id')->constrained('clients', 'client_id')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('inventories', 'item_id')->onDelete('cascade');
            $table->integer('quantity');
            $table->timestamps();
            
            // Prevent duplicate items in cart for same client
            $table->unique(['client_id', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};