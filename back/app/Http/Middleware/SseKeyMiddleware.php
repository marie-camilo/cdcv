<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SseKeyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->query('key') !== config('services.sse.key')) {
            abort(401);
        }

        return $next($request);
    }
}
