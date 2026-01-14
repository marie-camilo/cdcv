<?php

namespace app\Models;

use Illuminate\Database\Eloquent\Model;

class Labyrinth extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'code'
    ];
}
