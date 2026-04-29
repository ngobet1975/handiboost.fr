import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Heart, Users, Trophy, Gift, ExternalLink, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Adhésions et Dons | Handiboost',
  description: 'Soutenez Handiboost en faisant un don ou en devenant adhérent. Chaque contribution aide à rendre le sport accessible aux personnes en situation de handicap.',
  alternates: {
    canonical: '/dons',
  }
};

export default function DonsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Adhésions et dons</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 md:py-24 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full font-bold text-lg mb-8">
            <Heart className="w-5 h-5 text-pink-300" />
            Soutenez le sport adapté
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            Ensemble, rendons le sport <span className="text-yellow-300">accessible à tous</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
            Chaque don, peu importe sa taille, compte énormément. En soutenant Handiboost, vous devenez partenaire d'un avenir sportif inclusif.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <a
              href="https://www.helloasso.com/associations/handiboost"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xl font-black h-auto py-5 px-10 rounded-2xl shadow-2xl hover:-translate-y-1 transition-all">
                <Gift className="w-6 h-6 mr-3" />
                Faire un don
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a
              href="https://www.helloasso.com/associations/handiboost/adhesions/adhesion-1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xl font-bold h-auto py-5 px-10 rounded-2xl border-2 border-white/30 hover:-translate-y-1 transition-all">
                <Users className="w-6 h-6 mr-3" />
                Devenir adhérent
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">

        {/* Impact Section */}
        <section className="py-16 md:py-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 text-center mb-6">
            Votre soutien en action
          </h2>
          <p className="text-xl text-slate-600 text-center max-w-3xl mx-auto mb-12">
            Votre générosité nous permet de perpétuer nos actions et de développer de nouveaux projets pour atteindre nos objectifs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Événements sportifs</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Organisation de journées de découverte, ateliers et rencontres sportives accessibles à tous.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
              <div className="w-20 h-20 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Outils numériques</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Développement de ressources en ligne pour les pratiquants et les professionnels de santé.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm hover:shadow-lg transition-all text-center">
              <div className="w-20 h-20 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Sensibilisation</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Actions de sensibilisation auprès du grand public et des professionnels sur les bienfaits du sport adapté.
              </p>
            </div>
          </div>
        </section>

        {/* Two Options: Don + Adhésion */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Don */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-8 md:p-10 border-2 border-yellow-200 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm mb-6">
              <Gift className="w-4 h-4" /> Don libre
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Faire un don</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Votre don est 100% sécurisé via HelloAsso. Vous recevrez un reçu fiscal pour votre déclaration d'impôts.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Don libre, du montant de votre choix</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Déductible des impôts (66% du montant)</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Reçu fiscal envoyé automatiquement</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Paiement sécurisé HelloAsso</span>
              </li>
            </ul>
            <a
              href="https://www.helloasso.com/associations/handiboost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-black text-xl h-auto py-5 rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
                Faire un don <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          {/* Adhésion */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-10 border-2 border-blue-200 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm mb-6">
              <Users className="w-4 h-4" /> Adhésion
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Devenir adhérent</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Rejoignez la communauté Handiboost et participez activement au développement du sport adapté.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Accès aux événements réservés aux membres</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Participation aux assemblées générales</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Newsletter et informations en avant-première</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-slate-700">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Contribuez à orienter les projets de l'association</span>
              </li>
            </ul>
            <a
              href="https://www.helloasso.com/associations/handiboost/adhesions/adhesion-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black text-xl h-auto py-5 rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
                Adhérer à l'association <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </section>

        {/* Trust section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 border-2 border-slate-100 shadow-sm text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900">Paiement 100% sécurisé</h3>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Tous les paiements sont gérés par <strong>HelloAsso</strong>, la plateforme de référence pour les associations françaises. Vos données bancaires ne transitent jamais par notre site.
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <span className="text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg">🔒 SSL/TLS</span>
            <span className="text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg">🇫🇷 Hébergé en France</span>
            <span className="text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg">📄 Reçu fiscal</span>
          </div>
        </section>

        {/* Contact fallback */}
        <section className="text-center">
          <p className="text-lg text-slate-600">
            Vous avez une question ? Écrivez-nous à{' '}
            <a href="mailto:handiboost.contact@gmail.com" className="font-bold text-blue-700 hover:underline">
              handiboost.contact@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
