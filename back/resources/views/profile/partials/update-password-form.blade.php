<section>
    <form method="post" action="{{ route('password.update') }}" class="mt-6 space-y-6">
        @csrf
        @method('put')

        <!-- Current Password -->
        <div>
            <x-input-label
                for="update_password_current_password"
                :value="__('Mot de passe actuel')"
                style="color: color-mix(in srgb, var(--color-white), transparent 25%);"
            />

            <x-text-input
                id="update_password_current_password"
                name="current_password"
                type="password"
                class="mt-1 block w-full"
                autocomplete="current-password"
                style="
                    background: color-mix(in srgb, var(--color-dark), transparent 25%);
                    color: var(--color-white);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                "
            />

            <x-input-error :messages="$errors->updatePassword->get('current_password')" class="mt-2" />
        </div>

        <!-- New Password -->
        <div>
            <x-input-label
                for="update_password_password"
                :value="__('Nouveau mot de passe')"
                style="color: color-mix(in srgb, var(--color-white), transparent 25%);"
            />

            <x-text-input
                id="update_password_password"
                name="password"
                type="password"
                class="mt-1 block w-full"
                autocomplete="new-password"
                style="
                    background: color-mix(in srgb, var(--color-dark), transparent 25%);
                    color: var(--color-white);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                "
            />

            <x-input-error :messages="$errors->updatePassword->get('password')" class="mt-2" />
        </div>

        <!-- Confirm Password -->
        <div>
            <x-input-label
                for="update_password_password_confirmation"
                :value="__('Confirmation mot de passe')"
                style="color: color-mix(in srgb, var(--color-white), transparent 25%);"
            />

            <x-text-input
                id="update_password_password_confirmation"
                name="password_confirmation"
                type="password"
                class="mt-1 block w-full"
                autocomplete="new-password"
                style="
                    background: color-mix(in srgb, var(--color-dark), transparent 25%);
                    color: var(--color-white);
                    border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                    border-radius: var(--radius-md);
                "
            />

            <x-input-error :messages="$errors->updatePassword->get('password_confirmation')" class="mt-2" />
        </div>

        <!-- Actions -->
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

            @if (session('status') === 'password-updated')
                <p class="text-sm font-semibold"
                   style="color: var(--color-light-green);">
                    Mot de passe mis à jour.
                </p>
            @endif
        </div>
    </form>
</section>
