@extends('admin.layouts.app')

@section('title', 'Admin — Partie #' . $game->id)
@php($subtitle = 'Gestion d’une partie')

@section('content')
    @if(session('success'))
        <div class="mt-4 p-3 text-sm font-semibold"
             style="
            background: color-mix(in srgb, var(--color-turquoise), transparent 70%);
            border: 1px solid color-mix(in srgb, var(--color-turquoise), transparent 40%);
            border-radius: var(--radius-md);
            color: var(--color-white);
         ">
            {{ session('success') }}
        </div>
    @endif

    @if(session('error'))
        <div class="mt-4 p-3 text-sm font-semibold"
             style="
            background: color-mix(in srgb, #ff4d4d, transparent 70%);
            border: 1px solid color-mix(in srgb, #ff4d4d, transparent 40%);
            border-radius: var(--radius-md);
            color: var(--color-white);
         ">
            {{ session('error') }}
        </div>
    @endif


    <!-- Header (mobile first) -->
    <section class="mt-6 flex items-start justify-between gap-4">

        <div class="min-w-0">
            <h1 class="text-2xl font-bold truncate" style="color: var(--color-white);">
                Partie #{{ $game->id }}
            </h1>

            <p class="mt-1 text-sm truncate" style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                Code : <span class="font-semibold" style="color: var(--color-white);">{{ $game->code }}</span>
            </p>
        </div>

        <!-- ✅ Même place que "Créer" -->
        <a href="{{ route('admin.games.index') }}"
           class="px-4 py-2 text-sm font-semibold transition shrink-0"
           style="
                background: color-mix(in srgb, var(--color-medium), transparent 55%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                color: var(--color-white);
                border-radius: var(--radius-md);
                display: flex;
                align-content: center;
           ">

            <img src="{{ asset('back/public/icons/Arrow_alt_left_alt.svg') }}"
                 alt="close_chat"
                 class="w-5 h-5"
                 style="filter: brightness(0) invert(1);"
            >
            Retour
        </a>
    </section>

    <!-- Timer -->
    <section class="mt-4 p-4 text-center"
             style="
            background: color-mix(in srgb, var(--color-medium), transparent 70%);
            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
            border-radius: var(--radius-md);
         ">

        <p class="text-xs font-semibold uppercase tracking-wide"
           style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
            Temps restant
        </p>

        <p class="mt-2 font-extrabold js-timer-big"
           style="
            font-size: 42px;
            line-height: 1;
            color: var(--color-white);
            letter-spacing: 1px;
       "
           data-status="{{ $game->status }}"
           data-ends-at-ts="{{ $endsAtTs ?? '' }}">
            @if($game->status === 'waiting')
                --:--
            @elseif($game->status === 'finished')
                00:00
            @else
                00:00
            @endif
        </p>

    </section>

    <!-- Infos rapides -->
    <section class="mt-4 p-4 flex flex-col gap-2"
             style="
                background: color-mix(in srgb, var(--color-medium), transparent 70%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
             ">

        <p class="text-sm" style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
            Statut :

            <span class="shrink-0 px-2 py-1 text-xs font-semibold"
                  style="
                    border-radius: 999px;
                    background: {{ ($game->ui_status ?? '') === 'EN COURS'
                        ? 'color-mix(in srgb, var(--color-turquoise), transparent 35%)'
                        : 'color-mix(in srgb, var(--color-medium), transparent 35%)'
                    }};
                    color: {{ ($game->ui_status ?? '') === 'EN COURS'
                        ? 'var(--color-dark)'
                        : 'var(--color-white)'
                    }};
                  ">
                {{ $game->ui_status }}
            </span>
        </p>

        <p class="mt-1 text-sm" style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
            Joueurs :
            <span class="font-semibold" style="color: var(--color-white);">
                {{ $game->players_count }}/6
            </span>
        </p>

        <p class="mt-2 text-sm font-semibold" style="color: var(--color-turquoise);">
            {{ $game->step_label ?? 'Non définie' }}
        </p>

    </section>

    <!-- Actions principales -->
    <section class="mt-4 grid grid-cols-1 gap-2">

        <!-- START -->
        @if ($game->status === 'waiting')
            <form id="startGameForm" method="POST" action="{{ route('admin.games.start', $game->code) }}">
                @csrf
                <button type="button"
                        class="w-full text-center px-4 py-3 text-sm font-semibold transition js-open-modal"
                        data-modal-title="Démarrer la partie ?"
                        data-modal-text="Cette action attribue les rôles et lance officiellement la partie."
                        data-modal-confirm="Oui"
                        data-form-id="startGameForm"
                        style="
                background: var(--color-turquoise);
                color: var(--color-dark);
                border-radius: var(--radius-md);
            ">
                    Démarrer la partie
                </button>
            </form>
        @endif

        <!-- Chat -->
        <a href="{{ route('admin.chat.show', $game) }}"
           class="w-full text-center px-4 py-3 text-sm font-semibold transition"
           style="
                background: color-mix(in srgb, var(--color-medium), transparent 55%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                color: var(--color-white);
                border-radius: var(--radius-md);
           ">
            Ouvrir le chat
        </a>

    </section>

    <!-- Accordion : Joueurs -->
    <section class="mt-6">

        <button type="button"
                class="w-full flex items-center justify-between gap-4 px-4 py-3 text-sm font-semibold transition js-accordion-btn"
                data-target="#playersAccordion"
                style="
                    background: color-mix(in srgb, var(--color-medium), transparent 70%);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                    color: var(--color-white);
                ">
            <span>Joueurs inscrits</span>
            <span style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                {{ $game->players_count }}/6
            </span>
        </button>

        <div id="playersAccordion"
             class="hidden mt-2 p-4"
             style="
        background: color-mix(in srgb, var(--color-medium), transparent 80%);
        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
        border-radius: var(--radius-md);
     ">

            @if($game->players->isEmpty())
                <p class="text-sm" style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                    Aucun joueur inscrit.
                </p>
            @else

                <div class="flex flex-col gap-2">

                    @foreach($game->players as $player)

                        @php($roleLabel = $player->role ? ucfirst($player->role) : 'Non attribué')
                        @php($impostorLabel = $player->impostor ? 'IMPOSTEUR' : 'JOUEUR')

                        <!-- Player Accordion Button -->
                        <button type="button"
                                class="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition js-accordion-btn"
                                data-target="#playerAccordion{{ $player->id }}"
                                style="
                            background: color-mix(in srgb, var(--color-medium), transparent 75%);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                            border-radius: var(--radius-md);
                            color: var(--color-white);
                        ">

                            <div class="min-w-0 flex flex-col items-start">
                                <span class="truncate" style="color: var(--color-white);">
                                    {{ $player->name ?? 'Joueur' }}
                                </span>

                                <div class="flex gap-2 items-center">
                                    <span class="text-xs"
                                          style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                        {{ $roleLabel }}
                                    </span>

                                    <span class="px-2 py-1 text-[11px] font-bold"
                                          style="
                                            border-radius: 999px;
                                            background: {{ $player->impostor
                                                ? 'color-mix(in srgb, #ff4d4d, transparent 65%)'
                                                : 'color-mix(in srgb, var(--color-turquoise), transparent 65%)'
                                            }};
                                            color: var(--color-white);
                                          ">
                                    {{ $impostorLabel }}
                                </span>

                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <span style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                    <img src="{{ asset('back/public/icons/arrow_down.svg') }}"
                                         alt="Ouvrir"
                                         class="w-4 h-4"
                                         style="filter: brightness(0) invert(1);">
                                </span>
                            </div>

                        </button>

                        <!-- Accordion content -->
                        <div id="playerAccordion{{ $player->id }}"
                             class="hidden p-4"
                             style="
                        margin-top: 8px;
                        background: color-mix(in srgb, var(--color-medium), transparent 85%);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                        border-radius: var(--radius-md);
                     ">

                            <p class="text-xs"
                               style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                                Rôle : <span
                                    style="color: var(--color-white); font-weight: 600;">{{ $roleLabel }}</span><br>
                                Imposteur : <span
                                    style="color: var(--color-white); font-weight: 600;">{{ $player->impostor ? 'Oui' : 'Non' }}</span>
                            </p>

                            <!-- Edit name -->
                            <form method="POST"
                                  action="{{ route('admin.players.update', [$game, $player]) }}"
                                  class="mt-3 flex flex-col gap-2">
                                @csrf
                                @method('PATCH')

                                <input type="text"
                                       name="name"
                                       value="{{ $player->name }}"
                                       class="w-full px-4 py-3 text-sm outline-none"
                                       style="
                                    background: color-mix(in srgb, var(--color-dark), transparent 65%);
                                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                                    border-radius: var(--radius-md);
                                    color: var(--color-white);
                               ">

                                <button type="submit"
                                        class="w-full px-4 py-3 text-sm font-semibold transition"
                                        style="
                                    background: var(--color-turquoise);
                                    color: var(--color-dark);
                                    border-radius: var(--radius-md);
                                "
                                        onmouseover="this.style.opacity='0.9'"
                                        onmouseout="this.style.opacity='1'">
                                    Modifier le nom
                                </button>
                            </form>

                            <!-- Delete player -->
                            <form id="deletePlayerForm{{ $player->id }}"
                                  method="POST"
                                  action="{{ route('admin.players.destroy', [$game, $player]) }}"
                                  class="mt-2">
                                @csrf
                                @method('DELETE')

                                <button type="button"
                                        class="w-full px-4 py-3 text-sm font-semibold transition js-open-modal"
                                        data-modal-title="Supprimer {{ $player->name }} ?"
                                        data-modal-text="Cette action est définitive."
                                        data-modal-confirm="Supprimer"
                                        data-form-id="deletePlayerForm{{ $player->id }}"
                                        style="
                                    background: color-mix(in srgb, #ff4d4d, transparent 75%);
                                    border: 1px solid color-mix(in srgb, #ff4d4d, transparent 45%);
                                    color: var(--color-white);
                                    border-radius: var(--radius-md);
                                ">
                                    Supprimer le joueur
                                </button>
                            </form>

                        </div>

                    @endforeach

                </div>

            @endif

        </div>


    </section>

    <!-- Accordion : Gestion -->
    <section class="mt-4">

        <button type="button"
                class="w-full flex items-center justify-between gap-4 px-4 py-3 text-sm font-semibold transition js-accordion-btn"
                data-target="#manageAccordion"
                style="
                    background: color-mix(in srgb, var(--color-medium), transparent 70%);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                    color: var(--color-white);
                ">
            <span>Gestion</span>
            <span style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                Actions avancées
            </span>
        </button>

        <div id="manageAccordion"
             class="hidden mt-2 p-4 flex flex-col gap-2"
             style="
                background: color-mix(in srgb, var(--color-medium), transparent 80%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
             ">

            <!-- Reset audios -->
            <form id="resetAudioForm" method="POST" action="{{ route('admin.games.audio.reset', $game->code) }}">
                @csrf
                <button type="button"
                        class="w-full text-center px-4 py-3 text-sm font-semibold transition js-open-modal"
                        data-modal-title="Réinitialiser les messages audio ?"
                        data-modal-text="Tous les messages talkie-walkie seront supprimés."
                        data-modal-confirm="Oui"
                        data-form-id="resetAudioForm"
                        style="
                        background: color-mix(in srgb, var(--color-medium), transparent 55%);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                        color: var(--color-white);
                        border-radius: var(--radius-md);
                    ">
                    Réinitialiser les messages audio
                </button>
            </form>

            <!-- Reset audios -->
            <form id="initLabyForm" method="POST" action="{{ route('admin.games.init.labyrinth', $game->code) }}">
                @csrf
                <button type="button"
                        class="w-full text-center px-4 py-3 text-sm font-semibold transition js-open-modal"
                        data-modal-title="Initialiser le labyrinth ?"
                        data-modal-text="Le labyrinth sera associé à la partie en cours."
                        data-modal-confirm="Oui"
                        data-form-id="initLabyForm"
                        style="
                        background: color-mix(in srgb, var(--color-medium), transparent 55%);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                        color: var(--color-white);
                        border-radius: var(--radius-md);
                    ">
                    Initialiser le labyrinthe
                </button>
            </form>


            <!-- Reset (placeholder) -->
            <form id="resetGameForm" method="POST" action="{{ route('admin.games.reset', $game->code) }}">
                @csrf

                <button type="button"
                        class="w-full text-center px-4 py-3 text-sm font-semibold transition js-open-modal"
                        data-modal-title="Réinitialiser la partie ?"
                        data-modal-text="Cette action remet la partie à zéro, en supprimant tous les joueurs et données associées."
                        data-modal-confirm="Oui"
                        data-form-id="resetGameForm"
                        style="
                        background: color-mix(in srgb, var(--color-red-accent), transparent 55%);
                        border: 1px solid color-mix(in srgb, var(--color-red-bright), transparent 30%);
                        color: var(--color-white);
                        border-radius: var(--radius-md);
                    ">
                    Réinitialiser la partie
                </button>
            </form>

        </div>

    </section>

    <!-- MODALE CONFIRMATION -->
    <div id="confirmModal"
         class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center items-center p-4"
         style="background: rgba(0,0,0,0.55);">

        <div class="w-full sm:max-w-md p-4"
             style="
            background: var(--color-medium);
            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
            border-radius: var(--radius-md);
         ">

            <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                    <p id="confirmModalTitle"
                       class="text-base font-bold"
                       style="color: var(--color-white);">
                        Confirmer
                    </p>

                    <p id="confirmModalText"
                       class="mt-1 text-sm"
                       style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                        Texte...
                    </p>
                </div>

                <button type="button"
                        class="text-sm font-bold px-3 py-1"
                        style="
                        color: var(--color-white);
                        border-radius: 999px;
                        background: color-mix(in srgb, var(--color-dark), transparent 35%);
                    "
                        onclick="closeConfirmModal()">
                    ✕
                </button>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
                <button type="button"
                        class="px-4 py-3 text-sm font-semibold"
                        style="
                        background: color-mix(in srgb, var(--color-medium), transparent 55%);
                        border: 1px solid color-mix(in srgb, var(--color-medium), transparent 30%);
                        color: var(--color-white);
                        border-radius: var(--radius-md);
                    "
                        onclick="closeConfirmModal()">
                    Annuler
                </button>

                <button type="button"
                        id="confirmModalConfirmBtn"
                        class="px-4 py-3 text-sm font-semibold"
                        style="
                        background: var(--color-turquoise);
                        color: var(--color-dark);
                        border-radius: var(--radius-md);
                    ">
                    Confirmer
                </button>
            </div>

        </div>
    </div>

    <script>
        let formToSubmitId = null;

        function openConfirmModal({title, text, confirmLabel, formId}) {
            formToSubmitId = formId;

            document.getElementById('confirmModalTitle').textContent = title || "Confirmer l’action";
            document.getElementById('confirmModalText').textContent = text || "";
            document.getElementById('confirmModalConfirmBtn').textContent = confirmLabel || "Confirmer";

            document.getElementById('confirmModal').classList.remove('hidden');
        }

        function closeConfirmModal() {
            document.getElementById('confirmModal').classList.add('hidden');
            formToSubmitId = null;
        }

        document.getElementById('confirmModalConfirmBtn').addEventListener('click', () => {
            if (!formToSubmitId) return;

            const form = document.getElementById(formToSubmitId);
            if (!form) return;

            form.submit();
        });

        // close when clicking outside
        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') closeConfirmModal();
        });

        document.querySelectorAll('.js-open-modal').forEach((btn) => {
            btn.addEventListener('click', () => {
                openConfirmModal({
                    title: btn.dataset.modalTitle,
                    text: btn.dataset.modalText,
                    confirmLabel: btn.dataset.modalConfirm,
                    formId: btn.dataset.formId,
                });
            });
        });

        // ✅ Accordion
        document.querySelectorAll('.js-accordion-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const target = document.querySelector(btn.dataset.target);
                if (!target) return;

                target.classList.toggle('hidden');
            });
        });

        function formatRemainingBig(seconds) {
            if (seconds <= 0) return "00:00";

            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        }

        function updateBigTimer() {
            const el = document.querySelector(".js-timer-big");
            if (!el) return;

            const status = (el.getAttribute("data-status") || "").trim();
            const endsAtTsRaw = (el.getAttribute("data-ends-at-ts") || "").trim();

            if (status === "waiting") {
                el.textContent = "--:--";
                return;
            }

            if (status === "finished") {
                el.textContent = "00:00";
                return;
            }

            if (!endsAtTsRaw) {
                el.textContent = "--:--";
                return;
            }

            const endsAtTs = Number(endsAtTsRaw);

            if (!Number.isFinite(endsAtTs)) {
                el.textContent = "--:--";
                return;
            }

            const nowTs = Math.floor(Date.now() / 1000);
            const diffSeconds = endsAtTs - nowTs;

            el.textContent = formatRemainingBig(diffSeconds);
        }


        updateBigTimer();

        setInterval(updateBigTimer, 1000);
    </script>

@endsection
