import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "./ContactForm";

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
            Une question, un besoin d&apos;accompagnement ou une proposition de partenariat ? Notre équipe est à votre écoute.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Informations de contact (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Nos coordonnées</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-lg">Par email</h3>
                    <p className="text-slate-600 mb-1">Pour toute demande générale :</p>
                  </div>
                </div>
                <a href="mailto:handiboost.contact@gmail.com" className="block text-center text-blue-700 font-bold hover:underline text-[13px] min-[375px]:text-sm sm:text-base">
                  handiboost.contact@gmail.com
                </a>
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
            <ContactForm />
          </div>

        </div>

      </div>
    </div>
  );
}
