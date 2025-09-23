<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientHistory extends Model
{
    protected $primaryKey = 'history_id';

    protected $fillable = [
        'client_id', 'service_id', 'user_id', 'appointment_id', 'notes'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }
}
