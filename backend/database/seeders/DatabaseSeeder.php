<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        // Gọi các seeder khác
        $this->call([
            UsersTableSeeder::class,
            ClientsTableSeeder::class,
            InventorySeeder::class,
            OrdersTableSeeder::class,
            OrderDetailsTableSeeder::class,
            InventoryImageSeeder::class,
        ]);
    }
}
