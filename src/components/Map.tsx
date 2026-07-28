'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { AlertTriangle, X, Mail, Search, Maximize2, Minimize2 } from 'lucide-react'
import { reportStructureError } from '@/app/admin/annuaire/actions'

// ─── Couleurs & emojis par activité ───────────────────────────────────────────
const getActivityConfig = (activite: string) => {
  const a = (activite || '').toLowerCase()
  if (a.includes('equitation') || a.includes('cheval')) return { color: '#8b4513', emoji: '🐴' }
  if (a.includes('nautiq') || a.includes('natation') || a.includes('eau') || a.includes('piscine')) return { color: '#0ea5e9', emoji: '🏊' }
  if (a.includes('gym') || a.includes('fit') || a.includes('yoga') || a.includes('pilate')) return { color: '#ec4899', emoji: '🤸' }
  if (a.includes('combat') || a.includes('art martial') || a.includes('judo') || a.includes('karat')) return { color: '#ef4444', emoji: '🥋' }
  if (a.includes('ball') || a.includes('foot') || a.includes('basket') || a.includes('rugby') || a.includes('tennis')) return { color: '#f97316', emoji: '⚽' }
  if (a.includes('athl') || a.includes('course')) return { color: '#eab308', emoji: '🏃' }
  if (a.includes('danse')) return { color: '#8b5cf6', emoji: '💃' }
  if (a.includes('nature') || a.includes('randonnee') || a.includes('marche') || a.includes('velo') || a.includes('cycl')) return { color: '#22c55e', emoji: '🚴' }
  return { color: '#3b82f6', emoji: '📍' }
}

