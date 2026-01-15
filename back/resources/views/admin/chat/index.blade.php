@extends('admin.layouts.app')

@section('title', 'Admin — Chat')
@php($subtitle = 'Chat joueurs')

@section('content')

    @php($selectedChannel = $selectedChannel ?? request('channel', 'general'))

    <style>
        /* Tag animé "EN COURS" */
        @keyframes pulseGlow {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.03); opacity: 0.85; }
            100% { transform: scale(1); opacity: 1; }
        }

        .tag-running {
            animation: pulseGlow 1.1s ease-in-out infinite;
        }

        /* Sidebar mobile overlay */
        .chat-overlay {
            position: fixed;
            inset: 0;
            z-index: 60;
            background: rgba(0,0,0,0.55);
            display: none;
            padding: 16px;
        }

        .chat-overlay.is-open {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
        }

        .chat-sidebar-mobile {
            width: 100%;
            max-width: 360px;
        }
    </style>

    <!-- Header -->
    <section class="mt-6 flex items-start justify-between gap-4">
        <div class="min-w-0">
            <h1 class="text-2xl font-bold truncate" style="color: var(--color-white);">
                Chat
            </h1>
            <p class="mt-1 text-sm truncate"
               style="color: color-mix(in srgb, var(--color-white), transparent 35%); text-wrap: wrap">
                Sélectionne une partie pour discuter avec les joueurs.
            </p>
        </div>

        <!-- Burger (mobile only) -->
        <button type="button"
                class="lg:hidden px-3 py-2 text-sm font-semibold transition shrink-0"
                style="
                background: color-mix(in srgb, var(--color-medium), transparent 55%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                color: var(--color-white);
                border-radius: var(--radius-md);
            "
                onclick="openChatSidebar()">
            <img src="{{ asset('back/public/icons/Sort.svg') }}"
                 alt="Burger"
                 class="w-5 h-5"
                 style="filter: brightness(0) invert(1);"
            >
        </button>
    </section>

    <!-- Mobile overlay sidebar -->
    <div id="chatSidebarOverlay" class="chat-overlay" onclick="overlayClick(event)">
        <aside class="chat-sidebar-mobile p-4 flex flex-col"
               style="
                height: calc(100vh - 32px);
                background: var(--color-medium);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
           ">

            <!-- Header fixe -->
            <div class="flex items-start justify-between gap-3 shrink-0">
                <h2 class="font-bold" style="color: var(--color-light-green);">
                    Parties
                </h2>

                <button type="button"
                        class="px-3 py-1 text-sm font-bold"
                        style="
                        color: var(--color-white);
                        border-radius: 999px;
                        background: color-mix(in srgb, var(--color-dark), transparent 35%);
                    "
                        onclick="closeChatSidebar()">
                    <img src="{{ asset('back/public/icons/Close_square.svg') }}"
                         alt="close_chat"
                         class="w-5 h-5"
                         style="filter: brightness(0) invert(1);"
                    >
                </button>
            </div>

            <!-- zone scrollable -->
            <div class="mt-4 flex-1" style="overflow-y: auto; -webkit-overflow-scrolling: touch;">
                <!-- Parties en cours -->
                <div>
                    <p class="text-xs font-semibold uppercase"
                       style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                        Parties en cours
                    </p>

                    <div class="mt-2 flex flex-col gap-2">
                        @forelse($runningParties as $game)
                            <a href="{{ route('admin.chat.show', $game) }}?channel={{ $selectedChannel }}"
                               class="block px-3 py-3 transition"
                               style="
                                background: {{ ($selectedGame?->id === $game->id)
                                    ? 'color-mix(in srgb, var(--color-turquoise), transparent 80%)'
                                    : 'color-mix(in srgb, var(--color-dark), transparent 55%)'
                                }};
                                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                                border-radius: var(--radius-md);
                                color: var(--color-white);
                           ">
                                <div class="flex items-start justify-between gap-2">
                                    <div class="min-w-0">
                                        <p class="text-sm font-semibold truncate">
                                            #{{ $game->id }} — {{ $game->code }}
                                        </p>
                                        <p class="text-xs truncate"
                                           style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                            Partie en cours
                                        </p>
                                    </div>

                                    <span class="tag-running text-[10px] font-bold px-2 py-1 shrink-0"
                                          style="
                                            border-radius: 999px;
                                            background: color-mix(in srgb, var(--color-turquoise), transparent 35%);
                                            color: var(--color-dark);
                                      ">
                                    EN COURS
                                </span>
                                </div>
                            </a>
                        @empty
                            <p class="text-sm mt-2"
                               style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                Aucune partie en cours.
                            </p>
                        @endforelse
                    </div>
                </div>

                <!-- Autres parties -->
                <div class="mt-5">
                    <p class="text-xs font-semibold uppercase"
                       style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                        Autres parties
                    </p>

                    <div class="mt-2 flex flex-col gap-2">
                        @forelse($otherParties as $game)
                            <a href="{{ route('admin.chat.show', $game) }}?channel={{ $selectedChannel }}"
                               class="block px-3 py-3 transition"
                               style="
                                background: {{ ($selectedGame?->id === $game->id)
                                    ? 'color-mix(in srgb, var(--color-turquoise), transparent 80%)'
                                    : 'color-mix(in srgb, var(--color-dark), transparent 55%)'
                                }};
                                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                                border-radius: var(--radius-md);
                                color: var(--color-white);
                           ">
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold truncate">
                                        #{{ $game->id }} — {{ $game->code }}
                                    </p>
                                    <p class="text-xs truncate"
                                       style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                        Statut : {{ $game->status }}
                                    </p>
                                </div>
                            </a>
                        @empty
                            <p class="text-sm mt-2"
                               style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                Aucune autre partie.
                            </p>
                        @endforelse
                    </div>
                </div>
            </div>
        </aside>
    </div>

    <!-- Layout Chat -->
    <section class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Sidebar desktop -->
        <aside class="hidden lg:block lg:col-span-1 p-4"
               style="
                background: color-mix(in srgb, var(--color-medium), transparent 70%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
           ">

            <h2 class="font-bold" style="color: var(--color-light-green);">
                Parties
            </h2>

            <!-- Parties en cours -->
            <div class="mt-4">
                <p class="text-xs font-semibold uppercase"
                   style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                    Parties en cours
                </p>

                <div class="mt-2 flex flex-col gap-2">
                    @forelse($runningParties as $game)
                        <a href="{{ route('admin.chat.show', $game) }}?channel={{ $selectedChannel }}"
                           class="block px-3 py-3 transition"
                           style="
                            background: {{ ($selectedGame?->id === $game->id)
                                ? 'color-mix(in srgb, var(--color-turquoise), transparent 80%)'
                                : 'color-mix(in srgb, var(--color-dark), transparent 55%)'
                            }};
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                            border-radius: var(--radius-md);
                            color: var(--color-white);
                       ">
                            <div class="flex items-start justify-between gap-2">
                                <div class="min-w-0">
                                    <p class="text-sm font-semibold truncate">
                                        #{{ $game->id }} — {{ $game->code }}
                                    </p>
                                    <p class="text-xs truncate"
                                       style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                        Partie en cours
                                    </p>
                                </div>

                                <span class="tag-running text-[10px] font-bold px-2 py-1 shrink-0"
                                      style="
                                        border-radius: 999px;
                                        background: color-mix(in srgb, var(--color-turquoise), transparent 35%);
                                        color: var(--color-dark);
                                  ">
                                EN COURS
                            </span>
                            </div>
                        </a>
                    @empty
                        <p class="text-sm mt-2"
                           style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                            Aucune partie en cours.
                        </p>
                    @endforelse
                </div>
            </div>

            <!-- Autres parties -->
            <div class="mt-5">
                <p class="text-xs font-semibold uppercase"
                   style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                    Autres parties
                </p>

                <div class="mt-2 flex flex-col gap-2">
                    @forelse($otherParties as $game)
                        <a href="{{ route('admin.chat.show', $game) }}?channel={{ $selectedChannel }}"
                           class="block px-3 py-3 transition"
                           style="
                            background: {{ ($selectedGame?->id === $game->id)
                                ? 'color-mix(in srgb, var(--color-turquoise), transparent 80%)'
                                : 'color-mix(in srgb, var(--color-dark), transparent 55%)'
                            }};
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                            border-radius: var(--radius-md);
                            color: var(--color-white);
                       ">
                            <div class="min-w-0">
                                <p class="text-sm font-semibold truncate">
                                    #{{ $game->id }} — {{ $game->code }}
                                </p>
                                <p class="text-xs truncate"
                                   style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                    Statut : {{ $game->status }}
                                </p>
                            </div>
                        </a>
                    @empty
                        <p class="text-sm mt-2"
                           style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                            Aucune autre partie.
                        </p>
                    @endforelse
                </div>
            </div>
        </aside>

        <!-- Zone conversation -->
        <main class="lg:col-span-2 p-4"
              style="
                background: color-mix(in srgb, var(--color-medium), transparent 70%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
          ">

            @if(!$selectedGame)
                <div class="p-6 text-center"
                     style="
                    background: color-mix(in srgb, var(--color-dark), transparent 55%);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                    color: var(--color-white);
                 ">
                    <p class="text-lg font-bold">Aucune partie sélectionnée</p>
                    <p class="mt-1 text-sm"
                       style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                        Clique sur une partie (burger en haut sur mobile) pour ouvrir la conversation.
                    </p>
                </div>
            @else

                <!-- En-tête conversation -->
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <h2 class="font-bold truncate" style="color: var(--color-white);">
                            Partie #{{ $selectedGame->id }} — {{ $selectedGame->code }}
                        </h2>
                        <p class="text-sm truncate"
                           style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                            Canal : <b>{{ strtoupper($selectedChannel) }}</b>
                        </p>
                    </div>

                    @if($selectedGame->status === 'started')
                        <span class="tag-running text-xs font-bold px-3 py-1 shrink-0"
                              style="
                            border-radius: 999px;
                            background: color-mix(in srgb, var(--color-turquoise), transparent 35%);
                            color: var(--color-dark);
                          ">
                        EN COURS
                    </span>
                    @else
                        <span class="text-xs font-bold px-3 py-1 shrink-0"
                              style="
                            border-radius: 999px;
                            background: color-mix(in srgb, var(--color-dark), transparent 35%);
                            color: var(--color-white);
                          ">
                        {{ strtoupper($selectedGame->status) }}
                    </span>
                    @endif
                </div>

                <!-- Switch channels -->
                <div class="mt-4 flex gap-2">
                    <a href="{{ route('admin.chat.show', $selectedGame) }}?channel=general"
                       class="px-3 py-2 text-sm font-semibold"
                       style="
                        border-radius: var(--radius-md);
                        background: {{ $selectedChannel === 'general'
                            ? 'color-mix(in srgb, var(--color-turquoise), transparent 70%)'
                            : 'color-mix(in srgb, var(--color-dark), transparent 55%)' }};
                        color: var(--color-white);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                   ">
                        GENERAL
                    </a>

                    <a href="{{ route('admin.chat.show', $selectedGame) }}?channel=impostor"
                       class="px-3 py-2 text-sm font-semibold"
                       style="
                        border-radius: var(--radius-md);
                        background: {{ $selectedChannel === 'impostor'
                            ? 'color-mix(in srgb, #ff4d4d, transparent 70%)'
                            : 'color-mix(in srgb, var(--color-dark), transparent 55%)' }};
                        color: var(--color-white);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                   ">
                        IMPOSTOR
                    </a>
                </div>

                <!-- Messages -->
                <div id="chatMessagesBox"
                     class="mt-4 flex flex-col gap-2"
                     style="max-height: 340px; overflow:auto;">

                    @forelse($messages as $msg)
                        @if($msg->sender === 'admin')
                            <div class="max-w-[85%] ml-auto px-3 py-2"
                                 style="
                                background: color-mix(in srgb, var(--color-turquoise), transparent 70%);
                                border: 1px solid color-mix(in srgb, var(--color-turquoise), transparent 40%);
                                border-radius: var(--radius-md);
                                color: var(--color-white);
                             ">
                                <p class="text-xs"
                                   style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                    Admin • {{ $msg->created_at->format('H:i') }}
                                </p>
                                <p class="text-sm mt-1">{{ $msg->content }}</p>
                            </div>
                        @else
                            <div class="max-w-[85%] px-3 py-2"
                                 style="
                                background: color-mix(in srgb, var(--color-dark), transparent 45%);
                                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                                border-radius: var(--radius-md);
                                color: var(--color-white);
                             ">
                                <p class="text-xs"
                                   style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                    Joueurs • {{ $msg->created_at->format('H:i') }}
                                </p>
                                <p class="text-sm mt-1">{{ $msg->content }}</p>
                            </div>
                        @endif
                    @empty
                        <p class="text-sm"
                           style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                            Aucun message sur ce canal.
                        </p>
                    @endforelse
                </div>

                <!-- Input -->
                <form id="chatForm"
                      method="POST"
                      action="{{ route('admin.chat.store', $selectedGame) }}"
                      class="mt-4 flex gap-2">
                    @csrf

                    <input type="hidden" name="channel" value="{{ $selectedChannel }}">

                    <input id="chatInput"
                           type="text"
                           name="content"
                           placeholder="Écrire un message…"
                           class="w-full px-4 py-3 text-sm outline-none"
                           required
                           style="
                            background: color-mix(in srgb, var(--color-dark), transparent 55%);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                            border-radius: var(--radius-md);
                            color: var(--color-white);
                       ">

                    <button type="submit"
                            class="px-4 py-3 text-sm font-semibold transition shrink-0"
                            style="
                            background: var(--color-turquoise);
                            color: var(--color-dark);
                            border-radius: var(--radius-md);
                        ">
                        Envoyer
                    </button>
                </form>

            @endif
        </main>
    </section>

    <footer class="mt-8 sm:mt-10 text-center text-xs"
            style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
        Admin — La Click des Chemises Vertes · v1 (Laravel 12)
    </footer>

    <script>
        // auto scroll en bas
        const box = document.getElementById('chatMessagesBox');
        if (box) box.scrollTop = box.scrollHeight;

        function openChatSidebar() {
            document.getElementById('chatSidebarOverlay')?.classList.add('is-open');
        }

        function closeChatSidebar() {
            document.getElementById('chatSidebarOverlay')?.classList.remove('is-open');
        }

        function overlayClick(e) {
            if (e.target.id === 'chatSidebarOverlay') closeChatSidebar();
        }
    </script>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const form = document.getElementById("chatForm");
            const input = document.getElementById("chatInput");

            if (!form || !input) return;

            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const content = input.value.trim();
                if (!content) return;

                const channel = form.querySelector('input[name="channel"]').value;

                const response = await fetch(form.action, {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": form.querySelector('input[name="_token"]').value,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ content, channel })
                });

                if (!response.ok) return;

                input.value = "";
            });
        });
    </script>

    <script src="https://js.pusher.com/8.4.0/pusher.min.js"></script>

    @if($selectedGame)
        <script>
            document.addEventListener("DOMContentLoaded", () => {
                const messagesBox = document.getElementById("chatMessagesBox");
                if (!messagesBox) return;

                const pusher = new Pusher("{{ config('broadcasting.connections.pusher.key') }}", {
                    cluster: "{{ config('broadcasting.connections.pusher.options.cluster') }}",
                    forceTLS: true
                });

                const channel = pusher.subscribe("chat.game.{{ $selectedGame->id }}");

                channel.bind("message.sent", function (data) {
                    if (!data || !data.content) return;

                    // ✅ filtrage par canal actif admin
                    if (data.channel !== "{{ $selectedChannel }}") return;

                    const isAdmin = data.sender === "admin";

                    messagesBox.innerHTML += `
                <div class="max-w-[85%] ${isAdmin ? 'ml-auto' : ''} px-3 py-2"
                    style="
                        background: ${isAdmin
                        ? 'color-mix(in srgb, var(--color-turquoise), transparent 70%)'
                        : 'color-mix(in srgb, var(--color-dark), transparent 45%)'
                    };
                        border: 1px solid ${isAdmin
                        ? 'color-mix(in srgb, var(--color-turquoise), transparent 40%)'
                        : 'color-mix(in srgb, var(--color-medium), transparent 35%)'
                    };
                        border-radius: var(--radius-md);
                        color: var(--color-white);
                    ">
                    <p class="text-xs"
                       style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                        ${isAdmin ? 'Admin' : 'Joueurs'} • ${data.time ?? ''}
                    </p>
                    <p class="text-sm mt-1">${data.content}</p>
                </div>
            `;

                    messagesBox.scrollTop = messagesBox.scrollHeight;
                });
            });
        </script>
    @endif

@endsection
