'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { renderToString } from 'react-dom/server'
import {
  Activity, PersonStanding, Target, Trophy, 
  MapPin, Accessibility, PersonStanding as Person, Goal,
  Swords, Dumbbell, Flag, Anchor, Mountain, Crown, Map as MapIcon
} from 'lucide-react'

// Icon mapping logic
const getActivityConfig = (activite: string) => {
  const a = (activite || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  
  if (a.includes('multisport')) return { color: '#1e3a8a', icon: <Activity color="white" /> } // bleu marine
  if (a.includes('apa')) return { color: '#fbcfe8', icon: <Accessibility color="white" /> } // rose pastel
  if (a.includes('foot')) return { color: '#10b981', icon: <Target color="white" /> } // vert émeraude
  if (a.includes('basket')) return { color: '#ea580c', icon: <Target color="white" /> } // orange foncé
  if (a.includes('natation') || a.includes('eau') || a.includes('piscine') || a.includes('plonge')) return { color: '#06b6d4', icon: <Activity color="white" /> } // turquoise
  if (a.includes('danse')) return { color: '#facc15', icon: <Person color="white" /> } // jaune
  if (a.includes('athl') || a.includes('biathlon') || a.includes('triathlon')) return { color: '#451a03', icon: <Activity color="white" /> } // marron foncé
  if (a.includes('tennis') && !a.includes('table')) return { color: '#14532d', icon: <Trophy color="white" /> } // vert sapin
  if (a.includes('canoe')) return { color: '#06b6d4', icon: <Anchor color="white" /> } // cyan
  if (a.includes('tir') && a.includes('arc')) return { color: '#000000', icon: <Target color="white" /> } // noir
  if (a.includes('escalade')) return { color: '#d97706', icon: <Mountain color="white" /> } // marron clair
  if (a.includes('equitation') || a.includes('equitherapie') || a.includes('cheval')) return { color: '#4d7c0f', icon: <Flag color="white" /> } // vert kaki
  if (a.includes('tennis de table') || a.includes('ping')) return { color: '#fdba74', icon: <Target color="white" /> } // orange clair
  if (a.includes('judo')) return { color: '#f87171', icon: <Activity color="white" /> } // rouge clair
  if (a.includes('boxe')) return { color: '#991b1b', icon: <Swords color="white" /> } // rouge foncé
  if (a.includes('rugby')) return { color: '#7f1d1d', icon: <Target color="white" /> } // bordeaux
  if (a.includes('badminton')) return { color: '#d946ef', icon: <Trophy color="white" /> } // magenta
  if (a.includes('gym')) return { color: '#d8b4fe', icon: <Activity color="white" /> } // violet clair
  if (a.includes('escrime')) return { color: '#4c1d95', icon: <Swords color="white" /> } // violet foncé
  if (a.includes('renforcement')) return { color: '#e2e8f0', icon: <Dumbbell color="#1e293b" /> } // gris clair
  if (a.includes('voile')) return { color: '#06b6d4', icon: <Anchor color="white" /> } // cyan
  if (a.includes('randonnee') || a.includes('marche')) return { color: '#451a03', icon: <Mountain color="white" /> } // marron foncé
  if (a.includes('echecs')) return { color: '#f5f5dc', icon: <Crown color="#451a03" /> } // beige
  if (a.includes('cirque')) return { color: '#facc15', icon: <Goal color="white" /> } // jaune
  if (a.includes('handball')) return { color: '#c084fc', icon: <Target color="white" /> } // mauve
  if (a.includes('boccia') || a.includes('petanque')) return { color: '#334155', icon: <Target color="white" /> } // gris foncé

  return { color: '#3b82f6', icon: <MapPin color="white" /> } // default
}

const createCustomIcon = (color: string, iconElement: React.ReactNode, selected = false) => {
  const size = selected ? 56 : 40
  const borderColor = 'white'
  const shadow = selected ? '0 8px 24px rgba(0,0,0,0.5)' : '0 6px 16px rgba(0,0,0,0.35)'

  const iconHtml = renderToString(<div style={{width: '20px', height: '20px', color: 'white'}}>{iconElement}</div>)

  const html = `
    <div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:${shadow};
      border:${selected ? 4 : 2}px solid ${borderColor};
      transition:all 0.2s;
    ">
      <div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;">
        ${iconHtml}
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

const userIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width:30px;height:30px;
      background:#2563eb;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 0 15px rgba(37, 99, 235, 0.5);
      animation: pulse 2s infinite;
    "></div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
})

function MapCenterer({ userLocation, structures }: { userLocation?: {lat: number, lon: number} | null, structures: any[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lon], 11, { duration: 1.5 })
    } else if (structures.length > 0) {
      const lats = structures.map(s => s.latitude).filter(l => l != null)
      const lons = structures.map(s => s.longitude).filter(l => l != null)
      if (lats.length > 0 && lons.length > 0) {
        const minLat = Math.min(...lats)
        const maxLat = Math.max(...lats)
        const minLon = Math.min(...lons)
        const maxLon = Math.max(...lons)
        map.fitBounds([[minLat, minLon], [maxLat, maxLon]], { padding: [50, 50] })
      }
    } else {
      map.setView([46.603354, 1.888334], 5) // France
    }
  }, [userLocation, map])

  return null
}

interface MapProps {
  structures: any[]
  userLocation?: { lat: number; lon: number } | null
  searchRadius?: number
  onMarkerClick?: (structure: any) => void
  selectedStructureId?: string | null
}

export default function Map({ structures, userLocation, searchRadius, onMarkerClick, selectedStructureId }: MapProps) {
  const selectedStructure = structures.find(s => s.id === selectedStructureId)

  return (
    <div className="w-full h-full relative" style={{ zIndex: 0 }}>
      <MapContainer 
        center={[46.603354, 1.888334]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapCenterer userLocation={userLocation} structures={structures} />
        
        {/* User Location Marker & Radius (Rayon de recherche) */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon} />
            {searchRadius && (
              <Circle 
                center={[userLocation.lat, userLocation.lon]} 
                radius={searchRadius * 1000} 
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 2, dashArray: '5, 10' }} 
              />
            )}
          </>
        )}

        {/* Structure Activity Radius (Rayon d'activité de la structure sélectionnée) */}
        {selectedStructure?.latitude && selectedStructure?.longitude && selectedStructure?.rayon_intervention && (
          <Circle 
            center={[selectedStructure.latitude, selectedStructure.longitude]} 
            radius={selectedStructure.rayon_intervention * 1000} 
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15, weight: 2 }} 
          />
        )}

        {structures.filter(s => s.latitude && s.longitude).map(s => {
          const config = getActivityConfig(s.activite)
          const isSelected = selectedStructureId === s.id
          
          return (
            <Marker
              key={s.id}
              position={[s.latitude, s.longitude]}
              icon={createCustomIcon(config.color, config.icon, isSelected)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(s),
              }}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}
