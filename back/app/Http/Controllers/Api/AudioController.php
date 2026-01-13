<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Request;
use function App\Http\Controllers\asset;
use function App\Http\Controllers\response;

class AudioController
{
    public function upload(Request $request) {

        if ($request->hasFile('audio')) {
            // On sauvegarde dans storage/app/public/talkie
            $path = $request->file('audio')->store('talkie', 'public');

            // On retourne l'URL complète pour que React puisse le lire
            return response()->json([
                'url' => asset('storage/' . $path),
                'filename' => basename($path)
            ]);
        }
        return response()->json(['error' => 'No audio'], 400);
    }
}
