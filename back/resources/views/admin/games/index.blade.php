@extends('admin.layouts.app')

@section('title', 'Admin — Parties')
@php($subtitle = 'Gestion des parties')

@section('content')

    <!-- Header -->
    <section class="mt-6 flex items-start justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold" style="color: var(--color-white);">
                Toutes les parties
            </h1>
        </div>

        @php($canCreate = $gamesCount < 10)

        <a href="{{ $canCreate ? '#' : 'javascript:void(0)' }}"
           class="px-4 py-2 text-sm font-semibold transition text-center"
           style="
            background: {{ $canCreate ? 'var(--color-turquoise)' : 'color-mix(in srgb, var(--color-medium), transparent 55%)' }};
            color: {{ $canCreate ? 'var(--color-dark)' : 'color-mix(in srgb, var(--color-white), transparent 45%)' }};
            border-radius: var(--radius-md);
            border: 1px solid {{ $canCreate ? 'transparent' : 'color-mix(in srgb, var(--color-medium), transparent 30%)' }};
            pointer-events: {{ $canCreate ? 'auto' : 'none' }};
            opacity: {{ $canCreate ? '1' : '0.6' }};
        "
           title="{{ $canCreate ? 'Créer une partie' : 'Limite atteinte (10 parties max)' }}"
        >
            + Créer
        </a>

    </section>

    <!-- Liste -->
    <section class="mt-6 flex flex-col gap-3">

        @if($games->isEmpty())
            <div class="p-4"
                 style="
                background: color-mix(in srgb, var(--color-medium), transparent 70%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
                color: var(--color-white);
             ">
                Aucune partie trouvée.
            </div>
        @else

            @foreach($games as $game)

                <div class="p-4"
                     style="
                    background: color-mix(in srgb, var(--color-medium), transparent 70%);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                 ">

                    <div class="flex items-start justify-between gap-3">

                        <div class="min-w-0">
                            <p class="text-sm font-bold truncate" style="color: var(--color-white);">
                                Partie #{{ $game->id }} — {{ $game->code }}
                            </p>

                            <p class="mt-1 text-xs"
                               style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                Joueurs :
                                <span class="font-semibold" style="color: var(--color-white);">
                                    {{ $game->players_count }}/6
                                </span>
                            </p>

                            <p class="mt-2 text-sm font-semibold"
                               style="color: var(--color-turquoise);">
                                {{ $game->step_label ?? 'Non définie' }}
                            </p>
                        </div>



                        <span class="shrink-0 px-2 py-1 text-xs font-semibold"
                              style="
                                border-radius: 999px;
                                background: {{ ($game['ui_status'] ?? '') === 'EN COURS'
                                    ? 'color-mix(in srgb, var(--color-turquoise), transparent 35%)'
                                    : 'color-mix(in srgb, var(--color-medium), transparent 35%)'
                                }};
                                color: {{ ($game['ui_status'] ?? '') === 'EN COURS'
                                    ? 'var(--color-dark)'
                                    : 'var(--color-white)'
                                }};
                              ">
                            {{ $game['ui_status'] ?? 'EN ATTENTE' }}
                        </span>

                    </div>

                    <div class="mt-4">
                        <a href="{{ route('admin.games.show', $game) }}"
                           class="block w-full text-center px-3 py-2 text-sm font-semibold transition"
                           style="
                                background: var(--color-turquoise);
                                color: var(--color-dark);
                                border-radius: var(--radius-md);
                            "
                           onmouseover="this.style.opacity='0.9'"
                           onmouseout="this.style.opacity='1'"
                        >
                            Gérer
                        </a>
                    </div>


                </div>

            @endforeach

        @endif

    </section>

@endsection
