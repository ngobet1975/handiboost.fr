import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, Tag, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", resolvedParams.slug)
    .single();
  
  if (!article) return { title: "Article introuvable | Handiboost" };

  return {
    title: `${article.title} | Actualités Handiboost`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .eq("status", "published")
    .single();

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.published_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const CategoryMap: Record<string, { label: string; color: string }> = {
    "info-apa": { label: "Info APA", color: "bg-blue-100 text-blue-800" },
    "journee-handiboost": { label: "Handiboost", color: "bg-teal-100 text-teal-800" },
    "evenement": { label: "Événement", color: "bg-orange-100 text-orange-800" },
    "ressource": { label: "Ressource", color: "bg-purple-100 text-purple-800" },
    "rapport": { label: "Rapport", color: "bg-slate-100 text-slate-800" }
  };

  const meta = CategoryMap[article.category] || CategoryMap["info-apa"];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            nativeButton={false}
            variant="ghost" 
            render={<Link href="/actualites" className="text-slate-500 hover:text-slate-800 font-medium text-base px-0" />}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour aux actualités
          </Button>
        </div>
      </div>

      <article className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Article Header */}
        <header className="mb-10 text-center">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            <span className={`${meta.color} text-sm font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5`}>
              <Tag className="w-4 h-4" />
              {meta.label}
            </span>
            <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Publié le <time dateTime={article.published_at}>{formattedDate}</time>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
            {article.title}
          </h1>

          {article.cover_image && (
            <div className="w-full aspect-video bg-slate-200 rounded-3xl overflow-hidden shadow-lg mb-10 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={article.cover_image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {article.excerpt && (
            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed text-left border-l-4 border-blue-500 pl-6 my-8">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Article Content */}
        <div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div 
            className="prose prose-lg md:prose-xl prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          >
            {article.content.split('\n').map((paragraph: string, index: number) => (
              paragraph.trim() === '' ? <br key={index} /> : 
              paragraph.startsWith('## ') ? <h2 key={index}>{paragraph.replace('## ', '')}</h2> :
              paragraph.startsWith('### ') ? <h3 key={index}>{paragraph.replace('### ', '')}</h3> :
              paragraph.startsWith('- ') ? <li key={index} className="ml-4 list-disc">{paragraph.replace('- ', '')}</li> :
              paragraph.startsWith('> ') ? <blockquote key={index}>{paragraph.replace('> ', '')}</blockquote> :
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

      </article>
    </div>
  );
}
