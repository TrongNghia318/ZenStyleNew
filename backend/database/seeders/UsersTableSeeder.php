<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          User::create([
            'name' => 'TrongNghia',
            'email' => 'admin@example.com',
            'phone' => '0909999999',
            'password' => Hash::make('123456'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Receptionist',
            'email' => 'reception@example.com',
            'phone' => '0911222333',
            'password' => Hash::make('123456'),
            'role' => 'receptionist',
        ]);

        User::create([
            'name' => 'Stylist',
            'email' => 'stylist@example.com',
            'phone' => '0933444555',
            'password' => Hash::make('123456'),
            'role' => 'stylist',
        ]);
    }
}
