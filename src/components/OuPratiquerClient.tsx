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
      <section className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border-4 border-slate-100 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Filter className="w-64 h-64" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 relative z-10">Affiner votre recherche</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {/* Recherche Textuelle */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <Search className="w-4 h-4" /> Mots-clés
            </label>
            <Input 
              placeholder="Ex: Club, Gym, Lyon..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 text-lg bg-slate-50 border-2 border-slate-200 focus-visible:ring-blue-500 rounded-xl"
            />
          </div>

          {/* Filtre Catégorie */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Que cherchez-vous ?
            </label>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v || "all")}>
              <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="club">Un sport en club</SelectItem>
                <SelectItem value="maison">Pratique à la maison</SelectItem>
                <SelectItem value="enseignant-apa">Un enseignant APA</SelectItem>
                <SelectItem value="kine">Un kinésithérapeute</SelectItem>
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
                <SelectValue placeholder="Toutes les régions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                <SelectItem value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</SelectItem>
                <SelectItem value="Bretagne">Bretagne</SelectItem>
                <SelectItem value="Île-de-France">Île-de-France</SelectItem>
                <SelectItem value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</SelectItem>
                <SelectItem value="Occitanie">Occitanie</SelectItem>
                {/* D'autres régions seront ajoutées dynamiquement plus tard */}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre Public */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" /> Public concerné
            </label>
            <Select value={publicFilter} onValueChange={(v) => setPublicFilter(v || "all")}>
              <SelectTrigger className="h-14 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl">
                <SelectValue placeholder="Tous les publics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les publics</SelectItem>
                <SelectItem value="enfant">Enfant</SelectItem>
                <SelectItem value="adulte">Adulte</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="personne en situation de handicap">En situation de handicap</SelectItem>
                <SelectItem value="maladie chronique / ALD">Maladie chronique / ALD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
