'use client'

import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { AlertTriangle, X, Mail } from 'lucide-react'
import { reportStructureError } from '@/app/admin/annuaire/actions'

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

const createCustomIcon = (color: string, emoji: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="7" fill="white"/></svg>`
  
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="width: 36px; height: 36px; position: relative; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
      ${svg}
      <span style="position: absolute; top: 4px; left: 50%; transform: translateX(-50%); font-size: 12px; line-height: 1;">${emoji}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  })
}

const getFavicon = (url: string) => {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`
  } catch (e) {
    return null
  }
}

export default function Map({ structures }: { structures: any[] }) {
  const [reportStructure, setReportStructure] = useState<any | null>(null);

  const handleConfirmReport = async () => {
    if (!reportStructure) return;
    try {
      await reportStructureError(reportStructure.id);
      window.location.href = `mailto:handiboost.contact@gmail.com?subject=${encodeURIComponent("Erreur sur la structure " + reportStructure.nom)}&body=${encodeURIComponent("Bonjour,\n\nJe souhaite signaler des informations erronées concernant la structure \"" + reportStructure.nom + "\".\n\nVoici les corrections à apporter :\n\n")}`;
      setReportStructure(null);
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="w-full h-[60vh] min-h-[500px] max-h-[800px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer center={[46.603354, 1.888334]} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {structures.map((s) => {
          if (!s.latitude || !s.longitude) return null;
          const conf = getActivityConfig(s.activite)
          const customIcon = createCustomIcon(conf.color, conf.emoji)
          return (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={customIcon}>
              <Popup>
                <div className="font-sans min-w-[200px]">
                  <div className="flex items-start gap-2 mb-2">
                    {s.site && getFavicon(s.site) && (
                      <img 
                        src={getFavicon(s.site)!} 
                        alt="" 
                        className="w-8 h-8 rounded object-contain" 
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <h3 className="font-bold text-slate-900 leading-tight flex-1 pt-1">{s.nom}</h3>
                  </div>
                  {s.activite && (
                    <p className="text-xs font-bold px-2 py-0.5 rounded-md inline-block mb-2" style={{ backgroundColor: conf.color + '20', color: conf.color }}>
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
                    <div className="mt-2 mb-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block w-full text-center">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportStructure(s);
                      }}
                      className="text-[10px] flex items-center text-red-600 hover:text-red-700 font-medium ml-auto"
                      title="Signaler une erreur"
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

      {/* Beautiful Report Modal */}
      {reportStructure && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setReportStructure(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3 text-center">
              Signaler une erreur
            </h3>
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
