import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, MapPin, Mail, ArrowLeft, CheckCircle2, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Réseau de Formateurs APA | Espace Professionnels',
  description: 'Trouvez un formateur expert pour accompagner vos équipes, clubs ou structures médicales dans la mise en place du Sport Santé.',
};

export default function FormateursPage() {
  const formateurs = [
    {
      name: "Dr. Sophie Martin",
      role: "Médecin du sport & Formatrice APA",
      region: "Auvergne-Rhône-Alpes",
      specialties: ["Prescription médicale", "Maladies chroniques", "Diabète"],
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
      colorClass: "bg-pink-50"
    },
    {
      name: "Thomas Dubois",
      role: "Enseignant APA-S",
      region: "Île-de-France",
      specialties: ["Handicap moteur", "Neurologie", "Inclusion en club"],
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
      colorClass: "bg-blue-50"
    },
    {
      name: "Marie Leroy",
      role: "Coordinatrice Sport Santé",
      region: "Nouvelle-Aquitaine",
      specialties: ["Vieillissement actif", "Prévention chutes", "Cardiologie"],
      imageUrl: "https://images.unsplash.com/photo-1594824436998-d40cb37ea494?auto=format&fit=crop&q=80&w=300&h=300",
      colorClass: "bg-emerald-50"
    },
    {
      name: "Karim Hassan",
      role: "Préparateur physique & Formateur",
      region: "Occitanie",
      specialties: ["Haut niveau handisport", "Accessibilité matérielle", "Traumatologie"],
      imageUrl: "https://images.unsplash.com/photo-1537368910025-702800faa86b?auto=format&fit=crop&q=80&w=300&h=300",
      colorClass: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/professionnels" className="flex items-center gap-2 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Retour à l'Espace Pro
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 md:mt-16">
        
        {/* Header Section */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center justify-center p-4 bg-pink-100 rounded-3xl mb-6">
              <BookOpen className="w-12 h-12 text-pink-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Réseau de Formateurs
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-6">
              Handiboost s'appuie sur un réseau national d'experts pour former vos équipes à l'accueil et l'accompagnement des publics à besoins spécifiques.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                Formation des éducateurs sportifs
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                Sensibilisation des équipes médicales
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                Accompagnement à la labellisation des clubs
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-pink-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-50" />
            <GraduationCap className="w-16 h-16 text-pink-600 mb-6 relative z-10" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4 relative z-10">Devenir Formateur Handiboost</h2>
            <p className="text-slate-600 mb-8 relative z-10">
              Vous êtes un professionnel de santé ou un enseignant en Activité Physique Adaptée expérimenté ? Rejoignez notre réseau et partagez votre expertise.
            </p>
            <button className="w-full py-4 bg-pink-600 text-white rounded-2xl font-bold text-lg hover:bg-pink-700 transition-colors relative z-10 shadow-md">
              Soumettre ma candidature
            </button>
          </div>
        </section>

        {/* Trainers Grid */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-8">Annuaire des formateurs (Démonstration)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formateurs.map((trainer, idx) => (
              <div 
                key={idx} 
                className="group bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className={`h-32 ${trainer.colorClass} relative`}>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <img 
                      src={trainer.imageUrl} 
                      alt={trainer.name} 
                      className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                
                <div className="pt-16 pb-8 px-6 flex-1 flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{trainer.name}</h3>
                  <p className="text-slate-500 font-medium text-sm mb-4">{trainer.role}</p>
                  
                  <div className="flex items-center gap-1.5 text-slate-600 text-sm mb-6 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {trainer.region}
                  </div>
                  
                  <div className="w-full flex-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Spécialités</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {trainer.specialties.map((spec, i) => (
                        <span key={i} className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
