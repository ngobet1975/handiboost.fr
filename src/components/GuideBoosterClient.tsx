'use client'

import React, { useState, useMemo } from 'react'
import { Search, ExternalLink, MapPin, Building2, Users, Landmark, AlertTriangle, CheckCircle2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <div className="h-[500px] bg-slate-100 flex items-center justify-center rounded-xl border border-slate-200">Chargement de la carte...</div> })

export interface GuideEntry {
  id: string
  name: string
  provider: string | null
  description: string | null
  url: string | null
  scope: string | null
  type: string | null
  verified_at: string | null
}

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; border: string; bg: string }> = {
  club: { label: 'Club sportif', icon: <Users className="w-5 h-5" />, color: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50' },
  professional: { label: 'Professionnel', icon: <Building2 className="w-5 h-5" />, color: 'text-purple-700', border: 'border-purple-200', bg: 'bg-purple-50' },
  institution: { label: 'Institution', icon: <Landmark className="w-5 h-5" />, color: 'text-orange-700', border: 'border-orange-200', bg: 'bg-orange-50' },
}

export function GuideBoosterClient({ entries, structures = [], activites = [] }: { entries: GuideEntry[], structures?: any[], activites?: string[] }) {
  const [search, setSearch] = useState('')
  const [addressSearch, setAddressSearch] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [radius, setRadius] = useState<number>(30)
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null)
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [activityFilter, setActivityFilter] = useState<string | null>(null)

  const fetchSuggestions = async (query: string) => {
    setAddressSearch(query)
    if (query.length < 3) {
      setAddressSuggestions([])
      return
    }
    try {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`)
      const data = await res.json()
      if (data.features) {
        setAddressSuggestions(data.features)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addressSearch.trim()) {
      setUserLocation(null)
      return
    }
    setIsSearchingLocation(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}`)
      const data = await res.json()
      if (data && data.length > 0) {
        setUserLocation({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) })
      } else {
        setUserLocation(null)
      }
    } catch (e) {
      setUserLocation(null)
    } finally {
      setIsSearchingLocation(false)
    }
  }

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const filteredMapStructures = useMemo(() => {
    let result = structures || []
    if (search) {
      result = result.filter((s: any) => 
        s.nom?.toLowerCase().includes(search.toLowerCase()) || 
        s.activite?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (userLocation && radius) {
      result = result.filter((s: any) => {
        if (!s.latitude || !s.longitude) return false
        return getDistance(userLocation.lat, userLocation.lon, s.latitude, s.longitude) <= radius
      })
    }
    if (activityFilter) {
      const matchActivity = (rawActivite: string, filter: string) => {
        const a = (rawActivite || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const f = filter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        if (f.includes('art')) return a.includes('martial') || a.includes('judo') || a.includes('karat') || a.includes('boxe') || a.includes('taekwondo') || a.includes('escrime');
        if (f.includes('athletisme')) return a.includes('athl') || a.includes('course');
        if (f.includes('cyclisme')) return a.includes('cycl') || a.includes('velo') || a.includes('vtt');
        if (f.includes('danse')) return a.includes('danse');
        if (f.includes('equitation')) return a.includes('equitation') || a.includes('cheval') || a.includes('poney');
        if (f.includes('gym')) return a.includes('gym') || a.includes('fit') || a.includes('yoga') || a.includes('pilate') || a.includes('renforcement');
        if (f.includes('natation')) return a.includes('nautiq') || a.includes('natation') || a.includes('eau') || a.includes('piscine') || a.includes('plonge') || a.includes('aquagym');
        if (f.includes('randonnee')) return a.includes('nature') || a.includes('randonnee') || a.includes('marche') || a.includes('montagne') || a.includes('escalade');
        if (f.includes('balle')) return a.includes('ball') || a.includes('foot') || a.includes('basket') || a.includes('rugby') || a.includes('tennis') || a.includes('ping') || a.includes('volley') || a.includes('boccia');
        if (f.includes('multisport')) return a.includes('multi') || a.includes('omnisport');
        
        return a.includes(f);
      }
      
      result = result.filter((s: any) => matchActivity(s.activite, activityFilter))
    }
    return result
  }, [structures, search, userLocation, radius, activityFilter])

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch = search === '' || 
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.provider?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (e.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
      const matchType = !typeFilter || e.type === typeFilter
      return matchSearch && matchType
    })
  }, [entries, search, typeFilter])

  const activeFilters = (typeFilter ? 1 : 0) + (activityFilter ? 1 : 0)

  return (
    <div>
      {/* Search + Filters Block */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md p-6 md:p-10 mb-10">
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <label htmlFor="guide-search" className="block text-xl font-bold text-slate-800 mb-3">
            🔍 Rechercher par mot-clé
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="w-7 h-7 text-slate-400" />
            </div>
            <input
              type="text"
              id="guide-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-3 border-slate-200 rounded-2xl py-5 pl-16 pr-6 text-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              placeholder="Ex : handisport, kinésithérapeute, sport santé..."
            />
          </div>
        </div>

        {/* Address Search */}
        <form onSubmit={handleSearchLocation} className="relative mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
          <label className="block text-lg font-bold text-slate-800 mb-3">
            📍 Trouver autour de moi (Adresse du patient)
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={addressSearch}
                onChange={(e) => fetchSuggestions(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 rounded-xl py-3 px-4 text-lg font-medium focus:outline-none focus:border-blue-500"
                placeholder="Adresse, Ville ou Code Postal..."
              />
              {addressSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {addressSuggestions.map((sugg, idx) => (
                    <div
                      key={idx}
                      className="p-3 hover:bg-blue-50 cursor-pointer text-slate-700 font-medium border-b border-slate-100 last:border-b-0"
                      onClick={() => {
                        setAddressSearch(sugg.properties.label)
                        setAddressSuggestions([])
                        setUserLocation({
                          lon: sugg.geometry.coordinates[0],
                          lat: sugg.geometry.coordinates[1]
                        })
                      }}
                    >
                      📍 {sugg.properties.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="bg-white border-2 border-slate-300 rounded-xl py-3 px-4 text-lg font-medium focus:outline-none focus:border-blue-500 w-full md:w-auto"
            >
              <option value={10}>Rayon : 10 km</option>
              <option value={30}>Rayon : 30 km</option>
              <option value={50}>Rayon : 50 km</option>
              <option value={100}>Rayon : 100 km</option>
            </select>
            <Button type="submit" disabled={isSearchingLocation} className="h-auto py-3 px-6 text-lg font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white shadow-md">
              {isSearchingLocation ? 'Recherche...' : 'Filtrer'}
            </Button>
            {userLocation && (
              <Button type="button" variant="outline" onClick={() => { setUserLocation(null); setAddressSearch(''); }} className="h-auto py-3 px-4 text-lg font-bold rounded-xl border-slate-300 hover:bg-slate-200 text-slate-700">
                ✕
              </Button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Type filters */}
          <div>
            <p className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" /> Que cherchez-vous ?
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(TYPE_CONFIG).map(([key, conf]) => (
                <button
                  key={key}
                  onClick={() => setTypeFilter(typeFilter === key ? null : key)}
                  className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg border-3 transition-all cursor-pointer ${
                    typeFilter === key
                      ? `${conf.bg} ${conf.border} ${conf.color} shadow-lg scale-105 ring-2 ring-offset-2 ring-blue-300`
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                  }`}
                >
                  {conf.icon} {conf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity filter */}
          <div>
            <p className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" /> Par activité (sur la carte)
            </p>
            <div className="flex flex-wrap gap-3">
              <select
                value={activityFilter || ''}
                onChange={(e) => setActivityFilter(e.target.value || null)}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-6 text-lg font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="">Toutes les activités</option>
                {activites.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active filters / reset */}
        {activeFilters > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
            <p className="text-base font-medium text-slate-500">
              {activeFilters} filtre{activeFilters > 1 ? 's' : ''} actif{activeFilters > 1 ? 's' : ''}
            </p>
            <button
              onClick={() => { setTypeFilter(null); setActivityFilter(null); setSearch(''); }}
              className="text-lg text-red-600 font-bold hover:underline px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              ✕ Tout effacer
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">La Carte des Structures Locales</h2>
        <p className="text-lg font-medium text-slate-500">
          {filteredMapStructures.length} structure{filteredMapStructures.length > 1 ? 's' : ''} référencée{filteredMapStructures.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-16">
        <Map structures={filteredMapStructures} />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Annuaires Partenaires</h2>
        <p className="text-lg font-medium text-slate-500">
          {filtered.length} résultat{filtered.length > 1 ? 's' : ''}{search && ` pour "${search}"`}
        </p>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun résultat</h3>
          <p className="text-slate-500">Essayez un autre terme ou supprimez les filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry) => {
            const typeConf = TYPE_CONFIG[entry.type ?? 'institution'] ?? TYPE_CONFIG.institution

            const isVerifiedRecently = entry.verified_at && 
              (Date.now() - new Date(entry.verified_at).getTime()) < 180 * 24 * 60 * 60 * 1000 // 6 mois

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl border-2 ${typeConf.border} shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group`}
              >
                {/* Type bar */}
                <div className={`${typeConf.bg} px-5 py-3 flex items-center justify-between`}>
                  <span className={`font-bold text-sm flex items-center gap-2 ${typeConf.color}`}>
                    {typeConf.icon} {typeConf.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors leading-tight">
                    {entry.name}
                  </h3>
                  {entry.provider && (
                    <p className="text-sm font-semibold text-slate-500 mb-3">{entry.provider}</p>
                  )}
                  <p className="text-slate-600 text-base leading-relaxed mb-4 flex-1">
                    {entry.description}
                  </p>

                  {/* Verified badge */}
                  <div className="mb-4">
                    {isVerifiedRecently ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Vérifié le {new Date(entry.verified_at!).toLocaleDateString('fr-FR')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Vérifiez les infos sur le site officiel
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                {entry.url && (
                  <div className="px-6 pb-6">
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all ${typeConf.bg} ${typeConf.color} border-2 ${typeConf.border} hover:shadow-md hover:scale-[1.02]`}
                    >
                      Consulter l'annuaire <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Disclaimer + Signal */}
      <div className="mt-16 space-y-6">
        <div className="bg-blue-50 border-2 border-blue-200 p-6 md:p-8 rounded-2xl">
          <p className="text-blue-900 text-lg font-medium leading-relaxed">
            <strong>ℹ️ Important :</strong> Ces liens renvoient vers les annuaires officiels des fédérations et institutions.
            Contactez directement la structure pour vérifier les activités proposées et les disponibilités.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 p-6 md:p-8 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Un lien ne fonctionne plus ? Une info est périmée ?</h3>
          <p className="text-slate-600 mb-4">Aidez-nous à maintenir cet outil à jour en nous signalant le problème.</p>
          <Button nativeButton={false} render={<Link href="/contact" />} className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 h-12 rounded-xl">
            <AlertTriangle className="w-4 h-4 mr-2" /> Signaler un problème
          </Button>
        </div>
      </div>
    </div>
  )
}
