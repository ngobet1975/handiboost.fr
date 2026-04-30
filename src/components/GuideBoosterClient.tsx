'use client'

import React, { useState, useMemo } from 'react'
import { Search, ExternalLink, MapPin, Building2, Users, Landmark, AlertTriangle, CheckCircle2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

const SCOPE_CONFIG: Record<string, { label: string; emoji: string }> = {
  national: { label: 'National', emoji: '🇫🇷' },
  regional: { label: 'Régional', emoji: '📍' },
}

export function GuideBoosterClient({ entries }: { entries: GuideEntry[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [scopeFilter, setScopeFilter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch = search === '' || 
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.provider?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (e.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
      const matchType = !typeFilter || e.type === typeFilter
      const matchScope = !scopeFilter || e.scope === scopeFilter
      return matchSearch && matchType && matchScope
    })
  }, [entries, search, typeFilter, scopeFilter])

  const activeFilters = (typeFilter ? 1 : 0) + (scopeFilter ? 1 : 0)

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

          {/* Scope filters */}
          <div>
            <p className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-500" /> Portée géographique
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(SCOPE_CONFIG).map(([key, conf]) => (
                <button
                  key={key}
                  onClick={() => setScopeFilter(scopeFilter === key ? null : key)}
                  className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg border-3 transition-all cursor-pointer ${
                    scopeFilter === key
                      ? 'bg-slate-800 border-slate-800 text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-slate-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                  }`}
                >
                  <span className="text-2xl">{conf.emoji}</span> {conf.label}
                </button>
              ))}
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
              onClick={() => { setTypeFilter(null); setScopeFilter(null); setSearch(''); }}
              className="text-lg text-red-600 font-bold hover:underline px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              ✕ Tout effacer
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-center text-lg font-medium text-slate-500 mb-8">
        {filtered.length} résultat{filtered.length > 1 ? 's' : ''}{search && ` pour "${search}"`}
      </p>

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
            const scopeConf = SCOPE_CONFIG[entry.scope ?? 'national'] ?? SCOPE_CONFIG.national

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
                  <span className="text-sm font-semibold text-slate-500">
                    {scopeConf.emoji} {scopeConf.label}
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
