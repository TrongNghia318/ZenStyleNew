<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Đổi tên class thành Booking (số ít)
class Booking extends Model
{
    // Laravel sẽ tự động suy luận tên bảng là 'bookings'
    // vì thế không cần dòng này nữa: protected $table = "bookings";

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'service',
        'stylist',
        'room',
        'booking_date',
        'booking_time',
        'notes',
    ];
}