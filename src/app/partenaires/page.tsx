import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Handshake, ShieldCheck, FileText, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Espace Partenaires — Réseau Handiboost',
  description: 'Rejoignez le Réseau Handiboost en tant que partenaire. Créez votre fiche, renseignez vos informations et signez la charte Handiboost.',
  alternates: { canonical: '/partenaires' },
}

const AVANTAGES = [
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: 'Visibilité auprès des pros',
    desc: 'Votre structure référencée dans le Guide Booster utilisé par les professionnels de santé.',
    color: 'bg-blue-600',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: 'Label Réseau Handiboost',
    desc: 'Attestez votre engagement en faveur de l'activité physique adaptée pour les personnes en situation de handicap.',
    color: 'bg-purple-600',
  },
  {
    icon: <FileText className="w-8 h-8 text-white" />,
    title: 'Charte & engagement qualité',
    desc: 'Accédez à la Charte Handiboost et signez-la électroniquement pour officialiser votre appartenance au réseau.',
    color: 'bg-emerald-600',
  },
  {
    icon: <Handshake className="w-8 h-8 text-white" />,
    title: 'Réseau national',
    desc: 'Rejoignez un réseau national de structures et de professionnels engagés pour le sport inclusif.',
    color: 'bg-orange-600',
  },
]

export default function PartenairesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Espace Partenaires</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="py-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 px-5 py-2.5 rounded-full font-bold text-sm mb-8">
            <Handshake className="w-5 h-5" />
            Accès Partenaires — Réseau Handiboost
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Rejoignez le<br />
            <span className="text-blue-700">Réseau Handiboost</span>
          </h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed mb-10">
            Vous êtes une structure sportive, une association ou un professionnel de santé ?<br />
            Rejoignez notre réseau, créez votre fiche et signez la Charte Handiboost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partenaires/connexion"
              className="inline-flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-black text-xl px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Accéder à mon espace
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>

        {/* ── Avantages ─────────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center">
            Pourquoi devenir partenaire ?
          </h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12 max-w-2xl mx-auto">
            Intégrer le Réseau Handiboost, c'est s'engager pour l'inclusion sportive et bénéficier d'une visibilité nationale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AVANTAGES.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex gap-6 items-start"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────────────────── */}
        <section className="mb-20 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Prêt à rejoindre le réseau ?</h2>
          <p className="text-xl font-medium opacity-90 mb-10 max-w-xl mx-auto">
            L'inscription est gratuite et ouverte à toutes les structures engagées dans l'activité physique adaptée.
          </p>
          <Link
            href="/partenaires/connexion"
            className="inline-flex items-center gap-3 bg-white text-blue-800 font-black text-xl px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 hover:bg-blue-50"
          >
            Créer mon espace partenaire
            <ArrowRight className="w-6 h-6" />
          </Link>
        </section>

      </div>
    </div>
  )
}
