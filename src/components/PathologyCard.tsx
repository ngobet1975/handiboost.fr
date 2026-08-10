"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export interface PathologyData {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  benefits: string[];
  benefits_intro?: string;
  benefits_outro?: string;
  precautions: string[];
  precautions_intro?: string;
  recommendedActivities: string[];
  recommendedActivities_intro?: string;
  recommendedActivities_outro?: string;
  whenToAskDoctor: string;
  resources: {
    label: string;
    url: string;
    sourceName?: string;
  }[];
  resources_intro?: string;
  validationStatus: "draft" | "to-review" | "validated";
  lastReviewedAt?: string;
  reviewedBy?: string;
  seoTitle?: string;
  seoDescription?: string;
  oldUrls?: string[];
  status: "published" | "draft" | "archived";
}

function CollapsibleSection({ 
  title, 
  titleBg, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  titleBg: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full">
      <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: titleBg }}>
        <h3 className="text-2xl font-bold text-white m-0">
          {title}
        </h3>
      </div>
      <div className="p-6 md:p-8 flex-1 flex flex-col text-black">
        {isOpen ? (
          <div className="flex-1 animate-in fade-in slide-in-from-top-2 duration-300">
            {children}
          </div>
        ) : (
          <div className="flex-1 relative overflow-hidden max-h-[120px]">
            {children}
            {/* Fade out effect at the bottom when collapsed */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        )}
        
        <div className="mt-6 flex justify-center pt-4 border-t border-slate-100">
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-slate-900 font-bold px-6 py-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            {isOpen ? (
              <>Réduire <ChevronUp className="ml-2 h-5 w-5" /></>
            ) : (
              <>Lire plus <ChevronDown className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PathologyCard({ data }: { data: PathologyData }) {
  const isPendingValidation = data.validationStatus !== "validated";

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-12">
      {/* Avertissement de validation médicale */}
      {isPendingValidation && (
        <div className="bg-orange-50 border-l-8 border-orange-500 p-6 rounded-r-2xl flex gap-4 items-start shadow-sm mb-10">
          <Info className="h-8 w-8 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-orange-900 font-medium text-lg md:text-xl leading-relaxed">
            <strong>Contenu à faire valider par Handiboost ou un professionnel de santé.</strong> Cette fiche clinique synthétique est un modèle en cours de conception et n'a pas encore été officiellement validée.
          </p>
        </div>
      )}

      {/* Les informations */}
      <CollapsibleSection title="Les informations" titleBg="#ED1B5F" defaultOpen={true}>
        <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
          {data.description}
        </div>
      </CollapsibleSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Bénéfices */}
        <CollapsibleSection title="Les bénéfices" titleBg="#1566B1">
          {data.benefits_intro && (
            <p className="text-lg font-bold mb-4 whitespace-pre-wrap">{data.benefits_intro}</p>
          )}
          <ul className="space-y-4 mb-4">
            {data.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-slate-800 shrink-0" />
                <span className="text-lg font-medium leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
          {data.benefits_outro && (
            <p className="text-lg font-medium mt-4 whitespace-pre-wrap">{data.benefits_outro}</p>
          )}
        </CollapsibleSection>

        {/* Précautions */}
        <CollapsibleSection title="Les précautions" titleBg="#FBA91C">
          {data.precautions_intro && (
            <p className="text-lg font-bold mb-4 whitespace-pre-wrap">{data.precautions_intro}</p>
          )}
          <ul className="space-y-4 mb-4">
            {data.precautions.map((precaution, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-slate-800 shrink-0" />
                <span className="text-lg font-medium leading-relaxed">{precaution}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Activités */}
        <CollapsibleSection title="Conseils sur les activités physiques" titleBg="#654B9E">
          {data.recommendedActivities_intro && (
            <p className="text-lg font-medium mb-4 whitespace-pre-wrap">{data.recommendedActivities_intro}</p>
          )}
          <ul className="space-y-4 mb-4">
            {data.recommendedActivities.map((activity, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-slate-800 shrink-0" />
                <span className="text-lg font-medium leading-relaxed">{activity}</span>
              </li>
            ))}
          </ul>
          {data.recommendedActivities_outro && (
            <p className="text-lg font-medium mt-4 whitespace-pre-wrap">{data.recommendedActivities_outro}</p>
          )}
        </CollapsibleSection>

        {/* Ressources */}
        <CollapsibleSection title="Ressources utiles" titleBg="#1566B1">
          {data.resources_intro && (
            <p className="text-lg font-medium mb-4 whitespace-pre-wrap">{data.resources_intro}</p>
          )}
          <ul className="space-y-4">
            {data.resources.map((resource, idx) => (
              <li key={idx}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-lg font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4">
                  {resource.label}
                  <ArrowRight className="h-5 w-5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      </div>

      {/* Avis médical */}
      <div className="mt-8 mx-auto max-w-2xl bg-rose-50 rounded-2xl p-6 border-l-4 border-rose-500 shadow-sm flex items-center justify-center gap-4">
        <Info className="h-6 w-6 text-rose-600 shrink-0" />
        <div className="text-center">
          <h4 className="text-rose-900 font-bold text-lg mb-1">Quand demander un avis médical ?</h4>
          <p className="text-rose-800 font-medium">
            {data.whenToAskDoctor}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="text-center pt-12 flex flex-col items-center">
        <h3 className="text-2xl font-extrabold text-slate-800 mb-6">
          Vous souhaitez pratiquer près de chez vous ?
        </h3>
        <Button nativeButton={false} size="lg" render={<Link href="/pratiquants/ou-pratiquer" className="inline-flex items-center justify-center px-8 py-4" />} className="text-xl font-bold h-auto rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-blue-800 hover:bg-blue-900 text-white w-full sm:w-auto">
          Trouver une activité adaptée <ArrowRight className="ml-3 h-6 w-6 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
