import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, Link as LinkIcon, Info, FileStack, BookOpen, Stethoscope } from "lucide-react";

export interface ProResource {
  id: string;
  title: string;
  description: string;
  category: "prescription" | "bilan" | "pedagogie" | "recommandation" | "telechargement";
  format?: "page" | "pdf" | "lien-externe";
  fileUrl?: string;
  externalUrl?: string;
  sourceName?: string;
  lastVerifiedAt?: string;
  status: "published" | "draft" | "archived";
}

const CategoryMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  "prescription": { label: "Prescription", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Stethoscope className="w-4 h-4" /> },
  "bilan": { label: "Bilan / Test", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: <FileStack className="w-4 h-4" /> },
  "pedagogie": { label: "Pédagogie", color: "bg-amber-100 text-amber-800 border-amber-200", icon: <BookOpen className="w-4 h-4" /> },
  "recommandation": { label: "Recommandations", color: "bg-purple-100 text-purple-800 border-purple-200", icon: <Info className="w-4 h-4" /> },
  "telechargement": { label: "Modèle", color: "bg-slate-100 text-slate-800 border-slate-200", icon: <FileText className="w-4 h-4" /> }
};

export function ProResourceCard({ resource }: { resource: ProResource }) {
  const meta = CategoryMap[resource.category] || CategoryMap["telechargement"];
  
  const isPdf = resource.format === "pdf";
  const url = resource.fileUrl || resource.externalUrl || "#";

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border border-slate-200 bg-white flex flex-col h-full rounded-xl overflow-hidden">
      <CardHeader className="pb-3 pt-5 px-5 bg-slate-50/50 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <span className={`${meta.color} border text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5`}>
            {meta.icon}
            {meta.label}
          </span>
          {isPdf && (
            <span className="bg-red-50 text-red-700 border border-red-100 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <FileText className="w-3 h-3" />
              PDF
            </span>
          )}
        </div>
        <CardTitle className="text-xl font-bold leading-tight text-slate-900 mt-2">
          {resource.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pt-4 flex-grow">
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          {resource.description}
        </p>
      </CardContent>

      <CardFooter className="pt-4 pb-5 px-5 mt-auto flex flex-col items-start gap-3 border-t border-slate-50 bg-slate-50">
        <Button 
          nativeButton={false}
          render={<a href={url} target="_blank" rel="noopener noreferrer" download={isPdf ? true : undefined} aria-label={`${isPdf ? 'Télécharger' : 'Consulter'} ${resource.title}`} />}
          className={`w-full font-bold text-sm h-12 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap ${
            isPdf 
              ? "bg-slate-800 hover:bg-slate-900 text-white" 
              : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
          }`}
        >
          <span>{isPdf ? 'Télécharger le document' : 'Consulter la ressource'}</span>
          {isPdf ? <Download className="h-4 w-4 shrink-0" /> : <ExternalLink className="h-4 w-4 shrink-0" />}
        </Button>

        <div className="w-full flex flex-col gap-1 text-xs text-slate-500 font-medium">
          {resource.sourceName && (
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Source : {resource.sourceName}
            </span>
          )}
          {resource.lastVerifiedAt && (
            <span className="text-slate-400 pl-5">
              Mise à jour : {new Date(resource.lastVerifiedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
