import React from "react";
import Link from "next/link";
import { ChevronLeft, FileText, CheckCircle2, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProResourceCard, ProResource } from "@/components/ProResourceCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Aide à la Prescription APA | Espace Professionnels Handiboost",
  description: "Ressources, cadre légal et fiches pratiques pour accompagner les médecins dans la prescription d'Activité Physique Adaptée.",
};

export default async function PrescriptionApaPage() {
  const supabase = await createClient();
  const { data: rawResources } = await supabase
    .from("professional_resources")
    .select("*")
    .eq("status", "published")
    .eq("validation_status", "validated")
    .in("category", ["telechargement", "prescription", "recommandation"]);

  const resources: ProResource[] = (rawResources ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    category: r.category ?? "prescription",
    format: r.format ?? "pdf",
    fileUrl: r.file_url ?? undefined,
    externalUrl: r.url ?? undefined,
    sourceName: r.source ?? "",
    status: r.status ?? "published",
  }));
  
  // Grouper les ressources
  const downloads = resources.filter(r => r.category === "telechargement");
  const prescriptions = resources.filter(r => r.category === "prescription");

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Button 
            nativeButton={false}
            variant="ghost" 
            render={<Link href="/professionnels" className="text-slate-500 hover:text-slate-800 font-medium text-base px-0" />}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour à l'espace Professionnels
          </Button>
        </div>

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            Aide à la prescription <span className="text-blue-700">d'Activité Physique Adaptée (APA)</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">
            Retrouvez ici le cadre réglementaire, les recommandations par pathologie et les outils pratiques pour accompagner les personnes vers une activité physique adaptée en toute sécurité.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Cadre et Étapes */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Le cadre de la prescription
              </h2>
              
              <div className="prose prose-slate max-w-none mb-6">
                <p>
                  Depuis la loi de Modernisation de notre système de santé (2016) et la loi Sport (2022), le médecin peut prescrire une Activité Physique Adaptée (APA) aux personnes atteintes d'une Affection de Longue Durée (ALD), d'une maladie chronique, ou présentant des facteurs de risque.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mt-4 text-sm rounded-r-lg">
                  <p className="text-amber-800 font-medium m-0 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Recommandations données à titre d'information, à adapter à l'évaluation clinique.</span>
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4 mt-8">Les 3 étapes pour prescrire :</h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">1</div>
                  <div>
                    <strong className="text-slate-800 block mb-1">L'évaluation initiale</strong>
                    <span className="text-slate-600">Évaluation médicale, repérage des contre-indications et évaluation de la motivation du patient.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">2</div>
                  <div>
                    <strong className="text-slate-800 block mb-1">La prescription spécifique</strong>
                    <span className="text-slate-600">Utilisation d'un formulaire type (téléchargeable ci-contre) en précisant les limites et précautions.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">3</div>
                  <div>
                    <strong className="text-slate-800 block mb-1">L'orientation vers le bon professionnel</strong>
                    <span className="text-slate-600">Selon la sévérité (Enseignant en APA, Masseur-Kinésithérapeute, Éducateur sportif formé).</span>
                  </div>
                </li>
              </ol>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Outil de prescription Vidal / HAS</h2>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-center">
                 <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Prescription de l'activité physique par le médecin traitant</h3>
                    <p className="text-slate-600 mb-4">Accédez à l'outil en ligne recommandé par la Haute Autorité de Santé (HAS) et Vidal pour la prescription d'une activité physique en fonction des différentes pathologies.</p>
                 </div>
                 <Button nativeButton={false} render={<a href="https://www.has-sante.fr/jcms/p_3389811/fr/prescription-de-l-activite-physique-par-le-medecin-traitant" target="_blank" rel="noopener noreferrer" />} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl px-6 w-full md:w-auto shrink-0">
                    Accéder à l'outil HAS <ExternalLink className="ml-2 w-4 h-4" />
                 </Button>
              </div>
            </section>

            {/* Accordéons Recommandations par pathologie */}
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Guides & Fiches par pathologie (HAS / SFP-APA)</h2>
              <p className="text-slate-600 mb-6">
                Fiches d'aide à la prescription détaillant les fréquences, intensités, types d'exercices et précautions. Faites défiler horizontalement pour voir toutes les fiches.
              </p>
              
              {prescriptions.length > 0 ? (
                <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                  {prescriptions.map((resource) => (
                    <div key={resource.id} className="snap-start shrink-0 w-[85%] sm:w-[320px]">
                      <ProResourceCard resource={resource} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">Aucune fiche disponible pour le moment.</p>
              )}
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 mt-8">Ressources Utiles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Guide des consultations HAS</h3>
                    <p className="text-slate-600 text-sm mb-4">Guide sur la consultation médicale de prescription d'Activité Physique Adaptée.</p>
                    <a href="https://www.has-sante.fr/jcms/p_3389811/fr/prescription-de-l-activite-physique-par-le-medecin-traitant" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-sm"><ExternalLink className="w-4 h-4" /> Voir le guide HAS</a>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Savoir prescrire - URPS AURA</h3>
                    <p className="text-slate-600 text-sm mb-4">Le guide de l'URPS Médecins Libéraux Auvergne-Rhône-Alpes.</p>
                    <a href="https://www.urps-med-aura.fr/savoir-prescrire" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-sm"><ExternalLink className="w-4 h-4" /> Voir le guide URPS</a>
                 </div>
              </div>
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-8">
            
            {/* Outils à télécharger */}
            <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DownloadIcon className="w-5 h-5 shrink-0" />
                Modèles de prescription de l'APA
              </h3>
              <div className="space-y-4">
                {downloads.map((resource) => (
                  <Button 
                    nativeButton={false}
                    key={resource.id}
                    variant="default"
                    render={<a href={resource.fileUrl || "#"} target="_blank" rel="noopener noreferrer" download={resource.format === 'pdf' ? true : undefined} />}
                    className="w-full h-auto py-4 whitespace-normal text-center flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-100 text-slate-900 rounded-xl"
                  >
                    <span className="font-bold text-base">Télécharger {resource.title.toLowerCase()}</span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Format {resource.format || "PDF"}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Lien Guide Booster */}
            <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl text-teal-900">
              <h3 className="text-lg font-bold mb-3 leading-snug">Vous cherchez une structure adaptée pour orienter une personne ?</h3>
              <p className="text-sm text-teal-800 mb-5">
                Utilisez l'annuaire métier réservé aux professionnels.
              </p>
              <Button 
                nativeButton={false}
                render={<Link href="/guide-booster" />}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold h-12 rounded-xl"
              >
                Accéder au Guide Booster <ArrowRight className="ml-2 w-4 h-4 shrink-0" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