// ─── Favicon de la structure ───────────────────────────────────────────────────
const getFavicon = (url: string) => {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`
  } catch {
    return null
  }
}

// ─── Marqueur : fond coloré plein + favicon/emoji par-dessus ─────────────────
const createCustomIcon = (color: string, emoji: string, faviconUrl: string | null) => {
  const size = 52 // taille agrandie

  const faviconHtml = faviconUrl
    ? `<img src="${faviconUrl}" 
          style="width:26px;height:26px;object-fit:contain;border-radius:4px;"
          onerror="this.style.display='none';this.nextSibling.style.display='block';"
       /><span style="display:none;font-size:18px;line-height:1;">${emoji}</span>`
    : `<span style="font-size:18px;line-height:1;">${emoji}</span>`

  const html = `
    <div style="
      width:${size}px;
      height:${size}px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 6px 16px rgba(0,0,0,0.35);
      border:3px solid white;
    ">
      <div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;">
        ${faviconHtml}
      </div>
    </div>`

  return L.divIcon({
    className: '',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -(size + 4)],
  })
}

// ─── Composant interne : barre de recherche sur la carte ───────────────────────
function MapSearch({ structures, onFocus }: { structures: any[]; onFocus: (s: any) => void }) {
  const map = useMap()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.length < 2) { setResults([]); return }
    const q = value.toLowerCase()
    setResults(
      structures
        .filter(s =>
          s.nom?.toLowerCase().includes(q) ||
          s.activite?.toLowerCase().includes(q) ||
          s.adresse?.toLowerCase().includes(q)
        )
        .slice(0, 8)
    )
  }

  const handleSelect = (s: any) => {
    if (s.latitude && s.longitude) {
      map.flyTo([s.latitude, s.longitude], 14, { duration: 1.2 })
    }
    onFocus(s)
    setQuery(s.nom)
    setResults([])
  }

  return (
    <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 1000, maxWidth: 380 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'white', borderRadius: 14, padding: '8px 14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)', border: '2px solid #e2e8f0'
      }}>
        <Search size={18} color="#94a3b8" />
        <input
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Rechercher une structure ou activité..."
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 15, fontWeight: 600, color: '#1e293b',
            background: 'transparent'
          }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]) }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={16} />
          </button>
        )}
      </div>
      {results.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 12, marginTop: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden',
          border: '1.5px solid #e2e8f0'
        }}>
          {results.map((s, i) => {
            const conf = getActivityConfig(s.activite)
            return (
              <div
                key={s.id || i}
                onClick={() => handleSelect(s)}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  borderBottom: i < results.length - 1 ? '1px solid #f1f5f9' : 'none',
                  display: 'flex', alignItems: 'center', gap: 10
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: conf.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14, flexShrink: 0
                }}>
                  {conf.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{s.nom}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{s.activite} — {s.adresse}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Map({ structures }: { structures: any[] }) {
  const [reportStructure, setReportStructure] = useState<any | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Plein écran natif
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const handleConfirmReport = async () => {
    if (!reportStructure) return
    try {
      await reportStructureError(reportStructure.id)
      window.location.href = `mailto:handiboost.contact@gmail.com?subject=${encodeURIComponent('Erreur sur la structure ' + reportStructure.nom)}&body=${encodeURIComponent('Bonjour,\n\nJe souhaite signaler des informations erronées concernant la structure "' + reportStructure.nom + '".\n\nVoici les corrections à apporter :\n\n')}`
      setReportStructure(null)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      className="w-full h-[65vh] min-h-[520px] max-h-[850px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg"
    >
      <MapContainer
        // Centrée sur la France métropolitaine
        center={[46.603354, 1.888334]}
        zoom={6}
        minZoom={5}
        maxZoom={18}
        // Limite les bounds pour ne pas trop s'éloigner de la France
        maxBounds={[[41.0, -5.5], [51.5, 10.0]]}
        maxBoundsViscosity={0.85}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        {/* Fond plat sans reliefs — CartoDB Positron */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Barre de recherche flottante */}
        <MapSearch structures={structures} onFocus={() => {}} />

        {structures.map((s) => {
          if (!s.latitude || !s.longitude) return null
          const conf = getActivityConfig(s.activite)
          const faviconUrl = s.site ? getFavicon(s.site) : null
          const icon = createCustomIcon(conf.color, conf.emoji, faviconUrl)

          return (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={icon}>
              <Popup>
                <div className="font-sans min-w-[220px]">
                  <div className="flex items-start gap-3 mb-2">
                    {/* Badge couleur activité */}
                    <div
                      style={{ background: conf.color }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    >
                      {conf.emoji}
                    </div>
                    <h3 className="font-black text-slate-900 leading-tight flex-1 pt-1 text-base">{s.nom}</h3>
                  </div>
                  {s.activite && (
                    <p
                      className="text-xs font-bold px-2 py-0.5 rounded-md inline-block mb-2"
                      style={{ backgroundColor: conf.color + '20', color: conf.color }}
                    >
                      {s.activite}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mb-2">{s.adresse}</p>

                  <div className="space-y-1 mt-2">
                    {s.public && <p className="text-xs"><strong>Public :</strong> {s.public}</p>}
                    {s.telephone && <p className="text-xs">📞 <a href={`tel:${s.telephone}`} className="text-blue-600 hover:underline">{s.telephone}</a></p>}
                    {s.mail && <p className="text-xs">✉️ <a href={`mailto:${s.mail}`} className="text-blue-600 hover:underline">{s.mail}</a></p>}
                    {s.site && <p className="text-xs">🌐 <a href={s.site.startsWith('http') ? s.site : `https://${s.site}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Site Web</a></p>}
                  </div>

                  {s.informations && (
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                      {s.informations}
                    </div>
                  )}

                  {s.enAttenteMaj && (
                    <div className="mt-2 mb-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 text-center">
                      ⚠️ En attente de MAJ
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    {s.appele === 'oui' && (
                      <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 inline-block">
                        ✓ Contactée
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setReportStructure(s) }}
                      className="text-[10px] flex items-center text-red-600 hover:text-red-700 font-medium ml-auto"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Signaler
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Bouton plein écran */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        style={{
          position: 'absolute', bottom: 16, right: 16, zIndex: 1000,
          background: 'white', border: '2px solid #e2e8f0',
          borderRadius: 10, padding: '8px 10px',
          cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 6,
          fontWeight: 700, fontSize: 13, color: '#1e293b'
        }}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        {isFullscreen ? 'Réduire' : 'Plein écran'}
      </button>

      {/* Modal signalement */}
      {reportStructure && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-slate-100 relative">
            <button
              onClick={() => setReportStructure(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 text-center">Signaler une erreur</h3>
            <p className="text-slate-600 text-center mb-8 font-medium">
              Voulez-vous nous aider à corriger les informations de la structure <span className="text-slate-900 font-bold">"{reportStructure.nom}"</span> ?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmReport}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Mail className="w-5 h-5" />
                Signaler par email
              </button>
              <button
                onClick={() => setReportStructure(null)}
                className="w-full font-bold text-slate-600 hover:text-slate-800 py-3.5 rounded-xl transition-colors hover:bg-slate-100"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
