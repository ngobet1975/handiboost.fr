import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { EvenementsClient } from '@/components/EvenementsClient';
import { EventData } from '@/components/EventCard';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Agenda & Événements Sportifs | Handiboost',
  description: 'Retrouvez tous les événements sportifs, les séances d\'Activité Physique Adaptée (APA) et les rencontres Handiboost.',
  alternates: {
    canonical: '/pratiquants/evenements',
  }
};

export default async function EvenementsPage() {
  let rawEvents: any[] = [];
  try {
    rawEvents = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/evenements.json'), 'utf8'));
  } catch {
    rawEvents = [];
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const data: EventData[] = rawEvents
    .filter((evt: any) => evt.status === 'published' && new Date(evt.startDate) >= today)
    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .map((evt: any) => ({
      id: evt.id,
      title: evt.title,
      slug: evt.slug,
      description: evt.description ?? "",
      startDate: evt.startDate ?? "",
      endDate: evt.endDate ?? "",
      eventType: (evt.eventType ?? "sport") as "sport",
      practiceTypes: evt.practiceTypes ?? [],
      publics: evt.publics ?? ["tous publics"],
      locationName: evt.locationName ?? "",
      city: evt.city ?? "",
      status: evt.status as "published",
      featured: evt.featured ?? false,
    }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Fil d'Ariane */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-lg font-bold text-slate-500">
          <Link href="/" className="hover:text-blue-800 hover:underline transition-all">Accueil</Link>
          <span>&gt;</span>
          <Link href="/pratiquants" className="hover:text-blue-800 hover:underline transition-all">Pratiquants</Link>
          <span>&gt;</span>
          <span className="text-slate-800">Événements</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 md:mt-12 md:pt-16">
        {/* Hero Section */}
        <section className="mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Trouver un événement sportif adapté
          </h1>
          <p className="text-2xl text-slate-700 font-medium leading-relaxed">
            Parcourez notre agenda pour trouver une compétition, un atelier APA ou une rencontre près de chez vous.
          </p>
        </section>

        {/* Composant Client (Recherche + Grille) */}
        <EvenementsClient data={data} />
      </div>
    </div>
  );
}
