'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === 'register';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isRegister && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = isRegister
        ? await registerUser({
            email,
            password,
            displayName: displayName || undefined,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
          })
        : await loginUser({ email, password });

      setSession(response.user);
      router.push('/products');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border border-(--line) bg-(--paper) p-6 shadow-sm sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">
          {isRegister ? 'Créer un compte' : 'Connexion client'}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-(--ink)">
          {isRegister ? 'Inscription' : 'Se connecter'}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-(--muted)">
          {isRegister
            ? 'Créez votre compte pour accéder au panier, finaliser vos commandes et retrouver votre historique.'
            : 'Connectez-vous pour retrouver vos informations et associer vos commandes à votre compte.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isRegister ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-(--ink)">
                Nom affiché
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Awa Diop"
                  className="mt-2 w-full rounded-md border border-(--line) bg-white px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                />
              </label>
              <label className="text-xs text-(--ink)">
                Prénom
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Awa"
                  className="mt-2 w-full rounded-md border border-(--line) bg-white px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                />
              </label>
              <label className="text-xs text-(--ink) sm:col-span-2">
                Nom
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Diop"
                  className="mt-2 w-full rounded-md border border-(--line) bg-white px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                />
              </label>
            </div>
          ) : null}

          <label className="block text-xs text-(--ink)">
            E-mail
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@exemple.com"
              className="mt-2 w-full rounded-md border border-(--line) bg-white px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
            />
          </label>

          <label className="block text-xs text-(--ink)">
            Mot de passe
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-md border border-(--line) bg-white px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
            />
          </label>

          {isRegister ? (
            <label className="block text-xs text-(--ink)">
              Confirmer le mot de passe
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-md border border-(--line) bg-white px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
              />
            </label>
          ) : null}

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center bg-(--ink) px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-(--muted) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Traitement...' : isRegister ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 border-t border-(--line) pt-4 text-sm text-(--muted)">
          {isRegister ? (
            <p>
              Déjà un compte ?{' '}
              <Link href="/login" className="font-semibold text-(--ink) underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          ) : (
            <p>
              Nouveau client ?{' '}
              <Link href="/register" className="font-semibold text-(--ink) underline underline-offset-4">
                Créer un compte
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
