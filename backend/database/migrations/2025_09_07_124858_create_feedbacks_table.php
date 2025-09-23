<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
     Schema::create('feedbacks', function (Blueprint $table) {
    $table->id('feedback_id');
    
    $table->foreignId('client_id')
          ->nullable()
          ->constrained('clients', 'client_id')
          ->onDelete('cascade');
          
    $table->foreignId('user_id')
          ->nullable()
          ->constrained('users', 'user_id')
          ->onDelete('cascade');
          
    $table->foreignId('item_id')
          ->constrained('inventories', 'item_id')
          ->onDelete('cascade');

    $table->unsignedTinyInteger('rating');
    $table->text('comments')->nullable();
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};