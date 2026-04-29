"use client";

import React, { useState, useMemo } from 'react';
import { EventData, EventCard } from './EventCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, MapPin, Users, Activity } from 'lucide-react';

export function EvenementsClient({ data }: { data: EventData[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('future');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [publicFilter, setPublicFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');

  // Filtrage
  const filteredData = useMemo(() => {
    const now = new Date();
    
    return data.filter(evt => {
      // 1. Recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const text = `${evt.title} ${evt.description} ${evt.city || ''} ${evt.locationName || ''}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      // 2. Filtre de Période (Logique FALC)
      const evtDate = new Date(evt.startDate);
      const isPast = evtDate < now;
      
      if (periodFilter === 'future' && isPast) return false;
      if (periodFilter === 'past' && !isPast) return false;
      
      if (periodFilter === 'this_month') {
        if (isPast || evtDate.getMonth() !== now.getMonth() || evtDate.getFullYear() !== now.getFullYear()) return false;
      }
      
      if (periodFilter === 'this_season' && evt.season) {
        const diffTime = evtDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (isPast || diffDays > 90) return false; // Approximatif : 3 mois max
      }

      // 3. Filtre de Type
      if (typeFilter !== 'all' && evt.eventType !== typeFilter) return false;

      // 4. Filtre de Région
      if (regionFilter !== 'all' && evt.region !== regionFilter && regionFilter !== 'Toutes les régions') return false;

      // 5. Filtre Public
      if (publicFilter !== 'all') {
        if (!evt.publics || !evt.publics.includes(publicFilter)) return false;
      }

      // 6. Filtre Âge
      if (ageFilter !== 'all') {
        if (!evt.ageCategories || !evt.ageCategories.includes(ageFilter)) return false;
      }

      return true;
    }).sort((a, b) => {
      // Tri par date : les événements à venir les plus proches d'abord.
      // Les événements passés : les plus récents d'abord.
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      
      if (periodFilter === 'past') {
        return dateB - dateA; // Décroissant pour les passés
      }
      return dateA - dateB; // Croissant pour les futurs
    });
  }, [data, searchQuery, periodFilter, typeFilter, regionFilter]);

  const periodLabels: Record<string, string> = {
    future: "Événements à venir",
    this_month: "Ce mois-ci",
    this_season: "Cette saison",
    past: "Événements passés"
  };

  const typeLabels: Record<string, string> = {
    all: "Tous les types",
    sport: "Sport / Compétition",
    apa: "Séance APA",
    atelier: "Atelier pratique",
    rencontre: "Rencontre / Conférence",
    "journee-handiboost": "Journée Handiboost"
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filtres */}
      <aside className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 sticky top-32">
          <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Trouver un événement
          </h2>

          <div className="space-y-6">
            {/* Recherche textuelle */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Mots-clés</label>
              <Input 
                placeholder="Ex: natation, Lyon, atelier..." 
                className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filtre Période */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date / Période
              </label>
              <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v || "future")}>
                <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800">
                  <SelectValue>{periodLabels[periodFilter]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="future">Événements à venir</SelectItem>
                  <SelectItem value="this_month">Ce mois-ci</SelectItem>
                  <SelectItem value="this_season">Cette saison</SelectItem>
                  <SelectItem value="past" className="text-slate-500">Événements passés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Type */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Type d'événement
              </label>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v || "all")}>
                <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl">
                  <SelectValue>{typeLabels[typeFilter]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="sport">Sport / Compétition</SelectItem>
                  <SelectItem value="apa">Séance APA</SelectItem>
                  <SelectItem value="atelier">Atelier pratique</SelectItem>
                  <SelectItem value="rencontre">Rencontre / Conférence</SelectItem>
                  <SelectItem value="journee-handiboost">Journée Handiboost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Région */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Région
              </label>
              <Select value={regionFilter} onValueChange={(v) => setRegionFilter(v || "all")}>
                <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl">
                  <SelectValue>{regionFilter === 'all' ? 'Toutes les régions' : regionFilter}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  <SelectItem value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</SelectItem>
                  <SelectItem value="Bretagne">Bretagne</SelectItem>
                  <SelectItem value="Île-de-France">Île-de-France</SelectItem>
                  <SelectItem value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Public Concerné */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4" /> Public concerné
              </label>
              <Select value={publicFilter} onValueChange={(v) => setPublicFilter(v || "all")}>
                <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl">
                  <SelectValue>
                    {publicFilter === 'all' ? 'Tous les publics' : 
                     publicFilter === 'personne en situation de handicap' ? 'En situation de handicap' : 
                     publicFilter === 'maladie chronique / ALD' ? 'Maladie chronique / ALD' : 
                     'Grand public'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les publics</SelectItem>
                  <SelectItem value="personne en situation de handicap">En situation de handicap</SelectItem>
                  <SelectItem value="maladie chronique / ALD">Maladie chronique / ALD</SelectItem>
                  <SelectItem value="tous publics">Grand public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Âge */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4" /> Âge
              </label>
              <Select value={ageFilter} onValueChange={(v) => setAgeFilter(v || "all")}>
                <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl">
                  <SelectValue>
                    {ageFilter === 'all' ? 'Tous les âges' : 
                     ageFilter === 'enfant' ? 'Enfant' : 
                     ageFilter === 'adulte' ? 'Adulte' : 
                     'Senior'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les âges</SelectItem>
                  <SelectItem value="enfant">Enfant</SelectItem>
                  <SelectItem value="adulte">Adulte</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <button 
              onClick={() => {
                setSearchQuery('');
                setPeriodFilter('future');
                setTypeFilter('all');
                setRegionFilter('all');
                setPublicFilter('all');
                setAgeFilter('all');
              }}
              className="w-full text-slate-500 hover:text-slate-800 font-bold underline mt-4"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </aside>

      {/* Grille Résultats */}
      <main className="w-full lg:w-2/3 xl:w-3/4">
        {/* Résumé des résultats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600 font-bold text-lg">
            {filteredData.length} événement{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
          </p>
          {periodFilter === 'past' && (
            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">Archives</span>
          )}
        </div>

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.map((evt) => (
              <EventCard key={evt.id} data={evt} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Aucun événement trouvé</h3>
            <p className="text-lg text-slate-600 mb-6 max-w-md mx-auto">
              Nous n'avons pas trouvé d'événement correspondant à vos critères.
            </p>
            <button 
              onClick={() => { 
                setPeriodFilter('future'); 
                setTypeFilter('all'); 
                setRegionFilter('all'); 
                setSearchQuery(''); 
                setPublicFilter('all');
                setAgeFilter('all');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Voir tous les événements à venir
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
