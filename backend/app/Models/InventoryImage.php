<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryImage extends Model
{
    use HasFactory;

    protected $table = 'inventory_images';   // bảng liên kết nhiều ảnh
    protected $primaryKey = 'image_id';

    protected $fillable = [
        'item_id',
        'path',
    ];

    // Tự động append url khi trả về JSON
    protected $appends = ['url'];

    // Accessor: lấy link đầy đủ tới ảnh
    public function getUrlAttribute()
    {
        return $this->path 
            ? asset('storage/' . $this->path) 
            : null;
    }

    // Quan hệ ngược lại với Inventory
    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'item_id', 'item_id');
    }
}
