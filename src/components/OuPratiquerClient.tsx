"use client";

import React, { useState, useMemo } from 'react';
import { DirectoryCard, DirectoryData } from './DirectoryCard';
import { Search, Filter, MapPin, Activity, Users, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function OuPratiquerClient({ data }: { data: DirectoryData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [publicFilter, setPublicFilter] = useState("all");

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Texte
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Catégorie
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      // Région
      const matchesRegion = regionFilter === "all" || item.regions.includes(regionFilter) || item.regions.includes("Toutes les régions");

      // Public
      const matchesPublic = publicFilter === "all" || item.publics.includes(publicFilter);

      return matchesSearch && matchesCategory && matchesRegion && matchesPublic;
    });
  }, [data, searchTerm, categoryFilter, regionFilter, publicFilter]);

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Zone de Recherche et Filtres */}
      <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border-2 border-slate-200 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
          <Filter className="w-64 h-64" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-10 relative z-10">🔍 Affiner votre recherche</h2>
        
        {/* Search bar - full width */}
        <div className="mb-8 relative z-10">
          <label htmlFor="ou-pratiquer-search" className="block text-xl font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-500" /> Mots-clés
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <Input 
              id="ou-pratiquer-search"
              placeholder="Ex : handisport, natation, Lyon, kinésithérapeute..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 text-xl pl-14 bg-slate-50 border-3 border-slate-200 focus-visible:ring-blue-500 rounded-2xl font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filters grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Filtre Catégorie */}
          <div>
            <label className="block text-xl font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-500" /> Que cherchez-vous ?
            </label>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v || "all")}>
              <SelectTrigger className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-lg py-3 font-medium">🏠 Tous les types</SelectItem>
                <SelectItem value="club" className="text-lg py-3 font-medium">⚽ Un sport en club</SelectItem>
                <SelectItem value="maison" className="text-lg py-3 font-medium">🏡 Pratique à la maison</SelectItem>
                <SelectItem value="enseignant-apa" className="text-lg py-3 font-medium">🎓 Un enseignant APA</SelectItem>
                <SelectItem value="kine" className="text-lg py-3 font-medium">🩺 Un kinésithérapeute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtre Région */}
          <div>
            <label className="block text-xl font-bold text-slate-700 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-500" /> Région
            </label>
            <Select value={regionFilter} onValueChange={(v) => setRegionFilter(v || "all")}>
              <SelectTrigger className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium">
                <SelectValue placeholder="Toutes les régions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-lg py-3 font-medium">🇫🇷 Toutes les régions</SelectItem>
                <SelectItem value="Auvergne-Rhône-Alpes" className="text-lg py-3 font-medium">📍 Auvergne-Rhône-Alpes</SelectItem>
                <SelectItem value="Bretagne" className="text-lg py-3 font-medium">📍 Bretagne</SelectItem>
                <SelectItem value="Île-de-France" className="text-lg py-3 font-medium">📍 Île-de-France</SelectItem>
                <SelectItem value="Nouvelle-Aquitaine" className="text-lg py-3 font-medium">📍 Nouvelle-Aquitaine</SelectItem>
                <SelectItem value="Occitanie" className="text-lg py-3 font-medium">📍 Occitanie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtre Public */}
          <div>
            <label className="block text-xl font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" /> Public concerné
            </label>
            <Select value={publicFilter} onValueChange={(v) => setPublicFilter(v || "all")}>
              <SelectTrigger className="h-16 text-xl bg-slate-50 border-3 border-slate-200 rounded-2xl font-medium">
                <SelectValue placeholder="Tous les publics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-lg py-3 font-medium">👥 Tous les publics</SelectItem>
                <SelectItem value="enfant" className="text-lg py-3 font-medium">👶 Enfant</SelectItem>
                <SelectItem value="adulte" className="text-lg py-3 font-medium">🧑 Adulte</SelectItem>
                <SelectItem value="senior" className="text-lg py-3 font-medium">👴 Senior</SelectItem>
                <SelectItem value="personne en situation de handicap" className="text-lg py-3 font-medium">♿ En situation de handicap</SelectItem>
                <SelectItem value="maladie chronique / ALD" className="text-lg py-3 font-medium">🏥 Maladie chronique / ALD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset button */}
        {(searchTerm || categoryFilter !== "all" || regionFilter !== "all" || publicFilter !== "all") && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <p className="text-lg font-medium text-slate-500">
              Filtres actifs
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setRegionFilter("all");
                setPublicFilter("all");
              }}
              className="text-lg text-red-600 font-bold hover:underline px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              ✕ Tout effacer
            </button>
          </div>
        )}
      </section>

      {/* Résultats de la recherche */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {filteredData.length} résultat{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
          </h2>
        </div>

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredData.map(item => (
              <DirectoryCard key={item.id} data={item} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-100 p-12 text-center rounded-3xl border-4 border-dashed border-slate-300">
            <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Aucune ressource trouvée</h3>
            <p className="text-lg text-slate-500">Essayez de modifier vos filtres pour voir plus de résultats.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setRegionFilter("all");
                setPublicFilter("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
