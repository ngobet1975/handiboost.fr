'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const getActivityColor = (activite: string) => {
  const a = (activite || '').toLowerCase()
  if (a.includes('equitation') || a.includes('cheval')) return '#8b4513'
  if (a.includes('nautiq') || a.includes('natation') || a.includes('eau') || a.includes('piscine')) return '#0ea5e9'
  if (a.includes('gym') || a.includes('fit') || a.includes('yoga') || a.includes('pilate')) return '#ec4899'
  if (a.includes('combat') || a.includes('art martial') || a.includes('judo') || a.includes('karat')) return '#ef4444'
  if (a.includes('ball') || a.includes('foot') || a.includes('basket') || a.includes('rugby') || a.includes('tennis')) return '#f97316'
  if (a.includes('athl') || a.includes('course')) return '#eab308'
  if (a.includes('danse')) return '#8b5cf6'
  if (a.includes('nature') || a.includes('randonnee') || a.includes('marche') || a.includes('velo') || a.includes('cycl')) return '#22c55e'
  return '#3b82f6' // Default blue
}

const createCustomIcon = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`
  
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="width: 32px; height: 32px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">${svg}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

export default function Map({ structures }: { structures: any[] }) {
  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer center={[46.603354, 1.888334]} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {structures.map((s) => {
          if (!s.latitude || !s.longitude) return null;
          const pinColor = getActivityColor(s.activite)
          const customIcon = createCustomIcon(pinColor)
          return (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={customIcon}>
              <Popup>
                <div className="font-sans min-w-[200px]">
                  <h3 className="font-bold text-slate-900 mb-1 leading-tight">{s.nom}</h3>
                  {s.activite && (
                    <p className="text-xs font-bold px-2 py-0.5 rounded-md inline-block mb-2" style={{ backgroundColor: pinColor + '20', color: pinColor }}>
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
                  
                  {s.appele === 'oui' && (
                    <div className="mt-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 inline-block">
                      ✓ Structure contactée
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
