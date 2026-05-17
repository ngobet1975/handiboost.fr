import React from "react";
import { Heart, Users, Target, ArrowRight, Activity, Handshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "L'Association Handiboost | Qui sommes-nous ?",
  description: "Découvrez Handiboost, notre mission, nos valeurs et comment nous facilitons l'accès à l'Activité Physique Adaptée (APA).",
};

export default function AssociationPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Qui est <span className="text-blue-300">Handiboost</span> ?
          </h1>
          <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Nous sommes une association dédiée à la promotion de l'Activité Physique Adaptée (APA) pour tous.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        
        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Mission */}
          <div className="group bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in duration-700 fill-mode-both" style={{ animationDelay: '100ms' }}>
            <div className="w-32 h-32 mb-6 rounded-full group-hover:scale-110 transition-transform duration-500 overflow-hidden flex items-center justify-center bg-blue-50 border-4 border-blue-100 shadow-inner">
              <img src="/bonhommes-handiboost.png" alt="Personnage Handiboost" className="w-full h-full object-cover object-[10%_50%]" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-700 transition-colors">Notre mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              HandiBoost est un guichet unique dédié à l’activité physique adaptée. Il centralise les informations, les contacts et les ressources pour aider les personnes et les professionnels à trouver facilement des solutions adaptées à leurs besoins, sans avoir à chercher sur plusieurs plateformes.
            </p>
          </div>

          {/* Valeurs */}
          <div className="group bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in duration-700 fill-mode-both" style={{ animationDelay: '300ms' }}>
            <div className="w-32 h-32 mb-6 rounded-full group-hover:scale-110 transition-transform duration-500 overflow-hidden flex items-center justify-center bg-emerald-50 border-4 border-emerald-100 shadow-inner">
              <img src="/bonhommes-handiboost.png" alt="Personnage Handiboost" className="w-full h-full object-cover object-[40%_50%]" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors">Nos valeurs</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Accessibilité, inclusion, coopération. Nos valeurs reposent sur l’écoute, le partage et l’échange afin de développer les réseaux selon les spécialités et les retours d’expérience de chacun.
            </p>
          </div>

          {/* Réseau */}
          <div className="group bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in duration-700 fill-mode-both" style={{ animationDelay: '500ms' }}>
            <div className="w-32 h-32 mb-6 rounded-full group-hover:scale-110 transition-transform duration-500 overflow-hidden flex items-center justify-center bg-amber-50 border-4 border-amber-100 shadow-inner">
              <img src="/bonhommes-handiboost.png" alt="Personnage Handiboost" className="w-full h-full object-cover object-[70%_50%]" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-amber-700 transition-colors">Notre réseau</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              HandiBoost s’appuie sur un réseau d’experts — professionnels de santé, paramédicaux, structures sportives et acteurs spécialisés.
            </p>
          </div>

          {/* Objectif */}
          <div className="group bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in duration-700 fill-mode-both" style={{ animationDelay: '700ms' }}>
            <div className="w-32 h-32 mb-6 rounded-full group-hover:scale-110 transition-transform duration-500 overflow-hidden flex items-center justify-center bg-purple-50 border-4 border-purple-100 shadow-inner">
              <img src="/bonhommes-handiboost.png" alt="Personnage Handiboost" className="w-full h-full object-cover object-[95%_50%]" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-purple-700 transition-colors">Notre objectif</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Connecter les initiatives, éviter les doublons et proposer des solutions adaptées, accessibles partout sur le territoire, en faveur des bénéficiaires.
            </p>
          </div>
        </div>

        {/* Pourquoi Handiboost */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                HandiBoost, le Guichet unique de l’activité physique <span className="text-blue-700">pour tous !</span>
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-slate-600 leading-relaxed">
                  L’association HandiBoost crée un réseau complet et accessible, avec plusieurs canaux qui se complètent pour que chacun (bénéficiaires et professionnels) trouve ce dont il a besoin, en autonomie ou avec accompagnement.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Aujourd’hui, accéder à une activité physique adaptée et durable peut vite devenir compliqué : les informations sont dispersées et difficiles à trouver. HandiBoost simplifie ce parcours en centralisant les ressources, en connectant les acteurs et en rendant visibles les créneaux et structures disponibles.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                <Activity className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg mb-1">Expertise</h3>
                <p className="text-slate-600">Des contenus validés</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg mb-1">Humain</h3>
                <p className="text-slate-600">Un réseau engagé</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
            Besoin de nous contacter ?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Vous avez une question, vous souhaitez devenir partenaire ou nous soutenir ? N'hésitez pas à nous écrire.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="text-lg h-14 px-8 rounded-full shadow-md bg-blue-700 hover:bg-blue-800"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Contactez-nous
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
