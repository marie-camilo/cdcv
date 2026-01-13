<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TalkieRoom;
use App\Events\UserSpeaking;
use App\Events\TimerUpdated;
use Illuminate\Http\Request;

class TalkieWalkieController extends Controller
{
    public function joinRoom(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $room = TalkieRoom::firstOrCreate(
            ['code' => $request->code],
            [
                'time_remaining' => 360,
                'is_active' => true,
                'connected_users' => []
            ]
        );

        return response()->json([
            'success' => true,
            'room' => $room
        ]);
    }

    public function getRoom(string $code)
    {
        $room = TalkieRoom::where('code', $code)->first();

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'room' => $room
        ]);
    }

    public function updateTimer(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'time_remaining' => 'required|integer|min:0'
        ]);

        $room = TalkieRoom::where('code', $request->code)->first();

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], 404);
        }

        $room->time_remaining = $request->time_remaining;
        $room->save();

        broadcast(new TimerUpdated($room))->toOthers();

        return response()->json([
            'success' => true,
            'time_remaining' => $room->time_remaining
        ]);
    }

    public function speaking(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'is_speaking' => 'required|boolean'
        ]);

        $room = TalkieRoom::where('code', $request->code)->first();

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], 404);
        }

        broadcast(new UserSpeaking([
            'room_code' => $request->code,
            'is_speaking' => $request->is_speaking
        ]))->toOthers();

        return response()->json([
            'success' => true
        ]);
    }

    public function leaveRoom(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        return response()->json([
            'success' => true
        ]);
    }
}
