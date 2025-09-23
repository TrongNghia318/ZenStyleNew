<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tạo một người dùng admin
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'phone' => '1234567890',
            'password' => '123456',
            'role' => 'admin',
        ]);

        // Tùy chọn: Tạo thêm một người dùng staff
        User::create([
            'first_name' => 'Staff',
            'last_name' => 'Staff',
            'email' => 'staff@example.com',
            'phone' => '0987654321',
            'password' => Hash::make('password'),
            'role' => 'staff',
        ]);

        // Tùy chọn: Sử dụng Factory để tạo nhiều người dùng "thường"
        User::factory(10)->create();
    }
}