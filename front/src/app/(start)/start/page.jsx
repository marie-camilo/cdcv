'use client';

export const dynamic = 'force-static';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { addPlayer } from '@/hooks/API/gameRequests';
import {
  checkGameState,
  checkPlayerCookie,
  getCodeFromCookie,
  joinGame,
} from '@/hooks/API/rules';

export default function StartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [code, setCode] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Lecture du query param APRÈS hydration
   */
  useEffect(() => {
    const c = searchParams.get('code');
    setCode(c);
  }, [searchParams]);

  /**
   * Guard d’accès (client-only)
   */
  useEffect(() => {
    if (!code) return;

    const init = async () => {
      try {
        const player = await checkPlayerCookie();
        const gameLog = await getCodeFromCookie().catch(() => null);

        if (player?.authenticated || gameLog?.game?.code === code) {
          const state = await checkGameState(code);

          if (state.status === 'waiting') {
            router.replace('/lobby');
            return;
          }

          if (state.status === 'started') {
            router.replace('/');
            return;
          }
        }
      } catch {
        router.replace('/');
      }
    };

    init();
  }, [code, router]);

  /**
   * Protection UI si code absent
   */
  if (code === null) {
    return (
        <main className="min-h-screen flex items-center justify-center text-red-500 font-mono">
          &gt; ERREUR : CODE DE PARTIE MANQUANT
        </main>
    );
  }

  /**
   * Enregistrement joueur
   */
  const handleNext = async () => {
    setErrorMessage('');

    if (!playerName.trim()) {
      setErrorMessage('⛔ IDENTITÉ REQUISE');
      return;
    }

    try {
      await addPlayer(code, playerName);
      await joinGame(code);
      router.push('/lobby');
    } catch (error) {
      const apiError = error?.data?.error;

      switch (apiError) {
        case 'GAME_FULL':
          setErrorMessage('⛔ PARTIE COMPLÈTE');
          break;
        case 'GAME_NOT_JOINABLE':
          setErrorMessage('⛔ PARTIE DÉJÀ DÉMARRÉE');
          break;
        default:
          setErrorMessage('⛔ ERREUR SYSTÈME');
      }
    }
  };

  return (
      <main className="h-full flex flex-col md:max-w-md mx-auto text-white font-mono">
        <section className="flex flex-col h-full justify-center px-6 gap-8">

          <div className="space-y-2">
            <p className="text-xs text-(--color-turquoise)">
              &gt; INITIALISATION SESSION
            </p>
            <h1 className="text-lg tracking-widest">
              ENREGISTREMENT JOUEUR
            </h1>
          </div>

          <div className="border border-(--color-turquoise) p-4 text-xs text-(--color-turquoise)">
            ⚠️ Une fois validée, votre identité ne pourra plus être modifiée.
          </div>

          <div className="space-y-4">
            <label className="block mb-2 text-xs text-(--color-turquoise)">
              &gt; IDENTIFIANT JOUEUR
            </label>

            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="NOM_CODE"
                className="w-full bg-black border-2 border-(--color-turquoise) px-4 py-2 text-(--color-turquoise) outline-none tracking-widest"
            />

            <button
                onClick={handleNext}
                className="w-full mt-4 bg-(--color-turquoise) text-black py-2 hover:bg-green-500 transition"
            >
              VALIDER IDENTITÉ
            </button>

            {errorMessage && (
                <p className="text-red-500 text-xs text-center">
                  {errorMessage}
                </p>
            )}
          </div>

          <p className="text-[10px] text-gray-500 text-center">
            ACCÈS SUPERVISÉ — JOURNALISATION ACTIVE
          </p>
        </section>
      </main>
  );
}
