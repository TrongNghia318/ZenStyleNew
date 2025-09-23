<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InventoryImage;

class InventoryImageSeeder extends Seeder
{
    public function run(): void
    {
        // Thêm ảnh phụ cho item_id = 1
        InventoryImage::create([
            'item_id' => 1,
            'path' => 'products/nuochoa1.jpg',
        ]);

        InventoryImage::create([
            'item_id' => 1,
            'path' => 'products/nuochoa2.jpg',
        ]);

        // Thêm ảnh phụ cho item_id = 2
        InventoryImage::create([
            'item_id' => 2,
            'path' => 'products/nuochoa2.jpg',
        ]);
    }
}
