"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, ArrowRight, Tag } from "lucide-react";

export interface ArticleData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "info-apa" | "journee-handiboost" | "evenement" | "ressource" | "rapport";
  coverImage?: string;
  publishedAt: string;
  expiresAt?: string;
  featured?: boolean;
  showOnHomepage?: boolean;
  sourceName?: string;
  sourceUrl?: string;
  status: "published" | "draft" | "archived";
  oldUrls?: string[];
}

const CategoryMap: Record<string, { label: string; color: string }> = {
  "info-apa": { label: "Info APA", color: "bg-blue-100 text-blue-800 border-blue-200" },
  "journee-handiboost": { label: "Handiboost", color: "bg-teal-100 text-teal-800 border-teal-200" },
  "evenement": { label: "Événement", color: "bg-orange-100 text-orange-800 border-orange-200" },
  "ressource": { label: "Ressource", color: "bg-purple-100 text-purple-800 border-purple-200" },
  "rapport": { label: "Rapport", color: "bg-slate-100 text-slate-800 border-slate-200" }
};

export function ArticleCard({ article }: { article: ArticleData }) {
  const meta = CategoryMap[article.category] || CategoryMap["info-apa"];
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link href={`/actualites/${article.slug}`} className="block h-full group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 rounded-2xl">
      <Card className="h-full flex flex-col border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 rounded-2xl overflow-hidden bg-white">
        
        {article.coverImage && (
          <div className="w-full h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.coverImage.startsWith('http') || article.coverImage.startsWith('/') ? article.coverImage : `/photos/${article.coverImage}`} 
              alt={article.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // prevent infinite loop
                target.src = '/logo-handiboost.png';
                target.className = 'w-1/2 h-1/2 object-contain opacity-40 mix-blend-multiply group-hover:scale-105 transition-transform duration-500';
                target.parentElement!.className = "w-full h-48 bg-gradient-to-br from-blue-50 to-slate-100 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-slate-200";
              }}
            />
          </div>
        )}

        <CardHeader className="p-6 pb-4">
          <div className="flex justify-between items-start gap-4 mb-3">
            <span className={`${meta.color} text-xs font-bold px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5`}>
              <Tag className="w-3 h-3" />
              {meta.label}
            </span>
            <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={article.publishedAt}>{formattedDate}</time>
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-3">
            {article.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 flex-grow">
          <p className="text-slate-600 text-base leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto">
          <span className="inline-flex items-center font-bold text-blue-700 group-hover:text-blue-800 group-hover:underline underline-offset-4 transition-all">
            Lire l'article <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
