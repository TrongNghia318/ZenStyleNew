<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'client_id',
        'user_id',
        'order_date',
        'status',
        'total_price',
        'payment_method',
        'email',
    ];

    //  Quan hệ với Client (mỗi đơn thuộc về 1 khách)
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }

    //  Quan hệ với User (nhân viên xử lý đơn, có thể null)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    //  Quan hệ với OrderDetail (mỗi đơn có nhiều chi tiết)
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'order_id');
    }
}
