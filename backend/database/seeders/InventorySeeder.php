<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // COSMETICS
        Inventory::create([
            'name' => 'Perfume 1',
            'quantity' => 10,
            'threshold' => 2,
            'unit_price' => 120,
            'type' => 'COS',
            'image' => 'products/nuochoa1.jpg',
            'description' => 'Premium perfume with a seductive scent, lasting 6-8 hours, perfect for parties or dating.'
        ]);

        Inventory::create([
            'name' => 'Perfume 2',
            'quantity' => 8,
            'threshold' => 2,
            'unit_price' => 130,
            'type' => 'COS',
            'image' => 'products/nuochoa2.jpg',
            'description' => 'Elegant and subtle fragrance, giving a sense of comfort and luxury.'
        ]);

        Inventory::create([
            'name' => 'Perfume 3',
            'quantity' => 14,
            'threshold' => 3,
            'unit_price' => 150,
            'type' => 'COS',
            'image' => 'products/nuochoa1.jpg',
            'description' => 'Luxurious design with long-lasting scent, helping you stay confident all day.'
        ]);

        Inventory::create([
            'name' => 'Perfume 4',
            'quantity' => 7,
            'threshold' => 2,
            'unit_price' => 110,
            'type' => 'COS',
            'image' => 'products/nuochoa2.jpg',
            'description' => 'Fresh and youthful fragrance, suitable for all fashion styles.'
        ]);

        // SHAMPOO
        Inventory::create([
            'name' => 'Shampoo 1',
            'quantity' => 20,
            'threshold' => 5,
            'unit_price' => 90,
            'type' => 'SHAMP',
            'image' => 'products/daugoi1.jpg',
            'description' => 'Nourishing shampoo that makes hair soft and smooth, reduces breakage, with a pleasant fragrance.'
        ]);

        Inventory::create([
            'name' => 'Shampoo 2',
            'quantity' => 18,
            'threshold' => 4,
            'unit_price' => 95,
            'type' => 'SHAMP',
            'image' => 'products/daugoi2.jpg',
            'description' => 'Anti-dandruff formula, cleanses the scalp, provides a refreshing cool feeling.'
        ]);

        Inventory::create([
            'name' => 'Shampoo 3',
            'quantity' => 22,
            'threshold' => 6,
            'unit_price' => 97,
            'type' => 'SHAMP',
            'image' => 'products/daugoi1.jpg',
            'description' => 'Herbal extract, safe for colored hair and sensitive scalp.'
        ]);

        Inventory::create([
            'name' => 'Shampoo 4',
            'quantity' => 19,
            'threshold' => 5,
            'unit_price' => 99,
            'type' => 'SHAMP',
            'image' => 'products/daugoi2.jpg',
            'description' => 'Strengthens hair, leaving it naturally shiny and suitable for all hair types.'
        ]);

        // HAIR GEL
        Inventory::create([
            'name' => 'Hair Spray 1',
            'quantity' => 15,
            'threshold' => 3,
            'unit_price' => 75,
            'type' => 'GEL',
            'image' => 'products/keo1.jpg',
            'description' => 'Strong hold, non-sticky, easy to wash off.'
        ]);

        Inventory::create([
            'name' => 'Hair Spray 2',
            'quantity' => 12,
            'threshold' => 2,
            'unit_price' => 80,
            'type' => 'GEL',
            'image' => 'products/keo2.jpg',
            'description' => 'Long-lasting hold with a gentle fragrance, ideal for daily use.'
        ]);

        Inventory::create([
            'name' => 'Hair Spray 3',
            'quantity' => 17,
            'threshold' => 3,
            'unit_price' => 78,
            'type' => 'GEL',
            'image' => 'products/keo1.jpg',
            'description' => 'Helps quick styling, does not dry hair, easy to re-comb.'
        ]);

        Inventory::create([
            'name' => 'Hair Spray 4',
            'quantity' => 13,
            'threshold' => 2,
            'unit_price' => 82,
            'type' => 'GEL',
            'image' => 'products/keo2.jpg',
            'description' => 'Professional hair spray for complex styling and long-lasting form.'
        ]);

        // EXTRA ITEMS
        Inventory::create([
            'name' => 'Mini Perfume',
            'quantity' => 9,
            'threshold' => 2,
            'unit_price' => 100,
            'type' => 'COS',
            'image' => 'products/nuochoa1.jpg',
            'description' => 'Mini version, convenient to carry, light fragrance.'
        ]);

        Inventory::create([
            'name' => 'Herbal Shampoo',
            'quantity' => 25,
            'threshold' => 5,
            'unit_price' => 105,
            'type' => 'SHAMP',
            'image' => 'products/daugoi1.jpg',
            'description' => 'Made from natural herbs, nourishes hair from root to tip.'
        ]);

        Inventory::create([
            'name' => 'Strong Styling Gel',
            'quantity' => 14,
            'threshold' => 3,
            'unit_price' => 86,
            'type' => 'GEL',
            'image' => 'products/keo2.jpg',
            'description' => 'Ultra strong hold, suitable for bold and edgy styles.'
        ]);

        Inventory::create([
            'name' => 'VIP Perfume',
            'quantity' => 11,
            'threshold' => 2,
            'unit_price' => 160,
            'type' => 'COS',
            'image' => 'products/nuochoa2.jpg',
            'description' => 'Limited edition with luxurious scent, perfect as a gift.'
        ]);
    }
}
