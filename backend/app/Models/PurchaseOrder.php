<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $primaryKey = 'order_id';

    protected $fillable = [
        'supplier_id', 'order_date', 'status'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function details()
    {
        return $this->hasMany(PurchaseOrderDetail::class, 'order_id');
    }
}
