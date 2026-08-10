import React from "react";
import Link from "next/link";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Conseils santé et Activité Physique Adaptée par pathologie | Handiboost",
  description: "Retrouvez nos fiches cliniques pour comprendre les bénéfices du sport adapté selon votre pathologie.",
};

const pathoColors: Record<string, string> = {
  "maladies-neuromusculaires": "#1566B1",
  "paralysie-cerebrale": "#ED1B5F",
  "pathologies-cerebelleuses": "#FBA91C",
  "sclerose-en-plaques": "#654B9E",
  "troubles-du-comportement-alimentaire-tca": "#4AC8DB",
  "troubles-du-comportement-alimentaire": "#4AC8DB",
};

export default async function PathologiesPage() {
  let rawPathologies: any[] = [];
  try {
    rawPathologies = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/pathologies.json'), 'utf8'));
  } catch {
    rawPathologies = [];
  }

  const pathologies = rawPathologies
    .filter((p: any) => p.validationStatus !== 'rejected')
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
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
        <section className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight flex flex-col md:flex-row items-center justify-center gap-4">
            {/* L'icône demandée sera intégrée ici une fois identifiée */}
            <img src="/illustrations/14.png" alt="" className="h-16 w-auto object-contain" />
            <span>Activité physique et <span style={{ color: '#ED1B5F' }}>Pathologies</span></span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed">
            Apprenez-en davantage sur votre pathologie et découvrez comment l’activité physique peut contribuer à votre bien-être, grâce à des fiches simples et faciles à comprendre.
          </p>
        </section>

        {/* Info Banner */}
        <div className="bg-slate-100 border border-slate-200 p-8 rounded-2xl mb-16 shadow-sm max-w-5xl mx-auto">
          <h3 className="font-extrabold text-2xl mb-4" style={{ color: '#ED1B5F' }}>
            Vous souhaitez commencer ou reprendre une activité physique ?
          </h3>
          <ul className="space-y-4 text-lg text-slate-800 font-medium mb-6">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 rounded-full bg-slate-800 shrink-0" />
              <span>
                Selon votre situation, un <strong>avis médical peut être recommandé</strong>. Votre médecin pourra, si nécessaire, vous <strong style={{ color: '#1566B1' }}>prescrire de l’Activité Physique Adaptée (APA)</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 rounded-full bg-slate-800 shrink-0" />
              <span>
                Pour pratiquer, <strong>plusieurs possibilités existent</strong> : <strong style={{ color: '#1566B1' }}>club sportif, maison sport santé, enseignant en APA en libéral</strong>…, selon vos besoins et vos objectifs.
              </span>
            </li>
          </ul>
          <div className="flex items-center gap-3 text-lg font-bold text-slate-700">
            <MessageCircle className="w-6 h-6 text-slate-500 shrink-0" />
            <p>
              Vous ne savez pas par où commencer ? Contactez-nous ! Nous serons ravis de vous conseiller, de vous orienter et de répondre à toutes vos questions.
            </p>
          </div>
        </div>

        {/* Grid Pathologies */}
        <section className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pathologies.map((patho) => {
              const bgColor = pathoColors[patho.slug] || "#1566B1"; // Default color if not matched

              return (
                <Link 
                  key={patho.id} 
                  href={`/pratiquants/conseils-par-pathologie/${patho.slug}`}
                  className="group relative rounded-[2.5rem] overflow-hidden shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl h-64 flex flex-col items-center justify-center p-6 text-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <h3 className="text-2xl font-extrabold text-white uppercase tracking-wide leading-tight">
                    {patho.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Illustration Footer */}
        <div className="flex justify-center mt-12 mb-8 gap-8">
          <img src="/illustrations/14.png" alt="Illustration pathologie 1" className="max-w-full h-auto md:h-64 object-contain" />
          <img src="/illustrations/15.png" alt="Illustration pathologie 2" className="max-w-full h-auto md:h-64 object-contain hidden md:block" />
        </div>

      </div>
    </div>
  );
}
