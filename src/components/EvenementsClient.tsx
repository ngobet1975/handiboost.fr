"use client";

import React, { useState, useMemo } from 'react';
import { EventData, EventCard } from './EventCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, MapPin, Users, Activity } from 'lucide-react';

export function EvenementsClient({ data }: { data: EventData[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitalTab, setHospitalTab] = useState<'hors-hopital' | 'ghe'>('hors-hopital');
  const [monthFilter, setMonthFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedPublics, setSelectedPublics] = useState<string[]>([]);
  const [ageFilter, setAgeFilter] = useState('all');

  const publicOptions = ["moteur", "sensoriel", "psychique", "cognitif", "mental", "maladies chroniques"];

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

      // 2. Filtre Hopital (GHE vs Hors Hopital)
      const isGHE = evt.title.toLowerCase().includes('ghe') || 
                    (evt.locationName && evt.locationName.toLowerCase().includes('ghe')) ||
                    evt.description.toLowerCase().includes('ghe');
      if (hospitalTab === 'ghe' && !isGHE) return false;
      if (hospitalTab === 'hors-hopital' && isGHE) return false;

      // 3. Filtre de Mois
      const evtDate = new Date(evt.startDate);
      if (monthFilter !== 'all') {
        if (evtDate.getMonth().toString() !== monthFilter) return false;
      }

      // 4. Filtre de Type
      if (typeFilter !== 'all' && evt.eventType !== typeFilter) return false;

      // 5. Filtre de Région
      if (regionFilter !== 'all' && evt.region !== regionFilter && regionFilter !== 'Toutes les régions') return false;

      // 6. Filtre Public (Multi-choix)
      if (selectedPublics.length > 0) {
        if (!evt.publics) return false;
        // Si un des publics cochés est présent dans l'événement
        const hasMatchingPublic = selectedPublics.some(p => evt.publics?.includes(p));
        // On considère que "tous publics" matche tout
        const isTousPublics = evt.publics.includes('tous publics');
        if (!hasMatchingPublic && !isTousPublics) return false;
      }

      // 7. Filtre Âge
      if (ageFilter !== 'all') {
        if (!evt.ageCategories || !evt.ageCategories.includes(ageFilter)) return false;
      }

      return true;
    }).sort((a, b) => {
      // Tri par date : les événements à venir les plus proches d'abord.
      // Les événements passés : les plus récents d'abord.
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      
      if (monthFilter !== 'all') {
        // If a specific month is selected, just sort naturally (already done below)
      } else {
        // Just sort nearest events first
      }
      return dateA - dateB; // Croissant pour les futurs
    });
  }, [data, searchQuery, hospitalTab, monthFilter, typeFilter, regionFilter, selectedPublics, ageFilter]);

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

            {/* Filtre Mois */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Mois de l'année
              </label>
              <Select value={monthFilter} onValueChange={(v) => setMonthFilter(v || "all")}>
                <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 capitalize">
                  <SelectValue>{monthFilter === 'all' ? 'Tous les mois' : new Date(2000, parseInt(monthFilter), 1).toLocaleString('fr-FR', { month: 'long' })}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()} className="capitalize">{new Date(2000, i, 1).toLocaleString('fr-FR', { month: 'long' })}</SelectItem>
                  ))}
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

            {/* Filtre Public Concerné (Cases à cocher) */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4" /> Public (handicaps)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {publicOptions.map(option => (
                  <label key={option} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={selectedPublics.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPublics([...selectedPublics, option]);
                        } else {
                          setSelectedPublics(selectedPublics.filter(p => p !== option));
                        }
                      }}
                    />
                    <span className="text-slate-700 font-medium capitalize">{option}</span>
                  </label>
                ))}
              </div>
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
                setMonthFilter('all');
                setTypeFilter('all');
                setRegionFilter('all');
                setSelectedPublics([]);
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
        {/* Tabs Hôpital / Hors Hôpital */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => setHospitalTab('hors-hopital')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${hospitalTab === 'hors-hopital' ? 'bg-white shadow-md text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Événements hors hôpital
          </button>
          <button
            onClick={() => setHospitalTab('ghe')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${hospitalTab === 'ghe' ? 'bg-white shadow-md text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Événements de l'hôpital GHE
          </button>
        </div>

        {/* Résumé des résultats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600 font-bold text-lg">
            {filteredData.length} événement{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
          </p>
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
                setMonthFilter('all'); 
                setTypeFilter('all'); 
                setRegionFilter('all'); 
                setSearchQuery(''); 
                setSelectedPublics([]);
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
