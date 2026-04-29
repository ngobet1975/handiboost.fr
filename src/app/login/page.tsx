import { LoginForm } from './login-form'
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

        {/* Client form handles OTP state */}
        <LoginForm initialMessage={message} />

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
