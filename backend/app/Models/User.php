<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $primaryKey = 'user_id';
    
    protected $fillable = [
        'name', 'email', 'phone', 'password', 'role'
    ];

    protected $hidden = ['password'];
    protected $casts = ['password' => 'hashed'];
}