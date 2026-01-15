<x-guest-layout>
    <div class="min-h-screen flex items-center justify-center px-4 py-10">
        <div
            class="w-full max-w-md p-6"
            style="
                background: color-mix(in srgb, var(--color-medium), transparent 70%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
            "
        >
            <!-- Header -->
            <div class="mb-6">
                <p class="text-sm font-semibold"
                   style="color: var(--color-light-green);">
                    Admin — La Click des Chemises Vertes
                </p>
                <h1 class="text-2xl font-bold mt-1" style="color: var(--color-white);">
                    Connexion
                </h1>
                <p class="text-sm mt-2"
                   style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                    Accès réservé à l’équipe d’administration.
                </p>
            </div>

            <!-- Session Status -->
            <x-auth-session-status class="mb-4" :status="session('status')" />

            <form method="POST" action="{{ route('login') }}" class="space-y-4">
                @csrf

                <!-- Email -->
                <div>
                    <x-input-label for="email" :value="__('Email')"
                                   style="color: color-mix(in srgb, var(--color-white), transparent 25%);" />

                    <x-text-input
                        id="email"
                        class="block mt-1 w-full"
                        type="email"
                        name="email"
                        :value="old('email')"
                        required
                        autofocus
                        autocomplete="username"
                        style="
                            background: color-mix(in srgb, var(--color-dark), transparent 25%);
                            color: var(--color-white);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                            border-radius: var(--radius-md);
                        "
                    />

                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                </div>

                <!-- Password -->
                <div>
                    <x-input-label for="password" :value="__('Password')"
                                   style="color: color-mix(in srgb, var(--color-white), transparent 25%);" />

                    <x-text-input
                        id="password"
                        class="block mt-1 w-full"
                        type="password"
                        name="password"
                        required
                        autocomplete="current-password"
                        style="
                            background: color-mix(in srgb, var(--color-dark), transparent 25%);
                            color: var(--color-white);
                            border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                            border-radius: var(--radius-md);
                        "
                    />

                    <x-input-error :messages="$errors->get('password')" class="mt-2" />
                </div>

                <!-- Remember Me -->
                <div class="flex items-center justify-between gap-3">
                    <label for="remember_me" class="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            class="h-4 w-4"
                            style="
                                accent-color: var(--color-turquoise);
                            "
                        >
                        <span class="text-sm"
                              style="color: color-mix(in srgb, var(--color-white), transparent 25%);">
                            {{ __('Remember me') }}
                        </span>
                    </label>
                </div>

                <!-- Submit -->
                <div class="pt-2">
                    <button
                        type="submit"
                        class="w-full px-4 py-3 text-sm font-bold transition"
                        style="
                            background: var(--color-turquoise);
                            color: var(--color-dark);
                            border-radius: var(--radius-md);
                        "
                        onmouseover="this.style.opacity='0.9'"
                        onmouseout="this.style.opacity='1'"
                    >
                        {{ __('Log in') }}
                    </button>

                    <p class="text-xs text-center mt-4"
                       style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
                        © {{ date('Y') }} La Click des Chemises Vertes
                    </p>
                </div>
            </form>
        </div>
    </div>
</x-guest-layout>
