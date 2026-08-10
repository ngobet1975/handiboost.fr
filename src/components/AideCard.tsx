import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText, ArrowRight, ExternalLink, Info, Landmark, ShieldPlus, Heart, Building, Users } from 'lucide-react';
import Image from 'next/image';

export interface AideData {
  id: string;
  title: string;
  slug: string;
  category: "etat" | "mdph" | "mutuelle" | "collectivite" | "association";
  description: string;
  eligibility: string[];
  amountLabel?: string;
  steps?: string[];
  requiredDocuments?: string[];
  externalUrl?: string;
  officialSourceName?: string;
  isOfficialSource?: boolean;
  lastVerifiedAt?: string;
  region?: string;
  department?: string;
  status: "published" | "draft" | "archived";
}

const CategoryMap: Record<string, { label: string; icon: React.ReactNode; badgeClass: string }> = {
  "etat": { label: "Aides Nationales (État)", icon: <span className="bg-[#ED1B5F] text-white font-bold px-2 py-0.5 rounded mr-1">N</span>, badgeClass: "text-[#ED1B5F] font-bold" },
  "mdph": { label: "Aides liées au Handicap", icon: <span className="bg-purple-600 text-white font-bold px-2 py-0.5 rounded mr-1">H</span>, badgeClass: "text-purple-600 font-bold" },
  "mutuelle": { label: "Aides Nationales (État)", icon: <span className="bg-[#ED1B5F] text-white font-bold px-2 py-0.5 rounded mr-1">N</span>, badgeClass: "text-[#ED1B5F] font-bold" }, // In the mockup, mutuelles has N
  "collectivite": { label: "Aides locales", icon: <span className="bg-[#FBA91C] text-white font-bold px-2 py-0.5 rounded mr-1">L</span>, badgeClass: "text-[#FBA91C] font-bold" },
  "association": { label: "Aides associatives", icon: <span className="bg-pink-600 text-white font-bold px-2 py-0.5 rounded mr-1">A</span>, badgeClass: "text-pink-600 font-bold" }
};

export function AideCard({ aide }: { aide: AideData }) {
  const meta = CategoryMap[aide.category] || CategoryMap["etat"];

  return (
    <Card className="border-[3px] border-[#3B89D1] bg-white flex flex-col h-full rounded-3xl overflow-hidden relative shadow-md hover:shadow-xl transition-shadow">
      
      {/* Category Badge */}
      <div className="pt-6 px-6 flex items-center">
        <div className="flex items-center text-sm">
          {meta.icon}
          <span className={meta.badgeClass}>{meta.label}</span>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4 px-6">
        {aide.amountLabel && (
          <div className="flex items-center gap-2 mb-3 bg-slate-50 border border-slate-200 w-fit px-3 py-1.5 rounded-lg">
            <div className="w-5 h-5 bg-orange-200 rounded-full flex items-center justify-center shrink-0">
              <div className="w-3 h-3 bg-[#FBA91C] rounded-full" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {aide.amountLabel}
            </span>
          </div>
        )}
        <CardTitle className="text-xl font-bold leading-snug text-slate-900">
          {aide.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pt-2 flex-grow flex flex-col">
        {/* Description intro */}
        <p className="text-slate-700 text-sm leading-relaxed font-medium mb-6">
          {aide.description}
        </p>

        {/* Public éligible */}
        {aide.eligibility && aide.eligibility.length > 0 && (
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mt-auto mb-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-blue-600" />
              Qui peut en bénéficier ?
            </h4>
            <ul className="space-y-1 mt-2 list-none">
              {aide.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 text-xs font-medium">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-6 px-6 flex items-end justify-between gap-4 mt-auto">
        <div className="text-[10px] text-slate-500 max-w-[150px] leading-tight font-medium">
          {aide.officialSourceName && (
            <span>
              Source d'information : {aide.officialSourceName}
            </span>
          )}
        </div>
        
        {aide.externalUrl ? (
          <Button 
            nativeButton={false}
            render={<a href={aide.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`En savoir plus sur ${aide.title}`} />}
            className="bg-[#3B89D1] hover:bg-blue-600 text-white font-bold h-10 px-6 rounded-full flex items-center justify-center gap-2 whitespace-nowrap shadow-md transition-transform hover:scale-105"
          >
            <span>En savoir +</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Button>
        ) : (
          <Button 
            disabled
            className="bg-slate-300 text-white font-bold h-10 px-6 rounded-full flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Indisponible</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
