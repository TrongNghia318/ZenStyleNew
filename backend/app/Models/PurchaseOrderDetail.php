<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderDetail extends Model
{
    protected $primaryKey = 'detail_id';

    protected $fillable = [
        'order_id', 'item_id', 'quantity', 'price'
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'order_id');
    }

    public function inventoryItem()
    {
        return $this->belongsTo(Inventory::class, 'item_id');
    }
}
