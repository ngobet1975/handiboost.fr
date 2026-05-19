'use client'

import React, { useState } from 'react'
import { Plus, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addStructure, deleteStructure, updateStructure, addActivite, deleteActivite } from './actions'
import AddressAutocomplete from '@/components/AddressAutocomplete'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// Leaflet map needs to be dynamically imported with SSR disabled
const Map = dynamic(() => import('@/components/Map'), { ssr: false, loading: () => <div className="h-[500px] bg-slate-100 flex items-center justify-center rounded-xl border border-slate-200">Chargement de la carte...</div> })

export default function StructuresManager({ initialStructures, initialActivites = [] }: { initialStructures: any[], initialActivites?: string[] }) {
  const router = useRouter()
  const [showMap, setShowMap] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activitesDropdownOpen, setActivitesDropdownOpen] = useState(false)
  const [newActiviteInput, setNewActiviteInput] = useState('')
  const [formData, setFormData] = useState({
    nom: '', activite: '', public: '', site: '', telephone: '', mail: '', informations: '', appele: 'non',
    adresse: '', latitude: null as number | null, longitude: null as number | null
  })

  function handleEditInit(s: any) {
    setEditingId(s.id)
    setFormData({
      nom: s.nom || '', activite: s.activite || '', public: s.public || '', site: s.site || '',
      telephone: s.telephone || '', mail: s.mail || '', informations: s.informations || '', appele: s.appele || 'non',
      adresse: s.adresse || '', latitude: s.latitude, longitude: s.longitude
    })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setFormData({
      nom: '', activite: '', public: '', site: '', telephone: '', mail: '', informations: '', appele: 'non',
      adresse: '', latitude: null, longitude: null
    })
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.nom || !formData.adresse) return alert("Le nom et l'adresse sont obligatoires.")
    
    if (editingId) {
      await updateStructure(editingId, formData)
    } else {
      await addStructure(formData)
    }
    handleCancelEdit()
    router.refresh()
  }

  const filteredStructures = initialStructures.filter(s => 
    s.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.activite && s.activite.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Colonne gauche : Formulaire + Liste */}
      <div className="lg:col-span-1 space-y-8">
        
        {/* Ajouter/Modifier une structure */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            {editingId ? "Modifier le centre" : "Ajouter un centre / club"}
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du centre</label>
              <input type="text" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse (Autocomplétion)</label>
              <AddressAutocomplete 
                defaultValue={formData.adresse} 
                onChange={(adresse, lat, lng) => setFormData({...formData, adresse, latitude: lat || null, longitude: lng || null})}
              />
              {formData.latitude && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> GPS OK</p>}
            </div>
            <div className="col-span-2 relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">Activités proposées (Choix multiple)</label>
              
              <div 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white min-h-[42px] cursor-pointer flex flex-wrap gap-2 items-center"
                onClick={() => setActivitesDropdownOpen(!activitesDropdownOpen)}
              >
                {formData.activite ? formData.activite.split(',').map(a => a.trim()).filter(Boolean).map(act => (
                  <span key={act} className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    {act}
                    <button type="button" onClick={(e) => {
                      e.stopPropagation();
                      const current = formData.activite.split(',').map(s => s.trim()).filter(Boolean)
                      setFormData({...formData, activite: current.filter(a => a !== act).join(', ')})
                    }} className="text-blue-500 hover:text-blue-900 rounded-full w-4 h-4 flex items-center justify-center bg-blue-200">
                      &times;
                    </button>
                  </span>
                )) : <span className="text-slate-400 text-sm">Sélectionner des activités...</span>}
              </div>

              {activitesDropdownOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden flex flex-col">
                  <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    {initialActivites.map(act => {
                      const isActive = formData.activite.includes(act)
                      return (
                        <div key={act} className="flex items-center justify-between hover:bg-slate-50 p-2 rounded">
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input 
                              type="checkbox" 
                              checked={isActive}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              onChange={() => {
                                let current = formData.activite.split(',').map(s => s.trim()).filter(Boolean)
                                if (isActive) {
                                  current = current.filter(a => a !== act)
                                } else {
                                  current.push(act)
                                }
                                setFormData({ ...formData, activite: current.join(', ') })
                              }}
                            />
                            <span className="text-sm text-slate-700">{act}</span>
                          </label>
                          <button 
                            type="button"
                            onClick={async (e) => {
                              e.preventDefault()
                              if(confirm(`Supprimer l'activité "${act}" du menu ?`)) {
                                await deleteActivite(act);
                                router.refresh();
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 p-1 rounded" 
                            title="Supprimer du menu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                    {initialActivites.length === 0 && <p className="text-xs text-slate-500 p-2 italic">Aucune activité enregistrée.</p>}
                  </div>
                  <div className="border-t border-slate-200 p-2 bg-slate-50 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nouvelle activité..." 
                      className="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={newActiviteInput}
                      onChange={e => setNewActiviteInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if(newActiviteInput.trim()) {
                            addActivite(newActiviteInput.trim())
                            setNewActiviteInput('')
                          }
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault()
                        if(newActiviteInput.trim()) {
                          await addActivite(newActiviteInput.trim());
                          setNewActiviteInput('');
                          router.refresh();
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded" 
                      title="Ajouter l'activité"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Public</label>
                <textarea value={formData.public} onChange={e => setFormData({...formData, public: e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                <input type="tel" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={formData.mail} onChange={e => setFormData({...formData, mail: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Site Web</label>
              <input 
                type="text" 
                value={formData.site} 
                onChange={e => setFormData({...formData, site: e.target.value})} 
                onBlur={() => {
                  if (formData.site && !formData.site.startsWith('http://') && !formData.site.startsWith('https://')) {
                    setFormData({...formData, site: `https://${formData.site}`})
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Informations supplémentaires</label>
              <textarea value={formData.informations} onChange={e => setFormData({...formData, informations: e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Appelé ou non ?</label>
              <select value={formData.appele} onChange={e => setFormData({...formData, appele: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="non">Non</option>
                <option value="oui">Oui</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {editingId ? "Enregistrer" : "Ajouter la structure"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Colonne droite : Carte + Liste */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Aperçu de la Carte Nationale</h2>
            <Button variant="outline" onClick={() => setShowMap(!showMap)} className="text-sm">
              {showMap ? "Masquer la carte" : "Afficher la carte"}
            </Button>
          </div>
          {showMap && (
            <div className="mb-4">
              <Map structures={initialStructures} />
            </div>
          )}
        </div>

        {/* Liste condensée avec recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800 whitespace-nowrap">Liste des structures</h2>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou activité..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-slate-600">Structure ({filteredStructures.length})</th>
                  <th className="text-left px-4 py-3 font-bold text-slate-600">Contact</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStructures.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 text-base">
                      {s.nom}
                      {s.enAttenteMaj && <span className="ml-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">⚠️ (En attente de MAJ)</span>}
                    </div>
                    {s.activite && <div className="text-xs font-bold text-blue-600 mb-1">{s.activite}</div>}
                    <div className="text-xs text-slate-500 max-w-[300px]">{s.adresse}</div>
                    {!s.latitude && <div className="text-xs text-red-500 font-medium mt-1">⚠️ Pas de coordonnées GPS</div>}
                  </td>
                  <td className="px-4 py-3">
                    {s.telephone && <div className="text-xs text-slate-600">📞 {s.telephone}</div>}
                    {s.mail && <div className="text-xs text-slate-600">✉️ {s.mail}</div>}
                    {s.appele === 'oui' && <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">Contacté</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => {
                        handleEditInit(s)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors" title="Modifier">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <form action={deleteStructure.bind(null, s.id)}>
                        <button type="submit" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors" title="Supprimer" onClick={(e) => { if(!confirm('Sûr de vouloir supprimer ?')) e.preventDefault() }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}
