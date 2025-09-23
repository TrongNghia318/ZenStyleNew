<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('clients', function (Blueprint $table) {
            $table->id('client_id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 20);
            $table->string('password');
            $table->date('dob')->nullable();
            $table->text('preferences')->nullable();
            $table->integer('loyalty_points')->default(0);
            $table->string('membership_tier')->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
