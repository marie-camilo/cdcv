<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin — La Click des Chemises Vertes')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="min-h-screen">

<div class="layout-container">

    {{-- Header réutilisable --}}
    @if(!request()->routeIs('admin.games.show'))
        @include('admin.partials.header', [
            'subtitle' => $subtitle ?? null
        ])
    @endif

    <main class="layout-content max-w-7xl mx-auto w-full px-4 sm:px-6">
        @yield('content')
    </main>

</div>

<script>
    (function () {
        const dropdown = document.getElementById('accountDropdown');
        const button = document.getElementById('accountDropdownButton');
        const menu = document.getElementById('accountDropdownMenu');

        if (!dropdown || !button || !menu) return;

        function closeMenu() {
            menu.classList.add('hidden');
        }

        function toggleMenu() {
            menu.classList.toggle('hidden');
        }

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', () => closeMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    })();
</script>

</body>
</html>
