@extends('admin.layouts.app')

@section('title', 'Admin — Dashboard')

@php($subtitle = 'Tableau de bord')

@section('content')

    <!-- Header -->
    <section class="mt-6 flex items-start justify-between gap-4">

        <div>
            <h1 class="text-2xl font-bold" style="color: var(--color-white);">
                Dashboard
            </h1>
        </div>

        <!-- Chat icon + badge -->


    </section>

    <!-- Section : Parties en cours -->
    <section class="mt-6">

        <div class="flex items-end justify-between gap-4">
            <div>
                <h2 class="text-lg font-bold" style="color: var(--color-light-green);">
                    Parties en cours
                </h2>
            </div>

            <a href="{{ route('admin.games.index') }}"
               class="text-sm font-semibold transition"
               style="color: #FFFFFF;display: flex; align-content: center; gap: 0.25rem;">
                Toutes les parties
                <img src="{{ asset('back/public/icons/Arrow_alt_lright_alt.svg') }}"
                     alt="close_chat"
                     class="w-5 h-5"
                     style="filter: brightness(0) invert(1);"
                >
            </a>
        </div>

        <div class="mt-4 flex flex-col gap-3">

            @forelse($activeGames as $game)

                <div class="p-4"
                     style="
                        background: color-mix(in srgb, var(--color-medium), transparent 70%);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                        border-radius: var(--radius-md);
                     ">

                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="text-sm font-bold truncate" style="color: var(--color-white);">
                                Partie #{{ $game['id'] }} — {{ $game['code'] }}
                            </p>

                            <p class="mt-1 text-xs"
                               style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                Temps restant :
                                <span class="font-semibold js-timer"
                                      style="color: var(--color-white);"
                                      data-ends-at-ts="{{ $game['ends_at_ts'] ?? '' }}">
                                    {{ empty($game['ends_at_ts']) ? '--:--' : '00:00' }}
                                </span>
                            </p>


                            <p class="mt-1 text-xs"
                               style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                Joueurs : <span class="font-semibold" style="color: var(--color-white);">
                                                {{ $game['players_count'] ?? 0 }}/{{ $game['capacity'] ?? 6 }}
                                            </span>
                            </p>


                            <p class="mt-2 text-sm font-semibold"
                               style="color: var(--color-turquoise);">
                                {{ $game['step_label'] ?? 'Non définie' }}
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

                    <!-- Actions -->
                    <div class="mt-4 grid grid-cols-1 gap-2">

                        <a href="{{ route('admin.games.show', $game['id']) }}"
                           class="text-center px-3 py-2 text-sm font-semibold transition"
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

            @empty

                <div class="p-4"
                     style="
                        background: color-mix(in srgb, var(--color-medium), transparent 70%);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                        border-radius: var(--radius-md);
                        color: var(--color-white);
                     ">
                    Aucune partie en cours pour le moment.
                </div>

            @endforelse

        </div>

    </section>

    <footer class="mt-8 sm:mt-10 text-center text-xs"
            style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
        Admin — La Click des Chemises Vertes · v1 (Laravel 12)
    </footer>

    <script>
        function formatRemaining(seconds) {
            if (seconds <= 0) return "00:00";

            const m = Math.floor(seconds / 60);
            const s = seconds % 60;

            return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        }

        function updateTimers() {
            const timers = document.querySelectorAll(".js-timer");

            timers.forEach((el) => {
                const endsAtTsRaw = el.dataset.endsAtTs;

                if (!endsAtTsRaw) {
                    el.textContent = "--:--";
                    return;
                }

                const endsAtTs = parseInt(endsAtTsRaw, 10);
                const nowTs = Math.floor(Date.now() / 1000);

                const diffSeconds = endsAtTs - nowTs;

                el.textContent = formatRemaining(diffSeconds);

                if (diffSeconds <= 60 && diffSeconds > 0) {
                    el.style.color = "var(--color-turquoise)";
                } else if (diffSeconds <= 0) {
                    el.style.color = "color-mix(in srgb, var(--color-white), transparent 45%)";
                } else {
                    el.style.color = "var(--color-white)";
                }
            });
        }

        updateTimers();
        setInterval(updateTimers, 1000);
    </script>

@endsection
