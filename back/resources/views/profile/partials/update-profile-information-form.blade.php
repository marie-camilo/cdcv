<section>
    <form method="post" action="{{ route('profile.update') }}" class="mt-6 space-y-6">
        @csrf
        @method('patch')

        {{-- Name --}}
        <div>
            <x-input-label
                for="name"
                :value="__('Nom')"
                style="color: color-mix(in srgb, var(--color-white), transparent 25%);"
            />

            <x-text-input
                id="name"
                name="name"
                type="text"
                class="mt-1 block w-full"
                :value="old('name', $user->name)"
                required
                autofocus
                autocomplete="name"
                style="
                    background: color-mix(in srgb, var(--color-dark), transparent 25%);
                    color: var(--color-white);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                "
            />

            <x-input-error class="mt-2" :messages="$errors->get('name')" />
        </div>

        {{-- Email --}}
        <div>
            <x-input-label
                for="email"
                :value="__('Email')"
                style="color: color-mix(in srgb, var(--color-white), transparent 25%);"
            />

            <x-text-input
                id="email"
                name="email"
                type="email"
                class="mt-1 block w-full"
                :value="old('email', $user->email)"
                required
                autocomplete="username"
                style="
                    background: color-mix(in srgb, var(--color-dark), transparent 25%);
                    color: var(--color-white);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                "
            />

            <x-input-error class="mt-2" :messages="$errors->get('email')" />
        </div>

        {{-- Actions --}}
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">

            <button
                type="submit"
                class="px-4 py-2 text-sm font-bold transition w-full sm:w-auto"
                style="
                    background: var(--color-turquoise);
                    color: var(--color-dark);
                    border-radius: var(--radius-md);
                "
                onmouseover="this.style.opacity='0.9'"
                onmouseout="this.style.opacity='1'"
            >
                Sauvegarder
            </button>

            @if (session('status') === 'profile-updated')
                <p class="text-sm font-semibold"
                   style="color: var(--color-light-green);">
                    Sauvegardé
                </p>
            @endif

        </div>
    </form>
</section>
