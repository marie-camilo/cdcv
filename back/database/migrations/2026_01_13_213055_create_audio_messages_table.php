<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audio_messages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player_id')->constrained()->cascadeOnDelete();

            $table->string('file_path');      // ex: talkie/ABCD/audio_12.webm
            $table->string('mime_type')->nullable();

            $table->timestamps();             // created_at = l’ordre chrono
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audio_messages');
    }
};
