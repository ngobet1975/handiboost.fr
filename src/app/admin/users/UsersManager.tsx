'use client'

import React, { useState } from 'react'
import { Users, Mail, Trash2, Plus, Edit2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addAdherent, deleteAdherent, updateAdherent } from './actions'

const STATUTS = [
  "En cours d'adhésion",
  "Fin d'adhésion",
  "Sans adhésion",
  "Adhésion gratuite"
]

export default function UsersManager({ initialAdherents }: { initialAdherents: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const adherentToEdit = initialAdherents.find(a => a.id === editingId)

  // This wrapper resets the form mode after submitting
  async function handleAdd(formData: FormData) {
    await addAdherent(formData)
  }

  async function handleUpdate(formData: FormData) {
    if (editingId) {
      await updateAdherent(editingId, formData)
      setEditingId(null)
    }
  }

  return (
    <>
      {/* Ajouter ou Modifier un professionnel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
            {editingId ? 'Modifier un professionnel' : 'Ajouter un professionnel'}
          </h2>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="text-slate-500">
              <X className="w-4 h-4 mr-2" /> Annuler la modification
            </Button>
          )}
        </div>
        
        <form action={editingId ? handleUpdate : handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
              <input type="text" name="nom" defaultValue={adherentToEdit?.nom || ''} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Ex: Dupont" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
              <input type="text" name="prenom" defaultValue={adherentToEdit?.prenom || ''} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Ex: Jean" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" name="email" defaultValue={adherentToEdit?.email || ''} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="jean@exemple.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input type="tel" name="telephone" defaultValue={adherentToEdit?.telephone || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Ex: 0612345678" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date d'adhésion</label>
              <input type="date" name="dateAdhesion" defaultValue={adherentToEdit?.dateAdhesion || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date d'attribution</label>
              <input type="date" name="dateAttribution" defaultValue={adherentToEdit?.dateAttribution || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fin d'adhésion</label>
              <input type="date" name="dateFinAdhesion" defaultValue={adherentToEdit?.dateFinAdhesion || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select name="typeAdhesion" defaultValue={adherentToEdit?.typeAdhesion || STATUTS[0]} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" className={`px-8 text-white ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? 'Enregistrer les modifications' : 'Ajouter le professionnel'}
            </Button>
          </div>
        </form>
      </div>

      {/* Liste des professionnels */}
      {initialAdherents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun professionnel</h3>
          <p className="text-slate-500">Ajoutez un premier professionnel ci-dessus.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-bold text-slate-600">Professionnel</th>
                <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Détails</th>
                <th className="text-left px-4 py-4 text-sm font-bold text-slate-600">Statut</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialAdherents.map((adherent: any) => (
                <tr key={adherent.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                        {(adherent.prenom?.[0] || adherent.nom?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{adherent.prenom} {adherent.nom}</span>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {adherent.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    {adherent.telephone && (
                      <div className="mb-1">
                        📞 <a href={`tel:${adherent.telephone}`} className="text-blue-600 hover:underline font-medium">{adherent.telephone}</a>
                      </div>
                    )}
                    {adherent.dateAdhesion && <div className="text-xs">Adh. : {new Date(adherent.dateAdhesion).toLocaleDateString('fr-FR')}</div>}
                    {adherent.dateAttribution && <div className="text-xs">Attr. : {new Date(adherent.dateAttribution).toLocaleDateString('fr-FR')}</div>}
                    {adherent.dateFinAdhesion && <div className="text-xs">Fin : {new Date(adherent.dateFinAdhesion).toLocaleDateString('fr-FR')}</div>}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      adherent.typeAdhesion?.includes('Fin') ? 'bg-red-100 text-red-800' : 
                      adherent.typeAdhesion?.includes('Sans') ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {adherent.typeAdhesion || "Inconnu"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingId(adherent.id)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="text-amber-500 hover:text-amber-700 p-2 hover:bg-amber-50 rounded-lg transition-colors" 
                        title="Modifier"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <form action={deleteAdherent.bind(null, adherent.id)}>
                        <button type="submit" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
