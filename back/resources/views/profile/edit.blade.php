@extends('admin.layouts.app')

@section('title', 'Admin — Réglages du compte')

@php($subtitle = 'Réglages du compte')

@section('content')

    <!-- Title -->
    <section class="mt-6 mb-6">
        <h1 class="text-2xl font-bold" style="color: var(--color-white);">
            Réglages du compte admin
        </h1>

        <p class="mt-1 text-sm" style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
            Modifie ton profil, ton mot de passe et les paramètres de sécurité.
        </p>
    </section>

    <!-- Cards -->
    <section class="grid grid-cols-1 gap-4">

        <!-- Profil -->
        <div
            class="p-5"
            style="
                background: color-mix(in srgb, var(--color-medium), transparent 70%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
            "
        >
            <h2 class="font-bold" style="color: var(--color-light-green);">
                Profil
            </h2>

            <p class="mt-1 text-sm"
               style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                Nom et adresse email du compte admin.
            </p>

            <div class="mt-4">
                @include('profile.partials.update-profile-information-form')
            </div>
        </div>

        <!-- Mot de passe -->
        <div
            class="p-5"
            style="
                background: color-mix(in srgb, var(--color-medium), transparent 70%);
                border: 1px solid color-mix(in srgb, var(--color-medium), transparent 35%);
                border-radius: var(--radius-md);
            "
        >
            <h2 class="font-bold" style="color: var(--color-light-green);">
                Mot de passe
            </h2>

            <p class="mt-1 text-sm"
               style="color: color-mix(in srgb, var(--color-white), transparent 35%);">
                Change le mot de passe pour sécuriser l’accès admin.
            </p>

            <div class="mt-4">
                @include('profile.partials.update-password-form')
            </div>
        </div>

    </section>

    <footer class="mt-8 sm:mt-10 text-center text-xs"
            style="color: color-mix(in srgb, var(--color-white), transparent 45%);">
        Admin — La Click des Chemises Vertes · Réglages
    </footer>

@endsection
