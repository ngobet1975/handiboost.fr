import React from "react";
import Link from "next/link";
import { ChevronRight, Newspaper } from "lucide-react";
import { ArticleCard, ArticleData } from "@/components/ArticleCard";
import actualitesData from "@/data/actualites.json";

export const metadata = {
  title: "Actualités | Handiboost",
  description: "Retrouvez toutes les actualités, rapports et événements autour du sport adapté et du parasport.",
};

export default function ActualitesPage() {
  const articles = (actualitesData as ArticleData[]).filter(a => a.status === "published");
  
  // Sort by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const featuredArticles = sortedArticles.filter(a => a.featured);
  const regularArticles = sortedArticles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-slate-500 font-medium" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded">Accueil</Link>
              </li>
              <li><ChevronRight className="w-4 h-4" aria-hidden="true" /></li>
              <li className="text-slate-900" aria-current="page">Actualités</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 flex items-center gap-4">
            <Newspaper className="w-10 h-10 md:w-14 md:h-14 text-blue-700 shrink-0" />
            <span className="leading-tight">Toute l'actualité <span className="text-blue-700">Handiboost</span></span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl">
            Restez informés des dernières évolutions sur le sport sur ordonnance, les événements associatifs et les stratégies nationales.
          </p>
        </section>

        {/* Featured Section */}
        {featuredArticles.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              À la une
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Grid Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            Dernières publications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
