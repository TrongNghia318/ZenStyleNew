<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $primaryKey = 'cart_id';
    
    protected $fillable = [
        'client_id',
        'item_id', 
        'quantity'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'item_id', 'item_id');
    }
}