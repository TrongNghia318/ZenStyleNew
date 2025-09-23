<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Client extends Authenticatable
{
    use HasApiTokens;

    protected $primaryKey = 'client_id';
    
    protected $fillable = [
        'name', 'email', 'phone', 'password', 'dob', 'preferences', 'loyalty_points', 'membership_tier'
    ];

    protected $hidden = ['password'];
    
    protected $casts = [
        'password' => 'hashed',
        'dob' => 'date',
    ];

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'client_id', 'client_id');
    }
}