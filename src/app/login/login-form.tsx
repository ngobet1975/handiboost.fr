'use client'

import { useState } from 'react'
import { sendOtp, verifyOtp } from './actions'
import { sendPartnerOtp, verifyPartnerOtp } from '@/app/partenaires/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, KeyRound, ArrowRight, Loader2, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LoginForm({ initialMessage }: { initialMessage: string | null }) {
  const router = useRouter()
  const [tab, setTab] = useState<'pro' | 'admin' | 'partner'>('pro')
  const [proMode, setProMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const [regNom, setRegNom] = useState('')
  const [regPrenom, setRegPrenom] = useState('')
  const [regProfession, setRegProfession] = useState('')
  const [adminCode, setAdminCode] = useState('')

  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerCode, setPartnerCode] = useState('')
  const [partnerStep, setPartnerStep] = useState<'email' | 'otp'>('email')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialMessage)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const resetMessages = () => { setError(null); setSuccessMsg(null) }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); resetMessages()
    const res = await sendOtp(email)
    if (res.error) { setError(res.error) } else { setSuccessMsg(`Un code a été envoyé à ${email}`); setStep('otp') }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); resetMessages()
    const { registerPro } = await import('./actions')
    const res = await registerPro({ nom: regNom, prenom: regPrenom, profession: regProfession, email })
    if (res.error) { setError(res.error) } else { setSuccessMsg(`Inscription réussie ! Un code a été envoyé à ${email}`); setStep('otp') }
    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); resetMessages()
    const res = await verifyOtp(email, code)
    if (res?.error) { setError(res.error); setLoading(false) }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); resetMessages()
    const { verifyAdminTotp } = await import('./actions')
    const res = await verifyAdminTotp(adminCode)
    if (res?.error) { setError(res.error); setLoading(false) }
  }

  const handlePartnerSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); resetMessages()
    const res = await sendPartnerOtp(partnerEmail.trim())
    if ('error' in res && res.error) { setError(res.error) }
    else { setSuccessMsg(`Un code a été envoyé à ${partnerEmail}`); setPartnerStep('otp') }
    setLoading(false)
  }

  const handlePartnerVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); resetMessages()
    const res = await verifyPartnerOtp(partnerEmail.trim(), partnerCode.trim())
    if ('error' in res && res.error) { setError(res.error); setLoading(false) }
    else if ('redirect' in res && res.redirect) { router.push(res.redirect) }
    else { setLoading(false) }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button onClick={() => { setTab('pro'); resetMessages() }} className={`flex-1 py-4 text-center font-bold text-base transition-colors ${tab === 'pro' ? 'bg-white text-blue-700 border-b-2 border-blue-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
          Accès Pro
        </button>
        <button onClick={() => { setTab('partner'); resetMessages() }} className={`flex-1 py-4 text-center font-bold text-base transition-colors ${tab === 'partner' ? 'bg-white text-orange-600 border-b-2 border-orange-500' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
          🏢 Partenaires
        </button>
        <button onClick={() => { setTab('admin'); resetMessages() }} className={`flex-1 py-4 text-center font-bold text-base transition-colors ${tab === 'admin' ? 'bg-white text-indigo-700 border-b-2 border-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
          Accès Admin
        </button>
      </div>

      <div className="p-8 md:p-10">
        {error && (
          <div className="mb-6 flex items-start gap-3 text-lg font-semibold text-red-700 bg-red-50 border-2 border-red-200 p-5 rounded-2xl">
            <span className="text-2xl">⚠️</span>{error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 flex flex-col bg-green-50 border-2 border-green-200 p-5 rounded-2xl">
            <div className="flex items-start gap-3 text-lg font-semibold text-green-700">
              <span className="text-2xl shrink-0">✅</span>
              <span className="break-all">{successMsg}</span>
            </div>
            <div className="mt-3 bg-green-100/80 p-3 rounded-xl border border-green-200 text-sm font-bold text-green-800 text-center">
              ⚠️ Pensez à vérifier vos courriers indésirables (Spams)
            </div>
          </div>
        )}

        {/* PRO TAB */}
        {tab === 'pro' && (
          <>
            {step === 'email' && proMode === 'login' && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-slate-500" /> Email professionnel
                  </Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="nom@exemple.com" className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium placeholder:text-slate-400 focus-visible:ring-blue-500" />
                </div>
                <Button type="submit" className="w-full h-16 text-xl rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" disabled={loading}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Recevoir mon code'}
                  {!loading && <ArrowRight className="w-6 h-6 ml-2" />}
                </Button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => { setProMode('register'); resetMessages() }} className="text-slate-500 font-medium hover:text-blue-600 transition-colors">
                    Pas encore de compte ? <span className="underline">S'inscrire</span>
                  </button>
                </div>
              </form>
            )}
            {step === 'email' && proMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="regNom" className="text-sm font-bold text-slate-700 mb-1 block">Nom</Label>
                    <Input id="regNom" required value={regNom} onChange={e => setRegNom(e.target.value)} placeholder="Dupont" className="h-12 bg-slate-50" />
                  </div>
                  <div>
                    <Label htmlFor="regPrenom" className="text-sm font-bold text-slate-700 mb-1 block">Prénom</Label>
                    <Input id="regPrenom" required value={regPrenom} onChange={e => setRegPrenom(e.target.value)} placeholder="Jean" className="h-12 bg-slate-50" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="regProfession" className="text-sm font-bold text-slate-700 mb-1 block">Profession</Label>
                  <Input id="regProfession" required value={regProfession} onChange={e => setRegProfession(e.target.value)} placeholder="Kinésithérapeute" className="h-12 bg-slate-50" />
                </div>
                <div>
                  <Label htmlFor="regEmail" className="text-sm font-bold text-slate-700 mb-1 block">Email professionnel</Label>
                  <Input id="regEmail" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@exemple.com" className="h-12 bg-slate-50" />
                </div>
                <Button type="submit" className="w-full h-14 mt-2 text-lg rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Créer mon compte'}
                </Button>
                <div className="text-center mt-3">
                  <button type="button" onClick={() => { setProMode('login'); resetMessages() }} className="text-slate-500 font-medium hover:text-blue-600 transition-colors">
                    Déjà inscrit ? <span className="underline">Se connecter</span>
                  </button>
                </div>
              </form>
            )}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <Label htmlFor="code" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-slate-500" /> Code de sécurité reçu par email
                  </Label>
                  <Input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))} required placeholder="123456" maxLength={6} className="h-16 text-2xl tracking-[0.5em] text-center bg-slate-50 border-3 border-slate-200 rounded-2xl font-bold placeholder:tracking-normal placeholder:text-slate-300 focus-visible:ring-blue-500" />
                </div>
                <Button type="submit" className="w-full h-16 text-xl rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-all hover:-translate-y-1" disabled={loading || code.length < 6}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Me connecter'}
                  {!loading && <ArrowRight className="w-6 h-6 ml-2" />}
                </Button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => { setStep('email'); resetMessages() }} className="text-blue-600 font-medium hover:underline">
                    Modifier l'adresse email
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* PARTNER TAB */}
        {tab === 'partner' && (
          <>
            <div className="flex flex-col gap-3 mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <p className="text-sm font-bold text-orange-800">
                  Espace réservé aux clubs et structures partenaires. Accédez à votre fiche ou créez-en une.
                </p>
              </div>
              <p className="text-sm text-orange-700 ml-9 font-medium">
                Vous n'êtes pas encore partenaire ? Entrez simplement votre email ci-dessous, un code vous sera envoyé pour créer votre espace gratuitement !
              </p>
            </div>
            {partnerStep === 'email' && (
              <form onSubmit={handlePartnerSendOtp} className="space-y-6">
                <div>
                  <Label htmlFor="partnerEmail" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-slate-500" /> Email de votre structure
                  </Label>
                  <Input id="partnerEmail" type="email" value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} required placeholder="club@exemple.com" className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium placeholder:text-slate-400 focus-visible:ring-orange-500" />
                </div>
                <Button type="submit" className="w-full h-16 text-xl rounded-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl transition-all hover:-translate-y-1" disabled={loading}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Recevoir mon code'}
                  {!loading && <ArrowRight className="w-6 h-6 ml-2" />}
                </Button>
              </form>
            )}
            {partnerStep === 'otp' && (
              <form onSubmit={handlePartnerVerify} className="space-y-6">
                <div>
                  <Label htmlFor="partnerCode" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-slate-500" /> Code reçu par email
                  </Label>
                  <Input id="partnerCode" type="text" value={partnerCode} onChange={(e) => setPartnerCode(e.target.value.replace(/\s+/g, ''))} required placeholder="123456" maxLength={6} className="h-16 text-2xl tracking-[0.5em] text-center bg-slate-50 border-3 border-slate-200 rounded-2xl font-bold placeholder:tracking-normal placeholder:text-slate-300 focus-visible:ring-orange-500" />
                </div>
                <Button type="submit" className="w-full h-16 text-xl rounded-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl transition-all hover:-translate-y-1" disabled={loading || partnerCode.length < 6}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Accéder à mon espace'}
                  {!loading && <ArrowRight className="w-6 h-6 ml-2" />}
                </Button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => { setPartnerStep('email'); resetMessages() }} className="text-orange-600 font-medium hover:underline">
                    Modifier l'adresse email
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* ADMIN TAB */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <Label htmlFor="adminCode" className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-slate-500" /> Code d'accès sécurisé
              </Label>
              <Input id="adminCode" type="text" value={adminCode} onChange={(e) => setAdminCode(e.target.value.replace(/\s+/g, ''))} required placeholder="123456" maxLength={6} className="h-16 text-2xl tracking-[0.5em] text-center bg-slate-50 border-3 border-slate-200 rounded-2xl font-bold placeholder:tracking-normal placeholder:text-slate-300 focus-visible:ring-indigo-500" />
            </div>
            <Button type="submit" className="w-full h-16 text-xl rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl transition-all hover:-translate-y-1" disabled={loading || adminCode.length < 6}>
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Connexion Admin'}
              {!loading && <ArrowRight className="w-6 h-6 ml-2" />}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
