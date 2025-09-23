<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id('detail_id'); // khóa chính
            $table->unsignedBigInteger('order_id'); // FK -> orders
            $table->unsignedBigInteger('item_id');  // FK -> inventory
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // giá tại thời điểm mua
            $table->timestamps();

            // Khóa ngoại
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
            $table->foreign('item_id')->references('item_id')->on('inventories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
