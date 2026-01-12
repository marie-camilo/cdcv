<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TalkieRoom extends Model
{
    protected $fillable = [
        'code',
        'time_remaining',
        'is_active',
        'connected_users'
    ];

    protected $casts = [
        'connected_users' => 'array',
        'is_active' => 'boolean'
    ];
}
