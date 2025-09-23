<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id'); // khóa chính
            $table->unsignedBigInteger('client_id'); // FK -> clients
            $table->unsignedBigInteger('user_id')->nullable(); // FK -> users (nhân viên xử lý đơn, có thể null)
            $table->dateTime('order_date');
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->decimal('total_price', 10, 2);
            $table->enum('payment_method', ['cash', 'card', 'transfer'])->nullable();
            $table->string('email')->nullable();
            $table->timestamps();

            // Khóa ngoại
            $table->foreign('client_id')->references('client_id')->on('clients')->onDelete('cascade');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
