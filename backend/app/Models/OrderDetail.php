<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $primaryKey = 'detail_id';

    protected $fillable = [
        'order_id',
        'item_id',
        'quantity',
        'price',
    ];

    // Quan hệ với Order (thuộc về 1 đơn)
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    // Quan hệ với Inventory (sản phẩm nào)
    public function inventory()
{
    return $this->belongsTo(Inventory::class, 'item_id', 'item_id');
}
}
