<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSchedule extends Model
{
    protected $primaryKey = 'schedule_id';

    protected $fillable = [
        'user_id', 'shift_date', 'start_time', 'end_time'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
