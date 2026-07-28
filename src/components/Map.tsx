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

// ─── Panneau latéral ─────────────────────────────────────────────────────────
function SidePanel({ structure, onClose, onValidate, onReport }: {
  structure: any
  onClose: () => void
  onValidate: () => void
  onReport: () => void
}) {
  const conf = getActivityConfig(structure.activite)
  const [validating, setValidating] = useState(false)
  const [localVerifiedAt, setLocalVerifiedAt] = useState<string | null>(structure.verifiedAt || null)

  const handleValidate = async () => {
    setValidating(true)
    await onValidate()
    const now = new Date().toISOString()
    setLocalVerifiedAt(now)
    setValidating(false)
  }

  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 340, zIndex: 900,
      background: 'white', boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
      borderRight: '2px solid #e2e8f0',
    }}>
      {/* Header coloré */}
      <div style={{ background: conf.color, padding: '20px 16px 16px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: 'white', display: 'flex' }}>
          <X size={18} />
        </button>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{conf.emoji}</div>
        <h2 style={{ color: 'white', fontWeight: 900, fontSize: 18, lineHeight: 1.3, margin: 0, paddingRight: 32 }}>{structure.nom}</h2>
        {structure.activite && (
          <span style={{ display: 'inline-block', marginTop: 8, background: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 700, fontSize: 12, padding: '4px 10px', borderRadius: 20 }}>
            {structure.activite}
          </span>
        )}
      </div>

      {/* Corps */}
      <div style={{ padding: 16, flex: 1 }}>
        {/* Badges état */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {localVerifiedAt && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 700, fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>
              <CheckCircle2 size={12} /> Vérifié le {new Date(localVerifiedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
          {structure.est_itinerant && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', fontWeight: 700, fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>
              <Car size={12} /> Se déplace — {structure.rayon_intervention} km
            </span>
          )}
          {structure.enAttenteMaj && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fefce8', border: '1px solid #fde047', color: '#a16207', fontWeight: 700, fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>
              <AlertTriangle size={12} /> Signalée
            </span>
          )}
          {structure.appele === 'oui' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 700, fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>
              ✓ Contactée
            </span>
          )}
        </div>

        {/* Infos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {structure.adresse && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <MapPin size={16} color={conf.color} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{structure.adresse}</span>
            </div>
          )}
          {structure.public && (
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Public</div>
              <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{structure.public}</div>
            </div>
          )}
          {structure.telephone && (
            <a href={`tel:${structure.telephone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1d4ed8', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <Phone size={16} /> {structure.telephone}
            </a>
          )}
          {structure.mail && (
            <a href={`mailto:${structure.mail}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1d4ed8', fontWeight: 600, fontSize: 14, textDecoration: 'none', wordBreak: 'break-all' }}>
              <Mail size={16} /> {structure.mail}
            </a>
          )}
          {structure.site && (
            <a href={structure.site.startsWith('http') ? structure.site : `https://${structure.site}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1d4ed8', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <Globe size={16} /> Site web
            </a>
          )}
          {structure.informations && (
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
              {structure.informations}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: 16, borderTop: '2px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={handleValidate}
          disabled={validating}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#16a34a', color: 'white', border: 'none', borderRadius: 12,
            padding: '12px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            opacity: validating ? 0.7 : 1
          }}
        >
          <ShieldCheck size={16} />
          {validating ? 'Validation...' : '✅ Valider les informations'}
        </button>
        <button
          onClick={onReport}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#fef2f2', color: '#dc2626', border: '2px solid #fecaca', borderRadius: 12,
            padding: '11px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer'
          }}
        >
          <AlertTriangle size={15} /> ⚠️ Signaler une erreur
        </button>
      </div>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────
interface MapProps {
  structures: any[]
  userLocation?: { lat: number; lon: number } | null
  searchRadius?: number
}

export default function Map({ structures, userLocation, searchRadius }: MapProps) {
  const [selectedStructure, setSelectedStructure] = useState<any | null>(null)
  const [reportStructure, setReportStructure] = useState<any | null>(null)
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

  const handleValidate = useCallback(async () => {
    if (!selectedStructure) return
    await validateStructure(selectedStructure.id)
  }, [selectedStructure])

  const handleConfirmReport = async () => {
    if (!reportStructure) return
    try {
      await reportStructureError(reportStructure.id)
      window.location.href = `mailto:handiboost.contact@gmail.com?subject=${encodeURIComponent('Erreur sur la structure ' + reportStructure.nom)}&body=${encodeURIComponent('Bonjour,\n\nJe souhaite signaler des informations erronées concernant la structure "' + reportStructure.nom + '".\n\n')}`
      setReportStructure(null)
    } catch (e) { console.error(e) }
  }

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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Barre de recherche */}
        <MapSearch structures={structures} onSelect={setSelectedStructure} />

        {/* Fermer panneau si clic sur la carte */}
        <MapClickHandler onClose={() => setSelectedStructure(null)} />

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
          const isSelected = selectedStructure?.id === s.id
          const icon = createCustomIcon(conf.color, conf.emoji, faviconUrl, isSelected)

          return (
            <React.Fragment key={s.id}>
              <Marker
                position={[s.latitude, s.longitude]}
                icon={icon}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent.stopPropagation()
                    setSelectedStructure(s)
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

      {/* Panneau latéral */}
      {selectedStructure && (
        <SidePanel
          structure={selectedStructure}
          onClose={() => setSelectedStructure(null)}
          onValidate={handleValidate}
          onReport={() => { setReportStructure(selectedStructure); setSelectedStructure(null) }}
        />
      )}

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

      {/* Modal signalement */}
      {reportStructure && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-slate-100 relative">
            <button onClick={() => setReportStructure(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 text-center">Signaler une erreur</h3>
            <p className="text-slate-600 text-center mb-8 font-medium">
              Voulez-vous nous aider à corriger les informations de <span className="text-slate-900 font-bold">"{reportStructure.nom}"</span> ?
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirmReport} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md">
                <Mail className="w-5 h-5" /> Signaler par email
              </button>
              <button onClick={() => setReportStructure(null)} className="w-full font-bold text-slate-600 hover:text-slate-800 py-3.5 rounded-xl hover:bg-slate-100">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
