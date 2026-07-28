"use client";

import React, { useState, useMemo } from 'react';
import { EventData, EventCard } from './EventCard';
import { Search, Calendar, MapPin, Users, Activity, X, SlidersHorizontal } from 'lucide-react';

const TODAY_STR = new Date().toISOString().split('T')[0];

const TYPE_PILLS: { value: string; label: string; color: string; bg: string; border: string }[] = [
  { value: 'sport',              label: '🏆 Sport / Compétition',    color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-300' },
  { value: 'apa',                label: '🏃 Séance APA',             color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-300' },
  { value: 'atelier',            label: '🔧 Atelier pratique',       color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-300' },
  { value: 'rencontre',          label: '🎤 Rencontre / Conférence', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300' },
  { value: 'journee-handiboost', label: '✨ Journée Handiboost',    color: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-300' },
];

const PUBLIC_PILLS = ["moteur", "sensoriel", "psychique", "cognitif", "mental", "maladies chroniques"];

export function EvenementsClient({ data }: { data: EventData[] }) {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [hospitalTab,    setHospitalTab]    = useState<'hors-hopital' | 'ghe'>('hors-hopital');
  const [typeFilter,     setTypeFilter]     = useState('');
  const [regionFilter,   setRegionFilter]   = useState('all');
  const [selectedPublics,setSelectedPublics]= useState<string[]>([]);
  const [dateFrom,       setDateFrom]       = useState('');
  const [showFilters,    setShowFilters]    = useState(false);

  const togglePublic = (p: string) =>
    setSelectedPublics(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const resetAll = () => {
    setSearchQuery(''); setTypeFilter(''); setRegionFilter('all');
    setSelectedPublics([]); setDateFrom('');
  };

  const activeCount = [searchQuery, typeFilter, regionFilter !== 'all', dateFrom, selectedPublics.length > 0].filter(Boolean).length;

  const filteredData = useMemo(() => {
    return data.filter(evt => {
      // Recherche textuelle
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = `${evt.title} ${evt.description} ${evt.city || ''} ${evt.locationName || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      // Onglet hôpital
      const isGHE = evt.title.toLowerCase().includes('ghe') ||
        (evt.locationName && evt.locationName.toLowerCase().includes('ghe')) ||
        evt.description.toLowerCase().includes('ghe');
      if (hospitalTab === 'ghe' && !isGHE) return false;
      if (hospitalTab === 'hors-hopital' && isGHE) return false;
      // Filtre type
      if (typeFilter && evt.eventType !== typeFilter) return false;
      // Filtre région
      if (regionFilter !== 'all' && evt.region !== regionFilter) return false;
      // Filtre public
      if (selectedPublics.length > 0) {
        const isTousPublics = evt.publics?.includes('tous publics');
        const hasMatch = selectedPublics.some(p => evt.publics?.includes(p));
        if (!hasMatch && !isTousPublics) return false;
      }
      // Filtre date à partir de
      if (dateFrom && new Date(evt.startDate) < new Date(dateFrom)) return false;
      return true;
    });
  }, [data, searchQuery, hospitalTab, typeFilter, regionFilter, selectedPublics, dateFrom]);

  return (
    <div>
      {/* ── Onglets hôpital ─────────────────────────────────────────────── */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 gap-2">
        {[
          { key: 'hors-hopital', label: '🏟️ Événements grand public' },
          { key: 'ghe',          label: '🏥 Événements GHE (hôpital)' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setHospitalTab(t.key as any)}
            className={`flex-1 py-4 px-4 rounded-xl font-bold text-base transition-all ${
              hospitalTab === t.key
                ? 'bg-white shadow-lg text-blue-700 ring-2 ring-blue-100'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar filtres ──────────────────────────────────────────────── */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 overflow-hidden sticky top-24">
            {/* En-tête sidebar */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-black text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" /> Filtres
                </h2>
                {activeCount > 0 && (
                  <button onClick={resetAll} className="text-blue-200 hover:text-white text-sm font-bold flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Effacer ({activeCount})
                  </button>
                )}
              </div>
              {/* Compteur résultats */}
              <p className="text-blue-100 text-sm font-medium mt-1">
                {filteredData.length} événement{filteredData.length !== 1 ? 's' : ''} à venir
              </p>
            </div>

            <div className="p-5 space-y-6">
              {/* Recherche */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                  Recherche libre
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Nom, ville, description..."
                    className="w-full pl-9 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* À partir du */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> À partir du
                </label>
                <input
                  type="date"
                  min={TODAY_STR}
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
                {dateFrom && (
                  <button onClick={() => setDateFrom('')} className="text-xs text-blue-600 hover:underline mt-1 font-bold">Effacer la date</button>
                )}
              </div>

              {/* Type d'événement */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Type d'événement
                </label>
                <div className="flex flex-col gap-1.5">
                  {TYPE_PILLS.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTypeFilter(typeFilter === t.value ? '' : t.value)}
                      className={`text-left px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        typeFilter === t.value
                          ? `${t.bg} ${t.border} ${t.color} shadow-sm`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Région */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Région
                </label>
                <select
                  value={regionFilter}
                  onChange={e => setRegionFilter(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  <option value="all">Toutes les régions</option>
                  <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                  <option value="Bretagne">Bretagne</option>
                  <option value="Île-de-France">Île-de-France</option>
                  <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                  <option value="Occitanie">Occitanie</option>
                  <option value="Grand Est">Grand Est</option>
                  <option value="Hauts-de-France">Hauts-de-France</option>
                  <option value="Normandie">Normandie</option>
                  <option value="Pays de la Loire">Pays de la Loire</option>
                  <option value="PACA">Provence-Alpes-Côte d'Azur</option>
                </select>
              </div>

              {/* Public handicap */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Type de handicap
                </label>
                <div className="flex flex-col gap-1.5">
                  {PUBLIC_PILLS.map(p => (
                    <label key={p} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPublics.includes(p)
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedPublics.includes(p)}
                        onChange={() => togglePublic(p)}
                        className="w-4 h-4 accent-teal-600 rounded"
                      />
                      <span className="text-sm font-bold capitalize">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Grille résultats ─────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Résumé + tri */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <span className="text-2xl font-black text-slate-800">{filteredData.length}</span>
              <span className="text-xl font-bold text-slate-500 ml-2">
                événement{filteredData.length !== 1 ? 's' : ''} trouvé{filteredData.length !== 1 ? 's' : ''}
              </span>
              {activeCount > 0 && (
                <span className="ml-3 text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {activeCount} filtre{activeCount > 1 ? 's' : ''} actif{activeCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredData.map(evt => <EventCard key={evt.id} data={evt} />)}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-16 text-center">
              <Calendar className="w-20 h-20 text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-700 mb-3">Aucun événement à venir</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                Aucun événement ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={resetAll}
                className="bg-blue-700 hover:bg-blue-800 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg"
              >
                Voir tous les événements à venir
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
