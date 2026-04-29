'use client'

import { useState } from 'react'
import { sendOtp, verifyOtp } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, KeyRound, ArrowRight, Loader2 } from 'lucide-react'

export function LoginForm({ initialMessage }: { initialMessage: string | null }) {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialMessage)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMsg(null)

    const res = await sendOtp(email)
    
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setSuccessMsg(`Un code à 6 chiffres a été envoyé à ${email}`)
      setStep('otp')
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await verifyOtp(email, code)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // If success, verifyOtp redirects so we don't need to handle it here
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
      {/* Messages */}
      {error && (
        <div className="mb-6 flex items-start gap-3 text-lg font-semibold text-red-700 bg-red-50 border-2 border-red-200 p-5 rounded-2xl">
          <span className="text-2xl">⚠️</span>
          {error}
        </div>
      )}
      
      {successMsg && (
        <div className="mb-6 flex items-start gap-3 text-lg font-semibold text-green-700 bg-green-50 border-2 border-green-200 p-5 rounded-2xl">
          <span className="text-2xl">✅</span>
          {successMsg}
        </div>
      )}

      {/* Email form */}
      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-500" /> Email professionnel
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nom@exemple.com"
              className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium placeholder:text-slate-400 focus-visible:ring-blue-500"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 text-xl rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Recevoir mon code'}
            {!loading && <ArrowRight className="w-6 h-6 ml-2" />}
          </Button>
        </form>
      )}

      {/* OTP form */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <Label htmlFor="code" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-slate-500" /> Code à 6 chiffres
            </Label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="123456"
              maxLength={6}
              className="h-16 text-2xl tracking-[0.5em] text-center bg-slate-50 border-3 border-slate-200 rounded-2xl font-bold placeholder:tracking-normal placeholder:text-slate-300 focus-visible:ring-blue-500"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 text-xl rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            disabled={loading || code.length < 6}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Me connecter'}
            {!loading && <ArrowRight className="w-6 h-6 ml-2" />}
          </Button>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => { setStep('email'); setSuccessMsg(null); setError(null) }}
              className="text-blue-600 font-medium hover:underline"
            >
              Modifier l'adresse email
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
