'use client'

import { useActionState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sendContactMessage } from './actions'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactMessage, null)

  if (state?.success) {
    return (
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Message envoyé !</h2>
          <p className="text-xl text-slate-600 max-w-md mx-auto">{state.success}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Envoyez-nous un message</h2>
      <p className="text-slate-600 mb-8">Remplissez les champs ci-dessous de manière claire. Les champs marqués d&apos;une étoile (*) sont obligatoires.</p>

      {state?.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block font-bold text-slate-800">
              Prénom <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
              placeholder="Votre prénom"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block font-bold text-slate-800">
              Nom <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold text-slate-800">
            Adresse email <span className="text-blue-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
            placeholder="exemple@email.com"
          />
          <p className="text-sm text-slate-500">Nous utiliserons cette adresse pour vous répondre.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="block font-bold text-slate-800">
            Sujet de votre message <span className="text-blue-600">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg bg-white"
          >
            <option value="">Choisissez une raison...</option>
            <option value="activity">Je souhaite trouver une activité physique</option>
            <option value="info">Demande d&apos;information générale</option>
            <option value="pro">Je suis un professionnel de santé</option>
            <option value="club">Je représente un club sportif</option>
            <option value="partnership">Proposition de partenariat</option>
            <option value="other">Autre demande</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block font-bold text-slate-800">
            Votre message <span className="text-blue-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg resize-y"
            placeholder="Écrivez votre message ici de manière claire..."
          ></textarea>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full md:w-auto h-14 px-8 text-lg font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50"
        >
          {isPending ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 w-5 h-5" />
              Envoyer le message
            </>
          )}
        </Button>

        <p className="text-xs text-slate-500 mt-4 text-center md:text-left">
          En envoyant ce formulaire, vous acceptez que l&apos;association Handiboost traite vos données personnelles pour vous répondre.
        </p>
      </form>
    </div>
  )
}
