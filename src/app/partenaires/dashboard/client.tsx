'use client'

import React, { useState } from 'react'
import { CheckCircle2, FileText, User, Save, Loader2, PenLine, AlertTriangle } from 'lucide-react'
import { savePartnerProfile, signCharter } from '@/app/partenaires/actions'

const CHARTE_TEXT = `CHARTE DU RÉSEAU HANDIBOOST

La présente charte définit les engagements des structures et professionnels intégrant le Réseau Handiboost.

1. ENGAGEMENT QUALITÉ
Le partenaire s'engage à proposer des activités physiques adaptées (APA) de qualité, encadrées par des professionnels qualifiés et accessibles aux personnes en situation de handicap.

2. ACCUEIL & INCLUSION
Le partenaire garantit un accueil bienveillant, sans discrimination, à toute personne en situation de handicap ou à mobilité réduite, quelles que soient la nature et l'étendue du handicap.

3. INFORMATION & TRANSPARENCE
Le partenaire s'engage à fournir des informations exactes et à jour sur ses activités, ses créneaux, ses tarifs et les aménagements disponibles (accessibilité, matériel adapté, etc.).

4. COLLABORATION
Le partenaire s'engage à coopérer avec Handiboost dans ses missions de promotion et de développement de l'activité physique adaptée sur le territoire.

5. RESPECT DES VALEURS
Le partenaire adhère aux valeurs fondatrices d'Handiboost : inclusion, bienveillance, solidarité et excellence dans l'accompagnement des personnes en situation de handicap.

6. DURÉE & RÉSILIATION
La présente charte prend effet à la date de signature électronique et reste valable tant que le partenariat est actif. Chaque partie peut mettre fin à l'adhésion par notification écrite.

En signant cette charte, le partenaire reconnaît avoir pris connaissance de l'ensemble de ses dispositions et s'engage à les respecter.`

interface PartnerData {
  id?: string
  email?: string
  nom_structure?: string
  nom_contact?: string
  telephone?: string
  adresse?: string
  ville?: string
  code_postal?: string
  site_web?: string
  description?: string
  activites?: string
  charte_signee?: boolean
  charte_signee_le?: string
  charte_signee_par?: string
}

