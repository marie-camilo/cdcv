<header class="border-b" style="border-color: color-mix(in srgb, var(--color-medium), transparent 50%);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <!-- Left -->
            <div>
                <p class="font-bold leading-5" style="color: var(--color-light-green);">
                    La Click des Chemises Vertes
                </p>
                <p class="text-sm leading-5" style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                    {{ $subtitle ?? 'Tableau de bord' }}
                </p>
            </div>

            <!-- Right -->
            <div class="flex items-center justify-between sm:justify-end gap-3">

                <!-- Nom connecté -->
                <span class="text-sm flex gap-2" style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                    <a href="{{ route('admin.dashboard') }}"
                       class="relative flex items-center justify-center w-11 h-11 transition"
                       style="
                            border-radius: 999px;
                            background: color-mix(in srgb, var(--color-medium), transparent 55%);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                            color: var(--color-white);
                       "
                       onmouseover="this.style.background='color-mix(in srgb, var(--color-medium), transparent 35%)'"
                       onmouseout="this.style.background='color-mix(in srgb, var(--color-medium), transparent 55%)'"
                       aria-label="Accéder à l'accueil"
                       title="Home"
                    >
                        <img src="{{ asset('back/public/icons/home.svg') }}"
                             alt="Chat"
                             class="w-5 h-5"
                             style="filter: brightness(0) invert(1);"
                        >
                    </a>

                    <a href="{{ route('admin.games.index') }}"
                       class="relative flex items-center justify-center w-11 h-11 transition"
                       style="
                            border-radius: 999px;
                            background: color-mix(in srgb, var(--color-medium), transparent 55%);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                            color: var(--color-white);
                       "
                       onmouseover="this.style.background='color-mix(in srgb, var(--color-medium), transparent 35%)'"
                       onmouseout="this.style.background='color-mix(in srgb, var(--color-medium), transparent 55%)'"
                       aria-label="Accéder aux parties"
                       title="Games"
                    >
                        <img src="{{ asset('back/public/icons/tv-minimal-play.svg') }}"
                             alt="Chat"
                             class="w-5 h-5"
                             style="filter: brightness(0) invert(1);"
                        >
                    </a>

                    <a href="{{ route('admin.chat.index') }}"
                       class="relative flex items-center justify-center w-11 h-11 transition"
                       style="
                            border-radius: 999px;
                            background: color-mix(in srgb, var(--color-medium), transparent 55%);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                            color: var(--color-white);
                       "
                                   onmouseover="this.style.background='color-mix(in srgb, var(--color-medium), transparent 35%)'"
                                   onmouseout="this.style.background='color-mix(in srgb, var(--color-medium), transparent 55%)'"
                                   aria-label="Accéder au chat"
                                   title="Chat"
                                >
                        <img src="{{ asset('back/public/icons/chat.svg') }}"
                             alt="Chat"
                             class="w-5 h-5"
                             style="filter: brightness(0) invert(1);"
                        >

                        @if(($pendingMessagesCount ?? 0) > 0)
                            <span class="absolute -top-1 -right-1 text-[11px] font-bold px-2 py-0.5"
                                  style="
                                    background: var(--color-turquoise);
                                    color: var(--color-dark);
                                    border-radius: 999px;
                                    border: 2px solid color-mix(in srgb, var(--color-dark), transparent 0%);
                                  ">
                                {{ $pendingMessagesCount }}
                            </span>
                        @endif
                    </a>
                </span>

                <!-- Dropdown compte -->
                <div class="relative" id="accountDropdown">

                    <button
                        type="button"
                        id="accountDropdownButton"
                        class="px-4 py-2 text-sm font-semibold transition w-full sm:w-auto"
                        style="
                            background: color-mix(in srgb, var(--color-medium), transparent 55%);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                            color: var(--color-white);
                            border-radius: var(--radius-md);
                        "
                    >

                        {{ auth()->user()->name ?? "Compte" }}
                    </button>

                    <!-- Menu -->
                    <div
                        id="accountDropdownMenu"
                        class="hidden absolute right-0 mt-2 w-64 p-2 z-50"
                        style="
                            background: color-mix(in srgb, var(--color-dark), transparent 15%);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                            border-radius: var(--radius-md);
                            backdrop-filter: blur(6px);
                        "
                    >
                        <!-- Header dropdown -->
                        <div class="px-3 py-2">
                            <p class="text-xs uppercase tracking-wide"
                               style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                Admin
                            </p>
                            <p class="text-sm font-semibold" style="color: var(--color-white);">
                                {{ auth()->user()->name ?? 'Compte admin' }}
                            </p>
                            <p class="text-xs"
                               style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                                {{ auth()->user()->email }}
                            </p>
                        </div>

                        <div class="my-2"
                             style="border-top: 1px solid color-mix(in srgb, var(--color-medium), transparent 40%);"></div>

                        <!-- Liens -->

                        <a href="{{ route('profile.edit') }}"
                           class="block px-3 py-2 text-sm font-semibold transition"
                           style="color: var(--color-white); border-radius: var(--radius-md);"
                           onmouseover="this.style.background='color-mix(in srgb, var(--color-medium), transparent 65%)'"
                           onmouseout="this.style.background='transparent'"
                        >
                            Réglages du compte
                        </a>

                        <div class="my-2"
                             style="border-top: 1px solid color-mix(in srgb, var(--color-medium), transparent 40%);"></div>

                        <!-- Logout -->
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button
                                type="submit"
                                class="w-full text-left px-3 py-2 text-sm font-semibold transition"
                                style="color: var(--color-white); border-radius: var(--radius-md);"
                                onmouseover="this.style.background='color-mix(in srgb, var(--color-classic-red), transparent 65%)'"
                                onmouseout="this.style.background='transparent'"
                            >
                                Déconnexion
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </div>
</header>
