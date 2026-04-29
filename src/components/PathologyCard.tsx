import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Activity, AlertTriangle, Heart, Stethoscope, Link as LinkIcon, Info } from 'lucide-react';
import Link from 'next/link';

export interface PathologyData {
  id: string;
  title: string;
  slug: string;
  description: string;
  benefits: string[];
  precautions: string[];
  recommendedActivities: string[];
  whenToAskDoctor: string;
  resources: {
    label: string;
    url: string;
    sourceName?: string;
  }[];
  validationStatus: "draft" | "to-review" | "validated";
  lastReviewedAt?: string;
  reviewedBy?: string;
  seoTitle?: string;
  seoDescription?: string;
  oldUrls?: string[];
  status: "published" | "draft" | "archived";
}

export function PathologyCard({ data }: { data: PathologyData }) {
  const isPendingValidation = data.validationStatus !== "validated";

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Avertissement de validation médicale */}
      {isPendingValidation && (
        <div className="bg-orange-50 border-l-8 border-orange-500 p-6 rounded-r-2xl flex gap-4 items-start shadow-sm">
          <Info className="h-8 w-8 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-orange-900 font-medium text-xl leading-relaxed">
            <strong>Contenu à faire valider par Handiboost ou un professionnel de santé.</strong> Cette fiche clinique synthétique est un modèle en cours de conception et n'a pas encore été officiellement validée.
          </p>
        </div>
      )}

      {/* Résumé */}
      <section className="bg-primary/5 p-8 md:p-10 rounded-3xl border-l-8 border-primary shadow-sm">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">L'essentiel à retenir</h2>
        <p className="text-2xl leading-relaxed text-gray-800 font-medium">{data.description}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Bénéfices */}
        <Card className="shadow-lg border-0 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-green-50 pb-5">
            <CardTitle className="flex items-center gap-4 text-3xl font-bold text-green-900">
              <Heart className="h-10 w-10 text-green-600" />
              Les bénéfices
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-6 pb-8">
            <ul className="space-y-6">
              {data.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-2 h-3 w-3 rounded-full bg-green-500 shrink-0" />
                  <span className="text-xl text-gray-800 font-medium leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Précautions */}
        <Card className="shadow-lg border-0 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-amber-50 pb-5">
            <CardTitle className="flex items-center gap-4 text-3xl font-bold text-amber-900">
              <AlertTriangle className="h-10 w-10 text-amber-600" />
              Les précautions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-6 pb-8">
            <ul className="space-y-6">
              {data.precautions.map((precaution, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-2 h-3 w-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xl text-gray-800 font-medium leading-relaxed">{precaution}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Avis médical (Remonté comme demandé) */}
      <Card className="shadow-lg border-0 bg-white rounded-3xl overflow-hidden">
        <CardHeader className="bg-rose-50 pb-5">
          <CardTitle className="flex items-center gap-4 text-3xl font-bold text-rose-900">
            <Stethoscope className="h-10 w-10 text-rose-600" />
            Quand demander un avis médical ?
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 px-6 md:px-10 pb-8">
          <p className="text-2xl text-gray-800 leading-relaxed font-semibold">
            {data.whenToAskDoctor}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Activités */}
        <Card className="shadow-lg border-0 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-blue-50 pb-5">
            <CardTitle className="flex items-center gap-4 text-3xl font-bold text-blue-900">
              <Activity className="h-10 w-10 text-blue-600" />
              Activités possibles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-6 pb-8">
            <ul className="space-y-4">
              {data.recommendedActivities.map((activity, idx) => (
                <li key={idx} className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border-2 border-gray-100">
                  <ArrowRight className="h-6 w-6 text-blue-600 shrink-0" />
                  <span className="text-xl text-gray-800 font-bold">{activity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Ressources */}
        <Card className="shadow-lg border-0 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 pb-5">
            <CardTitle className="flex items-center gap-4 text-3xl font-bold text-slate-900">
              <LinkIcon className="h-10 w-10 text-slate-600" />
              Ressources utiles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-6 pb-8">
            <ul className="space-y-6">
              {data.resources.map((resource, idx) => (
                <li key={idx}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-xl font-bold text-blue-700 hover:text-blue-900 hover:underline decoration-4 underline-offset-4 transition-all">
                    <ArrowRight className="h-6 w-6 shrink-0 mt-1" />
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action */}
      <div className="text-center pt-12 pb-6 flex flex-col items-center">
        <h3 className="text-3xl font-extrabold text-slate-800 mb-6">
          Vous souhaitez pratiquer près de chez vous ?
        </h3>
        <Button nativeButton={false} size="lg" render={<Link href="/pratiquants/ou-pratiquer" className="inline-flex items-center justify-center px-10 py-6" />} className="text-2xl font-bold h-auto rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-blue-800 hover:bg-blue-900 text-white w-full sm:w-auto">
          Trouver une activité adaptée <ArrowRight className="ml-4 h-8 w-8 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
