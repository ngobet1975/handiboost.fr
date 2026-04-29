import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Info, ExternalLink, Activity, FolderOpen } from 'lucide-react';

export interface DirectoryData {
  id: string;
  title: string;
  description: string;
  category: "club" | "maison" | "enseignant-apa" | "kine";
  resourceType: "annuaire-national" | "annuaire-regional" | "ressource-locale" | "ressource-en-ligne";
  regions: string[];
  publics: string[];
  externalUrl?: string;
  isMock?: boolean;
}

const CategoryMap: Record<string, string> = {
  "club": "Sport en club",
  "maison": "Pratique à la maison",
  "enseignant-apa": "Enseignant en APA",
  "kine": "Kinésithérapeute"
};

const ResourceTypeMap: Record<string, string> = {
  "annuaire-national": "Annuaire National",
  "annuaire-regional": "Annuaire Régional",
  "ressource-locale": "Ressource Locale",
  "ressource-en-ligne": "Ressource en ligne"
};

export function DirectoryCard({ data }: { data: DirectoryData }) {
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-2 border-slate-100 flex flex-col h-full bg-white rounded-2xl overflow-hidden relative">
      
      {/* Badge Mock Data (Temporaire, caché en production) */}
      {data.isMock && isDev && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          Données fictives (Test)
        </div>
      )}

      <CardHeader className="pb-4 bg-slate-50 border-b border-slate-100">
        <div className="flex gap-2 flex-wrap mb-3">
          <span className="bg-blue-100 text-blue-800 text-sm font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            {CategoryMap[data.category]}
          </span>
          <span className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" />
            {ResourceTypeMap[data.resourceType]}
          </span>
        </div>
        <CardTitle className="text-2xl font-extrabold text-slate-800 leading-tight">
          {data.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 flex-grow">
        <p className="text-slate-700 text-lg mb-6 leading-relaxed">
          {data.description}
        </p>

        <div className="space-y-4">
          {/* Régions */}
          {data.regions.length > 0 && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {data.regions.map((region, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-sm font-semibold px-3 py-1.5 rounded-md">
                    {region}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Publics */}
          {data.publics.length > 0 && (
            <div className="flex items-start gap-3 mt-4">
              <Users className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {data.publics.map((publicType, idx) => (
                  <span key={idx} className="bg-teal-50 border border-teal-100 text-teal-800 text-sm font-semibold px-3 py-1.5 rounded-md">
                    {publicType}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="pt-4 pb-6 px-6 bg-white border-t border-slate-50 mt-auto">
        {data.externalUrl ? (
          <Button 
            nativeButton={false}
            render={<a href={data.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Consulter le site ${data.title} (s'ouvre dans un nouvel onglet)`} />}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg h-14 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Consulter ce site</span>
            <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
          </Button>
        ) : (
          <Button variant="outline" className="w-full font-bold text-lg h-14 rounded-xl border-2 text-slate-700">
            En savoir plus <Info className="ml-2 h-5 w-5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
