<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClientsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Client::create([
            'name' => 'Nguyễn Văn A',
            'email' => 'a@example.com',
            'phone' => '0901234567',
            'password' => Hash::make('123456'),
            'dob' => '1995-01-01',
            'preferences' => 'Cắt tóc ngắn, nhuộm nâu',
            'loyalty_points' => 100,
            'membership_tier' => 'Gold',
        ]);

        Client::create([
            'name' => 'Trần Thị B',
            'email' => 'b@example.com',
            'phone' => '0912345678',
            'password' => Hash::make('123456'),
            'dob' => '2000-05-10',
            'preferences' => 'Gội đầu, dưỡng tóc',
            'loyalty_points' => 50,
            'membership_tier' => 'Silver',
        ]);

        Client::create([
            'name' => 'Lê Văn C',
            'email' => 'c@example.com',
            'phone' => '0923456789',
            'password' => Hash::make('123456'),
            'dob' => '1998-08-20',
            'preferences' => null,
            'loyalty_points' => 0,
            'membership_tier' => null,
        ]);
    }
}
