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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Notre Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Faciliter l'accès au sport pour les personnes en situation de handicap ou atteintes de maladies chroniques.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Nos Valeurs</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Inclusion, bienveillance et rigueur médicale. L'Activité Physique Adaptée doit être accessible et sécurisée.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-6">
              <Handshake className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Notre Réseau</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nous fédérons des professionnels de santé, des enseignants en APA et des clubs sportifs engagés.
            </p>
          </div>
        </div>

        {/* Pourquoi Handiboost */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Le sport santé, <span className="text-blue-700">notre priorité</span>
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-slate-600 leading-relaxed">
                  L'Activité Physique Adaptée (APA) n'est pas qu'un simple loisir. C'est un véritable outil thérapeutique qui améliore la qualité de vie, réduit la fatigue et permet de mieux vivre avec sa pathologie.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Notre équipe travaille chaque jour pour vous fournir des informations claires, validées par des professionnels, et pour vous aider à trouver la bonne structure près de chez vous.
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
