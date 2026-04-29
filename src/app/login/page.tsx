import { login, loginWithGoogle } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion | Handiboost',
  description: 'Connectez-vous à votre espace professionnel Handiboost.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const message = typeof params?.message === 'string' ? params.message : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <img src="/logo-handiboost.png" alt="Handiboost" className="h-20 w-auto mx-auto mb-6 drop-shadow-2xl" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Connexion</h1>
          <p className="text-xl text-blue-200 font-medium">Accédez à votre espace professionnel sécurisé</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          
          {/* Google Login Button */}
          <form action={loginWithGoogle} className="mb-8">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-4 bg-white border-3 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl py-5 px-6 text-xl font-bold text-slate-700 transition-all hover:shadow-md"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Se connecter avec Google
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-base font-bold text-slate-400 uppercase tracking-wider">ou par email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email/Password form */}
          <form action={login}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-slate-500" /> Email professionnel
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-500" /> Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>

              {message && (
                <div className="flex items-start gap-3 text-lg font-semibold text-red-700 bg-red-50 border-2 border-red-200 p-5 rounded-2xl">
                  <span className="text-2xl">⚠️</span>
                  {message}
                </div>
              )}

              <Button
                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xl font-black h-16 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all"
                type="submit"
              >
                Se connecter <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>

          {/* Security note */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-3 text-base text-slate-400">
            <Shield className="w-5 h-5" />
            <span>Connexion sécurisée par Supabase Auth</span>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-lg font-bold text-blue-200 hover:text-white transition-colors hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
