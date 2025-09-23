<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $primaryKey = 'service_id';

    protected $fillable = [
        'name', 'duration_minutes', 'price', 'description'
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'service_id');
    }

    public function clientHistories()
    {
        return $this->hasMany(ClientHistory::class, 'service_id');
    }
}
