import React from "react";
import Link from "next/link";
import { ChevronLeft, Wrench, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProResourceCard, ProResource } from "@/components/ProResourceCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Outils d'Accompagnement APA | Espace Professionnels Handiboost",
  description: "Ressources, bilans, tests et supports pédagogiques pour les professionnels du sport adapté et de la santé.",
};

export default async function OutilsAccompagnementPage() {
  const supabase = await createClient();
  const { data: rawResources } = await supabase
    .from("professional_resources")
    .select("*")
    .eq("status", "published")
    .eq("validation_status", "validated")
    .in("category", ["bilan", "pedagogie", "recommandation"]);

  const resources: ProResource[] = (rawResources ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    category: r.category ?? "bilan",
    format: r.format ?? "pdf",
    fileUrl: r.file_url ?? undefined,
    externalUrl: r.url ?? undefined,
    sourceName: r.source ?? "",
    status: r.status ?? "published",
  }));
  
  // Categorization
  const bilans = resources.filter(r => r.category === "bilan");
  const pedagogies = resources.filter(r => r.category === "pedagogie");
  const recommandations = resources.filter(r => r.category === "recommandation");

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
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
        <section className="mb-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight flex items-center gap-4">
            <Wrench className="w-10 h-10 md:w-12 md:h-12 text-blue-700" />
            Boîte à outils <span className="text-blue-700">d'accompagnement</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Évaluez vos patients, suivez leur progression et trouvez des ressources pédagogiques pour adapter vos séances d'Activité Physique.
          </p>
        </section>

        {/* Section Bilan et Évaluation */}
        {bilans.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-slate-800">Outils d'évaluation et bilans</h2>
              <div className="h-px bg-slate-200 flex-grow ml-4 hidden sm:block"></div>
            </div>
            <p className="text-slate-600 mb-8 max-w-3xl">
              Grilles de tests, évaluations de l'autonomie et questionnaires pour réaliser le bilan initial du patient (Aides au bilan APA).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bilans.map((resource) => (
                <ProResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        )}

        {/* Section Pédagogie */}
        {pedagogies.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-slate-800">Ressources Pédagogiques</h2>
              <div className="h-px bg-slate-200 flex-grow ml-4 hidden sm:block"></div>
            </div>
            <p className="text-slate-600 mb-8 max-w-3xl">
              Fiches d'exercices, carnets de suivi et livrets pratiques pour animer vos séances.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pedagogies.map((resource) => (
                <ProResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        )}

        {/* Section Recommandations Externes */}
        {recommandations.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-slate-800">Guides et Recommandations</h2>
              <div className="h-px bg-slate-200 flex-grow ml-4 hidden sm:block"></div>
            </div>
            <p className="text-slate-600 mb-8 max-w-3xl">
              Supports documentaires édités par les fédérations et ministères pour l'inclusion dans le sport.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommandations.map((resource) => (
                <ProResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
