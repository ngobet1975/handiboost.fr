'use client'

import React, { useState, useMemo } from 'react'
import { Search, ExternalLink, MapPin, Building2, Users, Landmark, AlertTriangle, CheckCircle2, Filter, X, ChevronLeft, Map as MapIcon, Phone, Mail, Globe, ShieldCheck, Car, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { validateStructure, reportStructureError } from '@/app/admin/annuaire/actions'

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">Chargement de la carte...</div> 
})

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

export function GuideBoosterClient({ entries, structures = [], activites = [] }: { entries?: GuideEntry[], structures?: any[], activites?: string[] }) {
  const [addressSearch, setAddressSearch] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [radius, setRadius] = useState<number>(30)
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null)
  
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [interventionFilter, setInterventionFilter] = useState<string | null>(null)
  const [ageFilter, setAgeFilter] = useState<string | null>(null)
  
  const [selectedStructure, setSelectedStructure] = useState<any | null>(null)
  const [isMobileListOpen, setIsMobileListOpen] = useState(true)

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

  const handleSelectAddress = (feature: any) => {
    setAddressSearch(feature.properties.label)
    setUserLocation({ lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0] })
    setAddressSuggestions([])
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

  const filteredStructures = useMemo(() => {
    let result = structures || []
    
    if (typeFilter) {
      result = result.filter((s: any) => s.type_structure === typeFilter)
    }
    if (interventionFilter) {
      result = result.filter((s: any) => s.type_intervention === interventionFilter)
    }
    if (ageFilter) {
      result = result.filter((s: any) => !s.age || s.age.includes('Tous âges') || s.age.includes(ageFilter))
    }
    
    // Sort by distance if user location is set
    if (userLocation) {
      result.sort((a, b) => {
        if (!a.latitude || !b.latitude) return 0;
        return getDistance(userLocation.lat, userLocation.lon, a.latitude, a.longitude) - 
               getDistance(userLocation.lat, userLocation.lon, b.latitude, b.longitude)
      })
    }

    return result
  }, [structures, userLocation, typeFilter, interventionFilter, ageFilter])

  const activeFiltersCount = (typeFilter ? 1 : 0) + (interventionFilter ? 1 : 0) + (ageFilter ? 1 : 0)

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Sidebar Gauche */}
      <div className={`w-full md:w-[420px] lg:w-[480px] h-full flex flex-col bg-white border-r border-slate-200 shadow-2xl z-10 transition-transform duration-300 absolute md:relative ${isMobileListOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)] md:translate-y-0'}`}>
        
        {/* En-tête Sidebar */}
        <div className="p-4 md:p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-700 font-medium transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" /> Retour au site
            </Link>
            <button className="md:hidden p-2 text-slate-500 bg-slate-100 rounded-full" onClick={() => setIsMobileListOpen(!isMobileListOpen)}>
              {isMobileListOpen ? <X size={20} /> : <MapIcon size={20} />}
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="text-blue-600" /> Guide Booster
          </h2>

          {/* Recherche Adresse */}
          <div className="relative mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Votre localisation</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Saisissez votre adresse..." 
                value={addressSearch}
                onChange={(e) => fetchSuggestions(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
              />
              <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            </div>
            {addressSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                {addressSuggestions.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectAddress(f)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm font-medium text-slate-700 transition-colors"
                  >
                    {f.properties.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtres */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <select value={typeFilter || ''} onChange={e => setTypeFilter(e.target.value || null)} className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 outline-none truncate">
                <option value="">Tous les types</option>
                <option value="Club">Club</option>
                <option value="Maison Sport Santé (MSS)">Maison Sport Santé (MSS)</option>
                <option value="Enseignant en APA libéral">Enseignant en APA libéral</option>
                <option value="Kinésithérapeute libéral">Kinésithérapeute libéral</option>
              </select>
              
              <select value={interventionFilter || ''} onChange={e => setInterventionFilter(e.target.value || null)} className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 outline-none truncate">
                <option value="">Intervention...</option>
                <option value="Domicile">Domicile</option>
                <option value="Cabinet">Cabinet</option>
                <option value="Extérieur (parc, etc.)">Extérieur</option>
                <option value="Mixte">Mixte</option>
              </select>
            </div>
            
            <div className="flex gap-2 items-center">
              <select value={ageFilter || ''} onChange={e => setAgeFilter(e.target.value || null)} className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 outline-none truncate">
                <option value="">Tous âges</option>
                <option value="0-5 ans : petit enfant">0-5 ans</option>
                <option value="6-8 ans : jeunes">6-8 ans</option>
                <option value="9-11 ans : enfants">9-11 ans</option>
                <option value="12-17 ans : adolescents">12-17 ans</option>
                <option value="18-24 ans : jeunes adultes">18-24 ans</option>
                <option value="25-64 ans : adultes">25-64 ans</option>
                <option value="65 ans et plus : seniors">65 ans et plus</option>
              </select>

              {userLocation && (
                <div className="flex-1 relative group">
                  <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-blue-600">Rayon ({radius}km)</label>
                  <input type="range" min="1" max="100" value={radius} onChange={e => setRadius(parseInt(e.target.value))} className="w-full accent-blue-600 mt-2" />
                </div>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button onClick={() => { setTypeFilter(null); setInterventionFilter(null); setAgeFilter(null) }} className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center">
                <X size={14} className="mr-1" /> Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* Contenu dynamique (Liste ou Détails) */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 relative">
          {selectedStructure ? (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => setSelectedStructure(null)} className="mb-4 inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                <ChevronLeft size={16} className="mr-1" /> Retour à la liste
              </button>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                  {selectedStructure.type_structure}
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{selectedStructure.nom}</h3>
                
                {selectedStructure.valide && (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-lg w-fit mb-4">
                    <CheckCircle2 size={16} /> Structure Validée
                  </div>
                )}
                
                <p className="text-slate-600 font-medium mb-6">{selectedStructure.informations}</p>

                <div className="space-y-4">
                  {selectedStructure.activite && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600"><Activity size={16}/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Activités</div>
                        <div className="text-slate-800 font-medium">{selectedStructure.activite}</div>
                      </div>
                    </div>
                  )}

                  {selectedStructure.adresse && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600"><MapPin size={16}/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Adresse</div>
                        <div className="text-slate-800 font-medium leading-snug">{selectedStructure.adresse}</div>
                        {userLocation && selectedStructure.latitude && (
                          <div className="text-blue-600 text-sm font-bold mt-1">
                            À {getDistance(userLocation.lat, userLocation.lon, selectedStructure.latitude, selectedStructure.longitude).toFixed(1)} km
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedStructure.type_intervention && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600"><Car size={16}/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Intervention</div>
                        <div className="text-slate-800 font-medium">{selectedStructure.type_intervention}</div>
                        {selectedStructure.rayon_intervention && <div className="text-sm text-slate-500">Rayon : {selectedStructure.rayon_intervention} km</div>}
                      </div>
                    </div>
                  )}

                  {selectedStructure.telephone && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600"><Phone size={16}/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Téléphone</div>
                        <a href={`tel:${selectedStructure.telephone}`} className="text-blue-600 font-bold hover:underline">{selectedStructure.telephone}</a>
                      </div>
                    </div>
                  )}

                  {selectedStructure.mail && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600"><Mail size={16}/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">E-mail</div>
                        <a href={`mailto:${selectedStructure.mail}`} className="text-blue-600 font-bold hover:underline">{selectedStructure.mail}</a>
                      </div>
                    </div>
                  )}
                  
                  {selectedStructure.site && (
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600"><Globe size={16}/></div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Site web</div>
                        <a href={selectedStructure.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-1">Visiter le site <ExternalLink size={12}/></a>
                      </div>
                    </div>
                  )}
                  
                  {/* Validation action */}
                  <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                    <button onClick={() => { reportStructureError(selectedStructure.id); alert('Signalement envoyé') }} className="w-full py-3 rounded-xl flex justify-center items-center gap-2 bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors">
                      <AlertTriangle size={18} /> Signaler une erreur
                    </button>
                    {!selectedStructure.valide && (
                      <button onClick={() => { validateStructure(selectedStructure.id); alert('Structure validée !') }} className="w-full py-3 rounded-xl flex justify-center items-center gap-2 bg-emerald-50 text-emerald-600 font-bold hover:bg-emerald-100 transition-colors">
                        <ShieldCheck size={18} /> Marquer comme validé
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-500 mb-2">{filteredStructures.length} structures trouvées</div>
              {filteredStructures.map((s: any) => (
                <div key={s.id} onClick={() => setSelectedStructure(s)} className="bg-white p-4 rounded-xl border-2 border-transparent hover:border-blue-200 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-bold text-slate-800 line-clamp-1">{s.nom}</h4>
                    {s.valide && <ShieldCheck size={16} className="text-emerald-500 shrink-0 ml-2" />}
                  </div>
                  <p className="text-sm text-slate-600 font-medium mb-2">{s.activite}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded">{s.type_structure}</span>
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">{s.type_intervention}</span>
                  </div>
                </div>
              ))}
              {filteredStructures.length === 0 && (
                <div className="text-center py-10 text-slate-500 font-medium">
                  Aucune structure ne correspond à vos critères.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Carte (Prend le reste de l'écran) */}
      <div className="flex-1 relative h-[60vh] md:h-screen w-full bg-slate-100">
        <Map 
          structures={filteredStructures} 
          userLocation={userLocation} 
          searchRadius={radius} 
          onMarkerClick={(s) => {
            setSelectedStructure(s)
            setIsMobileListOpen(true) // Ouvrir la liste sur mobile si clic sur carte
          }}
          selectedStructureId={selectedStructure?.id}
        />
      </div>

    </div>
  )
}
