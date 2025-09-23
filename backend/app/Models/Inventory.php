<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $primaryKey = 'item_id';

    protected $fillable = [
        'name',
        'quantity',
        'threshold',
        'unit_price',
        'type',
        'image',
        'description'
    ];

     // Thêm average_rating vào JSON response
    protected $appends = ['image_url', 'average_rating'];

    // Accessor để sinh ra image_url
    public function getImageUrlAttribute()
    {
        return $this->image
            ? asset('storage/' . $this->image)
            : null;
    }

    // Accessor để tính rating trung bình
    public function getAverageRatingAttribute()
    {
        $average = $this->feedbacks()->avg('rating');
        return $average ? round($average, 1) : 0;
    }

    // Relationship với feedbacks
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'item_id', 'item_id');
    }

    public function purchaseOrderDetails()
    {
        return $this->hasMany(PurchaseOrderDetail::class, 'item_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'item_id', 'item_id');
    }

    public function images()
    {
        return $this->hasMany(InventoryImage::class, 'item_id', 'item_id');
    }
}