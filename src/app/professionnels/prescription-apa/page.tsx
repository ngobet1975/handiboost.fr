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
  const recommandations = resources.filter(r => r.category === "recommandation");

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
              
              <div className="prose prose-slate max-w-none mb-8">
                <p>
                  Depuis la loi de Modernisation de notre système de santé (2016) et la loi Sport (2022) <strong>(Sources et dates à valider par Handiboost)</strong>, 
                  le médecin traitant ou spécialiste peut prescrire une Activité Physique Adaptée (APA) aux personnes atteintes 
                  d'une Affection de Longue Durée (ALD), d'une maladie chronique, ou présentant des facteurs de risque.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-6">
                  <p className="text-amber-800 font-medium m-0 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>Ces recommandations sont données à titre d'information et doivent toujours être adaptées à l'évaluation clinique personnalisée de votre patient.</span>
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
                    <span className="text-slate-600">Selon la sévérité (Enseignant APA, Masseur-Kinésithérapeute, Éducateur sportif formé).</span>
                  </div>
                </li>
              </ol>
            </section>

            {/* Accordéons Recommandations par pathologie */}
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Fiches par pathologie</h2>
              <p className="text-slate-600 mb-6">
                Fiches d'aide à la prescription détaillant les fréquences, intensités, types d'exercices et précautions.
              </p>
              
              {prescriptions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {prescriptions.map((resource) => (
                    <ProResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">Aucune fiche disponible pour le moment.</p>
              )}
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-8">
            
            {/* Outils à télécharger */}
            <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DownloadIcon className="w-5 h-5" />
                Modèles rapides
              </h3>
              <div className="space-y-4">
                {downloads.map((resource) => (
                  <Button 
                    nativeButton={false}
                    key={resource.id}
                    variant="default"
                    render={<a href={resource.fileUrl || "#"} target="_blank" rel="noopener noreferrer" />}
                    className="w-full h-auto py-4 whitespace-normal text-center flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-100 text-slate-900 rounded-xl"
                  >
                    <span className="font-bold text-base">Télécharger {resource.title.toLowerCase()}</span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Format {resource.format || "PDF"}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Guide HAS */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recommandations Officielles</h3>
              <div className="space-y-4">
                {recommandations.map((resource) => (
                  <ProResourceCard key={resource.id} resource={resource} />
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
