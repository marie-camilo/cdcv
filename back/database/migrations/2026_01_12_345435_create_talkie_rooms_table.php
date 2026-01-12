<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talkie_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->integer('time_remaining')->default(360);
            $table->boolean('is_active')->default(true);
            $table->json('connected_users')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talkie_rooms');
    }
};
