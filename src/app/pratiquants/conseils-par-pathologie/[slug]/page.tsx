import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PathologyCard } from "@/components/PathologyCard";
import fs from "fs";
import path from "path";

function loadPathologies(): any[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/pathologies.json'), 'utf8'));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const allPathos = loadPathologies();
  const patho = allPathos.find((p: any) => p.slug === resolvedParams.slug);
  
  if (!patho) return { title: "Fiche introuvable | Handiboost" };

  return {
    title: `${patho.title} et Sport | Handiboost`,
    description: patho.description,
  };
}

export default async function PathologiePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const allPathos = loadPathologies();
  const raw = allPathos.find((p: any) => p.slug === resolvedParams.slug);

  if (!raw) {
    notFound();
  }

  const patho = {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    description: raw.description ?? "",
    benefits: raw.benefits ?? [],
    benefits_intro: raw.benefits_intro,
    benefits_outro: raw.benefits_outro,
    precautions: raw.precautions ?? [],
    precautions_intro: raw.precautions_intro,
    recommendedActivities: raw.recommendedActivities ?? [],
    recommendedActivities_intro: raw.recommendedActivities_intro,
    recommendedActivities_outro: raw.recommendedActivities_outro,
    resources: raw.resources ?? [],
    resources_intro: raw.resources_intro,
    validationStatus: raw.validationStatus,
    whenToAskDoctor: "En cas de douleur inhabituelle ou de doute, consultez votre médecin traitant.",
    status: "published" as const,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            nativeButton={false}
            variant="ghost" 
            render={<Link href="/pratiquants/conseils-par-pathologie" className="text-slate-500 hover:text-slate-800 font-medium text-base px-0" />}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour aux fiches pathologies
          </Button>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header de la Fiche */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm mb-6">
            <FileText className="w-4 h-4" />
            Fiche Santé & Sport
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
            {patho.title}
          </h1>
          {patho.subtitle && (
            <p className="mt-6 text-xl font-medium text-slate-700">
              {patho.subtitle}
            </p>
          )}
        </header>

        {/* Composant de rendu de la fiche structurée */}
        <PathologyCard data={patho} />

      </div>
    </div>
  );
}
