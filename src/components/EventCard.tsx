import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, Clock, ArrowRight, Activity, Smile } from 'lucide-react';
import Link from 'next/link';

export interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate?: string;
  season?: "printemps" | "ete" | "automne" | "hiver";
  eventType: "sport" | "atelier" | "journee-handiboost" | "apa" | "rencontre";
  practiceTypes: string[];
  publics: string[];
  ageCategories?: string[];
  locationName?: string;
  city?: string;
  department?: string;
  region?: string;
  externalUrl?: string;
  image?: string;
  source?: string;
  status: "published" | "draft" | "archived";
  featured?: boolean;
  showInNews?: boolean;
  expiresAt?: string;
}

const EventTypeMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  "sport": { label: "Événement Sportif", color: "bg-blue-100 text-blue-800", icon: <Activity className="w-4 h-4" /> },
  "apa": { label: "Séance APA", color: "bg-teal-100 text-teal-800", icon: <Activity className="w-4 h-4" /> },
  "atelier": { label: "Atelier Pratique", color: "bg-purple-100 text-purple-800", icon: <Users className="w-4 h-4" /> },
  "rencontre": { label: "Rencontre / Conférence", color: "bg-orange-100 text-orange-800", icon: <Users className="w-4 h-4" /> },
  "journee-handiboost": { label: "Journée Handiboost", color: "bg-pink-100 text-pink-800", icon: <Smile className="w-4 h-4" /> }
};

export function EventCard({ data }: { data: EventData }) {
  const isDev = process.env.NODE_ENV !== 'production';
  const start = new Date(data.startDate);
  
  const formatterDay = new Intl.DateTimeFormat('fr-FR', { day: 'numeric' });
  const formatterMonth = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
  
  const dayStr = formatterDay.format(start);
  const monthStr = formatterMonth.format(start).toUpperCase();

  const isPast = new Date() > new Date(data.endDate || data.startDate);

  const eventTypeMeta = EventTypeMap[data.eventType] || EventTypeMap["sport"];

  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow border-2 ${isPast ? 'border-slate-200 bg-slate-50 opacity-80' : 'border-slate-100 bg-white'} flex flex-col h-full rounded-2xl overflow-hidden relative`}>
      
      {/* Badge Mock Data (Temporaire, caché en production) */}
      {(data as any).isMock && isDev && (
        <div className="absolute top-0 left-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-20">
          Données fictives (Test)
        </div>
      )}

      {data.featured && !isPast && (
        <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
          À la une
        </div>
      )}

      {isPast && (
        <div className="absolute top-0 right-0 bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
          Événement passé
        </div>
      )}

      <CardHeader className="pb-4 pt-8 px-6 flex flex-row items-start gap-4">
        {/* Date block (FALC visual cue) */}
        <div className={`flex flex-col items-center justify-center shrink-0 w-24 h-24 rounded-xl border-2 ${isPast ? 'bg-slate-100 border-slate-300 text-slate-500' : 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'}`}>
          <span className="text-3xl font-black">{dayStr}</span>
          <span className="text-base font-bold uppercase tracking-wider">{monthStr}</span>
        </div>

        <div className="flex-1">
          <div className="flex gap-2 flex-wrap mb-2">
            <span className={`${eventTypeMeta.color} border border-current opacity-90 text-sm font-extrabold px-3 py-1 rounded-md inline-flex items-center gap-1.5`}>
              {eventTypeMeta.icon}
              {eventTypeMeta.label}
            </span>
          </div>
          <CardTitle className={`text-2xl font-extrabold leading-tight ${isPast ? 'text-slate-600' : 'text-slate-900'}`}>
            {data.title}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pt-2 flex-grow">
        <p className="text-slate-700 text-lg mb-6 leading-relaxed">
          {data.description}
        </p>

        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <MapPin className="h-6 w-6 text-blue-700 shrink-0" />
            <span className="text-slate-900 font-bold text-lg">
              {data.locationName} {data.city ? `- ${data.city}` : ''} {data.department ? `(${data.department})` : ''}
            </span>
          </div>

          {/* Practice Types */}
          {data.practiceTypes && data.practiceTypes.length > 0 && (
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {data.practiceTypes.map((type, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-sm font-semibold px-2.5 py-1 rounded-md">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Publics / Ages */}
          {(((data.publics?.length ?? 0) > 0) || ((data.ageCategories?.length ?? 0) > 0)) && (
            <div className="flex items-start gap-3 mt-4">
              <Users className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {data.publics?.map((pub, idx) => (
                  <span key={`pub-${idx}`} className="bg-teal-50 border border-teal-100 text-teal-800 text-sm font-semibold px-2.5 py-1 rounded-md">
                    {pub}
                  </span>
                ))}
                {data.ageCategories?.map((age, idx) => (
                  <span key={`age-${idx}`} className="bg-orange-50 border border-orange-100 text-orange-800 text-sm font-semibold px-2.5 py-1 rounded-md capitalize">
                    {age}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 mt-auto">
        <Button nativeButton={false} render={<Link href={`/pratiquants/evenements/${data.slug}`} />} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold text-lg h-14 rounded-xl">
          En savoir plus <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
