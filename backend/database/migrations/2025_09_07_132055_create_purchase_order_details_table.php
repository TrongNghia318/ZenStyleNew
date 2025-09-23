<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('purchase_order_details', function (Blueprint $table) {
            $table->id('detail_id');
            $table->foreignId('order_id')->constrained('purchase_orders','order_id')->onDelete('cascade');
            $table->foreignId('item_id')->constrained('inventories','item_id')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
        });
    }

    public function down(): void {
        Schema::dropIfExists('purchase_order_details');
    }
};
