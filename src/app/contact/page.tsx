import React from "react";
import { Mail, MapPin, Phone, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contactez-nous | Handiboost",
  description: "Vous avez une question sur l'Activité Physique Adaptée ou sur notre association ? Contactez l'équipe Handiboost.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight flex justify-center items-center gap-4">
            <MessageSquare className="w-10 h-10 md:w-14 md:h-14 text-blue-300" />
            <span>Nous <span className="text-blue-300">contacter</span></span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Une question, un besoin d'accompagnement ou une proposition de partenariat ? Notre équipe est à votre écoute.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Informations de contact (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Nos coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Par email</h3>
                    <p className="text-slate-600 mb-1">Pour toute demande générale :</p>
                    <a href="mailto:contact@handiboost.fr" className="text-blue-700 font-bold hover:underline">
                      contact@handiboost.fr
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-900 text-lg mb-2">Accessibilité</h3>
              <p className="text-blue-800">
                Si vous avez des difficultés à utiliser ce formulaire, vous pouvez nous envoyer un email directement. Nous vous aiderons avec plaisir.
              </p>
            </div>
          </div>

          {/* Formulaire de contact (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Envoyez-nous un message</h2>
              <p className="text-slate-600 mb-8">Remplissez les champs ci-dessous de manière claire. Les champs marqués d'une étoile (*) sont obligatoires.</p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block font-bold text-slate-800">
                      Prénom <span className="text-blue-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="firstName" 
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
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg bg-white"
                  >
                    <option value="">Choisissez une raison...</option>
                    <option value="activity">Je souhaite trouver une activité physique</option>
                    <option value="info">Demande d'information générale</option>
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
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg resize-y"
                    placeholder="Écrivez votre message ici de manière claire..."
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto h-14 px-8 text-lg font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <Send className="mr-2 w-5 h-5" />
                  Envoyer le message
                </Button>
                
                <p className="text-xs text-slate-500 mt-4 text-center md:text-left">
                  En envoyant ce formulaire, vous acceptez que l'association Handiboost traite vos données personnelles pour vous répondre.
                </p>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
