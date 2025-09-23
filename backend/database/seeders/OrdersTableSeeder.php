<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use Carbon\Carbon;

class OrdersTableSeeder extends Seeder
{
    public function run(): void
    {
        // Ví dụ: đơn hàng cho client_id = 1, user_id = 1
        Order::create([
            'client_id'      => 1,
            'user_id'        => 1, // nhân viên xử lý (có thể null)
            'order_date'     => Carbon::now(),
            'status'         => 'paid',
            'total_price'    => 500000,
            'payment_method' => 'cash',
        ]);

        Order::create([
            'client_id'      => 2,
            'user_id'        => null, // khách đặt online
            'order_date'     => Carbon::now()->subDay(),
            'status'         => 'pending',
            'total_price'    => 250000,
            'payment_method' => 'card',
        ]);
    }
}
