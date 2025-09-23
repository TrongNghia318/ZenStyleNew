<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderDetail;

class OrderDetailsTableSeeder extends Seeder
{
    public function run(): void
    {
        // Chi tiết cho đơn hàng 1
        OrderDetail::create([
            'order_id' => 1,
            'item_id'  => 1,
            'quantity' => 2,
            'price'    => 200000, // giá tại thời điểm mua
        ]);

        OrderDetail::create([
            'order_id' => 1,
            'item_id'  => 2,
            'quantity' => 1,
            'price'    => 100000,
        ]);

        // Chi tiết cho đơn hàng 2
        OrderDetail::create([
            'order_id' => 2,
            'item_id'  => 3,
            'quantity' => 5,
            'price'    => 50000,
        ]);
    }
}
