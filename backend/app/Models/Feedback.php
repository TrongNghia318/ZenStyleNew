<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedbacks';
    protected $primaryKey = 'feedback_id';

    protected $fillable = [
        'client_id',
        'user_id', 
        'item_id',
        'rating',
        'comments'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id', 'client_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'item_id', 'item_id');
    }
}