'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Handshake, Mail, KeyRound, ArrowRight, Loader2 } from 'lucide-react'
import { sendPartnerOtp, verifyPartnerOtp } from '@/app/partenaires/actions'

export default function PartenaireConnexionPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const result = await sendPartnerOtp(email.trim())
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setStep('otp')
      setMessage(`Un code a été envoyé à ${email}. Vérifiez votre boîte mail.`)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) return
    setLoading(true)
    setError('')
    const result = await verifyPartnerOtp(email.trim(), otp.trim())
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else if (result?.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-16">

      {/* Breadcrumb */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 py-4 px-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-base font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/partenaires" className="hover:text-blue-800 hover:underline transition-all">Espace Partenaires</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Connexion</span>
        </div>
      </div>

      <div className="w-full max-w-md mt-16">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-10 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Handshake className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-black mb-2">Accès Partenaires</h1>
            <p className="text-blue-200 font-medium">Réseau Handiboost</p>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <p className="text-slate-700 font-medium text-center mb-6">
                    Entrez votre adresse email professionnelle.<br />
                    Nous vous enverrons un code de connexion.
                  </p>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  {loading ? 'Envoi en cours...' : 'Recevoir mon code'}
                </button>

                <p className="text-center text-sm text-slate-500 font-medium">
                  Première connexion ?{' '}
                  <span className="text-blue-700 font-bold">Entrez votre email et vous recevrez un code.</span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium text-center mb-4">
                      {message}
                    </div>
                  )}
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Code à 6 chiffres
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      inputMode="numeric"
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl text-slate-900 font-black text-center text-3xl tracking-[1rem] focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Handshake className="w-5 h-5" />}
                  {loading ? 'Vérification...' : 'Accéder à mon espace'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('email'); setOtp(''); setError(''); setMessage('') }}
                  className="w-full text-slate-500 hover:text-slate-700 font-medium text-sm py-2 transition-colors"
                >
                  ← Changer d'adresse email
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6 font-medium">
          <Link href="/partenaires" className="hover:text-blue-700 underline">En savoir plus sur l'Espace Partenaires</Link>
        </p>
      </div>
    </div>
  )
}
