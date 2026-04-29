import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText, ArrowRight, ExternalLink, Info, Landmark, ShieldPlus, Heart, Building, Users } from 'lucide-react';

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

const CategoryMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  "etat": { label: "Aide Nationale", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <Landmark className="w-4 h-4" /> },
  "mdph": { label: "Aide Handicap / MDPH", color: "bg-purple-100 text-purple-800 border-purple-200", icon: <ShieldPlus className="w-4 h-4" /> },
  "mutuelle": { label: "Mutuelle & Santé", color: "bg-teal-100 text-teal-800 border-teal-200", icon: <Heart className="w-4 h-4" /> },
  "collectivite": { label: "Aide Locale", color: "bg-orange-100 text-orange-800 border-orange-200", icon: <Building className="w-4 h-4" /> },
  "association": { label: "Aide Associative", color: "bg-pink-100 text-pink-800 border-pink-200", icon: <Users className="w-4 h-4" /> }
};

export function AideCard({ aide }: { aide: AideData }) {
  const meta = CategoryMap[aide.category] || CategoryMap["etat"];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-2 border-slate-100 bg-white flex flex-col h-full rounded-2xl overflow-hidden relative">
      <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex gap-2 flex-wrap mb-3">
          <span className={`${meta.color} border text-sm font-extrabold px-3 py-1.5 rounded-md inline-flex items-center gap-1.5`}>
            {meta.icon}
            {meta.label}
          </span>
          {aide.amountLabel && (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-sm font-extrabold px-3 py-1.5 rounded-md">
              Montant : {aide.amountLabel}
            </span>
          )}
        </div>
        <CardTitle className="text-2xl font-extrabold leading-tight text-slate-900">
          {aide.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pt-6 flex-grow space-y-6">
        {/* Description intro */}
        <p className="text-slate-700 text-lg leading-relaxed font-medium">
          {aide.description}
        </p>

        {/* Public éligible */}
        {aide.eligibility && aide.eligibility.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Qui peut en bénéficier ?
            </h4>
            <ul className="space-y-1 mt-2 list-none">
              {aide.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Étapes (Comment faire) */}
        {aide.steps && aide.steps.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-lg">
              <ArrowRight className="w-5 h-5 text-slate-400" />
              Comment l'obtenir (en bref) :
            </h4>
            <ol className="space-y-2 ml-1">
              {aide.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700">
                  <span className="flex items-center justify-center bg-slate-100 text-slate-600 font-bold rounded-full w-6 h-6 shrink-0 text-sm mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Documents */}
        {aide.requiredDocuments && aide.requiredDocuments.length > 0 && (
          <div className="flex items-start gap-3 mt-4">
            <FileText className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-700">Documents souvent demandés : </span>
              <span className="text-slate-600 italic">
                {aide.requiredDocuments.join(', ')}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-6 pb-6 px-6 border-t border-slate-50 mt-auto bg-slate-50 flex flex-col items-start gap-4">
        {aide.externalUrl ? (
          <Button 
            nativeButton={false}
            render={<a href={aide.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Voir le site ${aide.officialSourceName || ''} (s'ouvre dans un nouvel onglet)`} />}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg h-14 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>{aide.isOfficialSource ? 'Voir le site officiel' : 'Voir le site web'}</span>
            <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
          </Button>
        ) : (
          <div className="w-full text-center text-slate-500 font-medium p-4 bg-slate-100 rounded-xl">
            <Info className="w-5 h-5 inline-block mr-2" />
            Vérifiez auprès de votre organisme local
          </div>
        )}

        {/* Meta foot */}
        <div className="w-full flex flex-wrap justify-between text-xs text-slate-500 mt-2 px-1 font-medium">
          {aide.officialSourceName && (
            <span>
              {aide.isOfficialSource ? 'Source officielle : ' : 'Source d\'information : '}
              {aide.officialSourceName}
            </span>
          )}
          {aide.lastVerifiedAt && (
            <span>Vérifié le : {new Date(aide.lastVerifiedAt).toLocaleDateString('fr-FR')}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
