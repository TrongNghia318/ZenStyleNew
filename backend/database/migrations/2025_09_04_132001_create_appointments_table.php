<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id('appointment_id');
            $table->foreignId('client_id')->constrained('clients','client_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users','user_id')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services','service_id')->onDelete('cascade');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->enum('status', ['booked','cancelled','rescheduled']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('appointments');
    }
};
