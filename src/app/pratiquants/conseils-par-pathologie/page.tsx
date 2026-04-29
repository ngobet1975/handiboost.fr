import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Stethoscope, HeartPulse, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PathologyData } from "@/components/PathologyCard";
import pathologiesData from "@/data/pathologies.json";

export const metadata = {
  title: "Conseils santé et Activité Physique Adaptée par pathologie | Handiboost",
  description: "Retrouvez nos fiches cliniques pour comprendre les bénéfices du sport adapté selon votre pathologie : SEP, endométriose, diabète, etc.",
};

export default function PathologiesPage() {
  const pathologies: PathologyData[] = pathologiesData.map((item: any) => ({
    ...item,
    whenToAskDoctor: item.whenToAskDoctor || "En cas de douleur inhabituelle ou de doute, consultez votre médecin traitant.",
    status: item.status || "published"
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Button 
            nativeButton={false}
            variant="ghost" 
            render={<Link href="/pratiquants" className="text-slate-500 hover:text-slate-800 font-medium text-base px-0" />}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour à l'espace Pratiquants
          </Button>
        </div>

        {/* Hero Section */}
        <section className="mb-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight flex items-center gap-4">
            <HeartPulse className="w-10 h-10 md:w-12 md:h-12 text-blue-700 shrink-0" />
            <span>Activité physique et <span className="text-blue-700">Pathologies</span></span>
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Consultez nos fiches synthétiques pour connaître les bénéfices du sport adapté, les activités recommandées et les précautions à prendre selon votre situation médicale.
          </p>
        </section>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl mb-12 shadow-sm">
          <h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center gap-2">
            <Stethoscope className="w-5 h-5" /> 
            Information médicale
          </h3>
          <p className="text-blue-800">
            Ces fiches sont données à titre indicatif. L'Activité Physique Adaptée doit toujours être personnalisée. Demandez conseil à votre médecin traitant avant de reprendre le sport, particulièrement si vous avez une Affection de Longue Durée (ALD).
          </p>
        </div>

        {/* Grid Pathologies */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathologies.map((patho) => (
              <Link 
                key={patho.id} 
                href={`/pratiquants/conseils-par-pathologie/${patho.slug}`}
                className="group block h-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 rounded-2xl"
              >
                <Card className="h-full border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 rounded-2xl overflow-hidden bg-white flex flex-col relative">
                  {patho.validationStatus === "to-review" && (
                    <div className="absolute top-4 right-4 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full z-10">
                      À valider
                    </div>
                  )}
                  <CardHeader className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Activity className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors pr-16">
                      {patho.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white flex-grow flex flex-col justify-between">
                    <p className="text-slate-600 text-base line-clamp-3 leading-relaxed mb-4">
                      {patho.description}
                    </p>
                    <span className="font-bold text-blue-700 flex items-center group-hover:text-blue-800 mt-auto">
                      Consulter la fiche <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