export default function PartnerDashboardClient({
  email,
  initialPartner,
}: {
  email: string
  initialPartner: PartnerData | null
}) {
  const [partner, setPartner] = useState<PartnerData | null>(initialPartner)
  const [tab, setTab] = useState<'charte' | 'fiche'>(
    initialPartner?.charte_signee ? 'fiche' : 'charte'
  )

  // ── Fiche form state ──────────────────────────────────────────────────────
  const [form, setForm] = useState({
    nom_structure: initialPartner?.nom_structure || '',
    nom_contact: initialPartner?.nom_contact || '',
    telephone: initialPartner?.telephone || '',
    adresse: initialPartner?.adresse || '',
    ville: initialPartner?.ville || '',
    code_postal: initialPartner?.code_postal || '',
    site_web: initialPartner?.site_web || '',
    description: initialPartner?.description || '',
    activites: initialPartner?.activites || '',
    est_itinerant: initialPartner?.est_itinerant || false,
    rayon_intervention: initialPartner?.rayon_intervention || '',
  })
  const [savingFiche, setSavingFiche] = useState(false)
  const [ficheMsg, setFicheMsg] = useState('')
  const [ficheError, setFicheError] = useState('')

  // ── Charte state ──────────────────────────────────────────────────────────
  const [charteAccepted, setCharteAccepted] = useState(false)
  const [signingCharte, setSigningCharte] = useState(false)
  const [charteError, setCharteError] = useState('')
  const [signataireName, setSignataireName] = useState(initialPartner?.nom_contact || '')

  const handleSaveFiche = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingFiche(true)
    setFicheMsg('')
    setFicheError('')

    // Créer la fiche en base si elle n'existe pas encore
    if (!partner) {
      const result = await savePartnerProfile(email, form)
      setSavingFiche(false)
      if (result.error) { setFicheError(result.error); return }
      setFicheMsg('Fiche enregistrée avec succès !')
      setPartner({ email, ...form })
    } else {
      const result = await savePartnerProfile(email, form)
      setSavingFiche(false)
      if (result.error) { setFicheError(result.error); return }
      setFicheMsg('Fiche mise à jour avec succès !')
      setPartner(prev => ({ ...prev, ...form }))
    }
  }

  const handleSignCharte = async () => {
    if (!charteAccepted || !signataireName.trim()) return
    
    // Si la fiche n'existe pas, on la crée d'abord avec les infos minimales
    if (!partner) {
      const result = await savePartnerProfile(email, {
        ...form,
        nom_contact: signataireName,
      })
      if (result.error) { setCharteError(result.error); return }
    }

    setSigningCharte(true)
    setCharteError('')
    const result = await signCharter(email, signataireName.trim())
    setSigningCharte(false)
    if (result.error) { setCharteError(result.error); return }
    setPartner(prev => ({
      ...prev,
      charte_signee: true,
      charte_signee_le: new Date().toISOString(),
      charte_signee_par: signataireName.trim(),
    }))
    setTab('fiche')
  }

  return (
    <div>
      {/* ── En-tête ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">
              {partner?.nom_structure || 'Mon Espace Partenaire'}
            </h1>
            <p className="text-slate-500 font-medium text-lg">{email}</p>
          </div>
          {partner?.charte_signee && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Charte signée le {new Date(partner.charte_signee_le!).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      </div>

      {/* ── Onglets ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-8 border-b-2 border-slate-200">
        <button
          onClick={() => setTab('charte')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-base rounded-t-xl transition-all border-b-2 -mb-[2px] ${
            tab === 'charte'
              ? 'border-blue-700 text-blue-700 bg-blue-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Charte Handiboost
          {!partner?.charte_signee && (
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full">!</span>
          )}
        </button>
        <button
          onClick={() => setTab('fiche')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-base rounded-t-xl transition-all border-b-2 -mb-[2px] ${
            tab === 'fiche'
              ? 'border-blue-700 text-blue-700 bg-blue-50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          Ma fiche partenaire
        </button>
      </div>

      {/* ── Onglet Charte ─────────────────────────────────────────────────── */}
      {tab === 'charte' && (
        <div className="space-y-6">
          {partner?.charte_signee ? (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-900 mb-2">Charte signée ✅</h2>
              <p className="text-slate-600 font-medium">
                Signée par <strong>{partner.charte_signee_par}</strong> le{' '}
                <strong>
                  {new Date(partner.charte_signee_le!).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </strong>.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
              {/* Texte de la charte */}
              <div className="bg-slate-50 border-b-2 border-slate-200 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-700" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Charte du Réseau Handiboost</h2>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 max-h-80 overflow-y-auto">
                  <pre className="text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed font-sans">
                    {CHARTE_TEXT}
                  </pre>
                </div>
              </div>

              {/* Signature */}
              <div className="p-6 md:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nom du signataire <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <PenLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={signataireName}
                      onChange={e => setSignataireName(e.target.value)}
                      placeholder="Prénom Nom"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={charteAccepted}
                      onChange={e => setCharteAccepted(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-slate-300 accent-blue-700 cursor-pointer"
                    />
                  </div>
                  <span className="text-slate-700 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                    Je certifie avoir lu et je m'engage à respecter la Charte du Réseau Handiboost dans son intégralité.
                    Cette signature vaut engagement officiel de ma structure.
                  </span>
                </label>

                {charteError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {charteError}
                  </div>
                )}

                <button
                  onClick={handleSignCharte}
                  disabled={!charteAccepted || !signataireName.trim() || signingCharte}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signingCharte ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {signingCharte ? 'Enregistrement...' : 'Signer la Charte Handiboost'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Onglet Fiche ──────────────────────────────────────────────────── */}
      {tab === 'fiche' && (
        <form onSubmit={handleSaveFiche} className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Ma fiche partenaire</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom structure */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nom de la structure / organisation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nom_structure}
                onChange={e => setForm(f => ({ ...f, nom_structure: e.target.value }))}
                required
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Ex : Club Handisport de Lyon"
              />
            </div>

            {/* Nom contact */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nom du responsable <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nom_contact}
                onChange={e => setForm(f => ({ ...f, nom_contact: e.target.value }))}
                required
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Prénom Nom"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="06 00 00 00 00"
              />
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="1 rue de la République"
              />
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ville</label>
              <input
                type="text"
                value={form.ville}
                onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Lyon"
              />
            </div>

            {/* Code postal */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Code postal</label>
              <input
                type="text"
                value={form.code_postal}
                onChange={e => setForm(f => ({ ...f, code_postal: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="69000"
              />
            </div>

            {/* Site web */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Site web</label>
              <input
                type="url"
                value={form.site_web}
                onChange={e => setForm(f => ({ ...f, site_web: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="https://monsite.fr"
              />
            </div>

            {/* Activités */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Activités proposées
              </label>
              <input
                type="text"
                value={form.activites}
                onChange={e => setForm(f => ({ ...f, activites: e.target.value }))}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Ex : Natation adaptée, Yoga, Athlétisme handisport..."
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Présentation de la structure
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                placeholder="Décrivez votre structure, vos valeurs, vos modalités d'accueil..."
              />
            </div>

            {/* Itinérant */}
            <div className="md:col-span-2 border-2 border-orange-100 bg-orange-50 rounded-2xl p-5">
              <label className="flex items-center gap-3 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  checked={form.est_itinerant as boolean}
                  onChange={e => setForm(f => ({ ...f, est_itinerant: e.target.checked }))}
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="text-base font-bold text-orange-800">🚗 Notre structure se déplace chez les pratiquants</span>
              </label>
              <p className="text-sm text-orange-600 ml-8 mb-3">Si votre club propose des séances à domicile, cochez cette case.</p>
              {form.est_itinerant && (
                <div className="ml-8">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Rayon d'intervention (km)</label>
                  <input
                    type="number"
                    min={1} max={500}
                    value={form.rayon_intervention as number}
                    onChange={e => setForm(f => ({ ...f, rayon_intervention: Number(e.target.value) }))}
                    className="w-40 px-4 py-3 border-2 border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Ex: 30"
                  />
                  <span className="ml-2 text-sm text-slate-500 font-medium">km autour de votre adresse</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {ficheMsg && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {ficheMsg}
            </div>
          )}
          {ficheError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {ficheError}
            </div>
          )}

          <button
            type="submit"
            disabled={savingFiche}
            className="mt-8 w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60"
          >
            {savingFiche ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {savingFiche ? 'Enregistrement...' : 'Enregistrer ma fiche'}
          </button>
        </form>
      )}
    </div>
  )
}
