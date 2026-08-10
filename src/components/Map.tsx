'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  AlertTriangle, X, Mail, Search, Maximize2, Minimize2,
  Phone, Globe, MapPin, CheckCircle2, Car, ShieldCheck, Clock
} from 'lucide-react'
import { reportStructureError, validateStructure } from '@/app/admin/annuaire/actions'

// ─── Couleurs & emojis par activité ──────────────────────────────────────────
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

// ─── Favicon ──────────────────────────────────────────────────────────────────
const getFavicon = (url: string) => {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`
  } catch {
    return null
  }
}

// ─── Marqueur coloré ─────────────────────────────────────────────────────────
const createCustomIcon = (color: string, emoji: string, faviconUrl: string | null, selected = false) => {
  const size = selected ? 64 : 52
  const borderColor = selected ? 'white' : 'white'
  const shadow = selected
    ? '0 8px 24px rgba(0,0,0,0.5)'
    : '0 6px 16px rgba(0,0,0,0.35)'

  const faviconHtml = faviconUrl
    ? `<img src="${faviconUrl}" style="width:${selected ? 32 : 26}px;height:${selected ? 32 : 26}px;object-fit:contain;border-radius:4px;" onerror="this.style.display='none';this.nextSibling.style.display='block';" /><span style="display:none;font-size:${selected ? 22 : 18}px;line-height:1;">${emoji}</span>`
    : `<span style="font-size:${selected ? 22 : 18}px;line-height:1;">${emoji}</span>`

  const html = `
    <div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:${shadow};
      border:${selected ? 4 : 3}px solid ${borderColor};
      transition:all 0.2s;
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

// ─── Barre de recherche interne ───────────────────────────────────────────────
function MapSearch({ structures, onSelect }: { structures: any[]; onSelect: (s: any) => void }) {
  const map = useMap()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.length < 2) { setResults([]); return }
    const q = value.toLowerCase()
    setResults(structures.filter(s =>
      s.nom?.toLowerCase().includes(q) ||
      s.activite?.toLowerCase().includes(q) ||
      s.adresse?.toLowerCase().includes(q)
    ).slice(0, 8))
  }

  const handleSelect = (s: any) => {
    if (s.latitude && s.longitude) map.flyTo([s.latitude, s.longitude], 14, { duration: 1.2 })
    onSelect(s)
    setQuery(s.nom)
    setResults([])
  }

  return (
    <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 1000, maxWidth: 380 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderRadius: 14, padding: '8px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', border: '2px solid #e2e8f0' }}>
        <Search size={18} color="#94a3b8" />
        <input
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Rechercher une structure ou activité..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: '#1e293b', background: 'transparent' }}
        />
        {query && <button onClick={() => { setQuery(''); setResults([]) }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>}
      </div>
      {results.length > 0 && (
        <div style={{ background: 'white', borderRadius: 12, marginTop: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
          {results.map((s, i) => {
            const conf = getActivityConfig(s.activite)
            return (
              <div key={s.id || i} onClick={() => handleSelect(s)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: conf.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{conf.emoji}</div>
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

// ─── Composant pour fermer le panneau en cliquant sur la carte ────────────────
function MapClickHandler({ onClose }: { onClose: () => void }) {
  useMapEvents({ click: onClose })
  return null
}

// ─── Composant principal ──────────────────────────────────────────────────────
interface MapProps {
  structures: any[]
  userLocation?: { lat: number; lon: number } | null
  searchRadius?: number
  onMarkerClick?: (structure: any) => void
}

export default function Map({ structures, userLocation, searchRadius, onMarkerClick }: MapProps) {
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      className="w-full h-[65vh] min-h-[520px] max-h-[850px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg"
    >
      <MapContainer
        center={[46.603354, 1.888334]}
        zoom={6}
        minZoom={6}
        maxZoom={18}
        maxBounds={[[41.0, -5.5], [51.5, 10.0]]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        />

        {/* Barre de recherche */}
        <MapSearch structures={structures} onSelect={(s) => {
          setSelectedStructureId(s.id)
          if (onMarkerClick) onMarkerClick(s)
        }} />

        {/* Fermer panneau si clic sur la carte */}
        <MapClickHandler onClose={() => setSelectedStructureId(null)} />

        {/* Cercle rayon de recherche */}
        {userLocation && searchRadius && (
          <Circle
            center={[userLocation.lat, userLocation.lon]}
            radius={searchRadius * 1000}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 2, dashArray: '8 4' }}
          />
        )}

        {/* Marqueurs */}
        {structures.map((s) => {
          if (!s.latitude || !s.longitude) return null
          const conf = getActivityConfig(s.activite)
          const faviconUrl = s.site ? getFavicon(s.site) : null
          const isSelected = selectedStructureId === s.id
          const icon = createCustomIcon(conf.color, conf.emoji, faviconUrl, isSelected)

          return (
            <React.Fragment key={s.id}>
              <Marker
                position={[s.latitude, s.longitude]}
                icon={icon}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent.stopPropagation()
                    setSelectedStructureId(s.id)
                    if (onMarkerClick) onMarkerClick(s)
                  }
                }}
              />
              {/* Cercle itinérant (rayon d'intervention) */}
              {isSelected && s.est_itinerant && s.rayon_intervention && (
                <Circle
                  center={[s.latitude, s.longitude]}
                  radius={s.rayon_intervention * 1000}
                  pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1, weight: 2, dashArray: '6 3' }}
                />
              )}
            </React.Fragment>
          )
        })}
      </MapContainer>

      {/* Bouton plein écran */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        style={{
          position: 'absolute', bottom: 16, right: 16, zIndex: 1000,
          background: 'white', border: '2px solid #e2e8f0', borderRadius: 10,
          padding: '8px 10px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: '#1e293b'
        }}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        {isFullscreen ? 'Réduire' : 'Plein écran'}
      </button>
    </div>
  )
}
