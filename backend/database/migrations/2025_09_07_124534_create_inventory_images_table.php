<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory_images', function (Blueprint $table) {
            $table->id('image_id');
            $table->unsignedBigInteger('item_id'); // liên kết tới inventory
            $table->string('path'); // đường dẫn ảnh
            $table->timestamps();

            $table->foreign('item_id')
                ->references('item_id')
                ->on('inventories')
                ->onDelete('cascade'); // xoá sp thì xoá ảnh luôn
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_images');
    }
};
